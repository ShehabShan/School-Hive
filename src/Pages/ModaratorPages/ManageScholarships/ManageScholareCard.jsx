import {
  FaUniversity,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import StarRatings from "react-star-ratings";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { RxViewVertical } from "react-icons/rx";

const ManageScholarCard = ({ scholarship, rating, handleDelete }) => {
  return (
    <div className="card  bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <figure className="px-6 pt-6">
        <img
          src={scholarship?.universityImage}
          alt={`logo`}
          className="rounded-xl  h-[300px] w-[405px] object-cover bg-white p-2"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title text-xl font-bold text-gray-800">
          <FaUniversity className="text-indigo-600" />
          {scholarship?.universityName}
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <FaGraduationCap className="text-indigo-500" />
            <span>
              {scholarship?.Postgraduate} - {scholarship?.subjectName}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-indigo-500" />
            <span>
              {scholarship?.city}, {scholarship?.country}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <FaClock className="text-indigo-500" />
            <span>Deadline: {scholarship?.applicationDeadline}</span>
          </div>

          <div className="flex items-center gap-2">
            <StarRatings
              rating={scholarship?.rating}
              starRatedColor="yellow"
              numberOfStars={5}
              name="rating"
              starDimension="24px"
              starSpacing="2px"
            />
            <span className="text-sm text-gray-500">
              ({scholarship?.rating})
            </span>
          </div>
        </div>
        <div className="text-lg font-semibold text-indigo-600">
          £{scholarship?.applicationFees}
        </div>

        <div className="card-actions gap-2  grid grid-cols-3 mt-4">
          <Link to={`/allScholership/${scholarship?._id}`}>
            <button className="btn btn-primary bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-none hover:from-indigo-600 hover:to-blue-700">
              <RxViewVertical />
            </button>
          </Link>
          <Link to={`${scholarship?._id}`}>
            <button className="btn btn-primary bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-none hover:from-indigo-600 hover:to-blue-700">
              <MdEdit />
            </button>
          </Link>

          <button
            onClick={() => handleDelete(scholarship?._id)}
            className="btn bg-white"
          >
            <MdDelete className="text-red-600 text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageScholarCard;
