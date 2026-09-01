import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Info, BookOpen, Award, Banknote, ShieldCheck, Clock, GraduationCap, MapPin, CalendarDays, MessagesSquare } from "lucide-react";
import useSingleScholership from "../../Hooks/useSingleScholership";
import useReviews from "../../Hooks/useReviews";
import useAdmin from "../../Hooks/useAdmin";
import useModaretor from "../../Hooks/useModaretor";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import AllReviews from "./AllReviews";
import ReviewCard from "../AdminPages/ManageReviews/ReviewCard";
import Stars from "../../Component/ui/Stars";
import { getDeadlineState } from "../../Component/scholarship/CountdownBadge";
import { useSaved, useToggleSave } from "../../Hooks/useSaved";
import toast from "react-hot-toast";
import Gallery from "../../Component/scholarship/details/Gallery";
import SummaryCard from "../../Component/scholarship/details/SummaryCard";
import StickyApplyBar from "../../Component/scholarship/details/StickyApplyBar";
import SectionAccordion from "../../Component/scholarship/details/SectionAccordion";
import EligibilityChecker from "../../Component/scholarship/details/EligibilityChecker";
import Checklist from "../../Component/scholarship/details/Checklist";
import Timeline from "../../Component/scholarship/details/Timeline";
import Faq from "../../Component/scholarship/details/Faq";
import RelatedCarousel from "../../Component/scholarship/details/RelatedCarousel";
import AboutUniversity from "../../Component/scholarship/details/AboutUniversity";
import "./ScholarshipDetails.css";

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
  const [isModaretor] = useModaretor();
  const isStaff = isAdmin || isModaretor;
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { data: savedDocs } = useSaved();
  const { data: staffReviews } = useQuery({
    queryKey: ["staff-review", id, isStaff],
    enabled: !!id && isStaff,
    queryFn: async () => {
      const res = await axiosSecure.get(`/allReviews?scholarShip_id=${id}&limit=100`);
      const list = res.data.data || [];
      // Live old server ignores scholarShip_id filter — fallback client filter
      return list.filter((r) => String(r.scholarShip_id) === String(id));
    },
  });
  const displayReviews = isStaff && staffReviews ? staffReviews : review;
  const displayCount = isStaff ? (staffReviews?.length ?? review?.length ?? 0) : (review?.length ?? 0);
  const toggleSave = useToggleSave();
  const isSaved = useMemo(() => (savedDocs || []).some((d) => String(d.scholarshipId) === String(id)), [savedDocs, id]);
  const [compareOn, setCompareOn] = useState(() => { try { return new Set(JSON.parse(localStorage.getItem("compareIds") || "[]")).has(String(id)); } catch { return false; } });
  const dl = getDeadlineState(scholarship?.applicationDeadline);
  const isExpired = dl.tone === "rose" && dl.label === "Expired";
  const cur = scholarship?.currency || "USD";

  const gallery = useMemo(() => {
    if (Array.isArray(scholarship?.gallery) && scholarship.gallery.length) return scholarship.gallery;
    if (scholarship?.universityImage) return [scholarship.universityImage];
    return [];
  }, [scholarship]);

  const handleSave = () => {
    if (!user) return navigate("/signIn");
    toggleSave.mutate(String(id), { onSuccess: (d) => toast.success(d.saved ? "Saved" : "Removed") });
  };
  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); } catch { window.prompt("Copy", window.location.href); }
  };
  const handleCompare = () => {
    const sid = String(id);
    const raw = JSON.parse(localStorage.getItem("compareIds") || "[]");
    let set = new Set(raw.map(String));
    if (set.has(sid)) set.delete(sid); else { if (set.size >= 4) return toast.error("Compare up to 4"); set.add(sid); }
    localStorage.setItem("compareIds", JSON.stringify([...set]));
    setCompareOn(set.has(sid));
    toast.success(set.has(sid) ? "Added to compare" : "Removed");
  };
  const handleApply = () => {
    if (isAdmin) return toast.error("Admin cannot apply");
    if (isExpired) return toast.error("Deadline passed");
    navigate(`/apply/${id}`);
  };

  if (!scholarship) {
    return <div className="container-page py-20 text-center text-slate-500">Loading scholarship…</div>;
  }

  const avgRating = Number(scholarship.rating || 0);
  const activeReviews = displayReviews || review || [];
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const c = (activeReviews || []).filter((r) => Math.round(Number(r.rating)) === star).length;
    return { star, c };
  });
  const maxC = Math.max(1, ...dist.map((d) => d.c));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="details-wrapper min-h-screen bg-slate-50 pb-24">
      <div className="border-b border-slate-100 bg-white">
        <div className="container-page flex flex-wrap items-center gap-2 py-3 text-sm">
          <Link to="/" className="text-slate-500 hover:text-slate-700">Home</Link><span className="text-slate-300">/</span>
          <Link to="/allScholership" className="text-slate-500 hover:text-slate-700">Scholarships</Link><span className="text-slate-300">/</span>
          <span className="truncate font-semibold text-slate-900">{scholarship.universityName}</span>
        </div>
      </div>

      <div className="details-main-grid container-page grid grid-cols-1 gap-6 py-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Gallery images={gallery} videoUrl={scholarship.videoUrl} videoPoster={scholarship.videoPoster} alt={scholarship.universityName} />
        <SummaryCard scholarship={scholarship} isSaved={isSaved} onSave={handleSave} onShare={handleShare} compareOn={compareOn} onCompare={handleCompare} isAdmin={isAdmin} isExpired={isExpired} onApply={handleApply} />
      </div>

      <div className="sticky top-0 z-30 -mt-1 hidden border-y border-slate-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 lg:block">
        <div className="container-page flex gap-6 overflow-x-auto py-3 text-sm font-semibold">
          {["overview", "facts", "eligibility", "benefits", "timeline", "documents", "campus", "faq", "reviews"].map((id) => (
            <a key={id} href={`#${id}`} className="whitespace-nowrap text-slate-600 hover:text-brand-700">{id.charAt(0).toUpperCase() + id.slice(1)}</a>
          ))}
        </div>
      </div>

      <div className="details-main-grid container-page grid grid-cols-1 gap-6 py-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-4">
          <SectionAccordion id="overview" icon={BookOpen} title="Overview" excerpt={scholarship.scholarshipDescription?.slice(0, 80)} defaultOpen>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{scholarship.scholarshipDescription || "No description."}</p>
            {(scholarship.highlights?.length) ? <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">{scholarship.highlights.map((h) => <li key={h}>{h}</li>)}</ul> : null}
            {scholarship.scholarshipDescription && scholarship.scholarshipDescription.length > 400 && <p className="mt-3 text-xs text-slate-400">Tip: use save to revisit this scholarship while you prepare.</p>}
          </SectionAccordion>

          <SectionAccordion id="facts" icon={Info} title="Quick facts" excerpt={`${scholarship.degree} · ${scholarship.country}`}>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Category", scholarship.scholarshipCategory],
                ["Subject", scholarship.subjectName],
                ["Degree", scholarship.degree],
                ["Location", `${scholarship.city}, ${scholarship.country}`],
                ["Duration", scholarship.duration || "—"],
                ["World rank", scholarship.universityWorldrank ? `#${scholarship.universityWorldrank}` : "—"],
                ["Posted", scholarship.postDate || "—"],
                ["Deadline", scholarship.applicationDeadline || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm"><span className="text-slate-500">{k}</span><span className="font-semibold text-slate-800">{v}</span></div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100"><p className="text-xs uppercase text-emerald-700">Stipend</p><p className="text-lg font-extrabold text-emerald-700">{scholarship.stipend ? fmt(scholarship.stipend, cur) : "—"}</p></div>
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100"><p className="text-xs uppercase text-slate-500">Application fee</p><p className="text-lg font-extrabold text-slate-900">{fmt(scholarship.applicationFees, cur)}</p></div>
              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100"><p className="text-xs uppercase text-slate-500">Service charge</p><p className="text-lg font-extrabold text-slate-900">{fmt(scholarship.serviceCharge, cur)}</p></div>
            </div>
          </SectionAccordion>

          <SectionAccordion id="eligibility" icon={ShieldCheck} title="Eligibility" excerpt={(scholarship.eligibility || []).slice(0, 2).join(" · ") || "Degree, country, GPA"} defaultOpen>
            {scholarship.eligibility?.length ? <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">{scholarship.eligibility.map((e) => <li key={e}>{e}</li>)}</ul> : <p className="text-sm text-slate-500">No specific eligibility listed — most applicants with <b>{scholarship.degree}</b> in <b>{scholarship.subjectName}</b> can apply.</p>}
            {scholarship.requirements?.length ? <div className="mt-4"><p className="text-sm font-semibold text-slate-800">Requirements</p><ul className="mt-2 list-disc pl-5 text-sm text-slate-700">{scholarship.requirements.map((r) => <li key={r}>{r}</li>)}</ul></div> : null}
            <div className="mt-6"><EligibilityChecker scholarship={scholarship} /></div>
          </SectionAccordion>

          <SectionAccordion id="benefits" icon={Award} title="What you get" excerpt={(scholarship.benefits || []).slice(0, 2).join(" · ") || "Tuition + stipend"}>
            {scholarship.benefits?.length ? <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">{scholarship.benefits.map((b) => <li key={b}>{b}</li>)}</ul> : <p className="text-sm text-slate-500">Benefits include tuition support and {scholarship.stipend ? `${fmt(scholarship.stipend, cur)} stipend` : "support"}.</p>}
            <div className="mt-4 flex flex-wrap gap-2">{(scholarship.tags || []).map((t) => <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{t}</span>)}</div>
          </SectionAccordion>

          <SectionAccordion id="timeline" icon={Clock} title="Timeline & how to apply" excerpt={`Deadline ${scholarship.applicationDeadline}`}>
            <Timeline deadline={scholarship.applicationDeadline} />
            <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-100">Apply before <b>{scholarship.applicationDeadline}</b> — {dl.label}. Late submissions are not considered.</div>
          </SectionAccordion>

          <SectionAccordion id="documents" icon={GraduationCap} title="Documents" excerpt="Checklist to track preparation">
            <Checklist scholarshipId={id} documents={scholarship.documents} />
          </SectionAccordion>

          <SectionAccordion id="campus" icon={MapPin} title="Campus & gallery" excerpt={`${gallery.length} photos${scholarship.videoUrl ? " + video" : ""}`}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {gallery.slice(0, 6).map((src) => <img key={src} src={src} alt="" className="h-32 w-full rounded-xl object-cover ring-1 ring-slate-100" onError={(e) => (e.currentTarget.style.display = "none")} />)}
            </div>
            {scholarship.mapUrl && <a href={scholarship.mapUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200">Open map</a>}
          </SectionAccordion>

          <SectionAccordion id="faq" icon={Info} title="FAQ & Ask" excerpt="Common questions">
            <Faq faqs={scholarship.faqs} scholarshipId={id} />
          </SectionAccordion>

          <section id="reviews" className="scroll-mt-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white"><MessagesSquare className="h-5 w-5" /></span>
              <h2 className="text-xl font-extrabold text-slate-900">Reviews</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{displayCount} {isStaff ? "total" : "verified"}</span>
              <span className="ml-auto flex items-center gap-2"><Stars rating={avgRating} showValue /><span className="text-sm text-slate-500">{avgRating.toFixed(1)}</span></span>
            </div>
            {isStaff && <p className="mt-2 text-xs text-slate-500">Staff view: showing all statuses (approved/pending/removed) with badges. Public sees approved only.</p>}
            <div className="mt-4 grid gap-2">
              {dist.map((d) => (
                <div key={d.star} className="flex items-center gap-2 text-xs">
                  <span className="w-8 font-medium text-slate-600">{d.star}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-amber-400" style={{ width: `${(d.c / maxC) * 100}%` }} /></div>
                  <span className="w-6 text-slate-500">{d.c}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              {activeReviews.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center"><MessagesSquare className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-2 font-bold text-slate-700">No reviews yet</p><p className="text-sm text-slate-500">Verified applicants after acceptance can review. Be first after you’re accepted.</p></div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{activeReviews.map((r, i) => <AllReviews key={r._id || i} review={r} />)}</div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <AboutUniversity scholarship={scholarship} />
          <RelatedCarousel scholarship={scholarship} />
          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <h3 className="font-bold text-slate-900">Need help?</h3>
            <p className="mt-1 text-sm text-slate-500">Ask about eligibility or documents — we’ll route to moderators.</p>
            <a href="#faq" className="mt-3 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">Ask a question</a>
          </div>
        </div>
      </div>

      <StickyApplyBar scholarship={scholarship} isSaved={isSaved} onSave={handleSave} onApply={handleApply} isExpired={isExpired} isAdmin={isAdmin} />
    </motion.div>
  );
}
