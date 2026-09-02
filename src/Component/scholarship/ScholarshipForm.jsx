import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  MapPin,
  Lightbulb,
  ShieldCheck,
  Clock,
  BadgeDollarSign,
  Link2,
  Eye,
} from "lucide-react";
import FormField from "../ui/FormField";
import { scholarshipSchema, defaultValues } from "../../lib/scholarshipSchema";

const STEPS = [
  { id: 1, title: "University", icon: Building2, desc: "Identity & location" },
  { id: 2, title: "Academic", icon: GraduationCap, desc: "Program details" },
  { id: 3, title: "Media", icon: ImageIcon, desc: "Gallery & story" },
  { id: 4, title: "Publish", icon: Sparkles, desc: "Timeline & fees" },
];

const inputBase = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none";
const inputError = "border-rose-300 focus:border-rose-400 focus:ring-rose-100";

export default function ScholarshipForm({
  initialValues,
  onSubmit,
  submitLabel = "Publish Scholarship",
  imageRequired = true,
  previewImage,
}) {
  const [step, setStep] = useState(1);
  const [deadline, setDeadline] = useState(initialValues?.applicationDeadline ? new Date(initialValues.applicationDeadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [coverPreview, setCoverPreview] = useState(previewImage || null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: { ...defaultValues, ...initialValues },
    mode: "onBlur",
  });

  const watched = watch();

  useEffect(() => {
    setValue("applicationDeadline", format(deadline, "yyyy-MM-dd"));
  }, [deadline, setValue]);

  const nextStep = async () => {
    const fieldsByStep = {
      1: ["universityName", "scholarshipName", "country", "city", "universityWorldrank"],
      2: ["scholarshipCategory", "subjectName", "degree", "scholarshipDescription"],
      3: [],
      4: ["applicationDeadline", "serviceCharge", "applicationFees"],
    };
    const ok = await trigger(fieldsByStep[step]);
    if (ok) setStep((s) => Math.min(4, s + 1));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const internalSubmit = async (data) => {
    setUploading(true);
    try {
      // deadline from state overrides
      data.applicationDeadline = format(deadline, "yyyy-MM-dd");
      // files are handled by parent via FormData, but we pass data + handle imgbb here for preview convenience
      // parent will do actual imgbb upload using FormData from form element — we emulate by passing files
      await onSubmit(data, { coverPreview, galleryPreviews, deadline });
    } finally {
      setUploading(false);
    }
  };

  // derived preview
  const preview = {
    universityName: watched.universityName || "University Name",
    scholarshipCategory: watched.scholarshipCategory || "Partial",
    degree: watched.degree || "Masters",
    subjectName: watched.subjectName || "Subject",
    city: watched.city || "City",
    country: watched.country || "Country",
    amount: watched.applicationFees || "—",
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header with stepper */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 p-8 text-white shadow-lift">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:24px_24px] opacity-10" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-soft">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{submitLabel}</h1>
              <p className="text-sm text-brand-100">Craft an opportunity that inspires future scholars</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-8 grid grid-cols-4 gap-3">
            {STEPS.map((s) => {
              const active = step === s.id;
              const done = step > s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`relative flex flex-col items-start gap-2 rounded-2xl border px-4 py-4 text-left transition-all ${
                    active ? "bg-white text-slate-900 shadow-soft border-white" : done ? "bg-white/15 text-white border-white/20 backdrop-blur" : "bg-white/10 text-white/80 border-white/15"
                  }`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-brand-600 text-white" : done ? "bg-emerald-500 text-white" : "bg-white/20 text-white"}`}>
                    {done ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                  </span>
                  <span className="text-sm font-bold leading-none">{s.title}</span>
                  <span className={`text-xs ${active ? "text-slate-500" : "text-white/70"}`}>{s.desc}</span>
                  {active && <motion.div layoutId="step-indicator" className="absolute inset-0 -z-10 rounded-2xl bg-white" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(internalSubmit)} className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main form */}
        <div className="rounded-[1.75rem] bg-white p-6 shadow-soft ring-1 ring-slate-100 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
            >
              {step === 1 && (
                <section className="space-y-5">
                  <h3 className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Building2 className="h-4 w-4" /></span> University Identity
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField label="University Name" required error={errors.universityName?.message}>
                      <input {...register("universityName")} className={`${inputBase} ${errors.universityName ? inputError : ""}`} placeholder="University of Oxford" />
                    </FormField>
                    <FormField label="Scholarship Title" hint="e.g. Clarendon Fund" error={errors.scholarshipName?.message}>
                      <input {...register("scholarshipName")} className={inputBase} placeholder="Computer Science Undergraduate" />
                    </FormField>
                    <FormField label="Country" required error={errors.country?.message}>
                      <input {...register("country")} className={`${inputBase} ${errors.country ? inputError : ""}`} placeholder="United Kingdom" />
                    </FormField>
                    <FormField label="City" required error={errors.city?.message}>
                      <input {...register("city")} className={`${inputBase} ${errors.city ? inputError : ""}`} placeholder="Oxford" />
                    </FormField>
                    <FormField label="World Rank" required hint="1-1000" error={errors.universityWorldrank?.message}>
                      <input type="number" {...register("universityWorldrank")} className={`${inputBase} ${errors.universityWorldrank ? inputError : ""}`} placeholder="5" />
                    </FormField>
                    <FormField label="Annual Stipend" hint="Leave empty if none" error={errors.stipend?.message}>
                      <input type="number" {...register("stipend")} className={inputBase} placeholder="15000" />
                    </FormField>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className="space-y-5">
                  <h3 className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><BookOpen className="h-4 w-4" /></span> Academic Details
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField label="Category" required error={errors.scholarshipCategory?.message}>
                      <select {...register("scholarshipCategory")} className={`${inputBase} ${errors.scholarshipCategory ? inputError : ""}`}>
                        <option value="Partial">Partial</option>
                        <option value="Full-fund">Full-fund</option>
                        <option value="Self-fund">Self-fund</option>
                      </select>
                    </FormField>
                    <FormField label="Subject" required error={errors.subjectName?.message}>
                      <input {...register("subjectName")} list="subjects" className={`${inputBase} ${errors.subjectName ? inputError : ""}`} placeholder="Agriculture / Engineering / Doctor" />
                      <datalist id="subjects"><option value="Agriculture" /><option value="Engineering" /><option value="Doctor" /><option value="Computer Science" /><option value="Business" /></datalist>
                    </FormField>
                    <FormField label="Degree" required>
                      <select {...register("degree")} className={inputBase}><option>Diploma</option><option>Bachelor</option><option>Masters</option><option>PhD</option></select>
                    </FormField>
                    <FormField label="Currency">
                      <select {...register("currency")} className={inputBase}><option>USD</option><option>GBP</option><option>EUR</option></select>
                    </FormField>
                    <FormField label="Duration" hint="4 years, 12 months">
                      <input {...register("duration")} className={inputBase} placeholder="4 years" />
                    </FormField>
                    <FormField label="Eligibility" hint="comma separated">
                      <input {...register("eligibility")} className={inputBase} placeholder="GPA 3.0+, IELTS 6.5" />
                    </FormField>
                    <FormField label="Benefits" hint="comma separated">
                      <input {...register("benefits")} className={inputBase} placeholder="Tuition, Stipend" />
                    </FormField>
                    <FormField label="Tags" hint="STEM, merit">
                      <input {...register("tags")} className={inputBase} placeholder="STEM, merit, 2026" />
                    </FormField>
                    <div className="md:col-span-2">
                      <FormField label="Description" required error={errors.scholarshipDescription?.message}>
                        <textarea {...register("scholarshipDescription")} className={`min-h-[120px] w-full rounded-xl border border-slate-200 bg-white p-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 ${errors.scholarshipDescription ? "border-rose-300" : ""}`} placeholder="Describe eligibility, benefits, and what makes this scholarship special..." />
                      </FormField>
                    </div>
                  </div>
                </section>
              )}

              {step === 3 && (
                <section className="space-y-5">
                  <h3 className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><ImageIcon className="h-4 w-4" /></span> Media & Story
                  </h3>

                  <FormField label="Cover Photo" required={imageRequired} hint={imageRequired ? "Required — also gallery fallback" : "Leave empty to keep current"} error={errors.universityImage?.message}>
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
                      <span className="hidden sm:inline-flex rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200"><Upload className="mr-1.5 inline h-4 w-4" />Upload</span>
                      <input type="file" name="universityImage" accept="image/*" onChange={handleCoverChange} className="w-full text-sm file:mr-3 file:rounded-lg file:border-none file:bg-brand-600 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white" required={imageRequired} />
                    </div>
                    {coverPreview && <img src={coverPreview} alt="preview" className="mt-3 h-40 w-full rounded-xl object-cover ring-1 ring-slate-200" />}
                  </FormField>

                  <FormField label="Gallery (up to 5)" hint="PNG/JPG">
                    <input type="file" name="galleryFiles" accept="image/*" multiple onChange={handleGalleryChange} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm file:mr-3 file:rounded-lg file:border-none file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white" />
                  </FormField>
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {galleryPreviews.map((src, i) => <img key={i} src={src} className="h-24 rounded-xl object-cover ring-1 ring-slate-200" />)}
                    </div>
                  )}
                  <FormField label="Gallery URLs fallback" hint="comma-separated https">
                    <input {...register("galleryUrls")} className={inputBase} placeholder="https://..., https://..." />
                  </FormField>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField label="Video URL" error={errors.videoUrl?.message}><div className="relative"><Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input {...register("videoUrl")} className={`${inputBase} pl-10`} placeholder="https://youtube.com/watch?v=..." /></div></FormField>
                    <FormField label="Video Poster" error={errors.videoPoster?.message}><input {...register("videoPoster")} className={inputBase} placeholder="https://..." /></FormField>
                    <FormField label="Brochure URL" error={errors.brochureUrl?.message}><input {...register("brochureUrl")} className={inputBase} placeholder="https://..." /></FormField>
                    <FormField label="Map URL" error={errors.mapUrl?.message}><div className="relative"><MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input {...register("mapUrl")} className={`${inputBase} pl-10`} placeholder="https://maps.google.com/..." /></div></FormField>
                  </div>

                  <FormField label="Highlights" hint="3 bullets above fold"><input {...register("highlights")} className={inputBase} placeholder="Fully funded, 4 years, Starts Sep 2026" /></FormField>
                  <FormField label="Documents" hint="Transcript, SOP, LOR"><input {...register("documents")} className={inputBase} placeholder="Transcript, SOP, LOR, IELTS" /></FormField>
                  <FormField label="Requirements" hint="GPA 3.0+, IELTS 6.5"><input {...register("requirements")} className={inputBase} placeholder="GPA 3.0+, IELTS 6.5" /></FormField>
                  <FormField label="FAQs" hint='JSON or q=>a | q=>a'><textarea {...register("faqs")} className="min-h-[90px] w-full rounded-xl border border-slate-200 bg-white p-3 text-sm" placeholder='[{"q":"Who?","a":"..."}] or Who?=>Answer | When?=>Date' /></FormField>
                </section>
              )}

              {step === 4 && (
                <section className="space-y-5">
                  <h3 className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Calendar className="h-4 w-4" /></span> Timeline & Fees
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField label="Post Date">
                      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-brand-500" />{format(new Date(), "PPP")}</span>
                        <span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">Today</span>
                      </div>
                    </FormField>
                    <FormField label="Application Deadline" required error={errors.applicationDeadline?.message}>
                      <input type="hidden" {...register("applicationDeadline")} value={format(deadline, "yyyy-MM-dd")} />
                      <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-soft">
                        <DatePicker selected={deadline} onChange={(d) => { setDeadline(d); setValue("applicationDeadline", format(d, "yyyy-MM-dd")); }} minDate={new Date()} inline />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">Selected: <span className="font-semibold text-slate-700">{format(deadline, "PPP")}</span> — {Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24))} days left</p>
                    </FormField>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                    <h4 className="mb-3 flex items-center gap-2 font-bold text-slate-800"><BadgeDollarSign className="h-5 w-5 text-brand-600" /> Fees Breakdown</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField label="Service Charge" required hint="Platform fee" error={errors.serviceCharge?.message}>
                        <div className="relative"><DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="number" {...register("serviceCharge")} className={`${inputBase} pl-10 ${errors.serviceCharge ? inputError : ""}`} placeholder="50" /></div>
                      </FormField>
                      <FormField label="Application Fees" required hint="Payable by applicant" error={errors.applicationFees?.message}>
                        <div className="relative"><BadgeDollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="number" {...register("applicationFees")} className={`${inputBase} pl-10 ${errors.applicationFees ? inputError : ""}`} placeholder="100" /></div>
                      </FormField>
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-white p-3 text-xs text-slate-600 ring-1 ring-slate-100">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" /> Total applicant cost = service charge + application fee • Refund policy visible on details page
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-100">
                    <Clock className="h-4 w-4" /> Draft autosaves locally — review before publishing
                  </div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button type="button" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting || uploading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-sm font-bold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60">
                {isSubmitting || uploading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Sparkles className="h-4 w-4" />}{submitLabel}
              </button>
            )}
          </div>
        </div>

        {/* Live preview sidebar */}
        <div className="space-y-4">
          <div className="rounded-[1.75rem] bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Eye className="h-4 w-4 text-brand-600" /> Live Preview</h4>
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="h-36 bg-gradient-to-br from-brand-600 to-indigo-800 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-200">{preview.scholarshipCategory} • {preview.degree}</p>
                <h5 className="mt-1 line-clamp-1 text-lg font-extrabold">{preview.universityName}</h5>
                <p className="line-clamp-1 text-sm text-brand-100">{preview.subjectName} • {preview.city}, {preview.country}</p>
              </div>
              <div className="p-4">
                <p className="line-clamp-2 text-sm text-slate-600">{watched.scholarshipDescription?.slice(0, 120) || "Description will appear here..."}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-extrabold text-brand-600">${preview.amount} fee</span>
                  <span className="text-xs text-slate-400">{watched.stipend ? `$${watched.stipend} stipend` : "No stipend"}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"><p className="font-bold text-slate-900">{watched.universityWorldrank || "—"}</p><p className="text-slate-500">Rank</p></div>
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"><p className="font-bold text-slate-900">{watched.degree || "—"}</p><p className="text-slate-500">Degree</p></div>
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"><p className="font-bold text-slate-900">{watched.currency || "USD"}</p><p className="text-slate-500">Currency</p></div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 ring-1 ring-amber-100">
            <h5 className="flex items-center gap-2 text-sm font-bold text-amber-900"><Lightbulb className="h-4 w-4" /> Tips</h5>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-amber-800">
              <li>Use high-res cover (1200×800) — also gallery fallback</li>
              <li>Keep title under 60 chars for cards</li>
              <li>Set deadline 30+ days out for visibility</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
