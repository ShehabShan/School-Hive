import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Check,
  X,
  MapPin,
  Globe,
  FileText,
  Clock3,
  ShieldCheck,
  ShieldX,
  Mail,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PageHeader from "../../../Component/ui/PageHeader";
import EmptyState from "../../../Component/ui/EmptyState";

const tabs = [
  { id: "pending", label: "Pending", icon: Clock3, activeClass: "bg-amber-100 text-amber-700 ring-amber-200" },
  { id: "approved", label: "Approved", icon: Check, activeClass: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
  { id: "rejected", label: "Rejected", icon: X, activeClass: "bg-rose-100 text-rose-600 ring-rose-200" },
];

const typeLabel = (t) => {
  const map = { university: "University", college: "College", school: "School" };
  return map[String(t || "").toLowerCase()] || "Institution";
};

const InstitutionApprovals = () => {
  const axiosSecure = useAxiosSecure();
  const [tab, setTab] = useState("pending");

  const { refetch, data: institutions = [], isLoading } = useQuery({
    queryKey: ["institutions", tab],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/institutions?status=${tab}`);
      return data.data;
    },
  });

  const handleApprove = async (inst) => {
    const result = await Swal.fire({
      title: "Approve institution?",
      html: `<p class="text-sm text-slate-600">${inst?.orgName} will be able to post and manage scholarships.</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Approve",
      background: "#ffffff",
      customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl", cancelButton: "rounded-xl" },
    });
    if (!result.isConfirmed) return;
    try {
      await axiosSecure.patch(`/users/institution/${inst?._id}`, { status: "approved" });
      Swal.fire({ position: "top-center", icon: "success", title: "Institution approved", showConfirmButton: false, timer: 1400 });
      refetch();
    } catch (error) {
      Swal.fire({ title: "Action failed", text: error?.response?.data?.message || "Something went wrong", icon: "error", confirmButtonColor: "#4f46e5" });
    }
  };

  const handleReject = async (inst) => {
    const { value: reason } = await Swal.fire({
      title: "Reject institution?",
      text: "This will block the account from posting scholarships.",
      input: "textarea",
      inputLabel: "Reason (shown to the institution)",
      inputPlaceholder: "e.g. Please provide valid accreditation documents...",
      inputValidator: (v) => (!v || String(v).trim().length < 5 ? "Please provide a short reason (min 5 chars)" : null),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Reject",
      background: "#ffffff",
      customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl", cancelButton: "rounded-xl" },
    });
    if (!reason) return;
    try {
      await axiosSecure.patch(`/users/institution/${inst?._id}`, { status: "rejected", reason: String(reason).trim() });
      Swal.fire({ position: "top-center", icon: "success", title: "Institution rejected", showConfirmButton: false, timer: 1400 });
      refetch();
    } catch (error) {
      Swal.fire({ title: "Action failed", text: error?.response?.data?.message || "Something went wrong", icon: "error", confirmButtonColor: "#4f46e5" });
    }
  };

  const handleReset = async (inst, status) => {
    const label = status === "pending" ? "Move back to pending?" : "Re-submit for review?";
    const result = await Swal.fire({
      title: label,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes",
      background: "#ffffff",
      customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl", cancelButton: "rounded-xl" },
    });
    if (!result.isConfirmed) return;
    try {
      await axiosSecure.patch(`/users/institution/${inst?._id}`, { status: "pending" });
      Swal.fire({ position: "top-center", icon: "success", title: "Status updated", showConfirmButton: false, timer: 1400 });
      refetch();
    } catch (error) {
      Swal.fire({ title: "Action failed", text: error?.response?.data?.message || "Something went wrong", icon: "error", confirmButtonColor: "#4f46e5" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        title="Institution Approvals"
        subtitle="Review university / college / school registration requests"
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold capitalize ring-1 transition-all ${
                active
                  ? t.activeClass
                  : "bg-white text-slate-500 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl bg-white p-12 shadow-soft ring-1 ring-slate-100">
          <span className="loading loading-spinner loading-lg text-brand-600"></span>
        </div>
      ) : institutions.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
          <EmptyState
            title={`No ${tab} institutions`}
            message="Institution registration requests will appear here for review."
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {institutions.map((inst) => (
            <div
              key={inst?._id}
              className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                  <Building2 className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-slate-900">{inst?.orgName || inst?.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {typeLabel(inst?.orgType)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${
                    tab === "pending"
                      ? "bg-amber-100 text-amber-700 ring-amber-200"
                      : tab === "approved"
                      ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
                      : "bg-rose-100 text-rose-600 ring-rose-200"
                  }`}
                >
                  {tab}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{inst?.email}</span>
                </p>
                {inst?.orgCountry && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="capitalize">{inst?.orgCountry}</span>
                  </p>
                )}
                {inst?.orgWebsite && (
                  <p className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <a
                      href={inst?.orgWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-brand-600 hover:underline"
                    >
                      {inst?.orgWebsite.replace(/^https?:\/\//, "")}
                    </a>
                  </p>
                )}
                {inst?.orgDescription && (
                  <p className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="line-clamp-3 text-slate-500">{inst?.orgDescription}</span>
                  </p>
                )}
                {tab === "rejected" && inst?.statusNote && (
                  <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-rose-100">
                    Reason: {inst?.statusNote}
                  </p>
                )}
                {tab === "approved" && inst?.reviewedBy && (
                  <p className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Approved by {inst?.reviewedBy}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {tab === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(inst)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(inst)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-rose-700"
                    >
                      <ShieldX className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </>
                )}
                {tab !== "pending" && (
                  <button
                    onClick={() => handleReset(inst)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    <Clock3 className="h-3.5 w-3.5" />
                    Move to Pending
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstitutionApprovals;