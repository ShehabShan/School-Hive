import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";

/**
 * Hydrate public identity (name, avatar, role, verified) for an email.
 * Cached 5m — N+1 safe at community scale, staleTime dedupes across
 * question + answers on the same page.
 */
export default function useAuthor(email, enabled = true) {
  const { data, isLoading } = useQuery({
    queryKey: ["author", String(email || "").toLowerCase()],
    enabled: Boolean(email) && enabled,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      try {
        const res = await axios.get(`${baseURL}/users/public/${encodeURIComponent(email)}`);
        return res.data?.data || null;
      } catch {
        return null;
      }
    },
  });
  return { author: data, loading: isLoading };
}
