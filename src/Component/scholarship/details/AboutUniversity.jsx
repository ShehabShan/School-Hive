/* eslint-disable react/prop-types */
import { MapPin, ExternalLink, GraduationCap } from "lucide-react";

export default function AboutUniversity({ scholarship }) {
  const s = scholarship || {};
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
      <h3 className="flex items-center gap-2 font-bold text-slate-900"><GraduationCap className="h-5 w-5 text-brand-600" /> About university</h3>
      <div className="mt-4 flex gap-4">
        <img src={s.universityImage} alt={s.universityName} className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200" onError={(e) => (e.currentTarget.style.display = "none")} />
        <div>
          <p className="font-bold text-slate-900">{s.universityName}</p>
          <p className="text-sm text-slate-500">{s.city}, {s.country} {s.universityWorldrank ? `· Rank #${s.universityWorldrank}` : ""}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={`https://www.google.com/maps/search/${encodeURIComponent(`${s.universityName} ${s.city} ${s.country}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><MapPin className="h-3.5 w-3.5" /> View on map</a>
        {s.brochureUrl && <a href={s.brochureUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><ExternalLink className="h-3.5 w-3.5" /> Brochure</a>}
      </div>
    </div>
  );
}
