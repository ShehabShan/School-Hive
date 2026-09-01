import { FaEye, FaStar } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import DataNotAvailable from "../../../Component/DataNotAvailable/DataNotAvailable";
import PageHeader from "../../../Component/ui/PageHeader";
import StatusBadge from "../../../Component/ui/StatusBadge";
import Spinner from "../../../Component/ui/Spinner";

const MyApplication = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: apply = [], isLoading } = useQuery({
    queryKey: ["apply", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/apply?email=${user?.email}`);
      return data.data;
    },
  });

  const { data: myReviews = [] } = useQuery({
    queryKey: ["myReviews-gate-list", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/allReviews?email=${user?.email}`);
      return data.data;
    },
  });

  const hasReviewed = (scholarshipId) => myReviews.some((r) => String(r.scholarShip_id) === String(scholarshipId));

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        icon={FaFileAlt}
        title="My Applications"
        subtitle={`Track the status of the ${apply?.length || 0} scholarships you applied to`}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-brand-600" />
        </div>
      ) : apply?.length === 0 ? (
        <DataNotAvailable />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3.5">University</th>
                  <th className="px-4 py-3.5">Address</th>
                  <th className="px-4 py-3.5">Feedback</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5">Degree</th>
                  <th className="px-4 py-3.5">Fees</th>
                  <th className="px-4 py-3.5">Service Charge</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apply.map((applicant) => {
                  const isAccepted = applicant?.applicationStatus === "accepted";
                  const reviewed = hasReviewed(applicant?.scholarship_id);
                  return (
                    <tr
                      key={applicant?._id}
                      className="border-t border-slate-100 text-sm text-slate-700 transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-4 py-3.5 font-semibold text-slate-900">{applicant?.universityName}</td>
                      <td className="px-4 py-3.5">{applicant?.applicantDistrict}</td>
                      <td className="px-4 py-3.5 text-slate-500">{applicant?.Feedback}</td>
                      <td className="px-4 py-3.5">{applicant?.subjectName}</td>
                      <td className="px-4 py-3.5">{applicant?.Postgraduate}</td>
                      <td className="px-4 py-3.5 font-semibold text-brand-600">${applicant?.applicationFees}</td>
                      <td className="px-4 py-3.5">${applicant?.serviceCharge}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={applicant?.applicationStatus} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-2">
                          <Link to={`/userDashboard/myApplication/${applicant?._id}`}>
                            <button
                              className="btn btn-sm btn-circle bg-slate-100 text-slate-600 border-none hover:bg-brand-600 hover:text-white"
                              title="View application"
                            >
                              <FaEye className="h-3.5 w-3.5" />
                            </button>
                          </Link>

                          {!isAccepted ? (
                            <button
                              disabled
                              className="btn btn-sm btn-circle bg-slate-100 text-slate-400 border-none cursor-not-allowed"
                              title="Review available only after moderator accepts your application"
                            >
                              <FaStar className="h-3.5 w-3.5" />
                            </button>
                          ) : reviewed ? (
                            <Link to="/userDashboard/myReviews" title="Already reviewed — edit in My Reviews">
                              <button className="btn btn-sm btn-circle bg-emerald-100 text-emerald-600 border-none hover:bg-emerald-600 hover:text-white">
                                <ShieldCheck className="h-4 w-4" />
                              </button>
                            </Link>
                          ) : (
                            <Link to={`/userDashboard/myApplication/addReviews/${applicant?.scholarship_id}`}>
                              <button
                                className="btn btn-sm btn-circle bg-amber-100 text-amber-600 border-none hover:bg-amber-500 hover:text-white"
                                title="Write a review (verified applicant, 1 per scholarship)"
                              >
                                <FaStar className="h-3.5 w-3.5" />
                              </button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-3 text-xs text-slate-400">
            <ShieldCheck className="inline h-3 w-3 text-emerald-500" /> Only <span className="font-bold">accepted</span> applications can leave 1 review per scholarship (pending moderation).
          </p>
        </div>
      )}
    </div>
  );
};

export default MyApplication;
