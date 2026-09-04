import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, ArrowRight } from "lucide-react";
import useScholership from "../../Hooks/useScholership";
import CountdownBadge from "./CountdownBadge";

const DeadlineStrip = () => {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const { data: resp, isLoading } = useScholership({ sort: "deadline", deadlineAfter: today, limit: 8, page: 1 });

  const list = useMemo(
    () =>
      (resp?.data || [])
        .filter((s) => s.status !== "draft" && s.status !== "scheduled")
        .slice(0, 8),
    [resp]
  );

  if (isLoading) {
    return (
      <section className="border-y border-amber-100 bg-amber-50/60">
        <div className="container-page py-6">
          <div className="h-5 w-40 animate-pulse rounded-lg bg-amber-100" />
          <div className="mt-4 flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 w-64 shrink-0 animate-pulse rounded-2xl bg-white/70" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!list.length) return null;

  return (
    <section aria-label="Closing soon" className="border-y border-amber-100 bg-amber-50/60">
      <div className="container-page py-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-amber-800">
            <CalendarClock className="h-4 w-4" />
            Closing soon — deadlines ahead
          </h2>
          <Link to="/allScholership?sort=deadline" className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {list.map((s) => (
            <Link
              key={s._id}
              to={`/allScholership/${s._id}`}
              className="group w-64 shrink-0 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <p className="truncate text-sm font-bold text-slate-900">{s.universityName || "—"}</p>
              <p className="truncate text-xs text-slate-500">{s.subjectName || s.scholarshipName || "—"}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <CountdownBadge deadline={s.applicationDeadline} />
                <span className="shrink-0 text-xs font-semibold text-slate-400">{s.applicationDeadline}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeadlineStrip;
