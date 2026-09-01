/* eslint-disable react/prop-types */
import { cn } from "../../lib/cn";

export default function Spinner({ className = "h-5 w-5" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-[3px] border-current border-t-transparent align-middle",
        className
      )}
    />
  );
}
