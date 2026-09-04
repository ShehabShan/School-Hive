const TABS = [
  { id: "answers", label: "Answers" },
  { id: "questions", label: "Questions" },
  { id: "activity", label: "Activity" },
  { id: "about", label: "About" },
];

export default function ProfileTabs({ active, onChange, counts }) {
  return (
    <div className="sticky top-0 z-10 -mx-4 border-b border-slate-200 bg-slate-50/80 px-4 backdrop-blur sm:mx-0 sm:px-0">
      <div className="flex gap-1 overflow-x-auto scrollbar-thin">
        {TABS.map((t) => {
          const isActive = active === t.id;
          const count = counts?.[t.id];
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`relative shrink-0 whitespace-nowrap px-3.5 py-3 text-sm font-bold transition ${isActive ? "text-brand-600" : "text-slate-600 hover:text-slate-900"}`}
            >
              {t.label}
              {typeof count === "number" && (
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${isActive ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-500"}`}>
                  {count}
                </span>
              )}
              {isActive && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { TABS };
