import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import useAxiosPublic from "./useAxiosPublic";

export function useMeStats() {
  const { user, tokenLoaded } = useAuth();
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["me-stats", user?.email],
    enabled: !!user?.email && tokenLoaded,
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users/me/stats");
      return data.data;
    },
  });
}

export function usePublicStats(email) {
  const axiosPublic = useAxiosPublic();
  return useQuery({
    queryKey: ["public-stats", email],
    enabled: !!email,
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users/public/${encodeURIComponent(email)}/stats`);
      return data.data;
    },
  });
}

export function usePortal() {
  const { user, tokenLoaded } = useAuth();
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["portal", user?.email],
    enabled: !!user?.email && tokenLoaded,
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users/me/portal");
      return data.data;
    },
  });
}
