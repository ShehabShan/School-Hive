import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FaCalendarAlt, FaGraduationCap, FaUniversity, FaPaperPlane, FaMoneyBillWave, FaImage } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "../../../assist/add-data.png";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import toast from "react-hot-toast";
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

export default function EditScholarship() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState({});
  const [postDate, setPostDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axiosPublic.get(`/allScholership/${id}`).then((res) => {
      const data = res.data.data || res.data;
      setScholarship(data);
      if (data.postDate) setPostDate(new Date(data.postDate));
      if (data.applicationDeadline) setDate(new Date(data.applicationDeadline));
    });
  }, [id, axiosPublic]);

  const handleCalendarToggle = () => setIsCalendarVisible(!isCalendarVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const formData = new FormData(e.target);
    const initialData = Object.fromEntries(formData.entries());
    const universityImage = formData.get("universityImage");

    if (!universityImage?.name) {
      delete initialData.universityImage;
    }

    if (universityImage?.name) {
      const imageFile = { image: universityImage };
      try {
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        initialData.universityImage = res.data.data.url;
      } catch {
        toast.error("Image upload failed.");
        setSubmitting(false);
        return;
      }
    }

    initialData.postDate = format(postDate, "yyyy-MM-dd");
    initialData.applicationDeadline = format(date, "yyyy-MM-dd");

    try {
      const { data } = await axiosPublic.patch(`/allScholership/${id}`, initialData);
      if (data.data?.modifiedCount > 0 || data.modifiedCount > 0) {
        toast.success("Scholarship updated!");
        navigate("/modaratorDashboard/manageScholarships");
      } else {
        toast.success("No changes detected.");
        navigate("/modaratorDashboard/manageScholarships");
      }
    } catch {
      toast.error("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100"
      >
        <div className="relative bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-8 text-center">
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]" />
          <div className="relative mx-auto mb-3 h-16 w-16 overflow-hidden rounded-2xl bg-white shadow-lift ring-4 ring-white/30">
            <img src={scholarship?.universityImage || Image} alt="University" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Edit Scholarship</h2>
          <p className="text-sm font-medium text-brand-200">{scholarship?.universityName || "Update scholarship details"}</p>
        </div>

        <div className="space-y-8 p-6 md:p-8">
          <section>
            <SectionTitle icon={FaUniversity} title="University Details" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="University Name" required>
                <input type="text" name="universityName" defaultValue={scholarship?.universityName} className={inputClass} required />
              </FormField>
              <FormField label="Subject" required>
                <input type="text" name="subjectName" defaultValue={scholarship?.subjectName} className={inputClass} required />
              </FormField>
              <FormField label="Country" required>
                <input type="text" name="country" defaultValue={scholarship?.country} className={inputClass} required />
              </FormField>
              <FormField label="City" required>
                <input type="text" name="city" defaultValue={scholarship?.city} className={inputClass} required />
              </FormField>
              <FormField label="University World Rank" required>
                <input type="number" name="universityWorldrank" defaultValue={scholarship?.universityWorldrank} className={inputClass} required />
              </FormField>
              <FormField label="Annual Stipend">
                <input type="number" name="stipend" defaultValue={scholarship?.stipend} className={inputClass} placeholder="15000" />
              </FormField>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-8">
            <SectionTitle icon={FaGraduationCap} title="Scholarship Information" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Scholarship Category" required>
                <select
                  className={selectClass}
                  name="scholarshipCategory"
                  value={scholarship?.scholarshipCategory || "Partial"}
                  onChange={(e) => setScholarship((s) => ({ ...s, scholarshipCategory: e.target.value }))}
                  required
                >
                  <option value="Partial">Partial</option>
                  <option value="Full-fund">Full-fund</option>
                  <option value="Self-fund">Self-fund</option>
                </select>
              </FormField>
              <FormField label="Subject Category">
                <select
                  className={selectClass}
                  name="subjectName2"
                  defaultValue={scholarship?.subjectName}
                  disabled
                >
                  <option>{scholarship?.subjectName || "Subject"}</option>
                </select>
                <p className="mt-1 text-xs text-slate-400">Subject is also above — keep them in sync.</p>
              </FormField>
              <FormField label="Degree" required>
                <select
                  className={selectClass}
                  name="degree"
                  value={scholarship?.degree || "Diploma"}
                  onChange={(e) => setScholarship((s) => ({ ...s, degree: e.target.value }))}
                  required
                >
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="masters">Masters</option>
                </select>
              </FormField>
              <FormField label="Scholarship Description" className="md:col-span-2">
                <textarea
                  name="scholarshipDescription"
                  defaultValue={scholarship?.scholarshipDescription}
                  className="min-h-[112px] w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  placeholder="Briefly describe eligibility and benefits..."
                />
              </FormField>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FormField label="Post Date">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-brand-300"
                  onClick={() => setPostDate(new Date())}
                >
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-brand-500" />
                    {format(postDate, "PPP")}
                  </span>
                  <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-600">Today</span>
                </button>
              </FormField>
              <FormField label="Application Deadline" required>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-brand-300"
                  onClick={handleCalendarToggle}
                >
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-brand-500" />
                    {format(date, "PPP")}
                  </span>
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-100">Pick</span>
                </button>
                {isCalendarVisible && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
                    <DatePicker selected={date} onChange={(d) => setDate(d)} minDate={new Date()} dateFormat="PPP" inline />
                  </div>
                )}
              </FormField>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-8">
            <SectionTitle icon={FaImage} title="Cover Photo" />
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="shrink-0 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">Upload</span>
              <input
                type="file"
                name="universityImage"
                accept="image/*"
                className="w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-none file:bg-brand-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">Leave empty to keep the current image.</p>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
            <SectionTitle icon={FaMoneyBillWave} title="Fees Breakdown" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Service Charge" required>
                <input type="number" name="serviceCharge" defaultValue={scholarship?.serviceCharge} className={inputClass} required />
              </FormField>
              <FormField label="Application Fees" required>
                <input type="number" name="applicationFees" defaultValue={scholarship?.applicationFees} className={inputClass} required />
              </FormField>
            </div>
          </section>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-base font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60"
          >
            <FaPaperPlane className="h-4 w-4" />
            {submitting ? "Saving..." : "Update Scholarship"}
          </button>
        </div>
      </form>
    </div>
  );
}
