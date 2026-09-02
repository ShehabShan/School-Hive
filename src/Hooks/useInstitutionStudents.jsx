import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import toast from "react-hot-toast";

export function useInstitutionStudents(email, { q, page = 1, limit = 10 } = {}) {
  const axiosSecure = useAxiosSecure();
  return useQuery({
    queryKey: ["institution-students", email, q, page, limit],
    enabled: !!email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/institutions/${encodeURIComponent(email)}/students`, { params: { q, page, limit } });
      return data;
    },
  });
}

export function useAddStudent() {
  const axiosSecure = useAxiosSecure();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ institutionEmail, payload }) => {
      const { data } = await axiosSecure.post(`/institutions/${encodeURIComponent(institutionEmail)}/students`, payload);
      return data;
    },
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ["institution-students", v.institutionEmail] }); toast.success("Student added"); },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed to add student"),
  });
}

export function useBulkAddStudents() {
  const axiosSecure = useAxiosSecure();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ institutionEmail, students }) => {
      const { data } = await axiosSecure.post(`/institutions/${encodeURIComponent(institutionEmail)}/students/bulk`, { students });
      return data;
    },
    onSuccess: (d, v) => { qc.invalidateQueries({ queryKey: ["institution-students", v.institutionEmail] }); toast.success(`Bulk: ${d.data.inserted} added, ${d.data.skipped} skipped`); },
    onError: (e) => toast.error(e?.response?.data?.message || "Bulk failed"),
  });
}

export function useUpdateStudent() {
  const axiosSecure = useAxiosSecure();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ institutionEmail, id, payload }) => {
      const { data } = await axiosSecure.patch(`/institutions/${encodeURIComponent(institutionEmail)}/students/${id}`, payload);
      return data;
    },
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ["institution-students", v.institutionEmail] }); toast.success("Student updated"); },
    onError: (e) => toast.error(e?.response?.data?.message || "Update failed"),
  });
}

export function useDeleteStudent() {
  const axiosSecure = useAxiosSecure();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ institutionEmail, id }) => {
      const { data } = await axiosSecure.delete(`/institutions/${encodeURIComponent(institutionEmail)}/students/${id}`);
      return data;
    },
    onSuccess: (_d, v) => { qc.invalidateQueries({ queryKey: ["institution-students", v.institutionEmail] }); toast.success("Student removed"); },
    onError: (e) => toast.error(e?.response?.data?.message || "Delete failed"),
  });
}
