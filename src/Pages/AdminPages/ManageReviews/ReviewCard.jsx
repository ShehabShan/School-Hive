import Stars from "../../../Component/ui/Stars";
import { Trash2, CalendarDays, Hash } from "lucide-react";

/* eslint-disable react/prop-types */
export default function ReviewCard({ review, handleDelete }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex-1 p-5">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 ring-2 ring-brand-100">
            {review?.reviewer_photo ? (
              <img src={review.reviewer_photo} alt={review?.reviewer_name || "Reviewer"} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                {(review?.reviewer_name || review?.reviewer_email || "U").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {review?.scholership_details?.universityName || review?.reviewer_name || "Scholarship"}
            </h3>
            <p className="truncate text-xs text-slate-500">{review?.reviewer_email}</p>
          </div>
          <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
            {review?.rating}/5
          </span>
        </div>

        <div className="mt-3 flex items-center">
          <Stars rating={review?.rating} />
        </div>

        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-600">
          {review?.comment || "—"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 font-medium ring-1 ring-slate-100">
            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
            {review?.reviewer_postDate ? new Date(review.reviewer_postDate).toLocaleDateString() : "—"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 font-medium ring-1 ring-slate-100">
            <Hash className="h-3.5 w-3.5 text-slate-400" />
            <span className="truncate max-w-[140px]">{review?.scholarShip_id}</span>
          </span>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/60 p-3">
        <button
          onClick={() => handleDelete(review?._id)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 ring-1 ring-slate-200 transition-colors hover:bg-rose-50 hover:ring-rose-200"
        >
          <Trash2 className="h-4 w-4" />
          Delete Review
        </button>
      </div>
    </article>
  );
}
