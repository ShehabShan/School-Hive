import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock3,
  ShieldAlert,
  Home,
  LogOut,
  Loader2,
  Mail,
} from "lucide-react";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { dashboardForRole } from "../../lib/dashboardForRole";

/* eslint-disable react/prop-types */
const InstitutionStatus = ({ mode }) => {
  const pending = mode === "pending";
  const { user, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { role, isInstitution, isPending, isRejected, loading } = useRole();

  const { data: me } = useQuery({
    queryKey: [user?.email, "me-status"],
    enabled: !!user?.email && isInstitution,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/users/me");
        return res.data?.data || null;
      } catch {
        return null;
      }
    },
  });

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/signIn" replace />;

  // not an institution in this state -> send to their correct dashboard
  if (!isInstitution || (pending ? !isPending : !isRejected)) {
    const target = dashboardForRole({ role, status: me?.status }) || "/";
    return <Navigate to={target} replace />;
  }

  const statusNote = pending ? null : me?.statusNote;

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
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-lift md:p-10"
      >
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
            pending ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
          }`}
        >
          {pending ? (
            <Clock3 className="h-8 w-8" />
          ) : (
            <ShieldAlert className="h-8 w-8" />
          )}
        </div>

        <h1 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-slate-900">
          {pending ? "Awaiting Approval" : "Registration Rejected"}
        </h1>

        <p className="mt-3 text-center text-sm leading-relaxed text-slate-500">
          {pending ? (
            <>
              Your institution account for{" "}
              <span className="font-semibold text-slate-700">
                {me?.orgName || user?.displayName || user?.email}
              </span>{" "}
              has been submitted. The platform owner will review it and you&apos;ll
              be able to post scholarships once approved.
            </>
          ) : (
            <>
              We&apos;re sorry — your institution registration for{" "}
              <span className="font-semibold text-slate-700">
                {me?.orgName || user?.displayName || user?.email}
              </span>{" "}
              was not approved.
            </>
          )}
        </p>

        {!pending && statusNote && (
          <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
            {statusNote}
          </div>
        )}

        {pending && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500 ring-1 ring-slate-100">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            We&apos;ll notify you at {user?.email} via the dashboard once reviewed.
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>
          <button
            onClick={() =>
              logOut().then(() => window.location.assign("/signIn")).catch(() => {})
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out &amp; Switch Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const PendingApproval = () => <InstitutionStatus mode="pending" />;
export const RejectedApproval = () => <InstitutionStatus mode="rejected" />;

export default InstitutionStatus;