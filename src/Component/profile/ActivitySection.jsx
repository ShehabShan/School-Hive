import { FileText, Star } from "lucide-react";
import { motion } from "framer-motion";
import StatusBadge from "../ui/StatusBadge";
import Stars from "../ui/Stars";

export default function ActivitySection({ applications = [], reviews = [], viewAllLink, reviewLink }) {
  const hasApps = applications.length > 0;
  const hasReviews = reviews.length > 0;

  if (!hasApps && !hasReviews) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6"
    >
      <h2 className="text-base font-bold text-slate-900 sm:text-lg">Activity</h2>

      {/* Applications */}
      {hasApps && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <FileText className="h-4 w-4 text-brand-500" /> Applications
            </h3>
            {viewAllLink && (
              <a href={viewAllLink} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                View all
              </a>
            )}
          </div>
          <div className="mt-2.5 space-y-2">
            {applications.slice(0, 4).map((a) => (
              <div
                key={a._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {a.universityName}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {a.subjectName} · {a.scholarshipCategory}
                  </p>
                </div>
                <StatusBadge status={a.applicationStatus} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {hasReviews && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <Star className="h-4 w-4 text-amber-500" /> Reviews
            </h3>
            {reviewLink && (
              <a href={reviewLink} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                View all
              </a>
            )}
          </div>
          <div className="mt-2.5 space-y-2">
            {reviews.slice(0, 3).map((r) => (
              <div
                key={r._id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {r.scholership_details?.universityName || "Scholarship"}
                  </p>
                  <Stars rating={r.rating} />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
