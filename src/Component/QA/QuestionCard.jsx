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

export function QuestionListItem({ q }){
  const excerpt = stripMarkdown(q.body);
  return (
    <article className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-brand-300 hover:shadow-md">
      <div className="hidden w-24 shrink-0 flex-col items-center justify-center gap-1.5 border-r border-slate-100 pr-4 sm:flex">
        <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-700" title="votes"><ArrowBigUp className="h-4 w-4 text-slate-400" />{q.voteScore ?? 0}</span>
        <AnswerStat count={q.answerCount ?? 0} accepted={Boolean(q.acceptedAnswerId)} />
        <span className="inline-flex items-center gap-1 text-xs text-slate-400" title="views"><Eye className="h-3.5 w-3.5" />{q.viewCount ?? 0}</span>
      </div>
      <div className="min-w-0 flex-1">
        <AuthorBlock email={q.authorEmail} role={q.authorRole} isVerified={q.authorIsVerified} time={q.createdAt} size="sm" className="mb-2" />
        <Link to={`/questions/${q._id}`} className="block">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900 group-hover:text-brand-600">{q.title}</h3>
          {excerpt && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{excerpt.slice(0, 220)}</p>}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">{categoryLabel(q.category)}</span>
          {(q.tags||[]).slice(0,3).map(t=> <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{tagLabel(t)}</span>)}
          {(q.context?.destinationCountry || q.context?.studyLevel) && (
            <span className="text-xs text-slate-400">
              {q.context?.destinationCountry ? `${q.context.destinationCountry}` : ""}
              {q.context?.destinationCountry && q.context?.studyLevel ? " · " : ""}
              {q.context?.studyLevel ? `${q.context.studyLevel}` : ""}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400 sm:hidden">
          <span className="font-bold text-slate-600">{q.voteScore ?? 0} votes</span>
          <AnswerStat count={q.answerCount ?? 0} accepted={Boolean(q.acceptedAnswerId)} />
          <span>{q.viewCount ?? 0} views</span>
        </div>
      </div>
      <div className="hidden shrink-0 flex-col items-end justify-between text-xs text-slate-400 md:flex">
        <span className="inline-flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{timeAgo(q.createdAt)}</span>
        <span className="font-medium">{q.language}</span>
      </div>
    </article>
  );
}

export function QuestionCard({ q }){
  const excerpt = stripMarkdown(q.body);
  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-brand-300 hover:shadow-md">
      <AuthorBlock email={q.authorEmail} role={q.authorRole} isVerified={q.authorIsVerified} time={q.createdAt} size="sm" className="mb-2" />
      <div className="flex items-start justify-between gap-2">
        <Link to={`/questions/${q._id}`} className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900 group-hover:text-brand-600">{q.title}</h3>
        </Link>
        <AnswerStat count={q.answerCount ?? 0} accepted={Boolean(q.acceptedAnswerId)} />
      </div>
      {excerpt && <Link to={`/questions/${q._id}`} className="block"><p className="mt-1 line-clamp-3 text-sm text-slate-500">{excerpt.slice(0, 180)}</p></Link>}
      <div className="mt-auto pt-3">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">{categoryLabel(q.category)}</span>
          {(q.tags||[]).slice(0,3).map(t=> <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{tagLabel(t)}</span>)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{q.voteScore ?? 0} votes · {q.viewCount ?? 0} views</span>
          <span>{timeAgo(q.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
