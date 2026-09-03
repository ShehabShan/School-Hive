import { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";

export default function SearchableCombobox({ label, placeholder, options, value, onChange, hint }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onEsc); };
  }, [open]);

  const filtered = options.filter((o) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return String(o.label || o.value || o).toLowerCase().includes(q) || String(o.value || "").toLowerCase().includes(q);
  }).slice(0, 8);

  const selected = options.find((o) => (o.value || o) === value);

  return (
    <div ref={ref} className="relative">
      <label className="mb-1.5 block text-xs font-extrabold tracking-wide text-slate-700 uppercase">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-2xl border bg-white px-3.5 py-3 text-left shadow-sm transition-all hover:border-slate-300 ${open ? "border-brand-500 ring-4 ring-brand-50" : "border-slate-200"}`}
      >
        <span className={`flex items-center gap-2 text-sm ${selected ? "font-semibold text-slate-900" : "text-slate-400"}`}>
          {selected ? (
            <>
              {selected.flag && <span className="text-base leading-none">{selected.flag}</span>}
              {selected.label || selected.value || selected}
            </>
          ) : (
            placeholder
          )}
        </span>
        <span className="flex items-center gap-1">
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onChange(""); setQuery(""); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onChange(""); setQuery(""); } }}
              className="rounded-full p-1 hover:bg-slate-100"
            >
              <X className="h-3.5 w-3.5 text-slate-400" />
            </span>
          )}
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}…`}
              className="w-full bg-transparent py-1 text-sm placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="max-h-56 overflow-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs text-slate-500">No matches — type to keep your own value or clear.</p>
            ) : (
              filtered.map((o) => {
                const val = o.value || o;
                const isSel = val === value;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { onChange(val); setOpen(false); setQuery(""); }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-slate-50 ${isSel ? "bg-brand-50 font-semibold text-brand-700 ring-1 ring-brand-100" : "text-slate-700"}`}
                  >
                    {o.flag && <span className="text-base">{o.flag}</span>}
                    <span className="truncate">{o.label || o}</span>
                    {isSel && <span className="ml-auto text-xs">✓</span>}
                  </button>
                );
              })
            )}
          </div>
          {hint && <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">{hint}</p>}
        </div>
      )}
    </div>
  );
}
