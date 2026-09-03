import { hasValue } from "../../utils/hasValue";

export default function OptionalField({ value, isOwner = false, addLabel, onAdd, children, fallback = null }) {
  const present = hasValue(value);
  if (present) return children ?? null;
  if (isOwner && addLabel) {
    return (
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-slate-200 hover:bg-brand-50 hover:ring-brand-200"
      >
        + {addLabel}
      </button>
    );
  }
  return fallback;
}
