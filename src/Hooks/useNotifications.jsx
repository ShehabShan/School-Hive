import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

// Shared notifications data source — single cache for every bell (main nav + dashboard).
// Was previously inline in NotificationBell.jsx:32; extracted per TASKS.md N1.
export default function useNotifications() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["notifications", "me"],
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
    queryFn: async () => {
      const { data } = await axiosSecure.get("/notifications/me?limit=10");
      return data;
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const { mutate: markRead, mutateAsync: markReadAsync, isPending: markReadPending } = useMutation({
    mutationFn: async (id) => axiosSecure.patch(`/notifications/read/${id}`),
    onSuccess: invalidate,
  });

  const { mutate: markAllRead, mutateAsync: markAllReadAsync, isPending: markAllReadPending } = useMutation({
    mutationFn: async () => axiosSecure.patch("/notifications/read-all"),
    onSuccess: invalidate,
  });

  const resp = query.data;

  return {
    resp,
    data: resp,
    notifications: resp?.data || [],
    unread: resp?.unreadCount || 0,
    unreadCount: resp?.unreadCount || 0,
    total: resp?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    markRead,
    markReadAsync,
    markReadPending,
    markAllRead,
    markAllReadAsync,
    markAllReadPending,
    invalidate,
  };
}
