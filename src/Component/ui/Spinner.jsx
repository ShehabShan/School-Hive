import { cn } from "../../lib/cn";

export default function Spinner({ className = "h-8 w-8" }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer gradient glow pulse */}
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500/20 opacity-75" />
      
      {/* Dual ring spinner */}
      <span
        role="status"
        aria-label="Loading"
        className={cn(
          "relative inline-block animate-spin rounded-full border-[3px] border-brand-200 border-t-brand-600 border-r-brand-600 align-middle shadow-soft",
          className
        )}
      />

      {/* Center dot accent */}
      <span className="absolute h-2 w-2 rounded-full bg-brand-600" />
    </div>
  );
}

