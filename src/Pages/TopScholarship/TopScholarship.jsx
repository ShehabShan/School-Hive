import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import useScholership from "../../Hooks/useScholership";
import ScholarshipCard from "../AllScholership/ScholarshipCard";
import { CardGridSkeleton } from "../../Component/ui/Skeleton";

const TopScholarship = () => {
  const [allScholership] = useScholership();
  const isLoading = allScholership.length === 0;
  const topScholarships = allScholership.slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl"
      />
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
          <p>
            Discover the most popular programs trusted by thousands of students
            around the world.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="mt-12">
            <CardGridSkeleton count={6} />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
          >
            {topScholarships.map((scholarship) => (
              <motion.div
                key={scholarship?._id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                <ScholarshipCard scholarship={scholarship} />
              </motion.div>
            ))}
          </motion.div>
        )}

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
