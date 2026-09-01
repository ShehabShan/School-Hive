import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  MapPin,
  CalendarDays,
  Info,
  Banknote,
  BadgeDollarSign,
  Receipt,
  CalendarPlus,
  ArrowRight,
  MessagesSquare,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import useSingleScholership from "../../Hooks/useSingleScholership";
import useReviews from "../../Hooks/useReviews";
import useAdmin from "../../Hooks/useAdmin";
import AllReviews from "./AllReviews";
import Stars from "../../Component/ui/Stars";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const [scholarship] = useSingleScholership(id);
  const [review] = useReviews(id);
  const [isAdmin] = useAdmin();

  const infoItems = [
    {
      icon: GraduationCap,
      label: "Category",
      value: scholarship?.scholarshipCategory,
    },
    {
      icon: BookOpen,
      label: "Subject",
      value: scholarship?.subjectName,
    },
    {
      icon: MapPin,
      label: "Location",
      value: `${scholarship?.country}, ${scholarship?.city}`,
    },
    {
      icon: CalendarDays,
      label: "Application Deadline",
      value: scholarship?.applicationDeadline,
    },
  ];

  const financeItems = [
    {
      icon: BadgeDollarSign,
      label: "Stipend",
      value: `$${scholarship?.stipend}`,
    },
    {
      icon: Banknote,
      label: "Application Fees",
      value: `$${scholarship?.applicationFees}`,
    },
    {
      icon: Receipt,
      label: "Service Charge",
      value: `$${scholarship?.serviceCharge}`,
    },
    {
      icon: CalendarPlus,
      label: "Posted on",
      value: scholarship?.postDate,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50"
    >
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 pt-16 pb-16 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl"
        />
        <div className="container-page relative">
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-lift md:h-28 md:w-28"
            >
              <img
                src={scholarship?.universityImage}
                alt={`${scholarship?.universityName} logo`}
                className="h-full w-full object-contain"
              />
            </motion.div>
            <div className="text-center md:text-left">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-white/20">
                {scholarship?.scholarshipCategory}
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
                {scholarship?.universityName}
              </h1>
              <p className="mt-2 text-brand-100">
                {scholarship?.scholarshipCategory} Scholarship in{" "}
                {scholarship?.subjectName}
              </p>
              <div className="mt-3">
                <Stars rating={scholarship?.rating} showValue />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-page -mt-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lift"
        >
          <div className="p-6 md:p-10">
            {/* Basic Information */}
            <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Info className="h-4 w-4" />
                </span>
                Basic Information
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {infoItems.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-100 transition-shadow hover:shadow-soft"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="font-semibold text-slate-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white">
                  <BookOpen className="h-4 w-4" />
                </span>
                Description
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                {scholarship?.scholarshipDescription}
              </p>
            </div>

            {/* Financial Information */}
            <div className="mt-6 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Banknote className="h-4 w-4" />
                </span>
                Financial Details
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {financeItems.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="group rounded-xl bg-white p-4 ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-xs text-slate-400">{label}</p>
                    <p className="text-lg font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply */}
            <div className="mt-8">
              <Link to={`/apply/${scholarship?._id}`} className="block w-full">
                <button
                  disabled={isAdmin}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-4 text-lg font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAdmin ? "Admin Can't Apply" : "Apply Now"}
                  {!isAdmin && (
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  )}
                </button>
              </Link>
              <p className="mt-3 text-center text-sm text-slate-400">
                Posted on: {scholarship?.postDate}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      <div className="bg-white pb-20">
        <div className="container-page">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white">
              <MessagesSquare className="h-5 w-5" />
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Reviews
            </h2>
          </div>
          {review?.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
              <MessagesSquare className="mx-auto h-10 w-10 text-slate-300" />
              <h2 className="mt-4 text-xl font-bold text-slate-700">
                No reviews available
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Be the first to share your experience.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {review?.map((reviews, index) => (
                <AllReviews key={index} review={reviews} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ScholarshipDetails;
