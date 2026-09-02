import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import useScholership from "../../Hooks/useScholership";
import ScholarshipGrid from "../../Component/scholarship/ScholarshipGrid";
import { useSaved, useToggleSave } from "../../Hooks/useSaved";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import useCompare from "../../Hooks/useCompare";
import "./TopScholarship.css";

const TopScholarship = () => {
  const { data: resp, isLoading } = useScholership({ sort: "rating", limit: 15, page: 1 });
  const raw = resp?.data || [];
  const list = raw.slice(0, 15);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: savedDocs } = useSaved();
  const savedIds = useMemo(() => new Set((savedDocs || []).map((d) => String(d.scholarshipId))), [savedDocs]);
  const toggleSave = useToggleSave();
  const { ids: compareIds, toggle: toggleCompare } = useCompare();

  const handleToggleSave = (s) => {
    if (!user) return navigate("/signIn");
    toggleSave.mutate(String(s._id));
  };
  const handleToggleCompare = (s) => {
    toggleCompare(String(s._id));
  };

  return (
    <section className="top-scholarships-wrapper relative overflow-hidden bg-slate-50">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="container-page relative py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          <span className="eyebrow">
            <Trophy className="h-3.5 w-3.5" />
            Hand-picked for you
          </span>
          <h2>Top Scholarships</h2>
          <p>Highest rated and most reviewed programs — sorted by student satisfaction.</p>
        </motion.div>

        <div className="mt-12">
          <ScholarshipGrid
            scholarships={list}
            isLoading={isLoading}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            compareIds={compareIds}
            onToggleCompare={handleToggleCompare}
            emptyTitle="No featured scholarships yet"
            emptyMessage="New opportunities are reviewed and ranked regularly."
          />
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/allScholership"
            className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lift"
          >
            See All Scholarships
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopScholarship;
