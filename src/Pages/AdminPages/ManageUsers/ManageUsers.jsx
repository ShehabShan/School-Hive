import { useEffect, useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Trash2, Crown, Lock, ShieldCheck, User, Users, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PageHeader from "../../../Component/ui/PageHeader";
import EmptyState from "../../../Component/ui/EmptyState";
import { roleMeta } from "../../../Component/profile/RoleBadge";

const PAGE_LIMIT = 12;
const ROLE_OPTIONS = ["", "user", "modaretor", "admin", "superadmin", "institution"];

const showError = (error) => {
  Swal.fire({
    title: "Action failed",
    text: error?.response?.data?.message || "Something went wrong",
    icon: "error",
    confirmButtonColor: "#4f46e5",
  });
};

const roleBadgeClass = (role) => {
  const meta = roleMeta[role];
  return meta ? meta.color : "bg-slate-100 text-slate-600 ring-slate-200";
};

const statusBadge = (status) => {
  const s = String(status || "");
  if (s === "approved") return "bg-emerald-100 text-emerald-700 ring-emerald-200";
  if (s === "rejected") return "bg-rose-100 text-rose-600 ring-rose-200";
  if (s === "pending") return "bg-amber-100 text-amber-700 ring-amber-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
};

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [role]);

  const params = useMemo(
    () => ({ q: debouncedSearch || undefined, role: role || undefined, page, limit: PAGE_LIMIT, sort: "newest" }),
    [debouncedSearch, role, page]
  );

  const { refetch, data: resp, isLoading, isFetching } = useQuery({
    queryKey: ["users", params],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users", { params });
      return data;
    },
  });

  const users = resp?.data || [];
  const total = resp?.total ?? 0;
  const totalPages = resp?.totalPages ?? 1;

  const askConfirm = (title, text, confirmText) =>
    Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#e11d48",
      confirmButtonText: confirmText,
      background: "#ffffff",
      customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl", cancelButton: "rounded-xl" },
    });

  const handleDelete = async (user) => {
    const result = await askConfirm("Delete user?", "You won't be able to revert this!", "Yes, delete it!");
    if (result.isConfirmed) {
      try {
        const { data } = await axiosSecure.delete(`/users/${user?._id}`);
        if (data.data?.deletedCount > 0 || data.deletedCount > 0) {
          Swal.fire({ title: "Deleted!", text: "User has been deleted.", icon: "success", confirmButtonColor: "#4f46e5" });
          refetch();
        }
      } catch (error) {
        showError(error);
      }
    }
  };

  const handleRole = async (user, endpoint, successTitle) => {
    const result = await askConfirm("Change role?", `Make ${user?.email} ${successTitle.toLowerCase()}?`, "Yes, confirm");
    if (!result.isConfirmed) return;
    try {
      const { data } = await axiosSecure.patch(endpoint);
      if (data.data?.modifiedCount > 0 || data.modifiedCount > 0) {
        Swal.fire({ position: "top-center", icon: "success", title: successTitle, showConfirmButton: false, timer: 1400 });
        refetch();
      }
    } catch (error) {
      showError(error);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await axiosSecure.get("/users/export", {
        params: { q: debouncedSearch || undefined, role: role || undefined },
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      showError(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Manage Users"
        subtitle={`${total} registered user${total === 1 ? "" : "s"} — assign roles or remove accounts`}
        actions={
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, organization or city…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 shadow-soft focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-soft focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r ? r.charAt(0).toUpperCase() + r.slice(1) : "All roles"}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0">
              <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-40 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-56 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
          <EmptyState title="No users found" message={debouncedSearch || role ? "No users match the current search/filters — try clearing them." : "User accounts will appear here once someone signs up."} />
        </div>
      ) : (
        <div className={`overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">Name</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Assign</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u, index) => {
                  const isOwner = u?.role === "superadmin";
                  return (
                    <tr key={u?._id} className="text-sm text-slate-700 hover:bg-slate-50/70">
                      <td className="px-4 py-3.5 font-semibold text-slate-500">{(page - 1) * PAGE_LIMIT + index + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                            {(u?.name || u?.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-900">{u?.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{u?.email}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${roleBadgeClass(u?.role)}`}>
                          {isOwner && <Crown className="h-3 w-3" />}
                          {isOwner ? "Owner" : u?.role === "institution" ? "Institution" : u?.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {isOwner ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
                            <Crown className="h-3 w-3" /> Owner
                          </span>
                        ) : u?.role === "institution" ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${statusBadge(u?.status)}`}>
                            {u?.status || "in review"}
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              onClick={() => handleRole(u, `/users/admin/${u?._id}`, `${u?.name} is admin now`)}
                              className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-700"
                            >
                              <ShieldCheck className="h-3 w-3" /> Admin
                            </button>
                            <button
                              onClick={() => handleRole(u, `/users/modaretor/${u?._id}`, `${u?.name} is moderator now`)}
                              className="inline-flex items-center gap-1 rounded-xl bg-sky-600 px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-sky-700"
                            >
                              <Users className="h-3 w-3" /> Mod
                            </button>
                            <button
                              onClick={() => handleRole(u, `/users/user/${u?._id}`, `${u?.name} is user now`)}
                              className="inline-flex items-center gap-1 rounded-xl bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
                            >
                              <User className="h-3 w-3" /> User
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {isOwner ? (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400" title="Owner cannot be removed">
                            <Lock className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDelete(u)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-rose-600 ring-1 ring-slate-200 transition-colors hover:bg-rose-50"
                            aria-label="Delete user"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
            <span className="text-xs font-semibold text-slate-500">
              Page {page} of {totalPages} · {total} user{total === 1 ? "" : "s"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
