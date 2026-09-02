import { useSearchParams, Link } from "react-router-dom";
import { Scale, X, Bookmark, ArrowRight, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Stars from "../../Component/ui/Stars";
import CountdownBadge from "../../Component/scholarship/CountdownBadge";

const fmt = (n, cur = "USD") => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(v); } catch { return `$${v.toLocaleString()}`; }
};

export default function Compare() {
  const [params, setParams] = useSearchParams();
  const ids = (params.get("ids") || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const axiosPublic = useAxiosPublic();

  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ["compare", ids.join(",")],
    enabled: ids.length > 0,
    queryFn: async () => {
      const arr = await Promise.all(ids.map(async (id) => {
        try { const r = await axiosPublic.get(`/allScholership/${id}`); return r.data.data; } catch { return null; }
      }));
      return arr.filter(Boolean);
    },
  });

  const remove = (id) => {
    const next = ids.filter((x) => x !== String(id));
    if (next.length) setParams({ ids: next.join(",") }); else setParams({});
    const stored = JSON.parse(localStorage.getItem("compareIds") || "[]");
    localStorage.setItem("compareIds", JSON.stringify(stored.filter((x) => String(x) !== String(id))));
  };
  const clearAll = () => {
    setParams({});
    localStorage.setItem("compareIds", JSON.stringify([]));
  };

  if (!ids.length) {
    return (
      <section className="bg-slate-50 py-20">
        <div className="container-page text-center">
          <Scale className="mx-auto h-12 w-12 text-slate-300" />
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Compare scholarships</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">Select up to 4 scholarships from the catalog (bookmark icon → Scale) to compare fees, stipends, deadlines, ratings and eligibility side-by-side.</p>
          <Link to="/allScholership" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white">Browse scholarships <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-10">
      <div className="container-page">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900"><Scale className="h-6 w-6 text-brand-600" /> Compare ({scholarships.length}/4)</h1>
          <button onClick={clearAll} className="inline-flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200"><Trash2 className="h-4 w-4" /> Clear</button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">{Array.from({ length: ids.length }).map((_, i) => <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-200" />)}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {scholarships.map((s) => (
              <div key={s._id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
                <div className="relative h-40 overflow-hidden">
                  <img src={s.universityImage} alt={s.universityName} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=No+Image")} />
                  <button onClick={() => remove(s._id)} className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow"><X className="h-4 w-4" /></button>
                  <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-brand-700">{s.scholarshipCategory}</span>
                </div>
                <div className="p-5">
                  <h3 className="line-clamp-2 font-bold text-slate-900">{s.universityName}</h3>
                  <p className="mt-1 text-sm text-slate-500">{s.degree} · {s.subjectName}</p>
                  <div className="mt-3 flex items-center gap-2"><Stars rating={s.rating} showValue /><span className="text-xs text-slate-400">({s.reviewsCount || 0})</span></div>
                  <CountdownBadge deadline={s.applicationDeadline} className="mt-3" />
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-slate-400">Location</dt><dd className="font-semibold text-slate-700">{s.city}, {s.country}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-400">Fee</dt><dd className="font-bold text-brand-600">{fmt(s.applicationFees, s.currency)}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-400">Stipend</dt><dd className="font-semibold text-emerald-600">{s.stipend ? fmt(s.stipend, s.currency) : "—"}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-400">Duration</dt><dd className="font-medium text-slate-700">{s.duration || "—"}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-400">Deadline</dt><dd className="font-medium text-slate-700">{s.applicationDeadline || "—"}</dd></div>
                  </dl>
                  {(s.eligibility?.length || s.tags?.length) ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(s.tags || []).slice(0, 2).map((t) => <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{t}</span>)}
                      {(s.eligibility || []).slice(0, 1).map((e) => <span key={e} className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700 ring-1 ring-amber-100">{e}</span>)}
                    </div>
                  ) : null}
                  <Link to={`/allScholership/${s._id}`} className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white">View details <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </div>
            ))}
            {scholarships.length < 4 && (
              <Link to="/allScholership" className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center hover:border-brand-200">
                <Bookmark className="h-8 w-8 text-slate-300" /><p className="mt-2 font-semibold text-slate-700">Add more</p><p className="text-sm text-slate-400">Browse and add up to {4 - scholarships.length} more</p>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
