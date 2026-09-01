import { useQuery } from "@tanstack/react-query";
import { FaTrash, FaCrown, FaLock, FaUserShield, FaUser, FaChalkboardTeacher } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PageHeader from "../../../Component/ui/PageHeader";
import EmptyState from "../../../Component/ui/EmptyState";
import { Users } from "lucide-react";

const showError = (error) => {
  Swal.fire({
    title: "Action failed",
    text: error?.response?.data?.message || "Something went wrong",
    icon: "error",
    confirmButtonColor: "#4f46e5",
  });
};

const roleBadge = (role) => {
  const r = String(role || "").toLowerCase();
  if (r === "superadmin") return "bg-amber-100 text-amber-700 ring-amber-200";
  if (r === "admin") return "bg-brand-100 text-brand-700 ring-brand-200";
  if (r === "modaretor") return "bg-sky-100 text-sky-700 ring-sky-200";
  if (r === "institution") return "bg-violet-100 text-violet-700 ring-violet-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
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

  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/users");
      return data.data;
    },
  });

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

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Manage Users"
        subtitle={`${users.length} registered user${users.length === 1 ? "" : "s"} — assign roles or remove accounts`}
      />

      {users.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
          <EmptyState title="No users found" message="User accounts will appear here once someone signs up." />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
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
                      <td className="px-4 py-3.5 font-semibold text-slate-500">{index + 1}</td>
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
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${roleBadge(u?.role)}`}>
                          {isOwner && <FaCrown className="h-3 w-3" />}
                          {isOwner ? "Owner" : u?.role === "institution" ? "Institution" : u?.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {isOwner ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
                            <FaCrown className="h-3 w-3" /> Owner
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
                              <FaUserShield className="h-3 w-3" /> Admin
                            </button>
                            <button
                              onClick={() => handleRole(u, `/users/modaretor/${u?._id}`, `${u?.name} is moderator now`)}
                              className="inline-flex items-center gap-1 rounded-xl bg-sky-600 px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-sky-700"
                            >
                              <FaChalkboardTeacher className="h-3 w-3" /> Mod
                            </button>
                            <button
                              onClick={() => handleRole(u, `/users/user/${u?._id}`, `${u?.name} is user now`)}
                              className="inline-flex items-center gap-1 rounded-xl bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
                            >
                              <FaUser className="h-3 w-3" /> User
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {isOwner ? (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400" title="Owner cannot be removed">
                            <FaLock className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDelete(u)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-rose-600 ring-1 ring-slate-200 transition-colors hover:bg-rose-50"
                            aria-label="Delete user"
                          >
                            <FaTrash className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
