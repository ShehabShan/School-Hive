import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowBigUp, ArrowBigDown, CheckCircle2, ExternalLink } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useRole from "../../Hooks/useRole";
import MarkdownBody from "./MarkdownBody";
import AuthorBlock from "./AuthorBlock";
import toast from "react-hot-toast";

const DOWNVOTE_REASONS = [
  { value: "outdated", label: "Outdated — rules/scores changed" },
  { value: "unsourced", label: "Unsourced — no evidence for claims" },
  { value: "off-topic", label: "Off-topic — doesn't answer the question" },
  { value: "incorrect", label: "Incorrect — factually wrong" },
];

export default function AnswerCard({ answer, isAsker, onAccept, accepting, questionId }){
  const axiosSecure = useAxiosSecure();
  const { me } = useRole();
  const qc = useQueryClient();
  const [voting,setVoting]=useState(false);
  const [showReason,setShowReason]=useState(false);
  const [reason,setReason]=useState("");

  const isAccepted = Boolean(answer.accepted);
  const rep = typeof me?.reputation === "number" ? me.reputation : 0;
  const canDownvote = rep >= 125;
  const qKey = ["question", String(questionId || answer.questionId)];

  const handleUpvote = async ()=>{
    if(!me){ toast.error("Sign in to vote"); return; }
    setVoting(true);
    try{
      await axiosSecure.post(`/answers/${answer._id}/upvote`);
      toast.success("Upvoted — answerer earns +10");
      qc.invalidateQueries({ queryKey: qKey });
    } catch(e){
      toast.error(e?.response?.data?.message || e.message);
    } finally { setVoting(false); }
  };
  const handleDownvote = async ()=>{
    if(!reason){ toast.error("Select a reason"); return; }
    setVoting(true);
    try{
      await axiosSecure.post(`/answers/${answer._id}/downvote`, { reason });
      toast.success("Downvoted with reason — actionable feedback");
      setShowReason(false); setReason("");
      qc.invalidateQueries({ queryKey: qKey });
    } catch(e){
      toast.error(e?.response?.data?.message || e.message);
    } finally { setVoting(false); }
  };

  return (
    <article className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${isAccepted ? "border-emerald-300" : "border-slate-200"}`}>
      {isAccepted && <div className="flex items-center gap-1.5 bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white"><CheckCircle2 className="h-3.5 w-3.5" /> Accepted answer — verified by the asker</div>}
      <div className="flex gap-1 p-4 sm:gap-3">
        {/* Vote rail */}
        <div className="flex w-10 shrink-0 flex-col items-center gap-0.5">
          <button onClick={handleUpvote} disabled={voting || !me} title={me ? "Upvote" : "Sign in to vote"} className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600 disabled:opacity-40">
            <ArrowBigUp className="h-6 w-6" />
          </button>
          <span className="text-sm font-extrabold text-slate-800" title={(answer.downvoteReasons||[]).length ? `Downvote reasons: ${(answer.downvoteReasons||[]).join(", ")}` : "vote score"}>{answer.voteScore ?? 0}</span>
          <button onClick={()=> canDownvote && setShowReason(v=>!v)} disabled={voting || !canDownvote} title={canDownvote ? "Downvote (reason required)" : "125 reputation required to downvote"} className={`rounded-lg p-1 transition-colors disabled:opacity-30 ${canDownvote ? "text-slate-400 hover:bg-rose-50 hover:text-rose-600" : "cursor-not-allowed"}`}>
            <ArrowBigDown className="h-6 w-6" />
          </button>
          {!canDownvote && me && <span className="text-center text-[9px] leading-tight text-slate-400">125 rep</span>}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <AuthorBlock email={answer.authorEmail} role={answer.authorRole} isVerified={answer.authorIsVerified} />
            <span className="text-[11px] text-slate-400">{new Date(answer.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>

          <div className="py-3"><MarkdownBody text={answer.body} /></div>

          {answer.sourceLink && (
            <a href={answer.sourceLink} target="_blank" rel="noreferrer noopener" className="mt-1 inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200 hover:bg-sky-100">
              <ExternalLink className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{answer.sourceLink}</span>
              <span className="shrink-0 rounded-full bg-sky-600 px-1.5 py-0.5 text-[10px] font-bold text-white">+3</span>
            </a>
          )}

          {(answer.downvoteReasons||[]).length>0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Flagged:</span>
              {(answer.downvoteReasons||[]).map((r,i)=> <span key={i} className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-100">{r}</span>)}
            </div>
          )}

          {showReason && (
            <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50/60 p-3">
              <p className="text-xs font-bold text-rose-800">Why are you downvoting? (required — gives the answerer something actionable)</p>
              <div className="mt-2 space-y-1">
                {DOWNVOTE_REASONS.map(r=> (
                  <label key={r.value} className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${reason===r.value ? "bg-white font-semibold text-rose-700 ring-1 ring-rose-200" : "text-slate-600 hover:bg-white/70"}`}>
                    <input type="radio" name={`reason-${answer._id}`} checked={reason===r.value} onChange={()=>setReason(r.value)} className="radio radio-error radio-xs" />
                    {r.label}
                  </label>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <button onClick={handleDownvote} disabled={voting || !reason} className="btn btn-xs btn-error text-white">{voting ? "…" : "Confirm downvote"}</button>
                <button onClick={()=>{setShowReason(false); setReason("");}} className="btn btn-xs btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {isAsker && !isAccepted && (
            <button onClick={()=>onAccept(answer._id)} disabled={accepting} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50">
              <CheckCircle2 className="h-4 w-4" /> {accepting ? "Accepting…" : "Mark as Accepted"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
