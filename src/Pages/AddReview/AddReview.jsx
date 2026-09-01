import { useState } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  CalendarDays,
  MessageSquare,
  Send,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useSingleScholership from "../../Hooks/useSingleScholership";
import FormField from "../../Component/ui/FormField";

function AddReview() {
  const { id } = useParams();
  const [postDate] = useState(new Date());
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [scholarship] = useSingleScholership(id);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const formData = new FormData(e.target);
    const initialData = Object.fromEntries(formData.entries());

    const formattedPostDate = format(postDate, "yyyy-MM-dd");

    initialData.reviewer_postDate = formattedPostDate;
    initialData.reviewer_email = user?.email;
    initialData.reviewer_name = user?.displayName;
    initialData.reviewer_photo = user?.photoURL;
    initialData.scholarShip_id = id;
    initialData.rating = String(rating);

    try {
      const { data } = await axiosPublic.post("/addReviews", initialData);
      if (data.data?.insertedId || data.insertedId) {
        toast.success("Review submitted successfully!");
        e.target.reset();
        setRating(5);
      } else {
        toast.success("Review submitted!");
        e.target.reset();
      }
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-6 py-8 text-center md:px-8">
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]" />
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-brand-300/20 blur-2xl" />

          <div className="relative">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lift ring-4 ring-white/25">
              {scholarship?.universityImage ? (
                <img
                  src={scholarship.universityImage}
                  alt={scholarship?.universityName || "University"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <GraduationCap className="h-8 w-8 text-brand-600" />
              )}
            </div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-100 ring-1 ring-white/20 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Share your experience
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              {scholarship?.universityName || "Add a Review"}
            </h2>
            <p className="mx-auto mt-1.5 max-w-xl text-sm font-medium leading-relaxed text-brand-100">
              {scholarship?.scholarshipName || "Tell future applicants what made this scholarship stand out"}
            </p>
            {scholarship?.universityName && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-brand-200">
                <span className="rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/15">
                  {scholarship?.scholarshipCategory || "Scholarship"}
                </span>
                {scholarship?.subjectName && (
                  <span className="rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/15">
                    {scholarship.subjectName}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7 p-6 md:p-8">
          {/* Rating */}
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              </span>
              <h3 className="text-sm font-bold tracking-tight text-slate-800">
                Your Rating
              </h3>
              <span className="ml-auto rounded-full bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-700 ring-1 ring-amber-100">
                {rating}.0 / 5.0
              </span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((value) => {
                  const active = (hoverRating || rating) >= value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(value)}
                      aria-label={`Rate ${value} out of 5`}
                      className="rounded-xl p-1.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      <Star
                        className={`h-9 w-9 transition-colors md:h-10 md:w-10 ${
                          active
                            ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                            : "fill-slate-200 text-slate-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-center text-xs font-medium text-slate-500">
                Tap a star to set your rating
              </p>
              {/* hidden input so FormData captures rating if needed, but we override with state */}
              <input type="hidden" name="rating" value={rating} />
            </div>
          </div>

          {/* Comment */}
          <FormField
            label="Your Review"
            required
            hint={`${scholarship?.universityName ? `Help others decide about ${scholarship.universityName}` : "Be honest and constructive — your feedback helps future scholars."}`}
          >
            <div className="relative">
              <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <textarea
                rows={5}
                name="comment"
                placeholder="What did you love about this scholarship? How was the application process, support, campus experience?"
                className="min-h-[128px] w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                required
              />
            </div>
          </FormField>

          {/* Meta row */}
          <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 md:grid-cols-2 md:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft ring-1 ring-slate-100">
                <CalendarDays className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Review date
                </p>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                  <FaCalendarAlt className="h-3.5 w-3.5 text-brand-500" />
                  {format(postDate, "PPP")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 ring-2 ring-white">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user?.displayName || "Reviewer"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                    {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {user?.displayName || "Anonymous"}
                </p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Publish Review
              </>
            )}
          </button>

          <p className="text-center text-xs leading-relaxed text-slate-400">
            Your review will be visible on the scholarship details page after submission.
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default AddReview;
