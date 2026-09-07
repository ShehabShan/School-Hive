import { Link } from "react-router-dom";
import { hasValue } from "../../utils/hasValue";

export default function StatsRow({ stats = [] }) {
  const filtered = stats.filter((s) => hasValue(s.value) || s.value === 0 || s.value === "0");
  if (!filtered.length) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {filtered.map((s) => {
        const Tag = s.to ? Link : "div";
        const props = s.to ? { to: s.to } : {};
        // normalize value — avoid "null" string, use ?? not ||
        const display = s.value ?? "—";
        const safeValue = display === null || display === undefined || String(display).trim() === "" ? "—" : String(display);
        // hide "null" literal safety
        const finalValue = safeValue === "null" || safeValue === "undefined" ? "—" : safeValue;
        return (
          <Tag
            key={s.label}
            {...props}
            className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-white to-slate-50 px-2 py-4 text-center ring-1 ring-slate-100"
          >
            <s.icon className="h-5 w-5 text-slate-400" />
            <span className="mt-1.5 text-[18px] font-extrabold tracking-tight text-slate-900">{finalValue}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</span>
          </Tag>
        );
      })}
    </div>
  );
}
