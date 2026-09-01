import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, tokenLoaded } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: me, isLoading } = useQuery({
    queryKey: [user?.email, "me"],
    enabled: !!user && tokenLoaded,
    queryFn: async () => {
      const res = await axiosSecure.get("/users/me");
      return res.data?.data || null;
    },
  });

  const role = me?.role || "";
  const status = me?.status || "active";
  const isInstitution = role === "institution";

  return {
    role,
    status,
    me,
    isAdmin: role === "admin" || role === "superadmin",
    isModaretor: role === "modaretor",
    isUser: role === "user",
    isSuperAdmin: role === "superadmin",
    isInstitution,
    isApprovedInstitution: isInstitution && status === "approved",
    isPending: isInstitution && status === "pending",
    isRejected: isInstitution && status === "rejected",
    loading: isLoading,
  };
};

export default useRole;