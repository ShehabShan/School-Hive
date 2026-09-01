import {
  GraduationCap,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Stars from "../../Component/ui/Stars";

const ScholarshipCard = ({ scholarship }) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div className="relative h-48 overflow-hidden">
        <img
          src={scholarship?.universityImage}
          alt={`${scholarship?.universityName} campus`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-700 shadow-sm backdrop-blur">
          {scholarship?.scholarshipCategory}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-brand-700">
          {scholarship?.universityName}
        </h3>
        <p className="mt-0.5 text-sm text-slate-500">
          {scholarship?.Postgraduate} — {scholarship?.subjectName}
        </p>

        <div className="mt-4 space-y-2.5 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-500">
              <GraduationCap className="h-3.5 w-3.5" />
            </span>
            {scholarship?.degree || scholarship?.scholarshipCategory} Scholarship
          </p>
          <p className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-500">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            {scholarship?.city}, {scholarship?.country}
          </p>
          <p className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-500">
              <Clock className="h-3.5 w-3.5" />
            </span>
            Deadline: {scholarship?.applicationDeadline}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Stars rating={scholarship?.rating} showValue />
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Application fee
            </p>
            <p className="text-xl font-extrabold text-brand-600">
              £{scholarship?.applicationFees}
            </p>
          </div>
          <Link
            to={`/allScholership/${scholarship?._id}`}
            className="group/btn inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            Details
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ScholarshipCard;
