import ActivitySection from "./ActivitySection";

export default function ActivityTab({ applications, reviews, enabled }) {
  if (!enabled) return null;
  const hasAny = (applications && applications.length) || (reviews && reviews.length);
  if (!hasAny) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-100">
        <p className="text-sm font-semibold text-slate-700">No activity yet</p>
        <p className="mt-1 text-xs text-slate-500">Applications and reviews will appear here.</p>
      </div>
    );
  }
  return <ActivitySection applications={applications} reviews={reviews} viewAllLink="/allScholership" />;
}
