/* eslint-disable react/prop-types */
import { GraduationCap, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Stars from "../../Component/ui/Stars";

const ScholarshipCard = ({ scholarship }) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-48 overflow-hidden">
        <img
          src={scholarship?.universityImage}
          alt={`${scholarship?.universityName} campus`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-700 shadow-sm backdrop-blur">
          {scholarship?.scholarshipCategory}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900">
          {scholarship?.universityName}
        </h3>
        <p className="mt-0.5 text-sm text-slate-500">
          {scholarship?.Postgraduate} — {scholarship?.subjectName}
        </p>

        <div className="mt-4 space-y-2.5 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 shrink-0 text-brand-500" />
            {scholarship?.degree || scholarship?.scholarshipCategory} Scholarship
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-brand-500" />
            {scholarship?.city}, {scholarship?.country}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-brand-500" />
            Deadline: {scholarship?.applicationDeadline}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Stars rating={scholarship?.rating} showValue />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
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
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ScholarshipCard;
