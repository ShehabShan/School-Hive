import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Clock, Eye, Pencil, Trash2 } from "lucide-react";
import Stars from "../../../Component/ui/Stars";

const ManageScholarCard = ({ scholarship, handleDelete }) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-48 overflow-hidden">
        <img
          src={scholarship?.universityImage}
          alt={scholarship?.universityName || "University"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-700 shadow-sm backdrop-blur">
          {scholarship?.scholarshipCategory}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          Rank #{scholarship?.universityWorldrank || "—"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-brand-700">
          {scholarship?.universityName}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">
          {scholarship?.degree || "Bachelor"} — {scholarship?.subjectName}
        </p>

        <div className="mt-4 space-y-2 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
              <GraduationCap className="h-3.5 w-3.5" />
            </span>
            <span className="truncate">{scholarship?.scholarshipCategory} Scholarship</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <span className="truncate">
              {scholarship?.city}, {scholarship?.country}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
              <Clock className="h-3.5 w-3.5" />
            </span>
            <span className="truncate">Deadline: {scholarship?.applicationDeadline}</span>
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Stars rating={scholarship?.rating} showValue />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Fee</p>
            <p className="text-lg font-extrabold text-brand-600">£{scholarship?.applicationFees}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              to={`/allScholership/${scholarship?._id}`}
              aria-label="View details"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-soft transition-colors hover:bg-slate-800"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              to={`${scholarship?._id}`}
              aria-label="Edit scholarship"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft transition-colors hover:bg-brand-700"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDelete(scholarship?._id)}
              aria-label="Delete scholarship"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-rose-600 ring-1 ring-slate-200 transition-colors hover:bg-rose-50 hover:ring-rose-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ManageScholarCard;
