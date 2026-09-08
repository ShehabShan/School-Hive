import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowBigUp, ArrowBigDown, CheckCircle2, ExternalLink, MoreHorizontal, Pencil } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useRole from "../../Hooks/useRole";
import useAuth from "../../Hooks/useAuth";
import MarkdownBody from "./MarkdownBody";
import AuthorBlock from "./AuthorBlock";
import toast from "react-hot-toast";

const DOWNVOTE_REASONS = [
  { value: "outdated", label: "Outdated — rules/scores changed" },
  { value: "unsourced", label: "Unsourced — no evidence for claims" },
  { value: "off-topic", label: "Off-topic — doesn't answer the question" },
  { value: "incorrect", label: "Incorrect — factually wrong" },
];

export default function AnswerCard({ answer, isAsker, onAccept, accepting, questionId, insideGroup = false }){
  const axiosSecure = useAxiosSecure();
  const { me } = useRole();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [voting,setVoting]=useState(false);
  const [showReason,setShowReason]=useState(false);
  const [reason,setReason]=useState("");
  const [menuOpen,setMenuOpen]=useState(false);
  const [editing,setEditing]=useState(false);
  const [editBody,setEditBody]=useState(answer.body||"");
  const [editLink,setEditLink]=useState(answer.sourceLink||"");
  const [saving,setSaving]=useState(false);
  const menuRef=useRef(null);

  const isAccepted = Boolean(answer.accepted);
  const isAuthor = String(answer.authorEmail||"").toLowerCase()===String(user?.email||"").toLowerCase();
  const qKey = ["question", String(questionId || answer.questionId)];
  const [expanded, setExpanded] = useState(false);
  const bodyText = String(answer.body || "");
  const isLong = bodyText.length > 280 || bodyText.split("\n").length > 4;
  useEffect(()=>{ setExpanded(false); }, [answer._id]);

  useEffect(()=>{
    if(!menuOpen) return;
    const onDown=(e)=>{ if(menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onEsc=(e)=>{ if(e.key==="Escape") setMenuOpen(false); };
    document.addEventListener("mousedown",onDown); document.addEventListener("keydown",onEsc);
    return()=>{document.removeEventListener("mousedown",onDown); document.removeEventListener("keydown",onEsc);};
  },[menuOpen]);

  const handleEditSave=async()=>{
    const body=editBody.trim();
    if(body.length<20) return toast.error("Answer body must be at least 20 characters");
    if(body.length>10000) return toast.error("Answer body must be at most 10000 characters");
    if(editLink && editLink.trim()){
      try{ const u=new URL(editLink.trim()); if(!["http:","https:"].includes(u.protocol)) throw new Error(); } catch{ return toast.error("sourceLink must be a valid http(s) URL"); }
    }
    setSaving(true);
    try{
      await axiosSecure.patch(`/answers/${answer._id}`, { body, sourceLink: editLink.trim()||null });
      toast.success("Answer updated");
      setEditing(false); setMenuOpen(false);
      qc.invalidateQueries({ queryKey: qKey });
    } catch(e){ toast.error(e?.response?.data?.message || e.message); } finally{ setSaving(false); }
  };

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
     setVoting(true);
     try{
       const payload = reason.trim() ? { reason: reason.trim() } : {};
       await axiosSecure.post(`/answers/${answer._id}/downvote`, payload);
       toast.success(reason.trim() ? "Downvoted with reason — actionable feedback" : "Downvoted");
       setShowReason(false); setReason("");
       qc.invalidateQueries({ queryKey: qKey });
     } catch(e){
       toast.error(e?.response?.data?.message || e.message);
     } finally { setVoting(false); }
   };

  // when fused inside QuestionDetail's AnswerBlock, parent provides outer border/shadow
  const outerClass = insideGroup
    ? `relative overflow-hidden bg-white transition-colors ${isAccepted ? "bg-emerald-50/30" : "bg-white"}`
    : `relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${isAccepted ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200"}`;

  return (
    <article className={outerClass}>
      {isAccepted && (
        <div className={`flex items-center gap-1.5 border-b px-4 py-2 text-[11px] font-bold uppercase tracking-widest ${isAccepted ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-slate-100 bg-emerald-50 text-emerald-700"}`}>
          <CheckCircle2 className="h-3.5 w-3.5" /> Accepted Answer
        </div>
      )}
        <div className="flex gap-3 p-5">
        {/* Vote rail */}
        <div className="flex w-10 shrink-0 flex-col items-center gap-0.5">
          <button onClick={handleUpvote} disabled={voting || !me} title={me ? "Upvote" : "Sign in to vote"} className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600 disabled:opacity-40">
            <ArrowBigUp className="h-6 w-6" />
          </button>
          <span className="text-sm font-extrabold text-slate-800" title={(answer.downvoteReasons||[]).length ? `Downvote reasons: ${(answer.downvoteReasons||[]).join(", ")}` : "vote score"}>{answer.voteScore ?? 0}</span>
          <button onClick={()=> me && setShowReason(v=>!v)} disabled={voting || !me} title={me ? "Downvote (optional reason)" : "Sign in to vote"} className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30">
            <ArrowBigDown className="h-6 w-6" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <AuthorBlock email={answer.authorEmail} role={answer.authorRole} isVerified={answer.authorIsVerified} />
              {Boolean(answer.isEdited) && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">edited</span>}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400">{new Date(answer.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
              {isAuthor && (
                <div className="relative" ref={menuRef}>
                  <button onClick={()=>setMenuOpen(v=>!v)} className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="More" aria-haspopup="menu" aria-expanded={menuOpen}>
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {menuOpen && (
                    <div role="menu" className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                      <button role="menuitem" onClick={()=>{ setEditing(true); setEditBody(answer.body||""); setEditLink(answer.sourceLink||""); setMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Pencil className="h-4 w-4 text-slate-500" /> Edit
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {editing ? (
            <div className="py-3 space-y-3">
              <textarea value={editBody} onChange={e=>setEditBody(e.target.value)} maxLength={10000} rows={6} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100" placeholder="Edit your answer (20-10000 chars)" />
              <input value={editLink} onChange={e=>setEditLink(e.target.value)} placeholder="Source link (optional, https://…)" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100" />
              <div className="flex gap-2">
                <button onClick={handleEditSave} disabled={saving} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-black disabled:opacity-50">{saving?"Saving…":"Save"}</button>
                <button onClick={()=>setEditing(false)} className="rounded-full bg-white px-4 py-2 text-xs font-semibold ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
              </div>
              <p className="text-[11px] text-slate-400">{editBody.trim().length}/10000 (min 20)</p>
            </div>
          ) : (
            <div className="py-3">
              <div
                onClick={()=>{ if(!expanded && isLong) setExpanded(true); }}
                className={isLong && !expanded ? "cursor-pointer" : ""}
                style={!expanded && isLong ? { display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" } : undefined}
              >
                <MarkdownBody text={answer.body} />
              </div>
              {isLong && !expanded && (
                <button type="button" onClick={()=>setExpanded(true)} className="mt-2 text-sm font-semibold text-sky-600 hover:underline">(more)</button>
              )}
              {isLong && expanded && (
                <button type="button" onClick={()=>setExpanded(false)} className="mt-2 text-sm font-semibold text-slate-500 hover:text-slate-700">Show less</button>
              )}
            </div>
          )}

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
              <p className="text-xs font-bold text-rose-800">Why are you downvoting? (optional — gives the answerer something actionable)</p>
              <div className="mt-2 space-y-1">
                {DOWNVOTE_REASONS.map(r=> (
                  <label key={r.value} className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${reason===r.value ? "bg-white font-semibold text-rose-700 ring-1 ring-rose-200" : "text-slate-600 hover:bg-white/70"}`}>
                    <input type="radio" name={`reason-${answer._id}`} checked={reason===r.value} onChange={()=>setReason(r.value)} className="radio radio-error radio-xs" />
                    {r.label}
                  </label>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <button onClick={handleDownvote} disabled={voting} className="btn btn-xs btn-error text-white">{voting ? "…" : "Confirm downvote"}</button>
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
