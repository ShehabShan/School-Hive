import useScholership from "../../../Hooks/useScholership";
import ManageScholarCard from "./ManageScholareCard";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import PageHeader from "../../../Component/ui/PageHeader";
import EmptyState from "../../../Component/ui/EmptyState";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";

const AllScholership = () => {
  const [allScholership, refetch] = useScholership();
  const axiosPublic = useAxiosPublic();

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
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl",
        cancelButton: "rounded-xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosPublic.delete(`/allScholership/${_id}`);
          if (data.data?.deletedCount > 0 || data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Scholarship has been removed.",
              icon: "success",
              confirmButtonColor: "#4f46e5",
            });
            refetch();
          }
        } catch {
          Swal.fire({ title: "Error", text: "Delete failed.", icon: "error" });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LayoutGrid}
        title="Manage Scholarships"
        subtitle={`${allScholership.length} scholarship${allScholership.length === 1 ? "" : "s"} — edit, view or remove listings`}
      />

      {allScholership.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
          <EmptyState
            title="No scholarships yet"
            message="Create your first scholarship using the Add Scholarship button."
            actionLabel="Add Scholarship"
            actionTo="/modaratorDashboard/addScholarships"
          />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          {allScholership.map((scholarship) => (
            <motion.div
              key={scholarship._id}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.3 }}
            >
              <ManageScholarCard scholarship={scholarship} handleDelete={handleDelete} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AllScholership;
