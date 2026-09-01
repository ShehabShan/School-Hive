import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Compass, Home, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-brand-100/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -6 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lift"
        >
          <GraduationCap className="h-12 w-12" />
        </motion.div>
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 ring-1 ring-brand-100">
          <SearchX className="h-3.5 w-3.5" />
          Error 404
        </div>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-500">
          No need to worry — your perfect scholarship is still out there. Head
          back to the homepage or browse the full list of scholarships.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 font-semibold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Home className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
            Go to Homepage
          </Link>
          <Link
            to="/allScholership"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-soft"
          >
            <Compass className="h-4 w-4" />
            Browse Scholarships
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
