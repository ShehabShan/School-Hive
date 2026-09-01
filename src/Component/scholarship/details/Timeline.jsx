import { Clock, FileText, GraduationCap, Send } from "lucide-react";

export default function Timeline({ deadline }) {
  if (!deadline) return null;
  const d = new Date(deadline);
  const mk = (days, label, icon) => {
    const t = new Date(d); t.setDate(d.getDate() - days);
    return { date: t.toISOString().slice(0, 10), label, icon };
  };
  const steps = [
    mk(30, "Start SOP & gather transcripts", FileText),
    mk(14, "Request recommendation letters", GraduationCap),
    mk(7, "Final IELTS/TOEFL & review", Clock),
    mk(0, "Submit application", Send),
  ];
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <h4 className="font-bold text-slate-900">Timeline — work back from deadline {deadline}</h4>
      <div className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <div key={s.label} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100"><s.icon className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
              <p className="text-sm font-semibold text-slate-800">{i + 1}. {s.label}</p>
              <p className="text-xs text-slate-500">by {s.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
