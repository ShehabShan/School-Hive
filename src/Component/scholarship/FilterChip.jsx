/* eslint-disable react/prop-types */
import { X } from "lucide-react";

export default function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="ml-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700 hover:bg-brand-200"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
