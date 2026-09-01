import { useState } from "react";
import ReviewCard from "./ReviewCard";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PageHeader from "../../../Component/ui/PageHeader";
import EmptyState from "../../../Component/ui/EmptyState";
import { motion } from "framer-motion";
import { Star, Search, CheckCheck } from "lucide-react";

const tabs = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "hidden", label: "Hidden" },
];

const ManageReview = () => {
  const axiosSecure = useAxiosSecure();
  const [activeTab, setActiveTab] = useState("pending");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState([]);

  const { refetch, data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", activeTab, q],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeTab) params.set("status", activeTab);
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

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleModerate = async (id, status) => {
    const reason = status === "rejected" || status === "hidden"
      ? (await Swal.fire({
          title: `Reason for ${status}?`,
          input: "text",
          inputPlaceholder: "Spam, profanity ... (optional)",
          showCancelButton: true,
          confirmButtonColor: "#4f46e5",
          confirmButtonText: "Confirm",
        })).value
      : null;
    // if dismissed on reason input, abort
    if (status === "rejected" && reason === undefined) return;

    try {
      await axiosSecure.patch(`/allReviews/${id}/moderate`, { status, reason: reason || undefined });
      Swal.fire({ icon: "success", title: `Marked ${status}`, timer: 1200, showConfirmButton: false });
      refetch();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err?.response?.data?.message || err.message });
    }
  };

  const handleDelete = async (_id) => {
    const res = await Swal.fire({
      title: "Delete review?",
      text: "This review will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete",
      background: "#ffffff",
      customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl", cancelButton: "rounded-xl" },
    });
    if (!res.isConfirmed) return;
    try {
      const { data } = await axiosSecure.delete(`/allReviews/${_id}`);
      if (data.data?.deletedCount > 0 || data.deletedCount > 0) {
        Swal.fire({ title: "Deleted!", text: "Review has been deleted.", icon: "success", confirmButtonColor: "#4f46e5" });
        refetch();
        setSelected((prev) => prev.filter((x) => x !== _id));
      }
    } catch {
      Swal.fire({ title: "Error", text: "Delete failed.", icon: "error" });
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

  const handleBulk = async (status) => {
    if (selected.length === 0) return;
    const res = await Swal.fire({
      title: `Bulk ${status} ${selected.length} review(s)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      confirmButtonText: `Yes, ${status}`,
    });
    if (!res.isConfirmed) return;
    try {
      await Promise.all(selected.map((id) => axiosSecure.patch(`/allReviews/${id}/moderate`, { status })));
      Swal.fire({ icon: "success", title: `Bulk ${status} done`, timer: 1200, showConfirmButton: false });
      setSelected([]);
      refetch();
    } catch {
      Swal.fire({ icon: "error", title: "Bulk failed" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Star}
        title="Manage Reviews"
        subtitle={`${stats?.total ?? reviews.length} total • ${stats?.pending ?? "-"} pending • ${stats?.approved ?? "-"} approved`}
        actions={
          selected.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">{selected.length} selected</span>
              <button onClick={() => handleBulk("approved")} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">
                Approve
              </button>
              <button onClick={() => handleBulk("rejected")} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700">
                Reject
              </button>
              <button onClick={() => setSelected([])} className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                Clear
              </button>
            </div>
          )
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.key || "all"}
              onClick={() => {
                setActiveTab(t.key);
                setSelected([]);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
                activeTab === t.key ? "bg-brand-600 text-white shadow-soft" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
          <EmptyState title="No reviews in this view" message={activeTab === "pending" ? "Queue is empty — great job!" : "No reviews match your filter."} />
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
              <ReviewCard
                review={review}
                selected={selected.includes(review._id)}
                onToggleSelect={() => toggleSelect(review._id)}
                onApprove={() => handleModerate(review._id, "approved")}
                onReject={() => handleModerate(review._id, "rejected")}
                onHide={() => handleModerate(review._id, "hidden")}
                onEdit={() => handleEdit(review)}
                handleDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {selected.length > 0 && (
        <div className="sticky bottom-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-white shadow-lift">
            <CheckCheck className="h-4 w-4" />
            {selected.length} selected
            <button onClick={() => handleBulk("approved")} className="ml-2 rounded-xl bg-emerald-600 px-3 py-1 text-xs font-bold">
              Approve all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReview;
