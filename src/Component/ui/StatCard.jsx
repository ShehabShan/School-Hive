/* eslint-disable react/prop-types */
import { cn } from "../../lib/cn";

export default function StatCard({ icon: Icon, label, value, trend, accent = "brand" }) {
  const accents = {
    brand: "bg-brand-50 text-brand-600",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
    sky: "bg-sky-100 text-sky-600",
    violet: "bg-violet-100 text-violet-600",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
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
      {trend && <p className="mt-1 text-xs font-medium text-slate-400">{trend}</p>}
    </div>
  );
}
