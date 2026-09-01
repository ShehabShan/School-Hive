/* eslint-disable react/prop-types */
import { cn } from "../../lib/cn";

const statusStyles = {
  accepted: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  approved: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  completed: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-100 text-amber-700 ring-amber-200",
  processing: "bg-amber-100 text-amber-700 ring-amber-200",
  rejected: "bg-rose-100 text-rose-700 ring-rose-200",
  hidden: "bg-slate-100 text-slate-600 ring-slate-200",
  removed: "bg-rose-50 text-rose-700 ring-rose-200",
};

const dotStyles = {
  accepted: "bg-emerald-500",
  approved: "bg-emerald-500",
  completed: "bg-emerald-500",
  pending: "bg-amber-500",
  processing: "bg-amber-500",
  rejected: "bg-rose-500",
  hidden: "bg-slate-400",
  removed: "bg-rose-500",
};

export default function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize shadow-sm ring-1 ring-inset",
        statusStyles[s] || "bg-slate-100 text-slate-600 ring-slate-200"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          dotStyles[s] || "bg-slate-400"
        )}
      />
      {status}
    </span>
  );
}
