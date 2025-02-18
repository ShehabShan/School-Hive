import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useReviews = (id) => {
  const axiosPublic = useAxiosPublic();

  const { user } = useAuth();

  const { refetch, data: review = [] } = useQuery({
    queryKey: ["review", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/allReviews/${id}`);

      return res.data.data;
    },
  });

  return [review, refetch];
};

export default useReviews;
