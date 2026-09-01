import ScholarshipCard from "./ScholarshipCard";
import useScholership from "../../Hooks/useScholership";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, GraduationCap, SlidersHorizontal } from "lucide-react";
import EmptyState from "../../Component/ui/EmptyState";

const AllScholership = () => {
  const [allScholership] = useScholership();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScholarships = useMemo(() => {
    const v = searchTerm.trim().toLowerCase();
    if (!v) return allScholership;
    return allScholership.filter((s) => s.universityName?.toLowerCase().includes(v));
  }, [allScholership, searchTerm]);

  const hasSearched = searchTerm.trim().length > 0;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl"
      />

      {/* Header */}
      <div className="relative bg-gradient-to-b from-brand-700 to-brand-900 pt-16 pb-20 text-center text-white">
        <div className="container-page">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-white/20 backdrop-blur">
            <GraduationCap className="h-3.5 w-3.5" />
            Explore opportunities
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            All Scholarships
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Browse and search the full catalog of scholarship programs available
            to you.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4 shadow-lift">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                type="text"
                className="w-full bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                placeholder="Search by university name..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search scholarships"
              />
              <span className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 sm:inline-flex">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {filteredScholarships.length} results
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container-page relative -mt-8">
        {filteredScholarships.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-soft">
            <EmptyState
              title={hasSearched ? "No matching scholarships" : "Loading scholarships"}
              message={
                hasSearched
                  ? "Try a different university name or clear your search."
                  : "Scholarship data is on its way — please wait a moment."
              }
            />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredScholarships.map((scholarship, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35 }}
              >
                <ScholarshipCard scholarship={scholarship} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AllScholership;
