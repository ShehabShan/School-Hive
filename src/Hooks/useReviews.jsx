import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";

const useReviews = (id) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const voterEmail = user?.email || "";

  const { refetch, data: review = [] } = useQuery({
    queryKey: ["review", id, voterEmail],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosPublic.get(`/allReviews/${id}${voterEmail ? `?voterEmail=${encodeURIComponent(voterEmail)}` : ""}`);
      return res.data.data;
    },
  });

  return [review, refetch];
};

export default useReviews;
