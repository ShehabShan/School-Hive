import useRole from "./useRole";

const useModaretor = () => {
  const { isModaretor, loading } = useRole();
  return [isModaretor, loading];
};

export default useModaretor;
