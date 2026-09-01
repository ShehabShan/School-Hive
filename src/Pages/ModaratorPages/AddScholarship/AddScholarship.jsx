import { useState } from "react";
import { format } from "date-fns";
import { FaCalendarAlt, FaGraduationCap, FaUniversity, FaPaperPlane, FaMoneyBillWave, FaImage } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "../../../assist/add-data.png";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
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

export default function AddScholarship() {
  const [postDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const [submitting, setSubmitting] = useState(false);

  const handleCalendarToggle = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const formData = new FormData(e.target);
    const initialData = Object.fromEntries(formData.entries());
    const universityImage = formData.get("universityImage");

    if (universityImage?.name) {
      const imageFile = { image: universityImage };
      try {
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        initialData.universityImage = res.data.data.url;
      } catch {
        toast.error("Image upload failed. Try again.");
        setSubmitting(false);
        return;
      }
    } else {
      initialData.universityImage = Image;
    }

    const formattedPostDate = format(postDate, "yyyy-MM-dd");
    const formattedDate = format(date, "yyyy-MM-dd");

    initialData.postDate = formattedPostDate;
    initialData.applicationDeadline = formattedDate;
    initialData.email = user?.email;
    initialData.rating = 0;
    initialData.Feedback = "";
    // new optional fields
    initialData.currency = formData.get("currency") || "USD";
    initialData.duration = formData.get("duration") || null;
    initialData.eligibility = String(formData.get("eligibility") || "").split(",").map((s) => s.trim()).filter(Boolean);
    initialData.benefits = String(formData.get("benefits") || "").split(",").map((s) => s.trim()).filter(Boolean);
    initialData.tags = String(formData.get("tags") || "").split(",").map((s) => s.trim()).filter(Boolean);

    try {
      const { data } = await axiosSecure.post("/allScholership", initialData);
      if (data.data?.insertedId || data.insertedId) {
        toast.success("Scholarship added successfully!");
        e.target.reset();
      } else {
        toast.success("Scholarship submitted!");
        e.target.reset();
      }
    } catch {
      toast.error("Failed to add scholarship.");
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
        {/* Header */}
        <div className="relative bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-8 text-center">
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]" />
          <div className="relative mx-auto mb-3 h-16 w-16 overflow-hidden rounded-2xl bg-white shadow-lift ring-4 ring-white/30">
            <img src={Image} alt="Scholarship" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Add Scholarship</h2>
          <p className="text-sm font-medium text-brand-200">Create a new opportunity for future scholars</p>
        </div>

        <div className="space-y-8 p-6 md:p-8">
          {/* University Information */}
          <section>
            <SectionTitle icon={FaUniversity} title="University Details" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="University Name" required>
                <input type="text" name="universityName" className={inputClass} placeholder="Oxford University" required />
              </FormField>
              <FormField label="Scholarship Name" required>
                <input
                  type="text"
                  name="scholarshipName"
                  className={inputClass}
                  placeholder="Computer Science Undergraduate"
                  required
                />
              </FormField>
              <FormField label="Country" required>
                <input type="text" name="country" className={inputClass} placeholder="United Kingdom" required />
              </FormField>
              <FormField label="City" required>
                <input type="text" name="city" className={inputClass} placeholder="Oxford" required />
              </FormField>
              <FormField label="University World Rank" hint="e.g. 1-1000" required>
                <input type="number" name="universityWorldrank" className={inputClass} placeholder="5" required />
              </FormField>
              <FormField label="Annual Stipend" hint="USD per year">
                <input type="number" name="stipend" className={inputClass} placeholder="15000" />
              </FormField>
            </div>
          </section>

          {/* Scholarship Information */}
          <section className="border-t border-slate-100 pt-8">
            <SectionTitle icon={FaGraduationCap} title="Scholarship Information" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Scholarship Category" required>
                <select className={selectClass} name="scholarshipCategory" defaultValue="Partial" required>
                  <option disabled>Scholarship Type</option>
                  <option value="Partial">Partial</option>
                  <option value="Full-fund">Full-fund</option>
                  <option value="Self-fund">Self-fund</option>
                </select>
              </FormField>
              <FormField label="Subject Category" required>
                <select className={selectClass} name="subjectName" defaultValue="Agriculture" required>
                  <option disabled>Choose subject</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </FormField>
              <FormField label="Degree" required>
                <select className={selectClass} name="degree" defaultValue="Diploma" required>
                  <option disabled>Choose degree</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>
              </FormField>
              <FormField label="Currency">
                <select className={selectClass} name="currency" defaultValue="USD">
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>
              </FormField>
              <FormField label="Duration" hint="e.g. 4 years, 12 months">
                <input type="text" name="duration" className={inputClass} placeholder="4 years" />
              </FormField>
              <FormField label="Eligibility" hint="Comma separated: GPA 3.0+, IELTS 6.5">
                <input type="text" name="eligibility" className={inputClass} placeholder="GPA 3.0+, IELTS 6.5" />
              </FormField>
              <FormField label="Benefits" hint="Comma separated: Tuition, Stipend $1200/mo">
                <input type="text" name="benefits" className={inputClass} placeholder="Full tuition, Stipend" />
              </FormField>
              <FormField label="Tags" hint="Comma separated: STEM, merit">
                <input type="text" name="tags" className={inputClass} placeholder="STEM, merit, 2026" />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Scholarship Description" required>
                  <textarea
                    name="scholarshipDescription"
                    className="min-h-[112px] w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    placeholder="Briefly describe eligibility, benefits, and perks..."
                    required
                  />
                </FormField>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FormField label="Post Date">
                <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-brand-500" />
                    {format(postDate, "PPP")}
                  </span>
                  <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-600">Today</span>
                </div>
              </FormField>
              <FormField label="Application Deadline" required>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-500"
                  onClick={handleCalendarToggle}
                >
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-brand-500" />
                    {format(date, "PPP")}
                  </span>
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
                    Pick
                  </span>
                </button>
                {isCalendarVisible && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
                    <DatePicker selected={date} onChange={(d) => setDate(d)} minDate={new Date()} dateFormat="PPP" inline />
                  </div>
                )}
              </FormField>
            </div>
          </section>

          {/* Photo */}
          <section className="border-t border-slate-100 pt-8">
            <SectionTitle icon={FaImage} title="Cover Photo" />
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="shrink-0 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">Upload</span>
              <input
                type="file"
                name="universityImage"
                accept="image/*"
                className="w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-none file:bg-brand-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                required
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">PNG, JPG up to 5MB. Will be hosted on imgbb.</p>
          </section>

          {/* Fees Information */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
            <SectionTitle icon={FaMoneyBillWave} title="Fees Breakdown" />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Service Charge" hint="Platform fee" required>
                <input type="number" name="serviceCharge" className={inputClass} placeholder="50" required />
              </FormField>
              <FormField label="Application Fees" hint="Payable by applicant" required>
                <input type="number" name="applicationFees" className={inputClass} placeholder="100" required />
              </FormField>
            </div>
          </section>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-base font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60"
          >
            <FaPaperPlane className="h-4 w-4" />
            {submitting ? "Publishing..." : "Publish Scholarship"}
          </button>
        </div>
      </form>
    </div>
  );
}
