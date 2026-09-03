import { hasValue } from "../../utils/hasValue";

export default function Section({ title, icon: Icon, value, isOwner = false, addLabel, onAdd, className = "", children }) {
  // If value prop provided, gate on it; otherwise gate on children presence via hasValue
  const show = value !== undefined ? hasValue(value) : hasValue(children);
  if (!show) {
    if (isOwner && addLabel) {
      return (
        <div className={`rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6 ${className}`}>
          {title && (
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
              {Icon && <Icon className="h-4 w-4 text-brand-500" />} {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onAdd}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:text-brand-600"
          >
            + {addLabel}
          </button>
        </div>
      );
    }
    return null;
  }
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6 ${className}`}>
      {title && (
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
          {Icon && <Icon className="h-4 w-4 text-brand-500" />} {title}
        </h3>
      )}
      <div className={title ? "mt-3" : ""}>{children}</div>
    </div>
  );
}
