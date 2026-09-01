import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useSingleScholership = (id) => {
  const axiosPublic = useAxiosPublic();

  const { refetch, data: scholarship = null } = useQuery({
    queryKey: ["singleScholership", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axiosPublic.get(`/allScholership/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  return [scholarship, refetch];
};

export default useSingleScholership;
