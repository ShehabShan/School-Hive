import { FaStar } from "react-icons/fa"; // Using react-icons for star
import { MdDelete } from "react-icons/md";

const AllReviews = ({ review }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <img
            src={review?.reviewer_photo}
            alt=""
            width={48}
            height={48}
            className="rounded-full mr-4"
          />
          <div>
            <h3 className="font-semibold text-lg">
              {review?.scholership_details?.universityName}
            </h3>
            <p className="text-sm text-gray-600">{review?.reviewer_email}</p>
          </div>
        </div>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`w-5 h-5 ${
                i < Number.parseInt(review?.rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">{review?.rating}/5</span>
        </div>
        <p className="text-gray-700 mb-4">{review?.comment}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            Posted on:{" "}
            {new Date(review?.reviewer_postDate).toLocaleDateString()}
          </span>
          <span>Scholarship ID: {review?.scholarShip_id}</span>
        </div>
      </div>
    </div>
  );
};

export default AllReviews;
