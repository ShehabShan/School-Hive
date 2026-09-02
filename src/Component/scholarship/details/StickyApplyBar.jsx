import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function StickyApplyBar({ scholarship, isSaved, onSave, onApply, isExpired, isAdmin, isInstitution, isModaretor, isPending, canApply }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  const s = scholarship || {};
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-lift backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-page flex items-center gap-3">
        <img src={s.universityImage} alt="" className="hidden h-10 w-10 rounded-xl object-cover md:block" onError={(e) => (e.currentTarget.style.display = "none")} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">{s.universityName}</p>
          <p className="truncate text-xs text-slate-500">{s.scholarshipCategory} · {s.subjectName}</p>
        </div>
        <button onClick={onSave} aria-label="Save" className={`hidden h-10 w-10 items-center justify-center rounded-xl ring-1 sm:inline-flex ${isSaved ? "bg-amber-400 text-slate-900 ring-amber-400" : "bg-white text-slate-700 ring-slate-200"}`}>{isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}</button>
        <button onClick={onApply} className={`rounded-xl px-6 py-2.5 text-sm font-extrabold text-white shadow ${canApply ? "bg-gradient-to-r from-brand-600 to-brand-700" : "bg-slate-400 cursor-not-allowed opacity-60 grayscale"}`}>{!canApply ? (isExpired ? "Closed" : isAdmin ? "Admin" : isInstitution ? "Institution" : isModaretor ? "Moderator" : isPending ? "Pending" : "Apply Now") : "Apply Now"}</button>
      </div>
    </div>
  );
}
