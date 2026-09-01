import { motion } from "framer-motion";
import { Quote, CalendarDays } from "lucide-react";
import Stars from "../../Component/ui/Stars";

/* eslint-disable react/prop-types */
const AllReviews = ({ review }) => {
  const initials =
    review?.reviewer_email?.charAt(0)?.toUpperCase() || "U";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <Quote
        aria-hidden
        className="absolute right-4 top-4 h-8 w-8 text-brand-100 transition-colors group-hover:text-brand-200"
      />
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white ring-2 ring-brand-100">
          {initials}
        </span>
        <div>
          <h3 className="font-bold text-slate-900">
            {review?.scholership_details?.universityName}
          </h3>
          <p className="text-xs text-slate-400">{review?.reviewer_email}</p>
        </div>
      </div>

      <div className="mt-3">
        <Stars rating={review?.rating} showValue />
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
        {review?.comment}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {new Date(review?.reviewer_postDate).toLocaleDateString()}
        </span>
        <span className="rounded-md bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-400">
          ID: {review?.scholarShip_id}
        </span>
      </div>
    </motion.div>
  );
};

export default AllReviews;
