import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useScholership from "../../Hooks/useScholership";
import ScholarshipCard from "../AllScholership/ScholarshipCard";
import { CardGridSkeleton } from "../../Component/ui/Skeleton";

const TopScholarship = () => {
  const [allScholership] = useScholership();
  const isLoading = allScholership.length === 0;
  const topScholarships = allScholership.slice(0, 6);

  return (
    <section className="bg-slate-50">
      <div className="container-page py-20 md:py-24">
        <div className="section-title">
          <span className="eyebrow">Hand-picked for you</span>
          <h2>Top Scholarships</h2>
          <p>
            Discover the most popular programs trusted by thousands of
            students around the world.
          </p>
        </div>

        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {topScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship?._id}
                scholarship={scholarship}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/allScholership"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 font-bold text-white transition-colors hover:bg-slate-800"
          >
            See All Scholarships
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopScholarship;
