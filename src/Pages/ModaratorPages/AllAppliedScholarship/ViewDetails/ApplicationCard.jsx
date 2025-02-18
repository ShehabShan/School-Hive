import {
  FaMailBulk,
  FaCalendarAlt,
  FaUser,
  FaBookOpen,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const ApplicationCard = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { refetch, data: singleApply = [] } = useQuery({
    queryKey: ["singleApply", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/singleApply/${id}`);
      return data.data;
    },
  });

  const totalFees = singleApply?.applicationFees + singleApply?.serviceCharge;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-row items-center justify-between pb-2">
        <h2 className="text-2xl font-bold">Application Details</h2>
        <div
          className={`badge ${
            singleApply?.applicationStatus === "rejected"
              ? "bg-red-500"
              : "bg-green-500"
          } text-white py-2 px-4 rounded`}
        >
          {singleApply?.applicationStatus === "pending" ? (
            <FaTimesCircle className="w-4 h-4 mr-2" />
          ) : (
            <FaCheckCircle className="w-4 h-4 mr-2" />
          )}
          {singleApply?.applicationStatus}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
              <img
                src={singleApply?.universityImage}
                alt="University"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{singleApply?.name}</h3>
              <p className="text-sm text-gray-500">{singleApply?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <FaMailBulk className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{singleApply?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{singleApply?.postDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaBookOpen className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{singleApply?.subjectName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaUser className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {singleApply?.scholarshipCategory} Scholarship
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Application Fees</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Application Fee:</span>
                <span>${singleApply?.applicationFees}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge:</span>
                <span>${singleApply?.serviceCharge}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${totalFees}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Additional Information</h4>
            <div className="text-sm space-y-1">
              <p>Scholarship ID: {singleApply?.scholarship_id}</p>
            </div>
          </div>
        </div>
      </div>
      {singleApply?.Feedback && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Feedback</h4>
          <p className="text-sm">{singleApply?.Feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
