import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";

export const useSaved = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  const query = useQuery({
    queryKey: ["saved", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get("/saved", { params: { email } });
      return res.data.data || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  return query;
};

export const useToggleSave = () => {
  const axiosSecure = useAxiosSecure();
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (scholarshipId) => {
      const res = await axiosSecure.post("/saved", { scholarshipId });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved", user?.email] });
    },
  });
};

export const useScholarshipStats = () => {
  const axiosPublic = useAxiosPublic();
  return useQuery({
    queryKey: ["scholarship-stats"],
    queryFn: async () => {
      const res = await axiosPublic.get("/allScholership/stats");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};


