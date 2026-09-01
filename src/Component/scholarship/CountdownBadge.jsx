import { Clock, AlertTriangle } from "lucide-react";

export function getDeadlineState(deadline) {
  if (!deadline) return { label: "No deadline", tone: "slate", days: null };
  const d = new Date(String(deadline).slice(0, 10));
  if (Number.isNaN(d.getTime())) return { label: String(deadline), tone: "slate", days: null };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d - today) / 86400000);
  if (diff < 0) return { label: "Expired", tone: "rose", days: diff };
  if (diff === 0) return { label: "Closes today", tone: "rose", days: 0 };
  if (diff === 1) return { label: "1 day left", tone: "rose", days: 1 };
  if (diff <= 7) return { label: `${diff} days left`, tone: "amber", days: diff };
  if (diff <= 30) return { label: `${diff} days left`, tone: "amber", days: diff };
  return { label: `${diff} days left`, tone: "emerald", days: diff };
}

const toneMap = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function CountdownBadge({ deadline, compact = false, className = "" }) {
  const s = getDeadlineState(deadline);
  const tone = toneMap[s.tone] || toneMap.slate;
  const Icon = s.tone === "rose" ? AlertTriangle : Clock;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 backdrop-blur ${tone} ${className}`}
      title={deadline ? `Deadline: ${deadline}` : undefined}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {compact ? (s.days !== null && s.days <= 7 ? s.label : deadline) : s.label}
    </span>
  );
}
