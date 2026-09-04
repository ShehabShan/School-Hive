import { Check, Lock, ShieldCheck } from "lucide-react";
import { PRIVILEGE_LADDER } from "../../constants/qa";

const PrivilegeLadder = ({ reputation = 0 }) => {
  const rep = Math.max(0, Number(reputation) || 0);
  const next = PRIVILEGE_LADDER.find((p) => rep < p.rep);
  const prev = [...PRIVILEGE_LADDER].reverse().find((p) => rep >= p.rep);
  const progress = next && prev ? Math.min(100, Math.round(((rep - prev.rep) / (next.rep - prev.rep)) * 100)) : 100;

  return (
    <section aria-label="Reputation privileges" className="mt-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <ShieldCheck className="h-4 w-4" />
          </span>
          Reputation privileges
        </h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{rep} rep</span>
      </div>

      {next ? (
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-600">
            {next.rep - rep} rep to unlock: <span className="text-brand-700">{next.label}</span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <p className="mt-4 text-xs font-semibold text-emerald-700">All privileges unlocked — thank you for helping the community.</p>
      )}

      <ul className="mt-4 space-y-2">
        {PRIVILEGE_LADDER.map((p) => {
          const unlocked = p.rep === 1 ? true : rep >= p.rep;
          return (
            <li key={p.rep} className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm ${unlocked ? "bg-emerald-50/60" : "bg-slate-50"}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${unlocked ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-400"}`}>
                {unlocked ? <Check className="h-3.5 w-3.5" /> : <Lock className="h-3 w-3" />}
              </span>
              <span className={unlocked ? "font-semibold text-slate-800" : "text-slate-500"}>{p.label}</span>
              <span className="ml-auto shrink-0 text-xs font-bold text-slate-400">{p.rep >= 1500 ? "1.5k" : p.rep} rep</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default PrivilegeLadder;
