import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useScholership = () => {
  const axiosPublic = useAxiosPublic();

  const { refetch, data: scholership = [] } = useQuery({
    queryKey: ["scholership"],
    queryFn: async () => {
      const res = await axiosPublic.get("/allScholership");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return [scholership, refetch];
};

export default useScholership;
