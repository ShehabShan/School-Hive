import { Link } from "react-router-dom";
import { GraduationCap, MapPin, ArrowRight, Eye, Pencil, Trash2, Bookmark, BookmarkCheck, Scale, Clock } from "lucide-react";
import Stars from "../ui/Stars";
import CountdownBadge from "./CountdownBadge";

const fmtMoney = (n, currency = "USD") => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(v);
  } catch {
    return `$${v.toLocaleString()}`;
  }
};

export default function ScholarshipCard({
  scholarship,
  variant = "browse", // browse | manage | compact
  onDelete,
  onPublish,
  onPublishNow,
  onUnschedule,
  onSchedule,
  saved = false,
  onToggleSave,
  compareChecked = false,
  onToggleCompare,
}) {
  const s = scholarship || {};
  const currency = s.currency || "USD";
  const img = s.universityImage || "https://placehold.co/600x400?text=Scholarship";
  const isManage = variant === "manage";
  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <article className="group flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition-all hover:shadow-lift">
        <div className="relative hidden h-auto w-52 shrink-0 overflow-hidden sm:block">
          <img
            src={img}
            alt={s.universityName || "University"}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=No+Image")}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
           <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-brand-700 shadow-sm">{s.scholarshipCategory}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-brand-700">{s.universityName}</h3>
            <CountdownBadge deadline={s.applicationDeadline} compact />
          </div>
          <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">
            {[s.degree || s.scholarshipCategory, s.subjectName, [s.city, s.country].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
          </p>
          {s.scholarshipDescription && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{s.scholarshipDescription}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Stars rating={s.rating} showValue />
            {s.stipend ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">{fmtMoney(s.stipend, currency)} stipend</span> : null}
            {Array.isArray(s.tags) && s.tags.slice(0, 2).map((t) => <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{t}</span>)}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <span className="text-sm font-extrabold text-brand-600">{fmtMoney(s.applicationFees, currency)} <span className="text-xs font-medium text-slate-400">fee</span></span>
            <div className="flex items-center gap-1.5">
              {onToggleSave && (
                <button
                  onClick={() => onToggleSave(s)}
                  aria-label={saved ? "Remove from saved" : "Save"}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 transition-colors ${saved ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}
                >
                  {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                </button>
              )}
              {onToggleCompare && (
                <button
                  onClick={() => onToggleCompare(s)}
                  aria-label="Compare"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 transition-colors ${compareChecked ? "bg-amber-500 text-white ring-amber-500" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}
                >
                  <Scale className="h-4 w-4" />
                </button>
              )}
              <Link to={`/allScholership/${s._id}`} className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800">View <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative h-48 overflow-hidden">
        <img
          src={img}
          alt={`${s.universityName || "University"} campus`}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=No+Image")}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-700 shadow-sm backdrop-blur">{s.scholarshipCategory || "—"}</span>
        {s.status === "draft" && <span className="absolute left-3 top-10 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow">Draft</span>}
        {s.status === "scheduled" && <span className="absolute left-3 top-10 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow">Scheduled • {s.publishAt ? new Date(s.publishAt).toLocaleDateString() : ""}</span>}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          {isManage && (
            <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">Rank #{s.universityWorldrank || "—"}</span>
          )}
          {!isManage && s.status !== "draft" && <CountdownBadge deadline={s.applicationDeadline} />}
        </div>
        {onToggleSave && !isManage && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleSave(s); }}
            aria-label={saved ? "Saved" : "Save"}
            className={`absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur shadow-soft transition-colors ${saved ? "bg-brand-600 text-white" : "bg-white/90 text-slate-700 hover:bg-white"}`}
          >
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-brand-700">{s.universityName}</h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">
          {s.degree || s.scholarshipCategory} · {s.subjectName || "—"}
        </p>
        {s.scholarshipDescription && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{s.scholarshipDescription}</p>}

        <div className="mt-4 space-y-2.5 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-500"><GraduationCap className="h-3.5 w-3.5" /></span>
            <span className="truncate">{s.degree || s.scholarshipCategory} Scholarship</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-500"><MapPin className="h-3.5 w-3.5" /></span>
            <span className="truncate">{[s.city, s.country].filter(Boolean).join(", ") || "—"}</span>
          </p>
          <div className="flex items-center gap-2">
            <Stars rating={s.rating} showValue />
            {s.reviewsCount ? <span className="text-xs text-slate-400">({s.reviewsCount})</span> : null}
            {isManage ? null : <span className="ml-auto hidden sm:inline-flex"><CountdownBadge deadline={s.applicationDeadline} /></span>}
          </div>
        </div>

        {(Array.isArray(s.eligibility) && s.eligibility.length) || (Array.isArray(s.benefits) && s.benefits.length) || (Array.isArray(s.tags) && s.tags.length) ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(s.tags || []).slice(0, 3).map((t) => <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{t}</span>)}
            {(s.eligibility || []).slice(0, 1).map((e) => <span key={e} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100">{e}</span>)}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Application fee</p>
            <p className="text-xl font-extrabold text-brand-600">{fmtMoney(s.applicationFees, currency)}</p>
            {s.stipend ? <p className="text-xs font-semibold text-emerald-600">{fmtMoney(s.stipend, currency)} stipend</p> : null}
          </div>

          {!isManage ? (
            <div className="flex items-center gap-1.5">
              {onToggleCompare && (
                <button
                  onClick={() => onToggleCompare(s)}
                  aria-label="Compare"
                  className={`hidden h-9 w-9 items-center justify-center rounded-xl ring-1 sm:inline-flex ${compareChecked ? "bg-amber-500 text-white ring-amber-500" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}
                >
                  <Scale className="h-4 w-4" />
                </button>
              )}
              <Link
                to={`/allScholership/${s._id}`}
                className="group/btn inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                Details <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5">
              {s.status === "draft" && (
                <>
                  <button onClick={() => onPublish?.(s._id)} aria-label="Publish" className="inline-flex h-9 items-center gap-1 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700">Publish</button>
                  <button onClick={() => onSchedule?.(s._id)} aria-label="Schedule" className="inline-flex h-9 items-center gap-1 rounded-xl bg-indigo-600 px-3 text-xs font-bold text-white hover:bg-indigo-700"><Clock className="h-3.5 w-3.5" /> Schedule</button>
                </>
              )}
              {s.status === "scheduled" && (
                <>
                  <button onClick={() => onPublishNow?.(s._id)} className="inline-flex h-9 items-center gap-1 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700">Publish now</button>
                  <button onClick={() => onUnschedule?.(s._id)} className="inline-flex h-9 items-center gap-1 rounded-xl bg-amber-500 px-3 text-xs font-bold text-white hover:bg-amber-600">Unschedule</button>
                </>
              )}
              <Link to={`/allScholership/${s._id}`} aria-label="View" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800"><Eye className="h-4 w-4" /></Link>
              <Link to={`${s._id}`} aria-label="Edit" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white hover:bg-brand-700"><Pencil className="h-4 w-4" /></Link>
              <button onClick={() => onDelete?.(s._id)} aria-label="Delete" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-rose-600 ring-1 ring-slate-200 hover:bg-rose-50 hover:ring-rose-200"><Trash2 className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
