import { useMemo, useState } from "react";
import useScholership from "../../../Hooks/useScholership";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import Swal from "sweetalert2";
import PageHeader from "../../../Component/ui/PageHeader";
import EmptyState from "../../../Component/ui/EmptyState";
import { motion } from "framer-motion";
import { LayoutGrid, Search } from "lucide-react";
import ScholarshipCard from "../../../Component/scholarship/ScholarshipCard";
import { CardGridSkeleton } from "../../../Component/ui/Skeleton";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ManageScholarships() {
  const [allScholership, refetch] = useScholership();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isInstitution } = useRole();
  const [q, setQ] = useState("");

  const myScholarships = useMemo(() => {
    if (!isInstitution) return allScholership;
    const email = (user?.email || "").toLowerCase();
    return allScholership.filter((s) => String(s.createdBy || "").toLowerCase() === email);
  }, [allScholership, isInstitution, user?.email]);

  const filtered = useMemo(() => {
    const v = q.trim().toLowerCase();
    if (!v) return myScholarships;
    return myScholarships.filter((s) => `${s.universityName} ${s.subjectName} ${s.scholarshipCategory} ${s.country}`.toLowerCase().includes(v));
  }, [myScholarships, q]);

  const addLink = isInstitution
    ? "/institutionDashboard/addScholarships"
    : "/modaratorDashboard/addScholarships";

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

      {allScholership.length === 0 ? (
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
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((scholarship) => (
            <motion.div key={scholarship._id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.3 }}>
              <ScholarshipCard scholarship={scholarship} variant="manage" onDelete={handleDelete} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
