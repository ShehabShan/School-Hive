import { GraduationCap, Briefcase, Award, Trophy, Languages, Heart } from "lucide-react";
import { motion } from "framer-motion";

function Item({ title, subtitle, meta, desc, logo }) {
  return (
    <div className="relative flex gap-3 pl-6">
      <span className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-brand-50" />
      <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 p-3">
        <div className="flex gap-2">
          {logo && <img src={logo} alt="" className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200" onError={(e)=> e.currentTarget.style.display='none'} />}
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900">{title}</p>
            {subtitle && <p className="text-xs font-medium text-slate-600">{subtitle}</p>}
            {meta && <p className="text-[11px] text-slate-500">{meta}</p>}
          </div>
        </div>
        {desc && <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-3">{desc}</p>}
      </div>
    </div>
  );
}

export function EducationTimeline({ education = [] }) {
  const filtered = (education || []).filter((e) => e?.school);
  if (!filtered.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><GraduationCap className="h-4 w-4 text-brand-500" /> Education</h3>
      <div className="mt-4 space-y-3 border-l border-slate-100 pl-0">
        {filtered.map((e,i)=> (
          <Item key={i} title={e.school || "Untitled school"} subtitle={[e.degree, e.field].filter(Boolean).join(" • ")} meta={[e.startYear, e.endYear].filter(Boolean).join(" — ") + (e.grade ? ` • ${e.grade}` : "")} desc={e.description} logo={e.logoUrl} />
        ))}
      </div>
    </motion.div>
  );
}

export function ExperienceTimeline({ experience = [] }) {
  const filtered = (experience || []).filter((e) => e?.title || e?.org);
  if (!filtered.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><Briefcase className="h-4 w-4 text-brand-500" /> Experience</h3>
      <div className="mt-4 space-y-3">
        {filtered.map((e,i)=> (
          <Item key={i} title={e.title || "Untitled role"} subtitle={[e.org, e.location].filter(Boolean).join(" • ")} meta={[e.startDate, e.current ? "Present" : e.endDate].filter(Boolean).join(" — ")} desc={e.description} />
        ))}
      </div>
    </motion.div>
  );
}

export function CertificationsSection({ certifications = [] }) {
  const filtered = (certifications || []).filter((c) => c?.name);
  if (!filtered.length) return null;
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Award className="h-4 w-4 text-amber-500" /> Certifications</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {filtered.map((c,i)=> (
          <a key={i} href={c.url || undefined} target={c.url ? "_blank" : undefined} rel="noopener noreferrer" className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-white hover:shadow-sm">
            <p className="text-sm font-bold text-slate-900">{c.name}</p>
            {[c.issuer, c.issueDate].filter(Boolean).join(" • ") && <p className="text-xs text-slate-600">{[c.issuer, c.issueDate].filter(Boolean).join(" • ")}</p>}
            {c.credentialId && <p className="text-[11px] text-slate-500">ID: {c.credentialId}</p>}
          </a>
        ))}
      </div>
    </div>
  );
}

export function AchievementsSection({ achievements = [] }) {
  const filtered = (achievements || []).filter((a) => a?.title);
  if (!filtered.length) return null;
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Trophy className="h-4 w-4 text-amber-500" /> Achievements</h3>
      <div className="mt-3 space-y-2">
        {filtered.map((a,i)=> (
          <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-sm font-bold text-slate-900">{a.title} {a.date && <span className="text-xs font-normal text-slate-500">• {a.date}</span>}</p>
            {a.description && <p className="text-xs text-slate-600">{a.description}</p>}
            {a.url && <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand-600 hover:underline">View</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LanguagesInterests({ languages=[], interests=[] }) {
  const langs = (languages || []).filter((l) => l?.name);
  const ints = (interests || []).filter(Boolean).map((s)=> String(s).trim()).filter(Boolean);
  if (!langs.length && !ints.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {langs.length >0 && (
        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Languages className="h-4 w-4 text-brand-500" /> Languages</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {langs.map((l,i)=> <span key={i} className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-100">{l.name} {l.level && <span className="text-[10px] text-slate-500">• {l.level}</span>}</span>)}
          </div>
        </div>
      )}
      {ints.length >0 && (
        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Heart className="h-4 w-4 text-rose-500" /> Interests</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ints.map((s,i)=> <span key={i} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">{s}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}
