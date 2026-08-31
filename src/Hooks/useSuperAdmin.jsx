import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useSuperAdmin = () => {
  const { user, tokenLoaded } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isSuperAdmin, isPending: isSuperAdminLoading } = useQuery({
    queryKey: [user?.email, "isSuperAdmin"],
    enabled: !!user && tokenLoaded,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/superAdmin/${user.email}`);
      return res.data?.isSuperAdmin;
    },
  });

  return [isSuperAdmin, isSuperAdminLoading];
};

export default useSuperAdmin;
