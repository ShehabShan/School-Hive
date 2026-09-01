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
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosSecure.delete(`/allReviews/${_id}`);
          if (data.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your review has been deleted.",
              icon: "success",
            });
            refetch();
          }
        } catch (error) {
          Swal.fire({
            title: "Delete failed",
            text: error?.response?.data?.message || "Something went wrong",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div>
      <PageHeader
        icon={FaStar}
        title="My Reviews"
        subtitle={`Reviews you've written (${myReviews?.length || 0})`}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-brand-600" />
        </div>
      ) : myReviews?.length === 0 ? (
        <DataNotAvailable />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myReviews?.map((reviews) => (
            <ReviewCard
              key={reviews?._id}
              review={reviews}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
