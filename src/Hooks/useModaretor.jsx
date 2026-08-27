import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useModaretor = () => {
  const { user, tokenLoaded } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isModaretor, isPending: isModaretorLoading } = useQuery({
    queryKey: [user?.email, "isModaretor"],
    enabled: !!user && tokenLoaded,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/modaretor/${user.email}`);
      return res.data?.isModaretor;
    },
  });

  return [isModaretor, isModaretorLoading];
};

export default useModaretor;
