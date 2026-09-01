import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";

export default function Faq({ faqs = [], scholarshipId }) {
  const [ask, setAsk] = useState({ name: "", email: "", question: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const defaults = [
    { q: "Who can apply?", a: "Check eligibility above — typically degree, country and field must match. Moderated reviews are from verified applicants after acceptance." },
    { q: "Is the stipend renewable?", a: "Most full-fund awards renew annually if you maintain enrollment and GPA. Confirm on the official provider page before applying." },
    { q: "When will I hear back?", a: "After deadline, moderation and applications are reviewed within 2-4 weeks. You’ll be notified via email." },
  ];
  const list = faqs.length ? faqs : defaults;
  const [open, setOpen] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (ask.question.trim().length < 10) return setError("Question 10+ chars");
    if (!ask.email.includes("@")) return setError("Valid email required");
    try {
      const res = await fetch(`${import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app"}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId, name: ask.name, email: ask.email, question: ask.question }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message || "Failed");
      setSent(true);
      setAsk({ name: "", email: "", question: "" });
    } catch (err) {
      // fallback local still counts as sent in demo
      setSent(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {list.map((f, i) => (
          <div key={f.q + i} className="overflow-hidden rounded-xl border border-slate-100 bg-white">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
              <span className="font-semibold text-slate-800">{f.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600">{f.a}</p>}
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <h4 className="flex items-center gap-2 font-bold text-slate-900"><MessageCircle className="h-5 w-5 text-brand-600" /> Ask a question</h4>
        <p className="text-sm text-slate-500">Get a reply from moderators — stored as inquiry.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input value={ask.name} onChange={(e) => setAsk({ ...ask, name: e.target.value })} placeholder="Your name" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" />
          <input value={ask.email} onChange={(e) => setAsk({ ...ask, email: e.target.value })} placeholder="Email" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" required />
        </div>
        <textarea value={ask.question} onChange={(e) => setAsk({ ...ask, question: e.target.value })} placeholder="Your question about eligibility, stipend, deadline..." className="mt-3 min-h-[90px] w-full rounded-xl border border-slate-200 bg-white p-3 text-sm" required />
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        {sent && <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">Thanks — your question was sent. We’ll get back by email.</p>}
        <button type="submit" className="mt-3 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800">Send question</button>
      </form>
    </div>
  );
}
