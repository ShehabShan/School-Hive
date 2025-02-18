import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import ReviewCard from "./ReviewCard";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

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
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosPublic.delete(`/allReviews/${_id}`);
          console.log(data.data);
          if (data.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            refetch();
          }
        } catch (error) {
          console.log("Scholership delete ERROR", error);
        }
      }
    });
  };

  return (
    <div>
      <h2 className="text-3xl text-emerald-700 font-bold">Manage review</h2>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
      "
      >
        {reviews?.map((reviews, index) => (
          <ReviewCard
            key={index}
            review={reviews}
            handleDelete={handleDelete}
          ></ReviewCard>
        ))}
      </div>
    </div>
  );
};

export default ManageReview;
