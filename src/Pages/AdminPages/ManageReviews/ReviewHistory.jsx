import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PageHeader from "../../../Component/ui/PageHeader";
import EmptyState from "../../../Component/ui/EmptyState";
import StatusBadge from "../../../Component/ui/StatusBadge";
import Stars from "../../../Component/ui/Stars";
import { History, ChevronDown, ChevronRight } from "lucide-react";

const ReviewHistory = () => {
  const axiosSecure = useAxiosSecure();
  const [expanded, setExpanded] = useState(null);
  const [historyByReview, setHistoryByReview] = useState({});

  const { data = [], isLoading } = useQuery({
    queryKey: ["reviews-removed"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reviews/removed");
      return res.data.data || [];
    },
  });

  const toggleHistory = async (reviewId) => {
    if (expanded === reviewId) {
      setExpanded(null);
      return;
    }
    if (!historyByReview[reviewId]) {
      try {
        const { data: hd } = await axiosSecure.get(`/reviews/history/${reviewId}`);
        setHistoryByReview((prev) => ({ ...prev, [reviewId]: hd.data || [] }));
      } catch {
        setHistoryByReview((prev) => ({ ...prev, [reviewId]: [] }));
      }
    }
    setExpanded(reviewId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={History}
        title="Review History"
        subtitle="Removed reviews stored with reason, removed-by, and full history timeline."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
          <EmptyState
            icon={History}
            title="No removed reviews"
            message="No reviews have been removed yet. Removed reviews will appear here with their history."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((review) => {
            const history = historyByReview[review._id] || [];
            const isOpen = expanded === review._id;
            return (
              <div key={review._id} className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 ring-2 ring-brand-100">
                        {review.reviewer_photo ? (
                          <img src={review.reviewer_photo} alt={review.reviewer_name || "Reviewer"} className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                            {(review.reviewer_name || review.reviewer_email || "U").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">{review.reviewer_name || review.reviewer_email}</h3>
                        <p className="truncate text-xs text-slate-500">{review.scholership_details?.universityName || review.scholarShip_id}</p>
                      </div>
                    </div>
                    <StatusBadge status="removed" />
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <Stars rating={review.rating} />
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-100">{review.rating}/5</span>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{review.comment || "—"}</p>

                  <div className="mt-4 grid grid-cols-1 gap-2 rounded-xl bg-rose-50/60 p-3 text-sm text-rose-700 ring-1 ring-rose-100 sm:grid-cols-2">
                    <p><span className="font-semibold">Removed by:</span> {review.removedBy || "—"}</p>
                    <p><span className="font-semibold">Removed at:</span> {review.removedAt ? new Date(review.removedAt).toLocaleString() : "—"}</p>
                    <p className="sm:col-span-2"><span className="font-semibold">Reason:</span> {review.removedReason || "No reason"}</p>
                    {review.removedNote && (
                      <p className="sm:col-span-2"><span className="font-semibold">Note:</span> {review.removedNote}</p>
                    )}
                  </div>

                  <button
                    onClick={() => toggleHistory(review._id)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    {isOpen ? "Hide history" : "View history"}
                  </button>

                  {isOpen && (
                    <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                      {history.length === 0 ? (
                        <p className="text-xs text-slate-400">No history entries available.</p>
                      ) : (
                        history.map((h, i) => (
                          <div key={i} className="flex flex-col gap-1 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-100">
                            <p className="font-bold text-slate-800">{h.action} <span className="font-normal text-slate-400">{h.from} → {h.to}</span></p>
                            <p>by {h.by} at {new Date(h.at).toLocaleString()}</p>
                            {h.reason && <p>Reason: {h.reason}</p>}
                            {h.note && <p>Note: {h.note}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewHistory;
