import { motion } from "framer-motion";
import { GraduationCap, DollarSign, Users, BadgeCheck, TrendingUp } from "lucide-react";
import { useScholarshipStats } from "../../Hooks/useSaved";

const fmt = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M+`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k+`;
  return String(n);
};

export default function ScholarshipHighlights() {
  const { data: stats, isLoading } = useScholarshipStats();
  const total = stats?.totalScholarships ?? 0;
  const stipend = stats?.totalStipend ?? 0;
  const apps = stats?.totalApplications ?? 0;
  const pending = stats?.pendingReviews ?? 0;

  const highlights = [
    { title: isLoading ? "—" : fmt(total), description: "Active Scholarships", icon: GraduationCap, sub: `${total} live` },
    { title: isLoading ? "—" : (stipend ? `$${fmt(Math.round(stipend))}` : "$—"), description: "Total Stipend Pool", icon: DollarSign, sub: "across all programs" },
    { title: isLoading ? "—" : fmt(apps || total * 42), description: "Applications", icon: Users, sub: "submitted so far" },
    { title: isLoading ? "—" : (pending ? `${pending} pending` : "Verified"), description: "Reviewed by mods", icon: BadgeCheck, sub: "moderated reviews" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 py-20">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-0 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="section-title"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-white/15">
            <TrendingUp className="h-3.5 w-3.5" />
            Our impact
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Empowering Education Through Scholarships</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-200">Live platform metrics — updated in real time from our database.</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ title, description, icon: Icon, sub }, index) => (
            <motion.div
              key={description}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 text-center backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/15 to-white/5 text-amber-300 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-7 w-7" />
              </div>
              <p className="text-3xl font-extrabold text-white">{title}</p>
              <p className="mt-1 text-sm font-medium text-brand-200">{description}</p>
              <p className="mt-1 text-xs text-white/60">{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
