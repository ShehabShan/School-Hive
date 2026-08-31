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
              i < rounded ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
            )}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-xs font-semibold text-slate-500">
          {Number(rating || 0).toFixed(1)}
        </span>
      )}
    </span>
  );
}
