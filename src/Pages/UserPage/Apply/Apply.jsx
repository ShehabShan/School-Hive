import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  GraduationCap,
  Building2,
  User,
  Send,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import Image from "../../../assist/add-data.png";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import useSingleScholership from "../../../Hooks/useSingleScholership";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import FormField from "../../../Component/ui/FormField";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const inputClass =
  "input input-bordered w-full rounded-xl border-slate-200 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const selectClass =
  "select w-full rounded-xl border-slate-200 bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

const SectionTitle = ({ icon: Icon, title }) => (
  <h3 className="mb-4 flex items-center gap-2.5 text-base font-bold text-slate-800">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
      <Icon className="h-4 w-4" />
    </span>
    {title}
  </h3>
);

export default function Apply() {
  const { id } = useParams();
  const [scholarship] = useSingleScholership(id);
  const [postDate, setPostDate] = useState(new Date());
  const { user } = useAuth();
  const [userId, setUserId] = useState([]);
  const navigate = useNavigate();

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
    const initialData = Object.fromEntries(formData.entries());

    const universityImage = formData.get("universityImage");

    if (universityImage.name) {
      const imageFile = { image: universityImage };
      try {
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        initialData.universityImage = res.data.data.url;
      } catch (error) {
        console.error(error);
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

    try {
      const { data } = await axiosSecure.post("/apply", initialData);
      if (data.data.insertedId) {
        e.target.reset();
        navigate("/userDashboard/myApplication");
      }
    } catch (error) {
      console.error("add scholership error", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-8 text-center">
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]"></div>
          <div className="relative mx-auto mb-3 h-16 w-16 overflow-hidden rounded-2xl bg-white shadow-lift ring-4 ring-white/30">
            <img src={Image} alt="SchoolHive" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            SchoolHive Scholarship
          </h2>
          <p className="text-sm font-medium text-brand-200">
            Biggest scholarship program
          </p>
        </div>

        <div className="space-y-8 p-6 md:p-8">
          {/* Applicant Details */}
          <section>
            <SectionTitle icon={User} title="Applicant Details" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="University Name">
                <input
                  type="text"
                  name="universityName"
                  className={`${inputClass} bg-slate-50 text-slate-500`}
                  defaultValue={scholarship?.universityName}
                  readOnly
                />
              </FormField>
              <FormField label="Village" required>
                <input
                  type="text"
                  name="applicantVillage"
                  className={inputClass}
                  required
                />
              </FormField>
              <FormField label="District" required>
                <input
                  type="text"
                  name="applicantDistrict"
                  className={inputClass}
                  required
                />
              </FormField>
              <FormField label="Country" required>
                <input
                  type="text"
                  name="applicantCountry"
                  className={inputClass}
                  required
                />
              </FormField>
            </div>
          </section>

          {/* Scholarship Information */}
          <section className="border-t border-slate-100 pt-8">
            <SectionTitle icon={GraduationCap} title="Scholarship Information" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Scholarship Type">
                <p className="rounded-xl bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-100">
                  {scholarship?.scholarshipCategory}
                </p>
              </FormField>
              <FormField label="Subject Category">
                <p className="rounded-xl bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-100">
                  {scholarship?.subjectName}
                </p>
              </FormField>
              <FormField label="Degree" required>
                <select
                  className={selectClass}
                  name="applyingDegree"
                  defaultValue="Diploma"
                  required
                >
                  <option disabled>Choose a Degree</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="masters">Masters</option>
                </select>
              </FormField>
              <FormField label="Gender" required>
                <select
                  className={selectClass}
                  name="applicantGender"
                  defaultValue="male"
                  required
                >
                  <option disabled>Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </FormField>
              <FormField label="SSC Result" hint="GPA on a 5.0 scale" required>
                <input
                  type="number"
                  name="SSCResult"
                  className={inputClass}
                  placeholder="GPA"
                  max={5}
                  onInput={(e) => {
                    if (e.target.value > 5) e.target.value = 5;
                  }}
                  required
                />
              </FormField>
              <FormField label="HSC Result" hint="GPA on a 5.0 scale" required>
                <input
                  type="number"
                  name="HSCResult"
                  className={inputClass}
                  placeholder="GPA"
                  max={5}
                  onInput={(e) => {
                    if (e.target.value > 5) e.target.value = 5;
                  }}
                  required
                />
              </FormField>
            </div>

            <div className="mt-4">
              <FormField label="Post Date">
                <div
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-500"
                  onClick={() => setPostDate(new Date())}
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="text-brand-500" />
                    {postDate ? format(postDate, "PPP") : "March 15, 2025"}
                  </span>
                  <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-600">
                    Today
                  </span>
                </div>
              </FormField>
            </div>
          </section>

          {/* Photo */}
          <section className="border-t border-slate-100 pt-8">
            <SectionTitle icon={Building2} title="Photo" />
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="shrink-0 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">
                Upload
              </span>
              <input
                type="file"
                name="universityImage"
                className="w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-none file:bg-brand-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                required
              />
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-slate-100 pt-8">
            <SectionTitle icon={User} title="Contact Info" />
            <FormField label="Phone Number" required>
              <input
                type="number"
                name="applicantNumber"
                className={inputClass}
                required
              />
            </FormField>
          </section>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-base font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Send className="h-4 w-4" />
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}
