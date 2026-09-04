import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, CheckCircle2, Eye, ArrowBigUp } from "lucide-react";
import { tagLabel, QUESTION_CATEGORIES } from "../../constants/qa";
import AuthorBlock from "./AuthorBlock";

const categoryLabel = (slug) => QUESTION_CATEGORIES.find((c) => c.value === slug)?.label || tagLabel(slug);

export function stripMarkdown(md) {
  return String(md || "")
    .replace(/!\[.*?\]\(.*?\)/g, "")   // images
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1") // links → text
    .replace(/[*_`#>~|-]/g, " ")        // emphasis/code/quote chars
    .replace(/\s+/g, " ")
    .trim();
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
  const full = stripMarkdown(q.body);
  const isLong = full.length > 150;
  const snippet = expanded ? full : full.slice(0, 150);
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-brand-300 hover:shadow-md sm:p-5">
      <AuthorBlock email={q.authorEmail} role={q.authorRole} isVerified={q.authorIsVerified} time={q.createdAt} size="sm" />
      <Link to={`/questions/${q._id}`} className="mt-3 block">
        <h3 className="line-clamp-2 text-[16px] font-bold leading-snug text-slate-900 group-hover:text-brand-600">{q.title}</h3>
      </Link>
      {full && (
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {snippet}
          {!expanded && isLong ? "…" : ""}
          {isLong && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpanded(!expanded); }}
              className="ml-1 text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline"
            >
              {expanded ? "Show less" : "More"}
            </button>
          )}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">{categoryLabel(q.category)}</span>
        {(q.tags || []).slice(0, 3).map((t) => <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{tagLabel(t)}</span>)}
      </div>
      <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1 font-semibold text-slate-700" title="votes"><ArrowBigUp className="h-4 w-4 text-slate-400" />{q.voteScore ?? 0} votes</span>
        <span className="inline-flex items-center gap-1" title="answers"><MessageSquare className="h-3.5 w-3.5" />{q.answerCount ?? 0} comments</span>
        <span className="inline-flex items-center gap-1" title="views"><Eye className="h-3.5 w-3.5" />{q.viewCount ?? 0} views</span>
        <span className="ml-auto hidden sm:inline-flex"><AnswerStat count={q.answerCount ?? 0} accepted={Boolean(q.acceptedAnswerId)} /></span>
      </div>
    </article>
  );
}

export function QuestionListItem({ q }){
  return <PostCard q={q} />;
}

export function QuestionCard({ q }){
  return <PostCard q={q} />;
}
