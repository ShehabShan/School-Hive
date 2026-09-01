import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import bgImg from "../../assist/image/register.jpg";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import SocialLogin from "./SocialLogin";

const Registration = () => {
  const navigate = useNavigate();
  const { googleSingIn, createUser, updateUserProfile, setUser } = useAuth();
  const axiosPublic = useAxiosPublic();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const name = form.name.value;
    const photo = form.photo.value;
    const pass = form.password.value;

    try {
      const { user } = await createUser(email, pass);
      await updateUserProfile(name, photo);
      setUser({ ...user, photoURL: photo, displayName: name });

      const userInfo = {
        name: name,
        email: user.email,
        role: "user",
      };

      try {
        const { data } = await axiosPublic.post("/users", userInfo);

        if (data.data.insertedId) {
          e.target.reset();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "User created successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.error("Failed to save user to the database", error);
        toast.error("Account created, but failed to save your profile.");
      }

      toast.success("Signup Successful");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  const handleGoogleSignIn = async (user) => {
    try {
      const userInfo = {
        name: user.displayName,
        email: user.email,
        role: "user",
      };
      try {
        await axiosPublic.post("/users", userInfo);
      } catch (error) {
        console.error("Failed to save user to the database", error);
      }
      toast.success("Signin Successful");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
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
            Get your free account now
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Join thousands of students funding their future.
          </p>

          <SocialLogin onSuccess={handleGoogleSignIn} />

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              or register with email
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
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
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div>
              <label
                className="mb-1.5 block text-sm font-semibold text-slate-700"
                htmlFor="photo"
              >
                Photo URL
              </label>
              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="photo"
                  autoComplete="photo"
                  name="photo"
                  className={inputClass}
                  type="text"
                  placeholder="https://..."
                />
              </div>
            </div>
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
            </div>

            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
            >
              Create Account
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
          <img
            src={bgImg}
            alt="Students celebrating scholarship success"
            className="absolute inset-0 h-full w-full object-cover"
          />
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
