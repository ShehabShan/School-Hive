import { motion } from "framer-motion";
import ScholarshipCard from "./ScholarshipCard";
import { CardGridSkeleton } from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import { SearchX } from "lucide-react";

export default function ScholarshipGrid({
  scholarships = [],
  isLoading = false,
  variant = "browse",
  onDelete,
  savedIds = new Set(),
  onToggleSave,
  compareIds = new Set(),
  onToggleCompare,
  emptyTitle,
  emptyMessage,
  emptyAction,
}) {
  if (isLoading) return <CardGridSkeleton count={6} />;

  if (!scholarships || scholarships.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={emptyTitle || "No scholarships found"}
        message={emptyMessage || "Try adjusting your filters or search term to discover more opportunities."}
        action={emptyAction}
      />
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {scholarships.map((s) => (
        <motion.div
          key={s._id}
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        >
          <ScholarshipCard
            scholarship={s}
            variant={variant}
            onDelete={onDelete}
            saved={savedIds.has(String(s._id))}
            onToggleSave={onToggleSave}
            compareChecked={compareIds.has(String(s._id))}
            onToggleCompare={onToggleCompare}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export function ScholarshipList({ scholarships = [], ...rest }) {
  if (!scholarships.length) {
    return <ScholarshipGrid scholarships={scholarships} {...rest} />;
  }
  // list variant uses same card but variant="compact" internally
  return (
    <div className="space-y-4">
      {scholarships.map((s) => (
        <ScholarshipCard
          key={s._id}
          scholarship={s}
          variant="compact"
          saved={rest.savedIds?.has(String(s._id))}
          onToggleSave={rest.onToggleSave}
          compareChecked={rest.compareIds?.has(String(s._id))}
          onToggleCompare={rest.onToggleCompare}
          onDelete={rest.onDelete}
        />
      ))}
    </div>
  );
}
