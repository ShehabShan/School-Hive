import { FaEye, FaStar } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";

const MyApplication = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: apply = [] } = useQuery({
    queryKey: ["apply", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/apply?email=${user?.email}`);
      return data.data;
    },
  });

  console.log(apply);

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
            {apply.map((applicant, index) => (
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
                      applicant?.applicationStatus === "completed"
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
                    <Link to={`/userDashboard/myApplication/${applicant?._id}`}>
                      <button className="btn btn-outline btn-sm">
                        <FaEye className="h-4 w-4" />
                      </button>
                    </Link>

                    <Link
                      to={`/userDashboard/myApplication/addReviews/${applicant?.scholarship_id}`}
                    >
                      <button className="btn btn-outline btn-sm text-yellow-500 border-yellow-500">
                        <FaStar className="h-4 w-4" />
                      </button>
                    </Link>
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
