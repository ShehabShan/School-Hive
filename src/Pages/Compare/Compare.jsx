import { useSearchParams, Link } from "react-router-dom";
import { Scale, X, Bookmark, ArrowRight, Trash2, Share2, Star, MapPin, Calendar, Award, Coins, Clock, GraduationCap, Building2, FileText, Tag, Trophy, Camera } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Stars from "../../Component/ui/Stars";
import CountdownBadge from "../../Component/scholarship/CountdownBadge";
import EmptyState from "../../Component/ui/EmptyState";
import toast from "react-hot-toast";
import useCompare from "../../Hooks/useCompare";

const fmt = (n, cur = "USD") => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(v); } catch { return `$${v.toLocaleString()}`; }
};

const placeholder = "https://placehold.co/600x400?text=Scholarship";

function Row({ label, icon: Icon, children }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <th className="sticky left-0 z-10 w-[180px] bg-slate-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
        <span className="flex items-center gap-1.5"><Icon className="h-3.5 w-3.5 text-slate-400" /> {label}</span>
      </th>
      {children}
    </tr>
  );
}

function Cell({ children, highlight }) {
  return <td className={`px-4 py-3 text-sm ${highlight ? "bg-emerald-50 ring-1 ring-emerald-100 font-semibold" : "bg-white"} text-slate-700`}>{children}</td>;
}

export default function Compare() {
  const [params, setParams] = useSearchParams();
  const ids = (params.get("ids") || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const axiosPublic = useAxiosPublic();
  const { remove: hookRemove, clear: hookClear } = useCompare();

  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ["compare", ids.join(",")],
    enabled: ids.length > 0,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    queryFn: async () => {
      const arr = await Promise.all(ids.map(async (id) => {
        try { const r = await axiosPublic.get(`/allScholership/${id}`); return r.data.data; } catch { return null; }
      }));
      const filtered = arr.filter(Boolean);
      if (filtered.length !== ids.length) toast.error(`${ids.length - filtered.length} scholarship(s) unavailable`);
      return filtered;
    },
  });

  const remove = (id) => {
    const next = ids.filter((x) => x !== String(id));
    if (next.length) setParams({ ids: next.join(",") }); else setParams({});
    hookRemove(id);
  };
  const clearAll = () => {
    setParams({});
    hookClear();
  };
  const share = async () => {
    const url = window.location.href;
    try { await navigator.clipboard.writeText(url); toast.success("Link copied!"); } catch { toast.error("Copy failed"); }
  };

  if (!ids.length) {
    return (
      <section className="bg-slate-50 py-20">
        <div className="container-page text-center">
          <EmptyState
            icon={Scale}
            title="Compare scholarships"
            message="Select up to 4 scholarships from the catalog (Scale icon) to compare fees, stipends, deadlines, ratings and eligibility side-by-side."
            action={<Link to="/allScholership" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white">Browse scholarships <ArrowRight className="h-4 w-4" /></Link>}
          />
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="bg-slate-50 py-10">
        <div className="container-page">
          <div className="mb-6 h-8 w-48 animate-pulse rounded-xl bg-slate-200" />
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">{Array.from({ length: ids.length }).map((_, i) => <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-100" />)}</div>
          </div>
        </div>
      </section>
    );
  }

  // helpers for highlights
  const fees = scholarships.map((s) => Number(s.applicationFees)).filter(Number.isFinite);
  const minFee = fees.length ? Math.min(...fees) : null;
  const maxRating = Math.max(...scholarships.map((s) => Number(s.rating) || 0), 0);
  const ranks = scholarships.map((s) => Number(s.universityWorldrank)).filter((n) => Number.isFinite(n) && n > 0);
  const bestRank = ranks.length ? Math.min(...ranks) : null;

  return (
    <section className="bg-slate-50 py-8">
      <div className="container-page">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900"><Scale className="h-6 w-6 text-brand-600" /> Compare <span className="rounded-full bg-white px-3 py-1 text-sm font-bold ring-1 ring-slate-200">{scholarships.length}/4</span></h1>
          <div className="flex items-center gap-2">
            <button onClick={share} className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Share2 className="h-4 w-4" /> Share</button>
            <button onClick={clearAll} className="inline-flex items-center gap-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"><Trash2 className="h-4 w-4" /> Clear</button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-soft">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 w-[180px] bg-slate-900 px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-white">Feature</th>
                {scholarships.map((s) => (
                  <th key={s._id} className="min-w-[220px] bg-white px-4 py-4 text-left">
                    <div className="relative overflow-hidden rounded-xl">
                      <img src={s.universityImage || placeholder} alt={s.universityName} className="h-32 w-full object-cover" onError={(e) => (e.currentTarget.src = placeholder)} />
                      <button onClick={() => remove(s._id)} aria-label="Remove" className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"><X className="h-4 w-4" /></button>
                      <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-brand-700">{s.scholarshipCategory || "—"}</span>
                      {s.status === "draft" && <span className="absolute left-2 top-10 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white">Draft</span>}
                    </div>
                    <p className="mt-2 line-clamp-1 font-bold text-slate-900">{s.universityName || "—"}</p>
                    <p className="text-xs text-slate-500">{s.scholarshipName || s.subjectName || "—"}</p>
                    <Link to={`/allScholership/${s._id}`} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700">View details <ArrowRight className="h-3 w-3" /></Link>
                  </th>
                ))}
                {scholarships.length < 4 && (
                  <th className="min-w-[220px] bg-slate-50 px-4 py-4">
                    <Link to="/allScholership" className="flex h-[160px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white p-4 text-center hover:border-brand-200">
                      <Bookmark className="h-8 w-8 text-slate-300" /><p className="mt-2 text-sm font-semibold text-slate-700">Add more</p><p className="text-xs text-slate-400">Browse and add up to {4 - scholarships.length} more</p>
                    </Link>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <Row label="University" icon={Building2}>
                {scholarships.map((s) => <Cell key={s._id}>{s.universityName || "—"}</Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Rank" icon={Trophy}>
                {scholarships.map((s) => {
                  const r = Number(s.universityWorldrank);
                  const isBest = bestRank !== null && r === bestRank;
                  return <Cell key={s._id} highlight={isBest}>{r ? `#${r}` : "—"}</Cell>;
                })}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Subject" icon={GraduationCap}>
                {scholarships.map((s) => <Cell key={s._id}>{s.subjectName || s.scholarshipName || "—"}</Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Degree" icon={Award}>
                {scholarships.map((s) => <Cell key={s._id}>{s.degree || "—"}</Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Location" icon={MapPin}>
                {scholarships.map((s) => {
                  const loc = [s.city, s.country].filter(Boolean).join(", ");
                  return <Cell key={s._id}>{loc || "—"}</Cell>;
                })}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Deadline" icon={Calendar}>
                {scholarships.map((s) => <Cell key={s._id}><CountdownBadge deadline={s.applicationDeadline} /></Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Rating" icon={Star}>
                {scholarships.map((s) => {
                  const isBest = Number(s.rating) === maxRating && maxRating > 0;
                  return <Cell key={s._id} highlight={isBest}><span className="inline-flex items-center gap-1"><Stars rating={s.rating} showValue /> <span className="text-xs text-slate-400">({s.reviewsCount || 0})</span></span></Cell>;
                })}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Application Fee" icon={Coins}>
                {scholarships.map((s) => {
                  const isBest = minFee !== null && Number(s.applicationFees) === minFee;
                  return <Cell key={s._id} highlight={isBest}>{fmt(s.applicationFees, s.currency)}</Cell>;
                })}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Service Charge" icon={Coins}>
                {scholarships.map((s) => <Cell key={s._id}>{fmt(s.serviceCharge, s.currency)}</Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Total Cost" icon={Coins}>
                {scholarships.map((s) => {
                  const total = (Number(s.applicationFees) || 0) + (Number(s.serviceCharge) || 0);
                  const totals = scholarships.map((x) => (Number(x.applicationFees) || 0) + (Number(x.serviceCharge) || 0));
                  const bestTotal = Math.min(...totals);
                  return <Cell key={s._id} highlight={total === bestTotal}><span className="font-extrabold">{fmt(total, s.currency)}</span></Cell>;
                })}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Stipend" icon={Coins}>
                {scholarships.map((s) => <Cell key={s._id} highlight={Number(s.stipend) > 0}>{s.stipend ? fmt(s.stipend, s.currency) : "—"}</Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Duration" icon={Clock}>
                {scholarships.map((s) => <Cell key={s._id}>{s.duration || "—"}</Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Benefits" icon={Award}>
                {scholarships.map((s) => <Cell key={s._id}>{(s.benefits || []).slice(0, 2).join(" • ") || "—"}</Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Eligibility" icon={FileText}>
                {scholarships.map((s) => <Cell key={s._id}>{(s.eligibility || []).slice(0, 2).join(" • ") || "—"}</Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Tags" icon={Tag}>
                {scholarships.map((s) => <Cell key={s._id}>{(s.tags || []).slice(0, 3).join(", ") || "—"}</Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Description" icon={FileText}>
                {scholarships.map((s) => <Cell key={s._id}><span className="line-clamp-3 text-xs leading-relaxed">{s.scholarshipDescription?.slice(0, 140) || "—"}{s.scholarshipDescription?.length > 140 ? "…" : ""}</span></Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Media" icon={Camera}>
                {scholarships.map((s) => <Cell key={s._id}>{(s.gallery?.length || 0) + (s.videoUrl ? 1 : 0)} item{(s.gallery?.length || 0) + (s.videoUrl ? 1 : 0) === 1 ? "" : "s"} {s.videoUrl ? "• video" : ""}</Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
              <Row label="Action" icon={ArrowRight}>
                {scholarships.map((s) => <Cell key={s._id}><Link to={`/allScholership/${s._id}`} className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800">View <ArrowRight className="h-3 w-3" /></Link></Cell>)}
                {scholarships.length < 4 && <td className="bg-slate-50" />}
              </Row>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-slate-400">Tip: cheapest fee and highest rating are highlighted. Drafts are hidden from public but appear here if you added them.</p>
      </div>
    </section>
  );
}
