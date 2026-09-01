import Stars from "../../../Component/ui/Stars";
import StatusBadge from "../../../Component/ui/StatusBadge";
import { Trash2, CalendarDays, Hash, ShieldCheck, Pencil, Check, X, EyeOff } from "lucide-react";

/* eslint-disable react/prop-types */
export default function ReviewCard({
  review,
  handleDelete,
  selected,
  onToggleSelect,
  onApprove,
  onReject,
  onHide,
  onEdit,
}) {
  const isPending = review?.status === "pending";
  const isApproved = review?.status === "approved";

  return (
    <article className={`flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${selected ? "ring-2 ring-brand-500" : "ring-slate-100"}`}>
      <div className="flex-1 p-5">
        <div className="flex items-start gap-3">
          {onToggleSelect && (
            <input type="checkbox" checked={!!selected} onChange={onToggleSelect} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          )}
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
          <StatusBadge status={review?.status || "pending"} />
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
            {review?.rating}/5
          </span>
          {review?.isVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
          )}
          {review?.isEdited && <span className="text-xs text-slate-400">Edited</span>}
        </div>

        <div className="mt-3 flex items-center">
          <Stars rating={review?.rating} />
        </div>

        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-600">{review?.comment || "—"}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 font-medium ring-1 ring-slate-100">
            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
            {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : review?.reviewer_postDate ? new Date(review.reviewer_postDate).toLocaleDateString() : "—"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 font-medium ring-1 ring-slate-100">
            <Hash className="h-3.5 w-3.5 text-slate-400" />
            <span className="truncate max-w-[110px]">{review?.scholarShip_id}</span>
          </span>
        </div>
        {review?.moderatedBy && (
          <p className="mt-2 text-xs text-slate-400">
            Moderated by <span className="font-semibold">{review.moderatedBy}</span> {review.moderatedAt ? `on ${new Date(review.moderatedAt).toLocaleDateString()}` : ""}
            {review.moderationReason ? ` — ${review.moderationReason}` : ""}
          </p>
        )}
      </div>

      <div className="border-t border-slate-100 bg-slate-50/60 p-3">
        {onApprove ? (
          <>
            <div className="grid grid-cols-3 gap-2">
              {isPending ? (
                <>
                  <button onClick={onApprove} className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button onClick={onReject} className="inline-flex items-center justify-center gap-1 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700">
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button onClick={onHide} className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
                    <EyeOff className="h-3.5 w-3.5" /> Hide
                  </button>
                </>
              ) : (
                <>
                  {!isApproved && (
                    <button onClick={onApprove} className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  <button onClick={onReject} className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-rose-600 ring-1 ring-slate-200 hover:bg-rose-50">
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button onClick={onHide} className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
                    <EyeOff className="h-3.5 w-3.5" /> Hide
                  </button>
                </>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {onEdit && (
                <button onClick={onEdit} className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-brand-600 ring-1 ring-slate-200 hover:bg-brand-50">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(review?._id)}
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-rose-600 ring-1 ring-slate-200 hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {onEdit && (
              <button onClick={onEdit} className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-brand-600 ring-1 ring-slate-200 hover:bg-brand-50">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
            )}
            <button
              onClick={() => handleDelete(review?._id)}
              className={`inline-flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-rose-600 ring-1 ring-slate-200 hover:bg-rose-50 ${!onEdit ? "col-span-2" : ""}`}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
