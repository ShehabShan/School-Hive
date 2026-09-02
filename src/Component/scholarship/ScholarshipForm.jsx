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
  BadgeDollarSign,
  Link2,
  Eye,
  Save,
  EyeOff,
} from "lucide-react";
import FormField from "../ui/FormField";
import ChipInput from "../ui/ChipInput";
import FAQBuilder from "./FAQBuilder";
import { scholarshipSchema, defaultValues } from "../../lib/scholarshipSchema";

const STEPS = [
  { id: 1, title: "University", icon: Building2, desc: "Identity & location" },
  { id: 2, title: "Academic", icon: GraduationCap, desc: "Program details" },
  { id: 3, title: "Media", icon: ImageIcon, desc: "Gallery & story" },
  { id: 4, title: "Publish", icon: Sparkles, desc: "Timeline & fees" },
];

const inputBase = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:outline-none";
const inputError = "border-rose-300 focus:border-rose-400 focus:ring-rose-100";

function sanitizeText(s) {
  return String(s || "").replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/<[^>]*>?/gm, "").trim();
}

function ytEmbed(url) {
  if (!url) return null;
  try {
    const u = new URL(String(url));
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
  } catch {}
  return null;
}

export default function ScholarshipForm({
  initialValues,
  onSubmit,
  onDraft,
  submitLabel = "Publish Scholarship",
  imageRequired = true,
  previewImage,
}) {
  const [step, setStep] = useState(1);
  const [deadline, setDeadline] = useState(initialValues?.applicationDeadline ? new Date(initialValues.applicationDeadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [coverPreview, setCoverPreview] = useState(previewImage || null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDraft, setIsDraft] = useState(initialValues?.status === "draft");

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
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Cover image must be <5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Only images allowed");
      return;
    }
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    const valid = files.filter((f) => f.type.startsWith("image/") && f.size < 5 * 1024 * 1024);
    if (valid.length !== files.length) alert("Some files skipped — only images <5MB");
    setGalleryPreviews(valid.map((f) => URL.createObjectURL(f)));
  };

  const internalSubmit = async (data, draft = false) => {
    setUploading(true);
    try {
      const clean = {};
      Object.keys(data).forEach((k) => {
        if (typeof data[k] === "string") clean[k] = sanitizeText(data[k]);
        else clean[k] = data[k];
      });
      clean.applicationDeadline = format(deadline, "yyyy-MM-dd");
      clean.status = draft ? "draft" : "published";
      await onSubmit(clean, { coverPreview, galleryPreviews, deadline, isDraft: draft });
      if (draft && onDraft) await onDraft(clean);
    } finally {
      setUploading(false);
    }
  };

  const preview = {
    universityName: watched.universityName || "University Name",
    scholarshipCategory: watched.scholarshipCategory || "Partial",
    degree: watched.degree || "Masters",
    subjectName: watched.subjectName || "Subject",
    city: watched.city || "City",
    country: watched.country || "Country",
    amount: watched.applicationFees || "—",
  };

  const videoEmbed = ytEmbed(watched.videoUrl);

  return (
    <div className="mx-auto max-w-5xl">
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
              <p className="text-sm text-brand-100">Craft an opportunity that inspires future scholars — drafts save privately</p>
            </div>
          </div>
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

      <form onSubmit={handleSubmit((d) => internalSubmit(d, isDraft))} className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
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
                    <FormField label="Eligibility" hint="Press Enter to add — no commas needed">
                      <ChipInput value={watched.eligibility} onChange={(v) => setValue("eligibility", v)} placeholder="GPA 3.0+ then Enter" />
                    </FormField>
                    <FormField label="Benefits" hint="Enter to add each benefit">
                      <ChipInput value={watched.benefits} onChange={(v) => setValue("benefits", v)} placeholder="Full tuition then Enter" />
                    </FormField>
                    <FormField label="Tags" hint="STEM, merit — Enter per tag">
                      <ChipInput value={watched.tags} onChange={(v) => setValue("tags", v)} placeholder="STEM then Enter" />
                    </FormField>
                    <div className="md:col-span-2">
                      <FormField label="Description" required error={errors.scholarshipDescription?.message}>
                        <textarea {...register("scholarshipDescription")} className={`min-h-[120px] w-full rounded-xl border border-slate-200 bg-white p-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 ${errors.scholarshipDescription ? "border-rose-300" : ""}`} placeholder="Describe eligibility, benefits, and what makes this scholarship special..." maxLength={2000} />
                        <p className="mt-1 text-xs text-slate-400">{(watched.scholarshipDescription || "").length}/2000 • Scripts auto-removed</p>
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

                  <FormField label="Cover Photo" required={imageRequired} hint={imageRequired ? "Required — also gallery fallback • <5MB, preview below" : "Leave empty to keep current"}>
                    <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
                      <span className="hidden sm:inline-flex rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200"><Upload className="mr-1.5 inline h-4 w-4" />Upload</span>
                      <input type="file" name="universityImage" accept="image/*" onChange={handleCoverChange} className="w-full text-sm file:mr-3 file:rounded-lg file:border-none file:bg-brand-600 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white" required={imageRequired} />
                    </div>
                    {coverPreview ? <img src={coverPreview} alt="preview" className="mt-3 h-48 w-full rounded-xl object-cover ring-1 ring-slate-200" onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=No+Image")} /> : <p className="mt-2 text-xs text-slate-500">Preview appears here after selecting • Auto-validated &lt;5MB</p>}
                  </FormField>

                  <FormField label="Gallery (up to 5)" hint="PNG/JPG • previews below, remove anytime">
                    <input type="file" name="galleryFiles" accept="image/*" multiple onChange={handleGalleryChange} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm file:mr-3 file:rounded-lg file:border-none file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white" />
                  </FormField>
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {galleryPreviews.map((src, i) => (
                        <div key={i} className="relative">
                          <img src={src} className="h-24 w-full rounded-xl object-cover ring-1 ring-slate-200" onError={(e) => (e.currentTarget.src = "https://placehold.co/300x200?text=No")} />
                          <button type="button" onClick={() => setGalleryPreviews((p) => p.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 rounded-full bg-white p-1 shadow"><span className="text-xs">×</span></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormField label="Gallery URLs fallback" hint="comma-separated https (used if no files)">
                    <input {...register("galleryUrls")} className={inputBase} placeholder="https://..., https://..." />
                  </FormField>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField label="Video URL" hint="YouTube — preview below" error={errors.videoUrl?.message}>
                      <div className="relative"><Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input {...register("videoUrl")} className={`${inputBase} pl-10`} placeholder="https://youtube.com/watch?v=..." /></div>
                      {videoEmbed && (
                        <div className="mt-2 overflow-hidden rounded-xl ring-1 ring-slate-200">
                          <iframe src={videoEmbed} title="preview" className="h-40 w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        </div>
                      )}
                      {!videoEmbed && watched.videoUrl && <p className="mt-1 text-xs text-rose-500">Invalid YouTube URL — use youtu.be or youtube.com/watch?v=</p>}
                    </FormField>
                    <FormField label="Video Poster" hint="Thumbnail" error={errors.videoPoster?.message}><input {...register("videoPoster")} className={inputBase} placeholder="https://..." /></FormField>
                    <FormField label="Brochure URL" hint="PDF link" error={errors.brochureUrl?.message}><input {...register("brochureUrl")} className={inputBase} placeholder="https://..." /></FormField>
                    <FormField label="Map URL" hint="Google maps" error={errors.mapUrl?.message}><div className="relative"><MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input {...register("mapUrl")} className={`${inputBase} pl-10`} placeholder="https://maps.google.com/..." /></div></FormField>
                  </div>

                  <FormField label="Highlights" hint="Enter to add each"><ChipInput value={watched.highlights} onChange={(v) => setValue("highlights", v)} placeholder="Fully funded then Enter" /></FormField>
                  <FormField label="Documents" hint="Transcript, SOP, LOR"><ChipInput value={watched.documents} onChange={(v) => setValue("documents", v)} placeholder="Transcript then Enter" /></FormField>
                  <FormField label="Requirements" hint="GPA 3.0+, IELTS 6.5"><ChipInput value={watched.requirements} onChange={(v) => setValue("requirements", v)} placeholder="GPA 3.0+ then Enter" /></FormField>
                  <FormField label="FAQs" hint="Add Q&A — JSON not needed">
                    <FAQBuilder value={watched.faqs} onChange={(v) => setValue("faqs", v)} />
                  </FormField>
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
                      <ShieldCheck className="h-4 w-4 text-emerald-600" /> Total = service + application • Preview: <span className="font-bold text-slate-900">${Number(watched.serviceCharge || 0) + Number(watched.applicationFees || 0)}</span>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <input type="checkbox" checked={isDraft} onChange={(e) => setIsDraft(e.target.checked)} className="h-5 w-5 rounded border-amber-300 text-brand-600 focus:ring-brand-500" />
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-bold text-amber-900"><Save className="h-4 w-4" /> Save as draft</p>
                      <p className="text-xs text-amber-700">Drafts are private — only you & superadmin see them until you publish</p>
                    </div>
                  </label>

                  <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600 ring-1 ring-slate-100">
                    <Eye className="h-4 w-4 shrink-0 text-slate-400" /> <span><b>Draft</b> saves to DB with <code className="rounded bg-white px-1.5 py-0.5 ring-1 ring-slate-200">status:draft</code> — invisible to public. <b>Publish</b> sets <code className="rounded bg-white px-1.5 py-0.5 ring-1 ring-slate-200">status:published</code> and appears in catalog.</span>
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
              <div className="flex gap-2">
                <button type="button" onClick={handleSubmit((d) => internalSubmit(d, true))} disabled={isSubmitting || uploading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                  {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" /> : <Save className="h-4 w-4" />}Save Draft
                </button>
                <button type="button" onClick={handleSubmit((d) => internalSubmit(d, false))} disabled={isSubmitting || uploading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-sm font-bold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60">
                  {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Sparkles className="h-4 w-4" />}{submitLabel}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.75rem] bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Eye className="h-4 w-4 text-brand-600" /> Live Preview</h4>
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="h-28 w-full bg-slate-100">
                {coverPreview ? <img src={coverPreview} alt="cover" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-600 to-indigo-800 p-4 text-white"><p className="text-xs">Cover preview</p></div>}
              </div>
              <div className="bg-gradient-to-br from-brand-600 to-indigo-800 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-200">{preview.scholarshipCategory} • {preview.degree}</p>
                <h5 className="mt-1 line-clamp-1 text-lg font-extrabold">{preview.universityName}</h5>
                <p className="line-clamp-1 text-sm text-brand-100">{preview.subjectName} • {preview.city}, {preview.country}</p>
              </div>
              <div className="p-4">
                <p className="line-clamp-2 text-sm text-slate-600">{watched.scholarshipDescription?.slice(0, 120) || "Description will appear here..."}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(String(watched.tags || "").split(",").map(s=>s.trim()).filter(Boolean).slice(0,2) || []).map(t=> <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}
                  {(String(watched.eligibility || "").split(",").map(s=>s.trim()).filter(Boolean).slice(0,1) || []).map(e=> <span key={e} className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700 ring-1 ring-amber-100">{e}</span>)}
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-extrabold text-brand-600">${preview.amount} fee</span>
                  <span className="text-xs text-slate-400">{watched.stipend ? `$${watched.stipend} stipend` : "No stipend"}</span>
                </div>
                {galleryPreviews.length > 0 && <div className="mt-3 grid grid-cols-3 gap-1.5">{galleryPreviews.map((src,i)=><img key={i} src={src} className="h-14 rounded-lg object-cover ring-1 ring-slate-200" />)}</div>}
                {isDraft && <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-200"><EyeOff className="h-3 w-3" /> Draft — private</span>}
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
              <li>Press <b>Enter</b> to add each chip — no commas to guess</li>
              <li>FAQs use <b>Add</b> button — no JSON</li>
              <li>Video: paste YouTube link to see embed</li>
              <li>Draft saves with <code>status:draft</code> until you publish</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
