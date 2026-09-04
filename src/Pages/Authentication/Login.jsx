import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Trophy,
  Building2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  AlertTriangle,
  Clock3,
} from "lucide-react";
import bgImg from "../../assist/image/login.webp";
import bgImgFallback from "../../assist/image/login.jpg";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import SocialLogin from "./SocialLogin";
import { waitForToken } from "../../lib/waitForToken";
import { dashboardForRole } from "../../lib/dashboardForRole";
import { friendlyAuthError } from "../../lib/friendlyAuthError";

const portals = [
  {
    id: "student",
    label: "Student",
    desc: "Scholarships & applications",
    icon: GraduationCap,
  },
  {
    id: "staff",
    label: "Staff",
    desc: "Admin & moderator panel",
    icon: ShieldCheck,
  },
  {
    id: "institution",
    label: "Institution",
    desc: "Universities & schools",
    icon: Building2,
  },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [portal, setPortal] = useState("student");
  const from = location?.state || "/";

  const { signIn, sendResetPassword } = useAuth();
  const axiosPublic = useAxiosPublic();

  const resolveAndGo = async (fallback, defaultDest, message) => {
    const token = await waitForToken();
    let me = null;
    if (token) {
      try {
        const res = await axiosPublic.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        me = res.data?.data;
      } catch {
        // role lookup failed (e.g. old server) — fall back to destination
      }
    }
    const route = dashboardForRole(me);
    toast.success(message || "Signin Successful");
    navigate(route || fallback || defaultDest || "/", { replace: true });
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
      } catch (e) {
        // non-fatal: user may already exist
      }
      await resolveAndGo(from, "/");
    } catch (err) {
      toast.error(friendlyAuthError(err?.message));
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    const form = e.target;
    const email = form.email.value;
    const pass = form.password.value;
    setBusy(true);
    try {
      await signIn(email, pass);
      await resolveAndGo(from, "/");
    } catch (err) {
      setError(friendlyAuthError(err?.message));
    } finally {
      setBusy(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    const email = e.target.resetEmail.value;
    setBusy(true);
    try {
      await sendResetPassword(email);
      toast.success("Password reset link sent. Check your inbox.");
      setForgot(false);
    } catch (err) {
      setError(friendlyAuthError(err?.message));
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 py-3 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15";

  const activePortal = portals.find((p) => p.id === portal);

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
        className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lift lg:grid-cols-2"
      >
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
              <Sparkles className="h-3.5 w-3.5" />
              Scholarship Portal
            </div>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white">
              Your future starts with one application.
            </h2>
            <ul className="mt-6 space-y-3 text-sm text-brand-100">
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-amber-300" />
                Access 850+ verified scholarships
              </li>
              <li className="flex items-center gap-3">
                <Trophy className="h-4 w-4 text-amber-300" />
                Track your applications in real time
              </li>
              <li className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-amber-300" />
                Join 50k+ funded students
              </li>
            </ul>
          </div>
        </div>

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
            Welcome back!
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to continue your scholarship journey.
          </p>

          {/* Role portal picker */}
          <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5">
            {portals.map((p) => {
              const Icon = p.icon;
              const selected = portal === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPortal(p.id)}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    selected
                      ? "bg-white text-brand-700 shadow-soft ring-1 ring-brand-100"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {p.label}
                </button>
              );
            })}
          </div>

          {portal === "institution" && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-800 ring-1 ring-amber-100">
              <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Institution accounts require the platform owner&apos;s approval
                after registration. You can sign in while it&apos;s pending.
              </span>
            </div>
          )}
          {portal === "staff" && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-sky-50 px-3 py-2.5 text-xs font-medium text-sky-800 ring-1 ring-sky-100">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Staff accounts (admin &amp; moderator) are assigned by the
                platform owner.
              </span>
            </div>
          )}
          {portal === "student" && (
            <SocialLogin onSuccess={handleGoogleSignIn} />
          )}

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              or login with email
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {forgot ? (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                  htmlFor="resetEmail"
                >
                  Reset password email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="resetEmail"
                    autoComplete="email"
                    name="resetEmail"
                    className={inputClass}
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => setForgot(false)}
                className="w-full text-center text-sm font-semibold text-slate-500 transition-colors hover:text-slate-700"
              >
                Back to sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                  htmlFor="LoggingEmailAddress"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="LoggingEmailAddress"
                    autoComplete="email"
                    name="email"
                    className={inputClass}
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    className="block text-sm font-semibold text-slate-700"
                    htmlFor="loggingPassword"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgot(true)}
                    className="text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="loggingPassword"
                    autoComplete="current-password"
                    name="password"
                    className={inputClass}
                    type={showPass ? "text" : "password"}
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
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 ring-1 ring-rose-100"
                  >
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {error}
                  </motion.p>
                )}
                {portal === "institution" && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Building2 className="h-3.5 w-3.5" />
                    {activePortal.label} portal selected — we&apos;ll take you to
                    your dashboard by account type.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400">
                Sign in with your account&apos;s actual role — we route you
                automatically.
              </p>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/registration"
              className="font-bold text-brand-600 transition-colors hover:text-brand-700"
            >
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;