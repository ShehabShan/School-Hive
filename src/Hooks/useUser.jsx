import useRole from "./useRole";

const useUser = () => {
  const { isUser, loading } = useRole();
  return [isUser, loading];
};

export default useUser;
