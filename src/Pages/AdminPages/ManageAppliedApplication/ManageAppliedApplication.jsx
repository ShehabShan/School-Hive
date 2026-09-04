import { Eye, CheckCircle, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import PageHeader from "../../../Component/ui/PageHeader";
import StatusBadge from "../../../Component/ui/StatusBadge";
import EmptyState from "../../../Component/ui/EmptyState";
import { ClipboardList } from "lucide-react";

const MyApplication = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { refetch, data: allApply = [] } = useQuery({
    queryKey: ["allapply", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/allapply");
      return data.data;
    },
  });

  const handleEdit = (_id) => {
    Swal.fire({
      title: "Accept application?",
      text: "This will mark the application as accepted.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "Yes, accept",
      background: "#ffffff",
      customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl", cancelButton: "rounded-xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosSecure.patch(`/allapply/accepted/${_id}`);
          if (data.data?.modifiedCount > 0 || data.modifiedCount > 0) {
            Swal.fire({ title: "Accepted!", text: "Application accepted.", icon: "success", confirmButtonColor: "#4f46e5" });
            refetch();
          }
        } catch {
          Swal.fire({ title: "Error", text: "Action failed.", icon: "error" });
        }
      }
    });
  };

  const handleCancel = (_id) => {
    Swal.fire({
      title: "Reject application?",
      text: "This will mark the application as rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "Yes, reject",
      customClass: { popup: "rounded-2xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosSecure.patch(`/allapply/cancel/${_id}`);
          if (data.data?.modifiedCount > 0 || data.modifiedCount > 0) {
            Swal.fire({ title: "Rejected!", text: "Application rejected.", icon: "success", confirmButtonColor: "#4f46e5" });
            refetch();
          }
        } catch {
          Swal.fire({ title: "Error", text: "Action failed.", icon: "error" });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="Manage Applied Applications"
        subtitle={`${allApply.length} application${allApply.length === 1 ? "" : "s"} awaiting review`}
      />

      {allApply.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
          <EmptyState title="No applications yet" message="Applied scholarships will appear here once users submit them." />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-4 py-3.5">University</th>
                  <th className="px-4 py-3.5">District</th>
                  <th className="px-4 py-3.5">Feedback</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5">Degree</th>
                  <th className="px-4 py-3.5">Fees</th>
                  <th className="px-4 py-3.5">Service</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allApply.map((applicant) => (
                  <tr key={applicant._id} className="text-sm text-slate-700 transition-colors hover:bg-slate-50/70">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{applicant?.universityName}</td>
                    <td className="px-4 py-3.5 text-slate-500">{applicant?.applicantDistrict || "—"}</td>
                    <td className="max-w-[180px] truncate px-4 py-3.5 text-slate-500" title={applicant?.Feedback}>
                      {applicant?.Feedback || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3.5">{applicant?.subjectName}</td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                        {applicant?.applyingDegree || applicant?.subjectName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold">${applicant?.applicationFees}</td>
                    <td className="px-4 py-3.5">${applicant?.serviceCharge}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={applicant?.applicationStatus} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          to={`/adminDashboard/allAppliedScholarships/${applicant?._id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-800"
                          aria-label="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          disabled={applicant?.applicationStatus === "accepted"}
                          onClick={() => handleEdit(applicant?._id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Accept"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={applicant?.applicationStatus === "rejected"}
                          onClick={() => handleCancel(applicant?._id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-rose-600 ring-1 ring-slate-200 transition-colors hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Reject"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplication;
