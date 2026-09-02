import { motion } from "framer-motion";

export default function CompletenessMeter({ value = 0, size = 56 }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? "text-emerald-500" : pct >= 50 ? "text-brand-500" : "text-amber-500";
  const bg = pct >= 80 ? "bg-emerald-50" : pct >= 50 ? "bg-brand-50" : "bg-amber-50";

  return (
    <div className={`flex items-center gap-3 rounded-xl ${bg} px-3 py-2.5 ring-1 ring-slate-100`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} stroke="#e2e8f0" strokeWidth="5" fill="none" />
          <motion.circle
            cx={size/2} cy={size/2} r={radius}
            stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }} transition={{ duration: 0.8, ease: "easeOut" }}
            className={color}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-extrabold ${color}`}>{pct}%</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-800">Profile completeness</p>
        <p className="text-[11px] text-slate-500">{pct < 50 ? "Add more details to shine" : pct < 80 ? "Almost there!" : "Impressive profile!"}</p>
      </div>
    </div>
  );
}
