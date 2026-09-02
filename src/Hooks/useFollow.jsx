import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";
import toast from "react-hot-toast";

export function useFollow(targetEmail) {
  const { user, tokenLoaded } = useAuth();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const qc = useQueryClient();

  const followersQ = useQuery({
    queryKey: ["followers", targetEmail],
    enabled: !!targetEmail,
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users/${encodeURIComponent(targetEmail)}/followers`);
      return data.data;
    },
  });

  const isFollowingQ = useQuery({
    queryKey: ["isFollowing", targetEmail, user?.email],
    enabled: !!targetEmail && !!user?.email && tokenLoaded,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/${encodeURIComponent(targetEmail)}/follow`);
      return data.following;
    },
  });

  const toggle = useMutation({
    mutationFn: async () => {
      const { data } = await axiosSecure.post(`/users/${encodeURIComponent(targetEmail)}/follow`);
      return data;
    },
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ["isFollowing", targetEmail] });
      qc.invalidateQueries({ queryKey: ["followers", targetEmail] });
      qc.invalidateQueries({ queryKey: ["me-stats"] });
      qc.invalidateQueries({ queryKey: ["public-stats", targetEmail] });
      toast.success(d.following ? "Following" : "Unfollowed");
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Follow failed"),
  });

  return { followersQ, isFollowingQ, toggle };
}
