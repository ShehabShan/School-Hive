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
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center",
        className
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
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
