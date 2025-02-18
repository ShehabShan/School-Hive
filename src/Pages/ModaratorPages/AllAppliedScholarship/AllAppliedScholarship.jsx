import { FaEye, FaEdit, FaTimes, FaCheckCircle } from "react-icons/fa";

import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

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
  console.log(allApply);
  const handleViewDetails = (_id) => {
    console.log(_id);
  };
  const handleEdit = (_id) => {
    console.log(_id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accepted it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosSecure.patch(`/allapply/accepted/${_id}`);

          if (data.data.modifiedCount > 0) {
            Swal.fire({
              title: "accepted!",
              text: "The Apply is rejected.",
              icon: "success",
            });
            refetch();
          }
          console.log("hangleCancel", data);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  const handleCancel = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosSecure.patch(`/allapply/cancel/${_id}`);

          if (data.data.modifiedCount > 0) {
            Swal.fire({
              title: "Rejected!",
              text: "The Apply is rejected.",
              icon: "success",
            });
            refetch();
          }
          console.log("hangleCancel", data);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  console.log(allApply);

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Your Applied applicants
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-gray-700 text-sm">
              <th className="p-3">University</th>
              <th className="p-3">Address</th>
              <th className="p-3">Feedback</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Degree</th>
              <th className="p-3">Fees</th>
              <th className="p-3">Service Charge</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allApply.map((applicant, index) => (
              <tr key={index} className="border-t text-sm text-gray-700">
                <td className="p-3">{applicant?.universityName}</td>
                <td className="p-3">
                  {applicant?.applicantDistrict}
                  {applicant?.applicantDistrict}
                </td>
                <td className="p-3">{applicant?.Feedback}</td>
                <td className="p-3">{applicant?.subjectName}</td>
                <td className="p-3">{applicant?.subjectName}</td>
                <td className="p-3">${applicant?.applicationFees}</td>
                <td className="p-3">${applicant?.serviceCharge}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      applicant?.applicationStatus === "accepted"
                        ? "bg-green-200 text-green-800"
                        : applicant?.applicationStatus === "pending"
                        ? "bg-blue-200 text-blue-800"
                        : applicant?.applicationStatus === "rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {applicant?.applicationStatus}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex space-x-2">
                    <Link
                      to={`/modaratorDashboard/allAppliedScholarships/${applicant?._id}`}
                    >
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleViewDetails(applicant?._id)}
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                    </Link>

                    {applicant?.applicationStatus === "accepted" ? (
                      <button
                        disabled
                        className="btn btn-outline btn-sm"
                        onClick={() => handleEdit(applicant?._id)}
                      >
                        <FaCheckCircle className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleEdit(applicant?._id)}
                      >
                        <FaCheckCircle className="h-4 w-4" />
                      </button>
                    )}

                    {applicant?.applicationStatus === "rejected" ? (
                      <button
                        disabled
                        className="btn btn-outline btn-sm text-red-500 border-red-500"
                        onClick={() => handleCancel(applicant?._id)}
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline btn-sm text-red-500 border-red-500"
                        onClick={() => handleCancel(applicant?._id)}
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyApplication;
