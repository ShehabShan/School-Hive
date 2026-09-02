import { useState } from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";

function sanitize(str) {
  return String(str || "").replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/<[^>]*>?/gm, "").slice(0, 800).trim();
}

export default function FAQBuilder({ value = "", onChange }) {
  // parse initial value: either JSON or q=>a string
  const parse = (v) => {
    const raw = String(v || "").trim();
    if (!raw) return [{ q: "", a: "" }];
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr.map((x) => ({ q: sanitize(x.q || x.question || ""), a: sanitize(x.a || x.answer || "") })).filter((x) => x.q || x.a);
    } catch {}
    if (raw.includes("=>") || raw.includes("|")) {
      return raw.split("|").map((pair) => { const [q, a] = pair.split("=>"); return q && a ? { q: sanitize(q), a: sanitize(a) } : null; }).filter(Boolean);
    }
    return [{ q: raw, a: "" }];
  };

  const [faqs, setFaqs] = useState(() => parse(value));

  const sync = (next) => {
    setFaqs(next);
    // send as JSON string for form
    const clean = next.filter((f) => f.q.trim() && f.a.trim()).map((f) => ({ q: sanitize(f.q), a: sanitize(f.a) }));
    onChange(JSON.stringify(clean));
  };

  const update = (idx, key, val) => {
    const next = [...faqs];
    next[idx] = { ...next[idx], [key]: val };
    sync(next);
  };

  const add = () => sync([...faqs, { q: "", a: "" }]);
  const remove = (idx) => {
    if (faqs.length === 1) return sync([{ q: "", a: "" }]);
    sync(faqs.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700"><HelpCircle className="h-4 w-4 text-brand-600" /> FAQ {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-rose-600 ring-1 ring-slate-200 hover:bg-rose-50">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <input value={f.q} onChange={(e) => update(i, "q", e.target.value)} placeholder="Question — e.g. Who can apply?" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100" maxLength={200} />
          <textarea value={f.a} onChange={(e) => update(i, "a", e.target.value)} placeholder="Answer — e.g. Anyone with GPA 3.0+" className="mt-2 min-h-[70px] w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100" maxLength={800} />
          <p className="mt-1 text-xs text-slate-400">{f.q.length}/200 • {f.a.length}/800 • scripts stripped automatically</p>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:bg-brand-50">
        <Plus className="h-4 w-4" /> Add another FAQ
      </button>
      <p className="text-xs text-slate-400">Preview: {faqs.filter((f)=>f.q).length} FAQ(s) • Stored as sanitized JSON, &lt;script&gt; removed</p>
    </div>
  );
}
