/* eslint-disable react/prop-types */
import { Inbox } from "lucide-react";
import { cn } from "../../lib/cn";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  message = "There is no data to display right now.",
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-gradient-to-b from-white to-slate-50/60 px-6 py-16 text-center transition-colors hover:border-brand-200",
        className
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-500 ring-1 ring-brand-100">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {message}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
