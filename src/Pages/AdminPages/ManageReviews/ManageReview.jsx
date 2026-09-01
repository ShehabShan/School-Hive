import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import ReviewCard from "./ReviewCard";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PageHeader from "../../../Component/ui/PageHeader";
import EmptyState from "../../../Component/ui/EmptyState";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const ManageReview = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const { refetch, data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/allReviews");
      return data.data;
    },
  });

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Delete review?",
      text: "This review will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete",
      background: "#ffffff",
      customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl", cancelButton: "rounded-xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosPublic.delete(`/allReviews/${_id}`);
          if (data.data?.deletedCount > 0 || data.deletedCount > 0) {
            Swal.fire({ title: "Deleted!", text: "Review has been deleted.", icon: "success", confirmButtonColor: "#4f46e5" });
            refetch();
          }
        } catch {
          Swal.fire({ title: "Error", text: "Delete failed.", icon: "error" });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Star}
        title="Manage Reviews"
        subtitle={`${reviews.length} review${reviews.length === 1 ? "" : "s"} — curate community feedback`}
      />

      {reviews.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
          <EmptyState title="No reviews yet" message="User reviews will appear here once submitted." />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {reviews?.map((review) => (
            <motion.div
              key={review._id}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.3 }}
            >
              <ReviewCard review={review} handleDelete={handleDelete} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ManageReview;
