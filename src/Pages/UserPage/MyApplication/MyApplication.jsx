import { useState, useMemo, useEffect } from "react";
import { FaFileAlt } from "react-icons/fa";
import { ShieldCheck, LayoutGrid, List, Table, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import PageHeader from "../../../Component/ui/PageHeader";
import Spinner from "../../../Component/ui/Spinner";
import ApplicationCard from "./ApplicationCard";
import ApplicationDetails from "./ApplicationDetails";
import { CardGridSkeleton } from "../../../Component/ui/Skeleton";
import EmptyState from "../../../Component/ui/EmptyState";
import "./MyApplication.css";

export default function MyApplication() {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "grid";
  const qParam = searchParams.get("q") || "";
  const [localQ, setLocalQ] = useState(qParam);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setLocalQ(qParam), [qParam]);

  const updateView = (v) => {
    const next = new URLSearchParams(searchParams);
    next.set("view", v);
    setSearchParams(next, { replace: true });
  };
  const updateSearch = (v) => {
    const next = new URLSearchParams(searchParams);
    if (v) next.set("q", v);
    else next.delete("q");
    next.delete("view"); // keep view but reset? keep
    next.set("view", view);
    setSearchParams(next, { replace: true });
  };

  const { data: apply = [], isLoading } = useQuery({
    queryKey: ["apply", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/apply?email=${user?.email}`);
      return data.data;
    },
    enabled: !!user?.email,
  });

  const { data: myReviews = [] } = useQuery({
    queryKey: ["myReviews-gate-list", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/allReviews?email=${user?.email}`);
      return data.data;
    },
  });

  const hasReviewed = (scholarshipId) => myReviews.some((r) => String(r.scholarShip_id) === String(scholarshipId));

  const filtered = useMemo(() => {
    const q = qParam.trim().toLowerCase();
    if (!q) return apply;
    return apply.filter((a) =>
      `${a.universityName} ${a.subjectName} ${a.applicationStatus} ${a.applicantDistrict}`.toLowerCase().includes(q)
    );
  }, [apply, qParam]);

  const openModal = (applicant) => {
    setSelected(applicant);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setSelected(null), 200);
  };

  // close on esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeModal();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div className="my-applications-wrapper container mx-auto px-4 py-8">
      <PageHeader
        icon={FaFileAlt}
        title="My Applications"
        subtitle={`Track the status of the ${apply?.length || 0} scholarships you applied to`}
        actions={
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={localQ}
                  onChange={(e) => setLocalQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && updateSearch(localQ.trim())}
                  placeholder="Search university..."
                  className="w-56 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                {localQ && (
                  <button onClick={() => { setLocalQ(""); updateSearch(""); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <button onClick={() => updateSearch(localQ.trim())} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">Search</button>
            </div>
            <div className="inline-flex overflow-hidden rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
              <button onClick={() => updateView("grid")} className={`rounded-lg px-3 py-1.5 ${view === "grid" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`} title="Grid view"><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => updateView("list")} className={`rounded-lg px-3 py-1.5 ${view === "list" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`} title="List view"><List className="h-4 w-4" /></button>
              <button onClick={() => updateView("table")} className={`rounded-lg px-3 py-1.5 ${view === "table" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"}`} title="Table view"><Table className="h-4 w-4" /></button>
            </div>
          </div>
        }
      />

      <div className="mt-4 flex items-center gap-2 sm:hidden">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={localQ} onChange={(e) => setLocalQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && updateSearch(localQ.trim())} placeholder="Search university..." className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm" />
        </div>
        <button onClick={() => updateSearch(localQ.trim())} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">Search</button>
      </div>

      {loading || isLoading ? (
        view === "list" ? (
          <div className="mt-6 space-y-4">{[1,2,3].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100" />)}</div>
        ) : view === "table" ? (
          <div className="mt-6 flex justify-center py-20"><Spinner className="h-8 w-8 text-brand-600" /></div>
        ) : (
          <div className="mt-6"><CardGridSkeleton count={6} /></div>
        )
      ) : apply?.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={FaFileAlt}
            title="No applications yet"
            message="You haven't applied to any scholarships yet. Explore opportunities and start your journey."
            action={<Link to="/allScholership" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-brand-700">Browse Scholarships</Link>}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No matching applications" message={`No applications match "${qParam}". Try a different search.`} action={<button onClick={() => updateSearch("")} className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white">Clear search</button>} />
        </div>
      ) : view === "table" ? (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3.5">University</th>
                  <th className="px-4 py-3.5">District</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5">Degree</th>
                  <th className="px-4 py-3.5">Fees</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((applicant) => (
                  <tr key={applicant?._id} className="border-t border-slate-100 text-sm text-slate-700 hover:bg-slate-50/70">
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{applicant?.universityName}</td>
                    <td className="px-4 py-3.5">{applicant?.applicantDistrict || "—"}</td>
                    <td className="px-4 py-3.5">{applicant?.subjectName}</td>
                    <td className="px-4 py-3.5">{applicant?.applyingDegree || applicant?.Postgraduate || "—"}</td>
                    <td className="px-4 py-3.5 font-semibold text-brand-600">${applicant?.applicationFees}</td>
                    <td className="px-4 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${applicant?.applicationStatus === "accepted" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : applicant?.applicationStatus === "rejected" ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-amber-50 text-amber-700 ring-amber-100"}`}>{applicant?.applicationStatus}</span></td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end">
                        <button onClick={() => openModal(applicant)} className="btn btn-sm btn-circle bg-slate-900 text-white border-none hover:bg-slate-800" title="View"><span className="text-xs">👁️</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : view === "list" ? (
        <div className="applications-grid mt-6 space-y-4">
          {filtered.map((a) => (
            <ApplicationCard key={a._id} applicant={a} hasReviewed={hasReviewed} onView={openModal} variant="list" />
          ))}
        </div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="applications-grid mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <motion.div key={a._id} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
              <ApplicationCard applicant={a} hasReviewed={hasReviewed} onView={openModal} variant="grid" />
            </motion.div>
          ))}
        </motion.div>
      )}

      <p className="mt-4 flex items-center gap-1.5 px-1 text-xs text-slate-400">
        <ShieldCheck className="h-3 w-3 text-emerald-500" /> Only <span className="font-bold">accepted</span> applications can leave 1 review per scholarship.
        <span className="ml-auto hidden sm:inline">Showing {filtered.length} of {apply.length}</span>
      </p>

      <AnimatePresence>
        {isOpen && selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="myapp-modal-backdrop fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <div
                className="relative max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-slate-50 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={closeModal} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-soft ring-1 ring-slate-200 hover:bg-slate-50" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
                <div className="p-4 md:p-6">
                  <ApplicationDetails data={selected} />
                  <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">Close</button>
                    <Link to={`/userDashboard/myApplication/${selected._id}`} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800">Open full page</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
