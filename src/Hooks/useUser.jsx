import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUser = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isUser, isPending: isUserLoading } = useQuery({
    queryKey: [user?.email, "isUser"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/user/${user.email}`);
      console.log("isUser log", res);
      return res.data?.isUser;
    },
  });

  return [isUser, isUserLoading];
};

export default useUser;
