import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, CheckCircle2, ArrowBigUp, ArrowBigDown, Eye, MoreHorizontal } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import AuthorBlock from "./AuthorBlock";
import CommentThread from "./CommentThread";
import useRole from "../../Hooks/useRole";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

export function stripMarkdown(md) {
  return String(md || "")
    .replace(/!\[.*?\]\(.*?\)/g, "")   // images
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1") // links → text
    .replace(/[*_`#>~|-]/g, " ")        // emphasis/code/quote chars
    .replace(/\s+/g, " ")
    .trim();
}

function extractImages(md){
  const re = /!\[.*?\]\(.*?\)/g;
  const urls = [];
  const str = String(md||"");
  const urlRe = /!\[.*?\]\((.*?)\)/;
  let match;
  while((match = re.exec(str)) !== null){
    const u = match[0].match(urlRe);
    if(u && u[1]) urls.push(u[1].trim());
    if(urls.length >= 2) break;
  }
  return urls.slice(0,2);
}

function formatCompact(n){
  const v = Number(n) || 0;
  if(v >= 10000) return (v/1000).toFixed(1).replace(/\.0$/,"")+"K";
  if(v >= 1000) return (v/1000).toFixed(1).replace(/\.0$/,"")+"K";
  return String(v);
}

export function timeAgo(d) {
  try {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(d).toLocaleDateString();
  } catch { return ""; }
}

export function AnswerStat({ count, accepted }) {
  if (accepted) return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white" title="Accepted answer">
      <CheckCircle2 className="h-3.5 w-3.5" /> {count}
    </span>
  );
  if (count > 0) return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700" title="Answered">
      {count}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500" title="Not answered">
      {count}
    </span>
  );
}

function PostCard({ q }) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const full = stripMarkdown(q.body);
  const isLong = full.length > 150;
  const snippet = expanded ? full : full.slice(0, 150);
  const images = extractImages(q.body);
  const { me } = useRole();
  const axiosSecure = useAxiosSecure();
  const qc = useQueryClient();
  const myEmail = String(me?.email || "").toLowerCase();
  const upvoters = Array.isArray(q.upvoterIds) ? q.upvoterIds.map(String) : [];
  const downvoters = Array.isArray(q.downvoterIds) ? q.downvoterIds.map(String) : [];
  const iUpvoted = upvoters.includes(myEmail);
  const iDownvoted = downvoters.includes(myEmail);
  const hasVoted = iUpvoted || iDownvoted;
  const rep = typeof me?.reputation === "number" ? me.reputation : 0;
  const canDownvote = rep >= 125;

  const handleUpvote = async (e)=>{
    e.preventDefault(); e.stopPropagation();
    if(!me) return toast.error("Sign in to vote");
    if(hasVoted) return toast.error("Already voted");
    try{
      await axiosSecure.post(`/questions/${q._id}/upvote`);
      toast.success("Upvoted — asker earns +2");
      qc.invalidateQueries({ queryKey: ["questions-browse"] });
      qc.invalidateQueries({ queryKey: ["question", String(q._id)] });
    }catch(err){ toast.error(err?.response?.data?.message || err.message); }
  };
  const handleDownvote = async (e)=>{
    e.preventDefault(); e.stopPropagation();
    if(!me) return toast.error("Sign in to vote");
    if(!canDownvote) return toast.error("125 rep required to downvote");
    if(hasVoted) return toast.error("Already voted");
    try{
      await axiosSecure.post(`/questions/${q._id}/downvote`);
      toast.success("Downvoted");
      qc.invalidateQueries({ queryKey: ["questions-browse"] });
      qc.invalidateQueries({ queryKey: ["question", String(q._id)] });
    }catch(err){ toast.error(err?.response?.data?.message || err.message); }
  };
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <div className="p-4 sm:p-5 pb-3">
        <AuthorBlock email={q.authorEmail} role={q.authorRole} isVerified={q.authorIsVerified} time={q.createdAt} size="sm" />
        <Link to={`/questions/${q._id}`} className="mt-3 block">
          <h3 className="line-clamp-2 text-[17px] font-extrabold leading-snug text-slate-900">{q.title}</h3>
        </Link>
        {full && (
          <p onClick={() => { if(!expanded && isLong) setExpanded(true); }} className={`mt-2 text-sm leading-relaxed text-slate-700 ${!expanded && isLong ? "cursor-pointer" : ""}`}>
            {snippet}
            {!expanded && isLong ? "…" : ""}
            {isLong && !expanded && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpanded(true); }}
                className="ml-1 text-sm text-sky-600 hover:underline"
              >
                (more)
              </button>
            )}
          </p>
        )}
      </div>
      {images.length > 0 && (
        <div className="-mx-0 border-y border-slate-100">
          {images.map((url,i)=> (
            <img key={i} src={url} alt="" className="w-full object-cover" loading="lazy" style={{ maxHeight: 420 }} onError={(e)=> e.currentTarget.style.display='none'} />
          ))}
        </div>
      )}
      <div className="flex items-center gap-1 px-4 py-2.5 text-xs sm:px-5">
        <button onClick={handleUpvote} disabled={!me || hasVoted} title={!me ? "Sign in to vote" : hasVoted ? "Already voted" : "Upvote — asker earns +2"} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${iUpvoted ? "bg-brand-600 text-white ring-brand-600" : "bg-sky-50 text-sky-700 ring-sky-100 hover:bg-sky-100"} disabled:opacity-40`}>
          <ArrowBigUp className={`h-3.5 w-3.5 ${iUpvoted ? "fill-white" : ""}`} /> Upvote · {formatCompact(q.voteScore ?? 0)}
        </button>
        <button onClick={handleDownvote} disabled={!me || hasVoted || !canDownvote} title={!me ? "Sign in to vote" : !canDownvote ? "125 rep required to downvote" : hasVoted ? "Already voted" : "Downvote"} className={`inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white shadow-sm disabled:opacity-30 ${iDownvoted ? "border-sky-200 bg-sky-50 text-sky-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
          <ArrowBigDown className="h-3.5 w-3.5" />
        </button>
        <button onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); setShowComments(v=>!v); }} className="ml-2 inline-flex items-center gap-1 text-slate-500 hover:text-slate-700" title="comments"><MessageSquare className="h-3.5 w-3.5" /> {q.answerCount ?? 0}</button>
        <span className="inline-flex items-center gap-1 text-slate-500" title="views"><Eye className="h-3.5 w-3.5" /> {q.viewCount ?? 0}</span>
        <span className="ml-auto inline-flex items-center gap-1 text-slate-400"><MoreHorizontal className="h-4 w-4" /></span>
      </div>
      {showComments && <CommentThread questionId={q._id} />}
    </article>
  );
}

export function QuestionListItem({ q }){
  return <PostCard q={q} />;
}

export function QuestionCard({ q }){
  return <PostCard q={q} />;
}
