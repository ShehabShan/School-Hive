import { Bookmark, BookmarkCheck, Share2, Scale, CalendarPlus, ShieldCheck, Clock, MapPin, Award } from "lucide-react";
import Stars from "../../ui/Stars";
import CountdownBadge from "../CountdownBadge";
import { getDeadlineState } from "../CountdownBadge";

const fmt = (n, cur = "USD") => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(v); } catch { return `$${v.toLocaleString()}`; }
};

export default function SummaryCard({ scholarship, isSaved, onSave, onShare, compareOn, onCompare, isAdmin, isInstitution, isModaretor, isPending, isExpired, canApply, onApply }) {
  const s = scholarship || {};
  const cur = s.currency || "USD";
  const dl = getDeadlineState(s.applicationDeadline);

  const addToCalendar = () => {
    if (!s.applicationDeadline) return;
    const dt = s.applicationDeadline.replace(/-/g, "");
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${dt}T090000Z\nSUMMARY:Scholarship deadline - ${s.universityName}\nDESCRIPTION:${s.scholarshipCategory || ""} ${s.subjectName || ""}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "scholarship-deadline.ics"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lift lg:sticky lg:top-20">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100">{s.scholarshipCategory || "—"}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">{s.degree || "—"}</span>
        <CountdownBadge deadline={s.applicationDeadline} />
        {s.universityWorldrank && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-100">Rank #{s.universityWorldrank}</span>}
      </div>

      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">{s.universityName}</h1>
      <p className="mt-1 text-sm text-slate-500">{s.subjectName} {s.city ? `· ${s.city}, ${s.country}` : ""}</p>

      <div className="mt-3 flex items-center gap-2">
        <Stars rating={s.rating} showValue />
        <span className="text-sm text-slate-500">{s.reviewsCount ? `${s.reviewsCount} reviews` : "No reviews yet"}</span>
        <span className="ml-auto hidden items-center gap-1 text-xs font-semibold text-emerald-700 sm:inline-flex"><ShieldCheck className="h-3.5 w-3.5" /> Verified listing</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <div className="text-center"><p className="text-xs uppercase tracking-wide text-slate-400">Fee</p><p className="text-lg font-extrabold text-slate-900">{fmt(s.applicationFees, cur)}</p></div>
        <div className="text-center border-x border-slate-200"><p className="text-xs uppercase tracking-wide text-slate-400">Stipend</p><p className="text-lg font-extrabold text-emerald-600">{s.stipend ? fmt(s.stipend, cur) : "—"}</p></div>
        <div className="text-center"><p className="text-xs uppercase tracking-wide text-slate-400">Duration</p><p className="text-sm font-bold text-slate-800">{s.duration || "—"}</p></div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"><MapPin className="h-3 w-3" /> {s.city}, {s.country}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"><Clock className="h-3 w-3" /> {dl.label}</span>
        {s.serviceCharge ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Service {fmt(s.serviceCharge, cur)}</span> : null}
      </div>

      {(s.highlights?.length || s.tags?.length) ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(s.highlights || s.tags || []).slice(0, 6).map((t) => <span key={t} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">{t}</span>)}
        </div>
      ) : null}

      <div className="mt-6">
        <button
          onClick={onApply}
          className={`w-full rounded-2xl px-6 py-4 text-base font-extrabold text-white shadow-soft transition-all ${canApply ? "bg-gradient-to-r from-brand-600 to-brand-700 hover:-translate-y-0.5 hover:shadow-lift" : "bg-slate-400 cursor-not-allowed opacity-60 grayscale"}`}
        >
          {!canApply ? (isExpired ? `Closed — deadline ${s.applicationDeadline}` : isAdmin ? "Admin can't apply" : isInstitution ? "Institution can't apply" : isModaretor ? "Moderators can't apply" : isPending ? "Pending approval" : "Apply Now") : "Apply Now"}
        </button>
        <p className="mt-2 text-center text-xs text-slate-400">Deadline <b className="text-slate-600">{s.applicationDeadline || "—"}</b> · Posted {s.postDate || "—"}</p>
        {!canApply && !isExpired && <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-center text-xs font-medium text-amber-700 ring-1 ring-amber-100">You don&apos;t have permission to apply — click to see reason</p>}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button onClick={onSave} className={`inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2.5 text-sm font-bold ring-1 ${isSaved ? "bg-amber-400 text-slate-900 ring-amber-400" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"}`}>{isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}{isSaved ? "Saved" : "Save"}</button>
        <button onClick={onShare} className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Share2 className="h-4 w-4" /> Share</button>
        <button onClick={onCompare} className={`inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2.5 text-sm font-bold ring-1 ${compareOn ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"}`}><Scale className="h-4 w-4" />{compareOn ? "Added" : "Compare"}</button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={addToCalendar} className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"><CalendarPlus className="h-3.5 w-3.5" /> Add to calendar</button>
        {s.brochureUrl && <a href={s.brochureUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Award className="h-3.5 w-3.5" /> Brochure</a>}
      </div>

      <p className="mt-4 rounded-xl bg-brand-50 px-3 py-2 text-xs leading-relaxed text-brand-700 ring-1 ring-brand-100">Tip: save and compare up to 4 programs — keep your shortlist while you prepare documents.</p>
    </div>
  );
}
