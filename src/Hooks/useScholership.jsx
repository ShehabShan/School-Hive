import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useScholership = (params = null) => {
  const axiosPublic = useAxiosPublic();

  const hasParams = params && typeof params === "object" && Object.keys(params).length > 0;

  const query = useQuery({
    queryKey: hasParams ? ["scholership", params] : ["scholership"],
    queryFn: async () => {
      const res = await axiosPublic.get("/allScholership", { params: params || undefined });
      // server returns {data, total, page, totalPages} or legacy {data:[]}
      const d = res.data;
      if (Array.isArray(d.data)) return d;
      if (Array.isArray(d)) return { data: d, total: d.length, page: 1, totalPages: 1 };
      return d;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  // backward compat: if caller does const [list, refetch] = useScholership()
  // and no params, return array directly; else return object
  if (!hasParams) {
    const arr = Array.isArray(query.data?.data) ? query.data.data : Array.isArray(query.data) ? query.data : [];
    return [arr, query.refetch, query];
  }
  return query;
};

export default useScholership;
