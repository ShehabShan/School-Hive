import { useMemo, useState } from "react";
import { QUESTION_TAGS, tagLabel } from "../../../constants/qa";

export default function TagSelector({ value, onChange, error }) {
  const [input, setInput] = useState("");

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [];
    return QUESTION_TAGS.filter((t) => t.includes(q) && !value.includes(t)).slice(0, 8);
  }, [input, value]);

  const add = (t) => {
    const v = String(t || input).trim().toLowerCase();
    if (!v || value.length >= 5 || value.includes(v)) { setInput(""); return; }
    onChange([...value, v]);
    setInput("");
  };
  const remove = (t) => onChange(value.filter((x) => x !== t));

  return (
    <div className="space-y-2">
      <label className="flex items-baseline justify-between">
        <span className="text-sm font-bold text-slate-900">Tags <span className="text-rose-500">*</span> <span className="font-normal text-slate-500">1–5</span></span>
        <span className={`text-xs font-bold ${value.length === 0 ? "text-slate-400" : value.length === 5 ? "text-amber-600" : "text-emerald-600"}`}>{value.length}/5</span>
      </label>

      <div className={`flex gap-2 rounded-2xl border bg-white p-2 shadow-sm transition-all ${error ? "border-rose-300 ring-4 ring-rose-50" : "border-slate-200 hover:border-slate-300 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-50"}`}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={value.length >= 5 ? "Max 5 tags reached" : "Type tag and press Enter — e.g. ielts, canada"}
          disabled={value.length >= 5}
          className="flex-1 bg-transparent px-2 py-1.5 text-sm placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
        />
        <button type="button" onClick={() => add()} disabled={value.length >= 5 || !input.trim()} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-black disabled:opacity-40">Add</button>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((t) => (
            <button key={t} type="button" onClick={() => add(t)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:ring-1 hover:ring-slate-300">
              + {tagLabel(t)}
            </button>
          ))}
        </div>
      )}

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {value.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">
              {tagLabel(t)}
              <button type="button" onClick={() => remove(t)} className="rounded-full bg-white/20 p-0.5 hover:bg-white/30">×</button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">Controlled vocab: ielts, canada, scholarship, visa… Free-form allowed, synonym-merge is Phase 2.</p>
      )}

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
      <p className="text-xs text-slate-500">Tags + context make your question discoverable via <span className="font-semibold">Browse</span> filters — a question without tags is invisible.</p>
    </div>
  );
}
