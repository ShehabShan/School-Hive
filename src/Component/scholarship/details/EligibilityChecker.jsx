/* eslint-disable react/prop-types */
import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export default function EligibilityChecker({ scholarship }) {
  const [degree, setDegree] = useState("");
  const [gpa, setGpa] = useState("");
  const [country, setCountry] = useState("");
  const [res, setRes] = useState(null);

  const check = () => {
    const s = scholarship || {};
    const checks = [];
    let score = 0;
    let total = 0;
    if (s.degree) { total += 1; if (degree && degree.toLowerCase() === String(s.degree).toLowerCase()) { score += 1; checks.push({ ok: true, txt: `Degree matches: ${s.degree}` }); } else if (!degree) checks.push({ ok: null, txt: `Requires: ${s.degree} (enter yours)` }); else checks.push({ ok: false, txt: `Requires ${s.degree}, you have ${degree}` }); }
    if (s.country) { total += 1; if (country && country.toLowerCase() === String(s.country).toLowerCase()) { score += 1; checks.push({ ok: true, txt: `Country matches: ${s.country}` }); } else if (!country) checks.push({ ok: null, txt: `Host: ${s.country}` }); else checks.push({ ok: false, txt: `Host is ${s.country}, you entered ${country}` }); }
    if (gpa) { total += 1; const v = Number(gpa); if (Number.isFinite(v) && v >= 3.0) { score += 1; checks.push({ ok: true, txt: `GPA ${gpa} meets typical 3.0+` }); } else checks.push({ ok: false, txt: `GPA ${gpa} may be below 3.0` }); }
    // eligibility array signals
    const elig = s.eligibility || [];
    if (elig.length) { total += 1; checks.push({ ok: null, txt: `Also needs: ${elig.slice(0, 2).join(", ")}` }); }
    let label = "Explore";
    if (total > 0) {
      const ratio = score / total;
      if (ratio >= 0.8) label = "Strong Match";
      else if (ratio >= 0.5) label = "Good Match";
    }
    setRes({ label, checks });
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <h4 className="font-bold text-slate-900">Check if you match</h4>
      <p className="text-sm text-slate-500">Quick, rule-based — no AI, no signup.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <select value={degree} onChange={(e) => setDegree(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">Your degree</option><option>Diploma</option><option>Bachelor</option><option>Masters</option><option>PhD</option></select>
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Your country" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" />
        <input value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="GPA (e.g. 3.4)" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm" />
      </div>
      <button onClick={check} className="mt-3 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800">Check eligibility</button>
      {res && (
        <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-100">
          <p className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ring-1 ${res.label === "Strong Match" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : res.label === "Good Match" ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-slate-100 text-slate-600 ring-slate-200"}`}>{res.label}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {res.checks.map((c, i) => (
              <li key={i} className="flex gap-2">{c.ok === true ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : c.ok === false ? <XCircle className="h-4 w-4 shrink-0 text-rose-500" /> : <HelpCircle className="h-4 w-4 shrink-0 text-slate-400" />}<span className="text-slate-700">{c.txt}</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
