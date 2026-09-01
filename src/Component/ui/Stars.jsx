/* eslint-disable react/prop-types */
import { Star } from "lucide-react";
import { cn } from "../../lib/cn";

export default function Stars({ rating = 0, size = "h-4 w-4", showValue = false }) {
  const rounded = Math.round(Number(rating) || 0);

  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              size,
              i < rounded
                ? "fill-amber-400 text-amber-400 drop-shadow-[0_1px_1px_rgba(245,158,11,0.35)]"
                : "fill-slate-200 text-slate-200"
            )}
          />
        ))}
      </span>
      {showValue && (
        <span className="ml-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-bold text-amber-600 ring-1 ring-amber-100">
          {Number(rating || 0).toFixed(1)}
        </span>
      )}
    </span>
  );
}
