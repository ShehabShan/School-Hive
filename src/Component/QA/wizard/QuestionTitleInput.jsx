import { useMemo } from "react";
import DuplicatePanel from "../DuplicatePanel";

function isQuestionLike(title) {
  const t = String(title || "").trim().toLowerCase();
  if (!t) return true;
  if (t.includes("?")) return true;
  return /^(how|what|why|when|where|which|can|does|is|are|should|would|do|did|will|has|have|any|best|need|looking|is there|does anyone)/.test(t);
}

export default function QuestionTitleInput({ value, onChange, error }) {
  const showNudge = useMemo(() => value.trim().length >= 10 && !isQuestionLike(value), [value]);
  const count = value.trim().length;
  const nearLimit = count > 260;

  return (
    <div className="space-y-2">
      <label className="flex items-baseline justify-between">
        <span className="text-sm font-bold text-slate-900">Question title <span className="text-rose-500">*</span></span>
        <span className={`text-xs ${nearLimit ? "text-amber-600 font-semibold" : "text-slate-400"}`}>{count}/300</span>
      </label>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={300}
          placeholder="e.g. What IELTS score is needed for Canada Masters in Computer Science?"
          className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-[15px] font-medium placeholder:text-slate-400 shadow-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-50 ${error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-50" : "border-slate-200 hover:border-slate-300"}`}
        />
        <span className="pointer-events-none absolute right-3 top-3.5 hidden text-xs font-semibold text-slate-400 sm:block">Tip: end with “?”</span>
      </div>
      {showNudge && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
          Phrase as a question — e.g. “What…?” — it helps search and duplicate detection. Not blocking, but improves answers.
        </p>
      )}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
      <DuplicatePanel title={value} />
      <p className="text-xs text-slate-500">Good titles are specific: include destination, level, and subject. Bad: “Help me” → Good: “What IELTS band is needed for TU Munich Masters in Data Science from Bangladesh?”</p>
    </div>
  );
}
