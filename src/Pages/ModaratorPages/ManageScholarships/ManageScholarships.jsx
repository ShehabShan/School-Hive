import { useMemo, useState } from "react";
import useScholership from "../../../Hooks/useScholership";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import Swal from "sweetalert2";
import PageHeader from "../../../Component/ui/PageHeader";
import EmptyState from "../../../Component/ui/EmptyState";
import { motion } from "framer-motion";
import { LayoutGrid, Search, Clock, X } from "lucide-react";
import ScholarshipCard from "../../../Component/scholarship/ScholarshipCard";
import { CardGridSkeleton } from "../../../Component/ui/Skeleton";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays } from "date-fns";

export default function ManageScholarships() {
  // include drafts for management view
  const { data: schData, refetch, isLoading, isFetching } = useScholership({ status: "all" });
  const allScholership = schData?.data || (Array.isArray(schData) ? schData : []) || [];
  const isInitialLoading = isLoading || (isFetching && allScholership.length === 0);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isInstitution } = useRole();
  const [q, setQ] = useState("");
  const [scheduleId, setScheduleId] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(addDays(new Date(), 1));
  const [showOnProfile, setShowOnProfile] = useState(false);

  const [tab, setTab] = useState("published");
  const myScholarships = useMemo(() => {
    if (!isInstitution) return allScholership;
    const email = (user?.email || "").toLowerCase();
    return allScholership.filter((s) => String(s.createdBy || "").toLowerCase() === email);
  }, [allScholership, isInstitution, user?.email]);

  const tabFiltered = useMemo(() => {
    if (tab === "all") return myScholarships;
    return myScholarships.filter((s) => (s.status || "published") === tab);
  }, [myScholarships, tab]);

  const filtered = useMemo(() => {
    const v = q.trim().toLowerCase();
    if (!v) return tabFiltered;
    return tabFiltered.filter((s) => `${s.universityName} ${s.subjectName} ${s.scholarshipCategory} ${s.country}`.toLowerCase().includes(v));
  }, [tabFiltered, q]);

  const counts = useMemo(() => {
    const c = { published: 0, scheduled: 0, draft: 0, all: myScholarships.length };
    myScholarships.forEach((s) => {
      const st = s.status || "published";
      if (c[st] !== undefined) c[st]++;
    });
    return c;
  }, [myScholarships]);

  const addLink = isInstitution
    ? "/institutionDashboard/addScholarships"
    : "/modaratorDashboard/addScholarships";

  const handlePublish = async (_id) => {
    try {
      await axiosSecure.patch(`/allScholership/${_id}`, { status: "published", publishAt: null });
      toast.success("Published!");
      refetch();
    } catch (e) {
      toast.error(e.response?.data?.message || "Publish failed");
    }
  };
  const handlePublishNow = async (_id) => {
    try {
      await axiosSecure.patch(`/allScholership/${_id}`, { status: "published", publishAt: null });
      toast.success("Published now!");
      refetch();
    } catch (e) {
      toast.error(e.response?.data?.message || "Publish failed");
    }
  };
  const handleUnschedule = async (_id) => {
    try {
      await axiosSecure.patch(`/allScholership/${_id}`, { status: "draft" });
      toast.success("Moved to draft");
      refetch();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed");
    }
  };
  const handleSchedule = (_id) => {
    setScheduleId(_id);
    setScheduleDate(addDays(new Date(), 1));
    setShowOnProfile(false);
  };
  const handleConfirmSchedule = async () => {
    if (!scheduleId) return;
    const now = new Date();
    const max = addDays(now, 30);
    if (scheduleDate <= now) return toast.error("Schedule time must be in the future");
    if (scheduleDate > max) return toast.error("Schedule max 30 days ahead");
    try {
      await axiosSecure.patch(`/allScholership/${scheduleId}`, { status: "scheduled", publishAt: scheduleDate.toISOString(), showScheduledOnProfile: showOnProfile });
      toast.success(`Scheduled for ${format(scheduleDate, "PPP p")} — draft removed`);
      setScheduleId(null);
      refetch();
      setTab("scheduled");
    } catch (e) {
      toast.error(e.response?.data?.message || "Schedule failed");
    }
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete it!",
      background: "#ffffff",
      customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl", cancelButton: "rounded-xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosSecure.delete(`/allScholership/${_id}`);
          if ((data.data?.deletedCount || data.deletedCount) > 0) {
            toast.success("Scholarship removed");
            refetch();
          } else if (data.data?.deletedCount === 0) {
            toast.error("Delete failed");
          } else {
            toast.success("Scholarship removed");
            refetch();
          }
        } catch (e) {
          toast.error(e.response?.data?.message || "Delete failed — check permissions");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LayoutGrid}
        title={isInstitution ? "My Scholarships" : "Manage Scholarships"}
        subtitle={`${filtered.length} scholarship${filtered.length === 1 ? "" : "s"} — ${isInstitution ? "your posted listings" : "edit, view or remove listings"}`}
        actions={
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:flex">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-40 bg-transparent text-sm outline-none placeholder:text-slate-400" />
            </div>
            <Link to={addLink} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">Add Scholarship</Link>
          </div>
        }
      />

      <div className="sm:hidden">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search scholarships..." className="w-full bg-transparent text-sm outline-none" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "published", label: `Published (${counts.published})` },
          { id: "scheduled", label: `Scheduled (${counts.scheduled})` },
          { id: "draft", label: `Draft (${counts.draft})` },
          { id: "all", label: `All (${counts.all})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-bold ring-1 transition ${tab === t.id ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isInitialLoading ? (
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
          <CardGridSkeleton count={4} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
          <EmptyState
            title={isInstitution ? "No scholarships posted yet" : "No matching scholarships"}
            message={isInstitution ? "Create your first scholarship to see it here." : "Try a different search term."}
            action={
              isInstitution ? (
                <Link to={addLink} className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white">Add Scholarship</Link>
              ) : (
                <button onClick={() => setQ("")} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white">Clear search</button>
              )
            }
          />
        </div>
      ) : (
        <>
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((scholarship) => (
              <motion.div key={scholarship._id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.3 }}>
                <ScholarshipCard scholarship={scholarship} variant="manage" onDelete={handleDelete} onPublish={handlePublish} onPublishNow={handlePublishNow} onUnschedule={handleUnschedule} onSchedule={handleSchedule} />
              </motion.div>
            ))}
          </motion.div>
          {scheduleId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setScheduleId(null)}>
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><Clock className="h-5 w-5 text-brand-600" /> Schedule Publish</h3>
                <button onClick={() => setScheduleId(null)} className="rounded-full p-1 hover:bg-slate-100"><X className="h-5 w-5" /></button>
              </div>
              <p className="mt-1 text-sm text-slate-500">Pick a future date/time (max 30 days). Draft will be removed and become scheduled.</p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-2">
                <DatePicker selected={scheduleDate} onChange={(d) => d && !isNaN(d.getTime()) && setScheduleDate(d)} showTimeSelect timeIntervals={15} dateFormat="yyyy-MM-dd HH:mm" minDate={new Date()} maxDate={addDays(new Date(), 30)} inline />
              </div>
              <p className="mt-2 text-xs text-slate-600">Selected: <b>{format(scheduleDate, "PPP p")}</b> • {Math.max(0, Math.ceil((scheduleDate - new Date()) / (86400000)))} days left</p>
              <label className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <input type="checkbox" checked={showOnProfile} onChange={(e) => setShowOnProfile(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
                <span className="text-sm font-semibold text-slate-700">Show scheduled on my public profile</span>
              </label>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setScheduleId(null)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">Cancel</button>
                <button onClick={handleConfirmSchedule} className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700">Schedule</button>
              </div>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  );
}
