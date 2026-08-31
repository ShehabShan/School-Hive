import { Link } from "react-router-dom";
import { GraduationCap, Compass, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
          <GraduationCap className="h-12 w-12" />
        </div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-600">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-500">
          No need to worry — your perfect scholarship is still out there. Head
          back to the homepage or browse the full list of scholarships.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>
          <Link
            to="/allScholership"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Compass className="h-4 w-4" />
            Browse Scholarships
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
