import { motion } from "framer-motion";
import { Search, Bookmark, Send, CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useScholarshipStats } from "../../Hooks/useSaved";

const steps = [
  { icon: Search, title: "Discover", desc: "Filter by country, degree, field and deadline. Sort by what matters most.", color: "brand" },
  { icon: Bookmark, title: "Save & compare", desc: "Bookmark favorites and compare up to 4 side-by-side.", color: "amber" },
  { icon: Send, title: "Apply", desc: "Apply with confidence — deadlines, fees and eligibility at a glance.", color: "emerald" },
];

export default function ScholershipStatic() {
  const { data: stats } = useScholarshipStats();
  const byCountry = stats?.byCountry || [];

  return (
    <section className="relative overflow-hidden bg-white">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-sky-50 blur-3xl" />
      <div className="container-page relative py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="section-title">
          <span className="eyebrow">How it works</span>
          <h2>From search to submission — in minutes</h2>
          <p>A guided flow built for real deadlines and real decisions.</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft"><s.icon className="h-7 w-7" /></div>
              <h3 className="text-lg font-bold text-slate-900">{i + 1}. {s.title}</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 lg:col-span-2">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900"><GraduationCap className="h-5 w-5 text-brand-600" /> Trending destinations</h3>
            <p className="mt-1 text-sm text-slate-500">Live breakdown from the catalog.</p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(byCountry.length ? byCountry : [{ _id: "United Kingdom", count: 12 }, { _id: "United States", count: 8 }, { _id: "Canada", count: 6 }, { _id: "Germany", count: 4 }]).slice(0, 6).map((c) => (
                <div key={c._id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4">
                  <span className="font-semibold text-slate-800">{c._id || "Unknown"}</span>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100">{c.count} programs</span>
                </div>
              ))}
            </div>
            <Link to="/allScholership" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">Browse all destinations →</Link>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
            <ShieldCheck className="h-8 w-8 text-amber-300" />
            <h3 className="mt-4 text-xl font-extrabold">Why School-Hive?</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-brand-100">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-amber-300" /> Real deadlines with countdowns — no stale dates.</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-amber-300" /> Verified reviews only from accepted applicants.</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-amber-300" /> Save, compare and revisit — your shortlist, anywhere.</li>
            </ul>
            <Link to="/allScholership" className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand-700 shadow-soft">Start exploring</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
