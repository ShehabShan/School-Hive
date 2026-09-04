import { motion } from "framer-motion";
import { Quote, CalendarDays, ShieldCheck, ThumbsUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Stars from "../../Component/ui/Stars";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AllReviews = ({ review }) => {
  const initials =
    review?.reviewer_email?.charAt(0)?.toUpperCase() || "U";
  const profileLink = `/profile/${encodeURIComponent(review?.reviewer_email || "")}`;
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isOwn = !!user?.email && String(review?.reviewer_email || "").toLowerCase() === String(user.email).toLowerCase();

  const { mutate: toggleHelpful, isLoading: voting } = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post(`/allReviews/${review._id}/helpful`);
      return res.data;
    },
    onSuccess: (d) => {
      toast.success(d?.data?.voted ? "Marked helpful" : "Vote removed");
      queryClient.invalidateQueries({ queryKey: ["review"] });
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to vote"),
  });

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
        <Link to={profileLink} className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white ring-2 ring-brand-100 hover:ring-brand-300">
          {review?.reviewer_photo ? <img src={review.reviewer_photo} alt={review.reviewer_name || review.reviewer_email} className="h-full w-full object-cover" onError={(e)=> e.currentTarget.style.display='none'} /> : initials}
        </Link>
        <div className="min-w-0">
          <h3 className="truncate font-bold text-slate-900">
            {review?.scholership_details?.universityName}
          </h3>
          <Link to={profileLink} className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600">
            {review?.reviewer_photo && <img src={review.reviewer_photo} alt="" className="h-4 w-4 rounded-full object-cover" onError={(e)=> e.currentTarget.style.display='none'} />}
            <span className="truncate">{review?.reviewer_name || review?.reviewer_email}</span>
            {review?.isVerified && <ShieldCheck className="h-3 w-3 text-emerald-500" />}
          </Link>
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
        <span className="flex items-center gap-2">
          {!isOwn && (
            <button
              onClick={() => (user ? toggleHelpful() : navigate("/signIn"))}
              disabled={voting}
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-bold ring-1 transition ${
                review?.helpfulVoted
                  ? "bg-brand-50 text-brand-700 ring-brand-200"
                  : "bg-white text-slate-500 ring-slate-200 hover:text-brand-600"
              } disabled:opacity-50`}
            >
              <ThumbsUp className="h-3 w-3" />
              Helpful{typeof review?.helpfulCount === "number" ? ` (${review.helpfulCount})` : ""}
            </button>
          )}
          <span className="rounded-md bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-400">
            ID: {review?.scholarShip_id}
          </span>
        </span>
      </div>
    </motion.div>
  );
};

export default AllReviews;
