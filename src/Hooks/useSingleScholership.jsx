import { useQuery } from "@tanstack/react-query";
// import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useSingleScholership = (id) => {
  const axiosPublic = useAxiosPublic();
  console.log(id);

  const { user } = useAuth();

  const { refetch, data: scholarship = [] } = useQuery({
    queryKey: ["singleScholership", id, user?.email],
    queryFn: async () => {
      if (!id) return null;

      const res = await axiosPublic.get(`/allScholership/${id}`);

      return res.data.data;
    },
    enabled: !!id,
  });

  return [scholarship, refetch];
};

export default useSingleScholership;
