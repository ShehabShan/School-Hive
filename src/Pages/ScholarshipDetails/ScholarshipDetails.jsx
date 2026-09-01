import { motion } from "framer-motion";
import { GraduationCap, BookOpen, MapPin, CalendarDays, Info, Banknote, BadgeDollarSign, Receipt, CalendarPlus, ArrowRight, MessagesSquare, Bookmark, BookmarkCheck, Share2, Scale, Award, Clock } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useSingleScholership from "../../Hooks/useSingleScholership";
import useReviews from "../../Hooks/useReviews";
import useAdmin from "../../Hooks/useAdmin";
import useAuth from "../../Hooks/useAuth";
import AllReviews from "./AllReviews";
import Stars from "../../Component/ui/Stars";
import CountdownBadge from "../../Component/scholarship/CountdownBadge";
import { getDeadlineState } from "../../Component/scholarship/CountdownBadge";
import { useSaved, useToggleSave } from "../../Hooks/useSaved";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const fmt = (n, cur = "USD") => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(v); } catch { return `$${v.toLocaleString()}`; }
};

export default function ScholarshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship] = useSingleScholership(id);
  const [review] = useReviews(id);
  const [isAdmin] = useAdmin();
  const { user } = useAuth();
  const { data: savedDocs } = useSaved();
  const toggleSave = useToggleSave();
  const isSaved = useMemo(() => (savedDocs || []).some((d) => String(d.scholarshipId) === String(id)), [savedDocs, id]);
  const [compareOn, setCompareOn] = useState(() => { try { return new Set(JSON.parse(localStorage.getItem("compareIds") || "[]")).has(String(id)); } catch { return false; } });

  const deadlineState = getDeadlineState(scholarship?.applicationDeadline);
  const isExpired = deadlineState.tone === "rose" && deadlineState.label === "Expired";
  const currency = scholarship?.currency || "USD";

  const handleSave = () => {
    if (!user) return navigate("/signIn");
    toggleSave.mutate(String(id), { onSuccess: (d) => toast.success(d.saved ? "Saved to wishlist" : "Removed from saved") });
  };
  const handleShare = async () => {
    const url = window.location.href;
    try { await navigator.clipboard.writeText(url); toast.success("Link copied"); } catch { window.prompt("Copy link", url); }
  };
  const handleCompare = () => {
    const sid = String(id);
    const raw = JSON.parse(localStorage.getItem("compareIds") || "[]");
    let set = new Set(raw.map(String));
    if (set.has(sid)) set.delete(sid); else { if (set.size >= 4) return toast.error("Compare up to 4"); set.add(sid); }
    localStorage.setItem("compareIds", JSON.stringify([...set]));
    setCompareOn(set.has(sid));
    toast.success(set.has(sid) ? "Added to compare" : "Removed from compare");
  };

  const infoItems = [
    { icon: GraduationCap, label: "Category", value: scholarship?.scholarshipCategory },
    { icon: BookOpen, label: "Subject / Field", value: scholarship?.subjectName },
    { icon: MapPin, label: "Location", value: `${scholarship?.country || "—"}, ${scholarship?.city || "—"}` },
    { icon: CalendarDays, label: "Deadline", value: scholarship?.applicationDeadline || "—" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 pb-16 pt-16 text-white">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="container-page relative">
          <Link to="/allScholership" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-brand-100 hover:text-white">← Back to scholarships</Link>
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lift md:h-28 md:w-28">
              <img src={scholarship?.universityImage} alt={`${scholarship?.universityName} logo`} className="h-full w-full object-contain" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/300x300?text=Scholarship")} />
            </motion.div>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-white/20">{scholarship?.scholarshipCategory || "—"}</span>
                <CountdownBadge deadline={scholarship?.applicationDeadline} />
                {scholarship?.degree && <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/20">{scholarship.degree}</span>}
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">{scholarship?.universityName}</h1>
              <p className="mt-2 text-brand-100">{scholarship?.scholarshipCategory} Scholarship in {scholarship?.subjectName} {scholarship?.city ? `· ${scholarship.city}, ${scholarship.country}` : ""}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Stars rating={scholarship?.rating} showValue />
                {scholarship?.reviewsCount ? <span className="text-sm text-brand-200">{scholarship.reviewsCount} reviews</span> : null}
                {scholarship?.universityWorldrank ? <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/20">Rank #{scholarship.universityWorldrank}</span> : null}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <button onClick={handleSave} className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold shadow-soft ${isSaved ? "bg-amber-400 text-slate-900" : "bg-white text-slate-900 hover:bg-slate-100"}`}>{isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}{isSaved ? "Saved" : "Save"}</button>
                <button onClick={handleShare} className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 hover:bg-white/20"><Share2 className="h-4 w-4" /> Share</button>
                <button onClick={handleCompare} className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold ring-1 ${compareOn ? "bg-amber-400 text-slate-900 ring-amber-400" : "bg-white/10 text-white ring-white/20 hover:bg-white/20"}`}><Scale className="h-4 w-4" /> {compareOn ? "In compare" : "Compare"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page -mt-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lift">
          <div className="p-6 md:p-10">
            <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white"><Info className="h-4 w-4" /></span> At a glance</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {infoItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-100"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon className="h-5 w-5" /></span><div><p className="text-xs text-slate-400">{label}</p><p className="font-semibold text-slate-800">{value || "—"}</p></div></div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {scholarship?.duration && <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100"><Clock className="mr-1 inline h-3 w-3" />{scholarship.duration}</span>}
                {(scholarship?.tags || []).map((t) => <span key={t} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">{t}</span>)}
              </div>
            </div>

            {(scholarship?.eligibility?.length || scholarship?.benefits?.length) ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {scholarship?.eligibility?.length ? (
                  <div className="rounded-2xl bg-amber-50/60 p-6 ring-1 ring-amber-100">
                    <h3 className="flex items-center gap-2 font-bold text-slate-900"><Award className="h-5 w-5 text-amber-600" /> Eligibility</h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">{scholarship.eligibility.map((e) => <li key={e}>{e}</li>)}</ul>
                  </div>
                ) : null}
                {scholarship?.benefits?.length ? (
                  <div className="rounded-2xl bg-emerald-50/60 p-6 ring-1 ring-emerald-100">
                    <h3 className="flex items-center gap-2 font-bold text-slate-900"><BadgeDollarSign className="h-5 w-5 text-emerald-600" /> Benefits</h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">{scholarship.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-6 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white"><BookOpen className="h-4 w-4" /></span> Description</h2>
              <p className="mt-4 leading-relaxed text-slate-600 whitespace-pre-wrap">{scholarship?.scholarshipDescription || "No description provided."}</p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white"><Banknote className="h-4 w-4" /></span> Financial Details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: BadgeDollarSign, label: "Stipend", value: scholarship?.stipend ? fmt(scholarship.stipend, currency) : "—" },
                  { icon: Banknote, label: "Application Fee", value: fmt(scholarship?.applicationFees, currency) },
                  { icon: Receipt, label: "Service Charge", value: fmt(scholarship?.serviceCharge, currency) },
                  { icon: CalendarPlus, label: "Posted on", value: scholarship?.postDate || "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="group rounded-xl bg-white p-4 ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-soft">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110"><Icon className="h-5 w-5" /></span>
                    <p className="mt-3 text-xs text-slate-400">{label}</p>
                    <p className="text-lg font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              {isExpired ? (
                <div className="rounded-2xl bg-rose-50 p-4 text-center text-sm font-semibold text-rose-700 ring-1 ring-rose-200">This scholarship has expired (deadline {scholarship?.applicationDeadline}).</div>
              ) : (
                <Link to={`/apply/${scholarship?._id}`} className="block w-full">
                  <button disabled={isAdmin || isExpired} className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-4 text-lg font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60">
                    {isAdmin ? "Admin Can't Apply" : isExpired ? "Closed — Deadline Passed" : "Apply Now"} {!isAdmin && !isExpired && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
                  </button>
                </Link>
              )}
              <p className="mt-3 text-center text-xs text-slate-400">Add to calendar: deadline <b className="text-slate-600">{scholarship?.applicationDeadline || "—"}</b> · Fees {fmt(scholarship?.applicationFees, currency)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white pb-20">
        <div className="container-page">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white"><MessagesSquare className="h-5 w-5" /></span>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">Reviews</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{review?.length || 0}</span>
          </div>
          {review?.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
              <MessagesSquare className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 text-xl font-bold text-slate-700">No reviews yet</h2><p className="mt-1 text-sm text-slate-400">Be the first to share your experience after acceptance.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">{review?.map((r, i) => <AllReviews key={r._id || i} review={r} />)}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
