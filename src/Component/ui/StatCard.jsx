import { cn } from "../../lib/cn";

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  accent = "brand",
}) {
  const accents = {
    brand: "bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 ring-brand-100",
    amber: "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 ring-amber-100",
    emerald: "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 ring-emerald-100",
    sky: "bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 ring-sky-100",
    violet: "bg-gradient-to-br from-violet-50 to-violet-100 text-violet-600 ring-violet-100",
  };

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-110",
              accents[accent]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      {trend && (
        <p className="mt-1 text-xs font-medium text-slate-400">{trend}</p>
      )}
    </div>
  );
}
