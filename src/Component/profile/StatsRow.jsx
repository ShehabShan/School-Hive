import { Link } from "react-router-dom";
import { hasValue } from "../../utils/hasValue";

export default function StatsRow({ stats = [] }) {
  const filtered = stats.filter((s) => hasValue(s.value) || s.value === 0 || s.value === "0");
  if (!filtered.length) return null;
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
      {filtered.map((s) => {
        const Tag = s.to ? Link : "div";
        const props = s.to ? { to: s.to } : {};
        // normalize value — avoid "null" string, use ?? not ||
        const display = s.value ?? "—";
        const safeValue = display === null || display === undefined || String(display).trim() === "" ? "—" : String(display);
        // hide "null" literal safety
        const finalValue = safeValue === "null" || safeValue === "undefined" ? "—" : safeValue;
        return (
          <Tag key={s.label} {...props} className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 px-2 py-3 text-center hover:-translate-y-0.5 hover:shadow-sm">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.color || "bg-white text-slate-600 ring-1 ring-slate-200"}`}><s.icon className="h-4 w-4" /></span>
            <span className="mt-1 text-sm font-extrabold text-slate-900">{finalValue}</span>
            <span className="text-[11px] font-medium leading-tight text-slate-500">{s.label}</span>
          </Tag>
        );
      })}
    </div>
  );
}
