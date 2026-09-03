import { Lightbulb, ShieldCheck, SearchCheck, Eye, Award } from "lucide-react";

const GUIDANCE = {
  1: {
    title: "How to get a great answer fast",
    icon: Lightbulb,
    bullets: [
      "Start with destination + level: “For Canada Masters in CS…”",
      "One specific question per post beats a essay of doubts.",
      "We check for duplicates as you type — saves you waiting.",
    ],
    tip: "Specific titles get 3× more answers. Bad: “Help me” → Good: “What IELTS band for TU Munich Masters Data Science from BD?”",
  },
  2: {
    title: "Why context matters",
    icon: ShieldCheck,
    bullets: [
      "IELTS 6.5 vs 7.0 depends on destination and home board.",
      "Scholarship rules change by country + field — we route to the right experts.",
      "Your context becomes Country Hive data later — future students thank you.",
    ],
    tip: "Destination + Home + Level unlocks the 2-click filter: Bangladesh → Germany, Masters — no FB search can do that.",
  },
  3: {
    title: "Make it findable",
    icon: SearchCheck,
    bullets: [
      "1–5 tags: mix controlled (ielts, canada) + free-form.",
      "Source link +3 rep and makes your claim auditable.",
      "Preview shows exactly how card looks in Browse feed.",
    ],
    tip: "First answer under a new tag earns +5 once — seeding new topics pays.",
  },
};

export default function GuidanceSidebar({ step, previewMode, onTogglePreview }) {
  const g = GUIDANCE[step] || GUIDANCE[1];
  const Icon = g.icon;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-extrabold text-slate-900">{g.title}</h3>
        </div>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-600">
          {g.bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>
        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-slate-200">{g.tip}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 text-xs font-extrabold tracking-widest text-slate-700 uppercase"><Eye className="h-3.5 w-3.5" /> Live Preview</h4>
          <button type="button" onClick={onTogglePreview} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold hover:bg-slate-50">
            {previewMode ? "Hide" : "Show"}
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">How your card will look in <span className="font-semibold">Browse Q&A</span> feed.</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 p-4 text-white shadow-sm">
        <p className="flex items-center gap-1.5 text-xs font-extrabold tracking-widest text-white/80 uppercase"><Award className="h-3.5 w-3.5" /> Reputation</p>
        <p className="mt-1 text-sm font-semibold">Ask +2 · Answer upvote +10 · Accepted +15 · Source +3</p>
        <p className="text-xs text-white/80">Daily cap 50. Verified badge via /verify — visible from day one.</p>
      </div>
    </div>
  );
}
