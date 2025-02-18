import { useState } from "react";
import { format } from "date-fns";
import { FaCalendarAlt, FaGraduationCap, FaUniversity } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "../../../assist/add-data.png";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;

const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function AddScholarship() {
  const [postDate, setPostDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const { user } = useAuth();

  const axiosPublic = useAxiosPublic();

  const handleCalendarToggle = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    console.log(formData);

    const initialData = Object.fromEntries(formData.entries());

    const universityImage = formData.get("universityImage");

    if (universityImage.name) {
      console.log("door");

      const imageFile = { image: universityImage };
      try {
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        initialData.universityImage = res.data.data.url;
      } catch (error) {
        console.log(error);
      }
    }

    const formattedPostDate = format(postDate, "yyyy-MM-dd");
    const formattedDate = format(date, "yyyy-MM-dd");

    initialData.postDate = formattedPostDate;
    initialData.applicationDeadline = formattedDate;

    initialData.email = user?.email;
    initialData.rating = 0;
    initialData.Feedback = "";

    console.log(initialData);

    try {
      const { data } = await axiosPublic.post("/allScholership", initialData);
      console.log(data.data);
      if (data.data.insertedId) {
        e.target.reset();
      }
    } catch (error) {
      console.log("add scholership error", error);
    }

    // console.log(initialData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-3xl mx-auto shadow-lg bg-white"
      >
        <div className="card-header text-center p-4 border-b">
          <div className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full">
            <img
              src={Image}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold">Oxford University Scholarship</h2>
          <p className="text-gray-600">
            Computer Science Undergraduate Program
          </p>
        </div>
        <div className="card-body p-6 space-y-6">
          {/* University Information */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <FaUniversity className="text-gray-500" />
              University Details
            </h3>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="form-control">
                <label className="label">University Name</label>
                <input
                  type="text"
                  name="universityName"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">Scholarship Name</label>
                <input
                  type="text"
                  name="scholarshipName"
                  className="input input-bordered"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="form-control">
                <label className="label">Country</label>

                <input
                  type="text"
                  name="country"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">City</label>
                <input
                  type="text"
                  name="city"
                  className="input input-bordered"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="form-control">
                <label className="label">University World rank</label>
                <input
                  type="number"
                  name="universityWorldrank"
                  className="input input-bordered"
                />
              </div>
            </div>
          </div>

          {/* Scholarship Details */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <FaGraduationCap className="text-gray-500" />
              Scholarship Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="form-control">
                <label>Scholership type</label>
                <select
                  className="select w-full max-w-xs"
                  name="scholarshipCategory"
                  defaultValue="Partial"
                  required
                >
                  <option disabled>Scholership Type</option>
                  <option value="Partial"> Partial</option>
                  <option value="Full-fund"> Full-fund</option>
                  <option value="Self-fund"> Self-fund</option>
                </select>
              </div>
              <div className="form-control">
                <label>Subject category</label>
                <select
                  className="select w-full max-w-xs"
                  name="subjectName"
                  defaultValue="Agriculture"
                  required
                >
                  <option disabled>Scholership Type</option>
                  <option value="Agriculture"> Agriculture</option>
                  <option value="Engineering"> Engineering</option>
                  <option value="Doctor"> Doctor</option>
                </select>
              </div>
              <div className="form-control">
                <label>Degree</label>
                <select
                  className="select w-full max-w-xs"
                  name="degree"
                  defaultValue="Diploma"
                  required
                >
                  <option disabled>Scholership Type</option>
                  <option value="Diploma"> Diploma</option>
                  <option value="Bachelor"> Bachelor</option>
                  <option value="masters"> masters</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">Annual Stipend</label>
                <input
                  type="number"
                  name="stipend"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control md:col-span-2 ">
                <label className="label">scholarship Description</label>
                <textarea
                  type="text"
                  name="scholarshipDescription"
                  className="input input-bordered h-32 p-3"
                  placeholder="Enter the Scholership short description"
                />
              </div>
            </div>
            <div className="form-control mt-4">
              <label className="label">Post Date</label>

              <div
                className="btn btn-outline w-full flex items-center justify-between"
                name="postDate"
                onClick={() => setPostDate(new Date())}
              >
                <FaCalendarAlt className="mr-2" />
                {postDate ? format(postDate, "PPP") : "March 15, 2025"}
              </div>
            </div>

            <div className="form-control mt-4">
              <label className="label">Application Deadline</label>
              <div
                className="btn btn-outline w-full flex items-center justify-between"
                name="applicationDeadline"
                onClick={handleCalendarToggle}
              >
                <FaCalendarAlt className="mr-2" />
                {date ? format(date, "PPP") : "March 15, 2025"}
              </div>

              {isCalendarVisible && (
                <DatePicker
                  selected={date}
                  onChange={(selectedDate) => setDate(selectedDate)}
                  minDate={new Date()}
                  dateFormat="PPP"
                  inline
                />
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label">Photo</label>
            <input type="file" name="universityImage" required />
          </div>

          {/* Fees Information */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-4 text-lg font-semibold">Fees Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between lg:mx-20">
                <div className="form-control">
                  <label className="label">Service Charge</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="serviceCharge"
                      className="input input-bordered"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">Application Fees</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="applicationFees"
                      className="input input-bordered"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="btn btn-primary w-full">Submit Application</button>
        </div>
      </form>
    </div>
  );
}
