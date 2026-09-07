const TABS = [
  { id: "answers", label: "Answers" },
  { id: "questions", label: "Questions" },
  { id: "activity", label: "Activity" },
  { id: "about", label: "About" },
];

export default function ProfileTabs({ active, onChange, counts }) {
  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-3 backdrop-blur-md sm:px-5">
      <div className="flex gap-1 overflow-x-auto scrollbar-thin" role="tablist" aria-label="Profile sections">
        {TABS.map((t) => {
          const isActive = active === t.id;
          const count = counts?.[t.id];
          return (
            <button
              key={t.id}
              id={`profile-tab-${t.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`profile-panel-${t.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(t.id)}
              className={`relative shrink-0 whitespace-nowrap px-3 py-4 text-sm font-bold transition-colors sm:px-4 ${isActive ? "text-brand-700" : "text-slate-500 hover:text-slate-900"}`}
            >
              {t.label}
              {typeof count === "number" && (
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-500"}`}>
                  {count}
                </span>
              )}
              {isActive && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-600 sm:inset-x-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { TABS };
