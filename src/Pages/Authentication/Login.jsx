import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import bgImg from "../../assist/image/login.jpg";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import SocialLogin from "./SocialLogin";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const from = location?.state || "/";

  const { signIn } = useAuth();
  const axiosPublic = useAxiosPublic();

  const handleGoogleSignIn = async (user) => {
    try {
      const userInfo = {
        name: user.displayName,
        email: user.email,
        role: "user",
        photoURL: user.photoURL || null,
      };
      try {
        await axiosPublic.post("/users", userInfo);
      } catch (e) {
        console.error("Failed to save user to the database", e);
      }
      toast.success("Signin Successful");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    const form = e.target;
    const email = form.email.value;
    const pass = form.password.value;
    try {
      await signIn(email, pass);
      toast.success("Signin Successful");
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err.message);
      toast.error(err?.message);
      setError(err?.message);
      e.target.reset();
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15";

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
        {/* Visual panel */}
        <div className="relative hidden lg:block">
          <img
            src={bgImg}
            alt="Students celebrating scholarship success"
            className="absolute inset-0 h-full w-full object-cover"
          />
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

          <SocialLogin onSuccess={handleGoogleSignIn} />

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              or login with email
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

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
                  autoComplete="current-password"
                  name="password"
                  className={inputClass}
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 ring-1 ring-rose-100"
                >
                  <FaExclamationTriangle className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              Sign In
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </form>

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
