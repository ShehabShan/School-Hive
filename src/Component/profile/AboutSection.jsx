import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutSection({ user }) {
  const [expanded, setExpanded] = useState(false);
  const bio = user?.bio || "No bio provided.";
  const skills = user?.skills?.length ? user.skills : [];
  const isLong = bio.length > 180;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6"
    >
      <h2 className="text-base font-bold text-slate-900 sm:text-lg">About</h2>

      <div className="mt-3">
        <AnimatePresence mode="wait">
          <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
            {isLong && !expanded ? bio.slice(0, 180) + "..." : bio}
          </p>
        </AnimatePresence>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {skills.length > 0 && (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Skills & Interests
          </h3>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
