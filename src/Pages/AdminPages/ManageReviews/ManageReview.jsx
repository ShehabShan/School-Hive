import { useState } from "react";
import ReviewCard from "./ReviewCard";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PageHeader from "../../../Component/ui/PageHeader";
import EmptyState from "../../../Component/ui/EmptyState";
import { motion } from "framer-motion";
import { Star, Search, History } from "lucide-react";
import { Link } from "react-router-dom";

const ManageReview = () => {
  const axiosSecure = useAxiosSecure();
  const [q, setQ] = useState("");

  const { refetch, data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", "approved", q],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("status", "approved");
      if (q.trim()) params.set("q", q.trim());
      params.set("limit", "100");
      const { data } = await axiosSecure.get(`/allReviews?${params.toString()}`);
      return data.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["reviews-stats"],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get("/reviews/stats");
        return data;
      } catch {
        return { total: reviews.length, pending: 0, approved: 0, rejected: 0 };
      }
    },
  });

  const handleDelete = async (_id) => {
    const res = await Swal.fire({
      title: "Remove review?",
      html: `<p class="text-sm text-slate-600">This review will be removed and saved to history with a reason. Admin can review it later.</p><input id="swal-del-reason" class="swal2-input" placeholder="Reason (required)"><textarea id="swal-del-note" class="swal2-textarea" placeholder="Note for history (optional)"></textarea>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "Yes, remove",
      focusConfirm: false,
      preConfirm: () => {
        const r = document.getElementById("swal-del-reason").value.trim();
        const n = document.getElementById("swal-del-note").value.trim();
        if (!r) { Swal.showValidationMessage("Reason required"); return false; }
        return { reason: r, note: n };
      },
    });
    if (!res.isConfirmed) return;
    try {
      await axiosSecure.delete(`/allReviews/${_id}`, { data: { reason: res.value.reason, note: res.value.note } });
      Swal.fire({ title: "Removed!", text: "Review removed with history.", icon: "success", confirmButtonColor: "#4f46e5" });
      refetch();
    } catch (err) {
      Swal.fire({ title: "Error", text: err?.response?.data?.message || "Remove failed.", icon: "error" });
    }
  };

  const handleEdit = async (review) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit review",
      html: `<textarea id="swal-comment" class="swal2-textarea w-full" placeholder="Comment 5-500 chars">${review.comment || ""}</textarea>
             <input id="swal-rating" type="number" min="1" max="5" value="${review.rating}" class="swal2-input w-full" placeholder="Rating 1-5"/>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      preConfirm: () => {
        const comment = document.getElementById("swal-comment").value;
        const rating = document.getElementById("swal-rating").value;
        if (!comment.trim() || comment.trim().length < 5) {
          Swal.showValidationMessage("Comment 5-500 chars required");
          return false;
        }
        const nr = Number(rating);
        if (!Number.isFinite(nr) || nr < 1 || nr > 5) {
          Swal.showValidationMessage("Rating 1-5 required");
          return false;
        }
        return { comment: comment.trim(), rating: nr };
      },
    });
    if (!formValues) return;
    try {
      await axiosSecure.patch(`/allReviews/${review._id}`, formValues);
      Swal.fire({ icon: "success", title: "Updated", timer: 1200, showConfirmButton: false });
      refetch();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Update failed", text: err?.response?.data?.message || err.message });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Star}
        title="Manage Reviews"
        subtitle={`${stats?.total ?? reviews.length} total • ${stats?.approved ?? reviews.length} approved • ${stats?.removed ?? 0} removed`}
        actions={
          <Link
            to="history"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-brand-600 ring-1 ring-slate-200 hover:bg-brand-50"
          >
            <History className="h-4 w-4" /> View History
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">Student reviews are auto-approved. Use <span className="font-semibold text-slate-700">Remove</span> to take down a review and store it in the history log.</p>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search comment or email..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
          <EmptyState title="No approved reviews" message="No approved reviews match your view. Student reviews appear here once approved." />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {reviews?.map((review) => (
            <motion.div
              key={review._id}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.25 }}
            >
              <ReviewCard review={review} handleDelete={handleDelete} onEdit={() => handleEdit(review)} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ManageReview;
