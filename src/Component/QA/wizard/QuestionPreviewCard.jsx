import { tagLabel } from "../../../constants/qa";

export default function QuestionPreviewCard({ data }) {
  const { title, body, category, tags, context, language } = data;
  const hasContent = title.trim() || body.trim() || tags.length > 0;
  if (!hasContent) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm font-semibold text-slate-600">Your question preview will appear here</p>
        <p className="mt-1 text-xs text-slate-500">Fill title + details — see exactly how card renders in the feed.</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900">{title || "Untitled question — add a specific title"}</h3>
        <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-slate-600">{body ? String(body).slice(0, 160) : "Body preview — write details on the left."}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {category ? <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">{category}</span> : <span className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-xs text-slate-400">category</span>}
          {tags.length > 0 ? tags.slice(0, 4).map((t) => <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">{tagLabel(t)}</span>) : <span className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-xs text-slate-400">tags 1–5</span>}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          {context.destinationCountry && <span className="rounded-full bg-indigo-50 px-2 py-1 font-medium text-indigo-700 ring-1 ring-indigo-100">{context.destinationCountry}</span>}
          {context.homeCountry && <span className="rounded-full bg-slate-50 px-2 py-1 font-medium text-slate-600 ring-1 ring-slate-200">{context.homeCountry}</span>}
          {context.studyLevel && <span className="rounded-full bg-slate-50 px-2 py-1 font-medium text-slate-600 ring-1 ring-slate-200">{context.studyLevel}</span>}
          {context.fieldOfStudy && <span className="rounded-full bg-slate-50 px-2 py-1 font-medium text-slate-600 ring-1 ring-slate-200">{context.fieldOfStudy}</span>}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <span className="font-medium text-slate-500">{language}</span>
          <span className="text-slate-400">score 0 • views 0 • preview</span>
        </div>
      </div>
    </div>
  );
}
