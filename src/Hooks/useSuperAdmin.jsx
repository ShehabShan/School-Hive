import useRole from "./useRole";

const useSuperAdmin = () => {
  const { isSuperAdmin, loading } = useRole();
  return [isSuperAdmin, loading];
};

export default useSuperAdmin;
