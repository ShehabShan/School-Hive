import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowBigUp } from "lucide-react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

function stripMarkdown(md) {
  return String(md || "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1")
    .replace(/[*_`#>~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function timeAgo(d) {
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
  } catch {
    return "";
  }
}

export default function AnswersTab({ email, enabled }) {
  const axiosPublic = useAxiosPublic();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile-answers", email],
    enabled: !!email && enabled,
    queryFn: async () => {
      const res = await axiosPublic.get("/answers", { params: { authorEmail: email, limit: 20 } });
      return res.data;
    },
  });

  if (!enabled) return null;
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="mt-3 h-3 w-full rounded bg-slate-100" />
            <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }
  if (isError) return <p className="rounded-2xl bg-white p-6 text-sm text-rose-600 ring-1 ring-slate-100">Failed to load answers.</p>;

  const list = data?.data || [];
  if (!list.length) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-100">
        <p className="text-sm font-semibold text-slate-700">No answers yet</p>
        <p className="mt-1 text-xs text-slate-500">Answers will appear here when they write one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {list.map((a) => {
        const snippet = stripMarkdown(a.body).slice(0, 220);
        const qid = a.questionId ? String(a.questionId) : null;
        return (
          <div key={a._id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
            {a.questionTitle && qid && (
              <Link to={`/questions/${qid}`} className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 hover:text-brand-600">
                {a.questionTitle}
              </Link>
            )}
            {!a.questionTitle && qid && (
              <Link to={`/questions/${qid}`} className="text-xs font-semibold text-brand-600 hover:underline">
                View question
              </Link>
            )}
            {snippet && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{snippet}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 font-bold text-slate-700 ring-1 ring-slate-200">
                <ArrowBigUp className="h-3.5 w-3.5" /> {a.voteScore ?? 0}
              </span>
              {a.accepted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 font-bold text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Accepted
                </span>
              )}
              <span className="text-slate-400">{timeAgo(a.createdAt)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
