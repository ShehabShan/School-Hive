/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Check, FileText } from "lucide-react";

export default function Checklist({ scholarshipId, documents = [] }) {
  const key = `checklist-${scholarshipId}`;
  const [done, setDone] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); } catch { return new Set(); }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify([...done])); }, [done, key]);
  const list = documents.length ? documents : ["Transcript", "Statement of Purpose", "Recommendation letter", "IELTS/TOEFL (if required)", "CV"];
  const toggle = (d) => setDone((prev) => { const n = new Set(prev); if (n.has(d)) n.delete(d); else n.add(d); return n; });
  const pct = Math.round((done.size / list.length) * 100);
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-bold text-slate-900"><FileText className="h-5 w-5 text-brand-600" /> Documents checklist</h4>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100">{done.size}/{list.length} · {pct}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-gradient-to-r from-brand-600 to-brand-700 transition-all" style={{ width: `${pct}%` }} /></div>
      <ul className="mt-4 space-y-2">
        {list.map((d) => (
          <li key={d} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
            <button onClick={() => toggle(d)} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${done.has(d) ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white"}`}>{done.has(d) && <Check className="h-3.5 w-3.5" />}</button>
            <span className={`text-sm ${done.has(d) ? "font-semibold text-slate-700 line-through decoration-slate-300" : "text-slate-700"}`}>{d}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-400">Saved locally on this device.</p>
    </div>
  );
}
