import { Eye, Star } from "lucide-react";
import { ShieldCheck, MapPin, GraduationCap, BookOpen, DollarSign } from "lucide-react";
import StatusBadge from "../../../Component/ui/StatusBadge";

export default function ApplicationCard({ applicant, hasReviewed, onView, variant = "grid" }) {
  const isAccepted = applicant?.applicationStatus === "accepted";
  const reviewed = hasReviewed(applicant?.scholarship_id);

  const ViewButton = () => (
    <button
      onClick={() => onView(applicant)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-soft hover:bg-slate-800"
      title="View application"
      aria-label="View application"
    >
      <Eye className="h-4 w-4" />
    </button>
  );

  const ReviewButton = () => {
    if (!isAccepted) {
      return (
        <button
          disabled
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 ring-1 ring-slate-200 cursor-not-allowed"
          title="Review available only after moderator accepts your application"
        >
          <Star className="h-4 w-4" />
        </button>
      );
    }
    if (reviewed) {
      return (
        <a
          href="/userDashboard/myReviews"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200 hover:bg-emerald-600 hover:text-white"
          title="Already reviewed — edit in My Reviews"
        >
          <ShieldCheck className="h-4 w-4" />
        </a>
      );
    }
    return (
      <a
        href={`/userDashboard/myApplication/addReviews/${applicant?.scholarship_id}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 ring-1 ring-amber-200 hover:bg-amber-500 hover:text-white"
        title="Write a review (verified applicant, 1 per scholarship)"
      >
        <Star className="h-4 w-4" />
      </a>
    );
  };

  if (variant === "list") {
    return (
      <div className="flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition-all hover:shadow-lift">
        <div className="hidden h-auto w-44 shrink-0 overflow-hidden sm:block">
          <img src={applicant?.universityImage} alt={applicant?.universityName} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-base font-bold text-slate-900">{applicant?.universityName}</h3>
            <StatusBadge status={applicant?.applicationStatus} />
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{applicant?.applicantDistrict || "—"}</span>
            <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" />{applicant?.subjectName}</span>
            <span className="inline-flex items-center gap-1"><GraduationCap className="h-3 w-3" />{applicant?.applyingDegree || applicant?.Postgraduate || "—"}</span>
          </p>
          {applicant?.Feedback && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{applicant.Feedback}</p>}
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <span className="text-sm font-bold text-brand-600">${applicant?.applicationFees} <span className="text-xs font-medium text-slate-400">+ ${applicant?.serviceCharge} service</span></span>
            <div className="flex items-center gap-1.5">
              <ViewButton />
              <ReviewButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // grid variant
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-40 overflow-hidden">
        <img src={applicant?.universityImage} alt={applicant?.universityName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => (e.currentTarget.style.display = "none")} />
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-700 shadow-sm">{applicant?.scholarshipCategory || "—"}</div>
        <div className="absolute right-3 top-3"><StatusBadge status={applicant?.applicationStatus} /></div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-bold text-slate-900">{applicant?.universityName}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="h-3.5 w-3.5 text-brand-500" />{applicant?.applicantDistrict || "—"}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><BookOpen className="h-3.5 w-3.5 text-brand-500" />{applicant?.subjectName} · {applicant?.applyingDegree || applicant?.Postgraduate || "—"}</p>
        {applicant?.Feedback && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{applicant.Feedback}</p>}
        <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
          <DollarSign className="h-4 w-4 text-brand-500" /> ${applicant?.applicationFees} <span className="text-slate-400">+ ${applicant?.serviceCharge} service</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <span className="text-xs font-medium text-slate-400">Fee total: <b className="text-slate-700">${Number(applicant?.applicationFees) + Number(applicant?.serviceCharge)}</b></span>
          <div className="flex items-center gap-1.5">
            <ViewButton />
            <ReviewButton />
          </div>
        </div>
      </div>
    </div>
  );
}
