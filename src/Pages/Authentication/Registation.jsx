import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ImageIcon,
  ArrowRight,
  Sparkles,
  Globe2,
  Rocket,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Landmark,
  MapPin,
  Link2,
  FileText,
  Upload,
  Check,
  X,
} from "lucide-react";
import bgImg from "../../assist/image/register.webp";
import bgImgFallback from "../../assist/image/register.jpg";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import SocialLogin from "./SocialLogin";
import { friendlyAuthError } from "../../lib/friendlyAuthError";
import { optimizeImage, formatBytes } from "../../lib/optimizeImage";

const roleTabs = [
  { id: "student", label: "Student", icon: GraduationCap, desc: "Apply to scholarships & save your favorites" },
  { id: "institution", label: "Institution", icon: Building2, desc: "Universities, colleges & schools post scholarships" },
];

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Registration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accountType, setAccountType] = useState("student");
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [studentPhotoPreview, setStudentPhotoPreview] = useState(null);
  const [studentPhotoUrl, setStudentPhotoUrl] = useState("");
  const [instLogoPreview, setInstLogoPreview] = useState(null);
  const [instLogoUrl, setInstLogoUrl] = useState("");
  const { createUser, updateUserProfile, setUser } = useAuth();
  const axiosPublic = useAxiosPublic();
  const from = location?.state?.from?.pathname || location?.state || "/";

  const handleImageSelect = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    if (!image_hosting_key) {
      toast.error("Image hosting not configured (VITE_IMAGE_HOSTING_KEY missing)");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    if (target === "institution") setInstLogoPreview(previewUrl);
    else setStudentPhotoPreview(previewUrl);

    setUploading(true);
    try {
      toast.loading("Optimizing image…", { id: "reg-upload" });
      const optimized = await optimizeImage(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1024, quality: 0.82 });
      if (optimized.size < file.size) toast.loading(`Uploading ${formatBytes(optimized.size)} (was ${formatBytes(file.size)})…`, { id: "reg-upload" });
      else toast.loading("Uploading image…", { id: "reg-upload" });
      const fd = new FormData();
      fd.append("image", optimized);
      const res = await axiosPublic.post(image_hosting_api, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.data?.display_url || res.data?.data?.url;
      if (!url) throw new Error(res.data?.error?.message || "Upload failed");
      if (target === "institution") setInstLogoUrl(url);
      else setStudentPhotoUrl(url);
      toast.success("Image uploaded", { id: "reg-upload" });
    } catch (err) {
      toast.error(err?.response?.data?.error?.message || err.message || "Upload failed", { id: "reg-upload" });
      if (target === "institution") {
        setInstLogoPreview(null);
        setInstLogoUrl("");
      } else {
        setStudentPhotoPreview(null);
        setStudentPhotoUrl("");
      }
    } finally {
      setUploading(false);
    }
  };

  const clearStudentPhoto = () => {
    setStudentPhotoPreview(null);
    setStudentPhotoUrl("");
  };
  const clearInstLogo = () => {
    setInstLogoPreview(null);
    setInstLogoUrl("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (uploading) {
      toast.error("Please wait for image upload to finish");
      return;
    }
    const form = e.target;
    const email = form.email.value;
    const pass = form.password.value;
    const isInstitution = accountType === "institution";

    setBusy(true);
    try {
      const { user } = await createUser(email, pass);

      if (isInstitution) {
        const orgName = form.orgName.value;
        const logoUrl = instLogoUrl || null;
        await updateUserProfile(orgName, logoUrl);
        setUser({ ...user, displayName: orgName, photoURL: logoUrl });

        const userInfo = {
          name: orgName,
          email: user.email,
          accountType: "institution",
          orgName,
          orgType: form.orgType.value,
          orgCountry: form.orgCountry.value,
          orgWebsite: form.orgWebsite.value || null,
          orgDescription: form.orgDescription.value || null,
          photoURL: logoUrl,
        };

        try {
          await axiosPublic.post("/users", userInfo);
        } catch (error) {
          toast.error("Account created, but failed to save your profile.");
        }

        e.target.reset();
        setInstLogoPreview(null);
        setInstLogoUrl("");
        setStudentPhotoPreview(null);
        setStudentPhotoUrl("");
        toast.success("Registration submitted for review");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registration submitted!",
          text: "The platform owner will review and approve your institution.",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
        navigate("/pendingApproval", { replace: true });
      } else {
        const name = form.name.value;
        const photo = studentPhotoUrl || null;
        await updateUserProfile(name, photo);
        setUser({ ...user, photoURL: photo, displayName: name });

        const userInfo = {
          name,
          email: user.email,
          accountType: "student",
          photoURL: photo,
        };

        try {
          const { data } = await axiosPublic.post("/users", userInfo);
          if (data.data.insertedId) {
            e.target.reset();
          }
        } catch (error) {
          toast.error("Account created, but failed to save your profile.");
        }

        setStudentPhotoPreview(null);
        setStudentPhotoUrl("");
        setInstLogoPreview(null);
        setInstLogoUrl("");
        toast.success("Signup Successful");
        navigate(from === "/pendingApproval" ? "/" : from, { replace: true });
      }
    } catch (err) {
      toast.error(friendlyAuthError(err?.message));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleSignIn = async (user) => {
    try {
      const userInfo = {
        name: user.displayName,
        email: user.email,
        accountType: "student",
        photoURL: user.photoURL || null,
      };
      try {
        await axiosPublic.post("/users", userInfo);
      } catch (error) {
        // non-fatal: user may already exist
      }
      toast.success("Signin Successful");
      navigate("/");
    } catch (err) {
      toast.error(friendlyAuthError(err?.message));
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15";

  const passInputClass =
    "w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 py-3 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15";

  const isInstitution = accountType === "institution";

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-brand-100/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lift lg:grid-cols-2"
      >
        {/* Form panel */}
        <div className="px-8 py-10 md:px-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              School<span className="text-brand-600">Hive</span>
            </span>
          </div>

          <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-slate-900">
            Join SchoolHive
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create an account as a student or an institution.
          </p>

          {/* Role selector */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
            {roleTabs.map((t) => {
              const Icon = t.icon;
              const selected = accountType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setAccountType(t.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    selected
                      ? "bg-white text-brand-700 shadow-soft ring-1 ring-brand-100"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {isInstitution
              ? "Institutions must be approved by the platform owner before posting scholarships."
              : "Students can apply to scholarships and track applications."}
          </p>

          {isInstitution && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-800 ring-1 ring-amber-100">
              <Landmark className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                After submitting, an admin will review your institution. You
                can sign in in the meantime.
              </span>
            </div>
          )}

          {!isInstitution && <SocialLogin onSuccess={handleGoogleSignIn} />}

          <div
            className={`${isInstitution ? "mt-6" : "my-6"} flex items-center gap-4`}
          >
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              or register with email
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {isInstitution ? (
              <>
                <div>
                  <label
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                    htmlFor="orgName"
                  >
                    Institution / Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="orgName"
                      autoComplete="organization"
                      name="orgName"
                      className={inputClass}
                      type="text"
                      required
                      placeholder="e.g. University of Dhaka"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                    htmlFor="orgType"
                  >
                    Institution Type
                  </label>
                  <div className="relative">
                    <Landmark className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      id="orgType"
                      name="orgType"
                      required
                      className={`${inputClass} appearance-none`}
                      defaultValue="university"
                    >
                      <option value="university">University</option>
                      <option value="college">College</option>
                      <option value="school">School</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                    htmlFor="orgCountry"
                  >
                    Country
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="orgCountry"
                      autoComplete="country-name"
                      name="orgCountry"
                      className={inputClass}
                      type="text"
                      required
                      placeholder="e.g. Bangladesh"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                    htmlFor="orgWebsite"
                  >
                    Website (optional)
                  </label>
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="orgWebsite"
                      autoComplete="url"
                      name="orgWebsite"
                      className={inputClass}
                      type="url"
                      placeholder="https://example.edu"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                    htmlFor="orgDescription"
                  >
                    Short Description (optional)
                  </label>
                  <div className="relative">
                    <FileText className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      id="orgDescription"
                      name="orgDescription"
                      rows={3}
                      className={`${inputClass} resize-none`}
                      placeholder="Tell students a little about your programs..."
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Institution Logo <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      {instLogoPreview ? (
                        <img src={instLogoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition ${uploading ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-black"}`}>
                        <Upload className="h-3.5 w-3.5" />
                        {uploading ? "Uploading…" : instLogoUrl ? "Change logo" : "Upload logo"}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, "institution")} disabled={uploading} />
                      </label>
                      <p className="mt-1 text-[11px] text-slate-400">JPG, PNG · max 5MB · uploaded via imgbb</p>
                    </div>
                    {instLogoPreview && (
                      <button type="button" onClick={clearInstLogo} className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove logo">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {instLogoUrl && (
                    <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <Check className="h-3.5 w-3.5" /> Logo ready
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                    htmlFor="name"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="name"
                      autoComplete="name"
                      name="name"
                      className={inputClass}
                      type="text"
                      required
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Profile Photo <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      {studentPhotoPreview ? (
                        <img src={studentPhotoPreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition ${uploading ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-black"}`}>
                        <Upload className="h-3.5 w-3.5" />
                        {uploading ? "Uploading…" : studentPhotoUrl ? "Change photo" : "Upload photo"}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, "student")} disabled={uploading} />
                      </label>
                      <p className="mt-1 text-[11px] text-slate-400">JPG, PNG · max 5MB · uploaded via imgbb</p>
                    </div>
                    {studentPhotoPreview && (
                      <button type="button" onClick={clearStudentPhoto} className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove photo">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {studentPhotoUrl && (
                    <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <Check className="h-3.5 w-3.5" /> Image ready
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label
                className="mb-1.5 block text-sm font-semibold text-slate-700"
                htmlFor="LoggingEmailAddress"
              >
                Contact Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="LoggingEmailAddress"
                  autoComplete="email"
                  name="email"
                  className={inputClass}
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label
                className="mb-1.5 block text-sm font-semibold text-slate-700"
                htmlFor="loggingPassword"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="loggingPassword"
                  autoComplete="new-password"
                  name="password"
                  className={passInputClass}
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy || uploading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {busy || uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isInstitution ? "Submit for Approval" : "Create Account"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/signIn"
              className="font-bold text-brand-600 transition-colors hover:text-brand-700"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Visual panel */}
        <div className="relative hidden lg:block">
          <picture>
            <source srcSet={bgImg} type="image/webp" />
            <img
              src={bgImgFallback}
              alt="Students celebrating scholarship success"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-900/60 to-brand-700/20" />
          <div className="relative flex h-full flex-col justify-end p-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-white/25 backdrop-blur">
              <Rocket className="h-3.5 w-3.5" />
              Join the community
            </div>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white">
              Create a free account in minutes.
            </h2>
            <ul className="mt-6 space-y-3 text-sm text-brand-100">
              <li className="flex items-center gap-3">
                <Globe2 className="h-4 w-4 text-amber-300" />
                Apply to global opportunities
              </li>
              <li className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-amber-300" />
                Manage everything in one dashboard
              </li>
              <li className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-amber-300" />
                Personalized recommendations
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Registration;