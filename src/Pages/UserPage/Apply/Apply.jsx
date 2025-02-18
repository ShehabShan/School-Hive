import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaCalendarAlt, FaGraduationCap, FaUniversity } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import Image from "../../../assist/add-data.png";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

import { useNavigate, useParams } from "react-router-dom";
import useSingleScholership from "../../../Hooks/useSingleScholership";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;

const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function Apply() {
  const { id } = useParams();
  const [scholarship] = useSingleScholership(id);
  const [postDate, setPostDate] = useState(new Date());
  const { user } = useAuth();
  const [userId, setUserId] = useState([]);
  const navigate = useNavigate();

  console.log(
    "subject Name ",
    scholarship?.subjectName,
    scholarship?.scholarshipCategory
  );

  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get(`/user?email=${user?.email}`).then((res) => {
      setUserId(res.data.data._id);
    });
  }, [user?.email, axiosSecure]);

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

    initialData.postDate = formattedPostDate;
    initialData.email = user?.email;
    initialData.name = user?.displayName;
    initialData.scholarshipCategory = scholarship?.scholarshipCategory;
    initialData.subjectName = scholarship?.subjectName;
    initialData.scholarship_id = scholarship?._id;
    initialData.userId = userId;
    initialData.Feedback = scholarship?.Feedback;
    initialData.applicationFees = scholarship?.applicationFees;
    initialData.serviceCharge = scholarship?.serviceCharge;
    initialData.applicationStatus = "pending";

    console.log(initialData);

    try {
      const { data } = await axiosSecure.post("/apply", initialData);
      console.log(data.data);
      if (data.data.insertedId) {
        e.target.reset();
        navigate("/userDashboard/myApplication");
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
          <h2 className="text-2xl font-bold">Schoole Hive Scholarship</h2>
          <p className="text-gray-600">Biggest scholership Program</p>
        </div>
        <div className="card-body p-6 space-y-6">
          {/* University Information */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <FaUniversity className="text-gray-500" />
              Applicant Details
            </h3>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="form-control">
                <label className="label">University Name</label>
                <input
                  type="text"
                  name="universityName"
                  className="input input-bordered"
                  defaultValue={scholarship?.universityName}
                  readOnly
                />
              </div>
              <div className="form-control">
                <label className="label">village</label>
                <input
                  type="text"
                  name="applicantVillage"
                  className="input input-bordered"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="form-control">
                <label className="label">District</label>

                <input
                  type="text"
                  name="applicantDistrict"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">country</label>
                <input
                  type="text"
                  name="applicantCountry"
                  className="input input-bordered"
                  required
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
                <p>{scholarship?.scholarshipCategory}</p>
              </div>
              <div className="form-control">
                <label>Subject category</label>

                <p>{scholarship?.subjectName}</p>
              </div>
              <div className="form-control">
                <label>Degree</label>
                <select
                  className="select w-full max-w-xs"
                  name="applyingDegree"
                  defaultValue="Diploma"
                  required
                >
                  <option disabled>Chose a Degree</option>
                  <option value="Diploma"> Diploma</option>
                  <option value="Bachelor"> Bachelor</option>
                  <option value="masters"> masters</option>
                </select>
              </div>

              <div className="form-control">
                <label>Gender</label>
                <select
                  className="select w-full max-w-xs"
                  name="applicantGender"
                  defaultValue="male"
                  required
                >
                  <option disabled>Gender</option>
                  <option value="male"> Male</option>
                  <option value="female"> female</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">SSC Result</label>
                <input
                  type="number"
                  name="SSCResult"
                  className="input input-bordered"
                  placeholder="GPA"
                  max={5}
                  onInput={(e) => {
                    if (e.target.value > 5) e.target.value = 5;
                  }}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">HSC result</label>
                <input
                  type="number"
                  name="HSCResult"
                  className="input input-bordered"
                  placeholder="GPA"
                  max={5}
                  onInput={(e) => {
                    if (e.target.value > 5) e.target.value = 5;
                  }}
                  required
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
          </div>

          <div className="form-control">
            <label className="label">Photo</label>
            <input type="file" name="universityImage" required />
          </div>

          {/* Fees Information */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-4 text-lg font-semibold">Contact info</h3>
            <div className="space-y-2">
              <div className="flex justify-between lg:mx-20">
                <div className="form-control">
                  <label className="label">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="applicantNumber"
                      className="input input-bordered w-[500px]"
                      required
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
