import Swal from "sweetalert2";
import { FaStar } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import ReviewCard from "../../AdminPages/ManageReviews/ReviewCard";
import DataNotAvailable from "../../../Component/DataNotAvailable/DataNotAvailable";
import PageHeader from "../../../Component/ui/PageHeader";
import Spinner from "../../../Component/ui/Spinner";

const MyReviews = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { refetch, data: myReviews = [], isLoading } = useQuery({
    queryKey: ["myreviews", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/allReviews?email=${user?.email}`);
      return data.data;
    },
  });

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete it!",
      background: "#ffffff",
      customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl", cancelButton: "rounded-xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosSecure.delete(`/allReviews/${_id}`);
          if (data.data?.deletedCount > 0 || data.deletedCount > 0) {
            Swal.fire({ title: "Deleted!", text: "Your review has been deleted.", icon: "success", confirmButtonColor: "#4f46e5" });
            refetch();
          }
        } catch (error) {
          Swal.fire({ title: "Delete failed", text: error?.response?.data?.message || "Something went wrong", icon: "error" });
        }
      }
    });
  };

  const handleEdit = async (review) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit your review",
      html: `<textarea id="swal-comment" class="swal2-textarea w-full" placeholder="5-500 chars">${review.comment || ""}</textarea>
             <input id="swal-rating" type="number" min="1" max="5" value="${review.rating}" class="swal2-input w-full" placeholder="1-5"/>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Save — re-queue for moderation",
      customClass: { popup: "rounded-2xl" },
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
      Swal.fire({ icon: "success", title: "Updated — pending moderation", timer: 1400, showConfirmButton: false });
      refetch();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Update failed", text: err?.response?.data?.message || err.message });
    }
  };

  return (
    <div>
      <PageHeader icon={FaStar} title="My Reviews" subtitle={`Reviews you've written (${myReviews?.length || 0}) — 1 per scholarship, edits re-queue as pending`} />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-brand-600" />
        </div>
      ) : myReviews?.length === 0 ? (
        <DataNotAvailable />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myReviews?.map((reviews) => (
            <ReviewCard key={reviews?._id} review={reviews} handleDelete={handleDelete} onEdit={() => handleEdit(reviews)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
