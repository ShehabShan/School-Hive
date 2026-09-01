import { Link } from "react-router-dom";
import { Bookmark,  } from "lucide-react";
import { useSaved, useToggleSave } from "../../../Hooks/useSaved";
import ScholarshipGrid from "../../../Component/scholarship/ScholarshipGrid";
import PageHeader from "../../../Component/ui/PageHeader";
import { CardGridSkeleton } from "../../../Component/ui/Skeleton";

export default function SavedScholarships() {
  const { data: docs, isLoading } = useSaved();
  const toggle = useToggleSave();
  const scholarships = (docs || []).map((d) => d.scholarship).filter(Boolean);
  const savedIds = new Set((docs || []).map((d) => String(d.scholarshipId)));

  const handleToggle = (s) => toggle.mutate(String(s._id));

  if (isLoading) return <div className="p-6"><CardGridSkeleton count={6} /></div>;

  return (
    <div className="p-6">
      <PageHeader icon={Bookmark} title="Saved Scholarships" subtitle={`${scholarships.length} saved`} actions={<Link to="/allScholership" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">Browse scholarships</Link>} />
      {scholarships.length === 0 ? (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <Bookmark className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-4 text-lg font-bold text-slate-900">No saved scholarships</h3>
          <p className="mt-1 text-sm text-slate-500">Bookmark scholarships you love — they’ll appear here.</p>
          <Link to="/allScholership" className="mt-6 inline-flex rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white">Explore scholarships</Link>
        </div>
      ) : (
        <ScholarshipGrid scholarships={scholarships} savedIds={savedIds} onToggleSave={handleToggle} />
      )}
      {scholarships.length > 0 && <p className="mt-6 text-center text-xs text-slate-400">Tip: compare up to 4 saved programs on the <Link to={`/compare?ids=${[...savedIds].slice(0,4).join(",")}`} className="font-semibold text-brand-600">compare page</Link>.</p>}
    </div>
  );
}
