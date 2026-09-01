import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useReviews = (id) => {
  const axiosPublic = useAxiosPublic();

  const { refetch, data: review = [] } = useQuery({
    queryKey: ["review", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosPublic.get(`/allReviews/${id}`);
      return res.data.data;
    },
  });

  return [review, refetch];
};

export default useReviews;
