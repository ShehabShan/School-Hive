import { useState, useRef } from "react";
import { X, Plus } from "lucide-react";

export default function ChipInput({ value = "", onChange, placeholder = "Type and press Enter", hint }) {
  const [input, setInput] = useState("");
  const chips = String(value || "").split(",").map((s) => s.trim()).filter(Boolean);
  const ref = useRef(null);

  const update = (next) => {
    onChange(next.join(", "));
  };

  const add = () => {
    const v = input.trim();
    if (!v) return;
    // allow comma-separated paste
    const parts = v.split(",").map((s) => s.trim()).filter(Boolean);
    const next = [...chips, ...parts].slice(0, 20);
    // dedupe
    const uniq = [...new Set(next)];
    update(uniq);
    setInput("");
  };

  const remove = (idx) => {
    const next = chips.filter((_, i) => i !== idx);
    update(next);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    }
    if (e.key === "Backspace" && !input && chips.length) {
      remove(chips.length - 1);
    }
  };

  return (
    <div>
      <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
        {chips.map((c, i) => (
          <span key={c + i} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
            {c}
            <button type="button" onClick={() => remove(i)} className="rounded-full p-0.5 hover:bg-brand-100">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={ref}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
          placeholder={chips.length ? "" : placeholder}
          className="min-w-[120px] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-slate-400"
        />
        {input && (
          <button type="button" onClick={add} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {chips.length > 0 && <p className="mt-1 text-xs text-slate-500">{chips.length} item{chips.length > 1 ? "s" : ""} • Preview: {chips.slice(0, 3).join(" • ")}{chips.length > 3 ? " …" : ""}</p>}
    </div>
  );
}
