import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useRole from "../../Hooks/useRole";
import RoleBadge from "../profile/RoleBadge";
import MarkdownBody from "./MarkdownBody";
import toast from "react-hot-toast";

function formatDate(d){
  try{ return new Date(d).toLocaleDateString(); } catch{ return ""; }
}

export default function AnswerCard({ answer, isAsker, onAccept, accepting, questionId }){
  const role = answer.authorRole;
  const isStaff = ["admin","superadmin","modaretor"].includes(role);
  const badgeRole = isStaff ? role : role==="institution" ? "institution" : null;
  const isAccepted = Boolean(answer.accepted);
  const isVerified = Boolean(answer.authorIsVerified);
  const axiosSecure = useAxiosSecure();
  const { me } = useRole();
  const qc = useQueryClient();
  const [voting,setVoting]=useState(false);
  const [showReason,setShowReason]=useState(false);
  const [reason,setReason]=useState("");

  const rep = typeof me?.reputation === "number" ? me.reputation : 0;
  const canDownvote = rep >= 125;

  const handleUpvote = async ()=>{
    if(!me){ toast.error("Sign in to vote"); return; }
    setVoting(true);
    try{
      await axiosSecure.post(`/answers/${answer._id}/upvote`);
      toast.success("Upvoted +10");
      qc.invalidateQueries({ queryKey: ["question", String(questionId || answer.questionId)] });
    } catch(e){
      toast.error(e?.response?.data?.message || e.message);
    } finally { setVoting(false); }
  };
  const handleDownvote = async ()=>{
    if(!me){ toast.error("Sign in to vote"); return; }
    if(!canDownvote){ toast.error("125 rep required to downvote"); return; }
    if(!reason){ toast.error("Select a reason"); return; }
    setVoting(true);
    try{
      await axiosSecure.post(`/answers/${answer._id}/downvote`, { reason });
      toast.success("Downvoted");
      setShowReason(false); setReason("");
      qc.invalidateQueries({ queryKey: ["question", String(questionId || answer.questionId)] });
    } catch(e){
      toast.error(e?.response?.data?.message || e.message);
    } finally { setVoting(false); }
  };

  return (
    <div className={`card bg-base-100 shadow-sm border ${isAccepted ? "border-emerald-300 bg-emerald-50/30" : ""}`}>
      <div className="card-body p-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-1 min-w-[48px]">
            <button onClick={handleUpvote} disabled={voting || !me} className="btn btn-xs btn-ghost" title={me ? "Upvote" : "Sign in to vote"}>▲</button>
            <span className="font-bold text-sm" title={(answer.downvoteReasons||[]).join(", ") || "voteScore"}>{answer.voteScore ?? 0}</span>
            <button onClick={()=> canDownvote && setShowReason(v=>!v)} disabled={voting || !canDownvote} className={`btn btn-xs btn-ghost ${!canDownvote ? "opacity-50" : ""}`} title={canDownvote ? "Downvote (reason required)" : "125 rep required"}>▼</button>
            {!canDownvote && me && <span className="text-[10px] opacity-60 text-center">125 rep required</span>}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{answer.authorEmail}</span>
              {badgeRole && <RoleBadge role={badgeRole} size="sm" />}
              {isVerified && <span className="badge badge-info badge-sm">✓ Verified</span>}
              {isAccepted && <span className="badge badge-success badge-sm gap-1">✓ Accepted</span>}
              <span className="ml-auto text-xs opacity-60">{formatDate(answer.createdAt)}</span>
            </div>
            <MarkdownBody text={answer.body} />
            {answer.sourceLink && <a href={answer.sourceLink} target="_blank" rel="noreferrer" className="link text-xs mt-2 block">{answer.sourceLink}</a>}
            {(answer.downvoteReasons||[]).length>0 && <div className="text-xs opacity-60 mt-1" title="Hover shows reasons">Downvote reasons: {(answer.downvoteReasons||[]).join(", ")}</div>}
            {showReason && (
              <div className="mt-2 p-2 border rounded bg-base-200">
                <p className="text-xs font-medium">Reason for downvote (required)</p>
                <select value={reason} onChange={e=>setReason(e.target.value)} className="select select-bordered select-sm w-full mt-1">
                  <option value="">Select reason</option>
                  <option value="outdated">outdated</option>
                  <option value="unsourced">unsourced</option>
                  <option value="off-topic">off-topic</option>
                  <option value="incorrect">incorrect</option>
                </select>
                <div className="mt-2 flex gap-2">
                  <button onClick={handleDownvote} disabled={voting || !reason} className="btn btn-xs btn-error">Confirm downvote</button>
                  <button onClick={()=>{setShowReason(false); setReason("");}} className="btn btn-xs btn-ghost">Cancel</button>
                </div>
              </div>
            )}
            {isAsker && !isAccepted && (
              <button onClick={()=>onAccept(answer._id)} disabled={accepting} className="btn btn-sm btn-success mt-3">
                {accepting ? "..." : "Mark as Accepted"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
