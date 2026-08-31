/* eslint-disable react/prop-types */
import { cn } from "../../lib/cn";

export default function FormField({
  label,
  hint,
  required,
  error,
  className,
  children,
}) {
  return (
    <div className={cn("form-control", className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
