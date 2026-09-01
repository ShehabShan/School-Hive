import { Link } from "react-router-dom";
import useScholership from "../../../Hooks/useScholership";
import ScholarshipCard from "../ScholarshipCard";

export default function RelatedCarousel({ scholarship }) {
  const s = scholarship || {};
  const { data: resp } = useScholership(s.country ? { country: s.country, sort: "deadline", limit: 6, page: 1 } : null);
  const list = (resp?.data || []).filter((x) => String(x._id) !== String(s._id)).slice(0, 4);
  if (!list.length) return null;
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">You may also like</h3>
        <Link to={`/allScholership?country=${encodeURIComponent(s.country || "")}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all →</Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {list.map((sc) => (
          <ScholarshipCard key={sc._id} scholarship={sc} />
        ))}
      </div>
    </div>
  );
}
