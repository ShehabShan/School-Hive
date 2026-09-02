import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { Search, GraduationCap, SlidersHorizontal, X, LayoutGrid, List, ChevronLeft, ChevronRight, Scale } from "lucide-react";
import useScholership from "../../Hooks/useScholership";
import { useSaved, useToggleSave } from "../../Hooks/useSaved";
import useAuth from "../../Hooks/useAuth";
import ScholarshipGrid, { ScholarshipList } from "../../Component/scholarship/ScholarshipGrid";
import FilterChip from "../../Component/scholarship/FilterChip";
import useCompare from "../../Hooks/useCompare";
import "./AllScholership.css";

const CATEGORY_OPTS = ["", "Partial", "Full-fund", "Self-fund"];
const DEGREE_OPTS = ["", "Diploma", "Bachelor", "Masters", "PhD"];
const SUBJECT_OPTS = ["", "Agriculture", "Engineering", "Doctor"];
const SORT_OPTS = [
  { v: "recommended", l: "Recommended" },
  { v: "deadline", l: "Deadline (soonest)" },
  { v: "rating", l: "Highest rated" },
  { v: "newest", l: "Newest" },
  { v: "fees-asc", l: "Fee: low → high" },
  { v: "fees-desc", l: "Fee: high → low" },
];

function useDebounced(v, ms = 400) {
  const [d, setD] = useState(v);
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return d;
}

export default function AllScholership() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const subject = searchParams.get("subject") || "";
  const degree = searchParams.get("degree") || "";
  const country = searchParams.get("country") || "";
  const maxFees = searchParams.get("maxFees") || "";
  const sort = searchParams.get("sort") || "recommended";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const view = searchParams.get("view") || "grid";

  const [localQ, setLocalQ] = useState(q);
  const debouncedQ = useDebounced(localQ, 400);
  const [showFilters, setShowFilters] = useState(false);
  const [localCountry, setLocalCountry] = useState(country);
  const [localMaxFees, setLocalMaxFees] = useState(maxFees);
  const { ids: compareIds, toggle: toggleCompare, clear: clearCompare } = useCompare();

  useEffect(() => setLocalQ(q), [q]);
  useEffect(() => setLocalCountry(country), [country]);
  useEffect(() => setLocalMaxFees(maxFees), [maxFees]);

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v === null || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    if (patch.q !== undefined || patch.category !== undefined || patch.subject !== undefined || patch.degree !== undefined || patch.country !== undefined || patch.maxFees !== undefined || patch.sort !== undefined) {
      if (!patch.page) next.set("page", "1");
    }
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (debouncedQ !== q) updateParams({ q: debouncedQ });

  }, [debouncedQ]);

  const serverParams = useMemo(() => {
    const p = {};
    if (debouncedQ) p.q = debouncedQ;
    if (category) p.category = category;
    if (subject) p.subject = subject;
    if (degree) p.degree = degree;
    if (country) p.country = country;
    if (maxFees) p.maxFees = maxFees;
    if (sort) p.sort = sort;
    p.page = page;
    p.limit = view === "list" ? 10 : 12;
    return p;
  }, [debouncedQ, category, subject, degree, country, maxFees, sort, page, view]);

  const { data: resp, isLoading } = useScholership(serverParams);
  // Fallback client-side filtering — live server-six-vert still old (returns all 37 for any q)
  // When server is deployed with faceted filter, this client filter is redundant but harmless.
  const raw = resp?.data || [];
  const filteredSorted = useMemo(() => {
    let arr = [...raw];
    // text q
    if (debouncedQ) {
      const rx = new RegExp(debouncedQ.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      arr = arr.filter((s) => rx.test(s.universityName || "") || rx.test(s.scholarshipCategory || "") || rx.test(s.subjectName || "") || rx.test(s.scholarshipDescription || "") || rx.test(s.country || "") || rx.test(s.city || "") || rx.test(s.degree || ""));
    }
    if (category) arr = arr.filter((s) => s.scholarshipCategory === category);
    if (subject) arr = arr.filter((s) => s.subjectName === subject);
    if (degree) arr = arr.filter((s) => s.degree === degree);
    if (country) arr = arr.filter((s) => String(s.country).toLowerCase() === country.toLowerCase());
    if (maxFees !== "" && maxFees !== null) {
      const mf = Number(maxFees);
      if (Number.isFinite(mf)) arr = arr.filter((s) => Number(s.applicationFees) <= mf);
    }
    // sort
    const srt = String(sort || "recommended").toLowerCase();
    if (srt === "rating" || srt === "recommended") arr.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0) || (Number(b.reviewsCount) || 0) - (Number(a.reviewsCount) || 0));
    else if (srt === "deadline") arr.sort((a, b) => String(a.applicationDeadline).localeCompare(String(b.applicationDeadline)));
    else if (srt === "fees-asc") arr.sort((a, b) => Number(a.applicationFees) - Number(b.applicationFees));
    else if (srt === "fees-desc") arr.sort((a, b) => Number(b.applicationFees) - Number(a.applicationFees));
    else if (srt === "newest") arr.sort((a, b) => String(b.postDate).localeCompare(String(a.postDate)));
    return arr;
  }, [raw, debouncedQ, category, subject, degree, country, maxFees, sort]);

  // Prefer server pagination when live (total differs from client count)
  let list, total, totalPages;
  const serverHasFilter = resp?.total !== undefined && resp.total !== filteredSorted.length;
  if (serverHasFilter) {
    list = raw;
    total = resp.total;
    totalPages = resp.totalPages || 1;
  } else {
    total = filteredSorted.length;
    const limit = view === "list" ? 10 : 12;
    totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    list = filteredSorted.slice(start, start + limit);
  }

  const { data: savedDocs } = useSaved();
  const savedIds = useMemo(() => new Set((savedDocs || []).map((d) => String(d.scholarshipId))), [savedDocs]);
  const toggleSave = useToggleSave();

  const handleToggleSave = (s) => {
    if (!user) return navigate("/signIn");
    toggleSave.mutate(String(s._id));
  };
  const handleToggleCompare = (s) => {
    toggleCompare(String(s._id));
  };

  const activeFilters = [];
  if (q) activeFilters.push({ k: "q", label: `"${q}"`, v: "" });
  if (category) activeFilters.push({ k: "category", label: category, v: "" });
  if (subject) activeFilters.push({ k: "subject", label: subject, v: "" });
  if (degree) activeFilters.push({ k: "degree", label: degree, v: "" });
  if (country) activeFilters.push({ k: "country", label: country, v: "" });
  if (maxFees) activeFilters.push({ k: "maxFees", label: `≤ $${maxFees} fee`, v: "" });

  const clearAll = () => {
    setLocalQ("");
    setLocalCountry("");
    setLocalMaxFees("");
    setSearchParams(new URLSearchParams({ sort: "recommended", view }), { replace: true });
  };

  return (
    <section className="main-scholarships-wrapper relative overflow-hidden bg-slate-50 pb-20">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />

      <div className="relative bg-gradient-to-b from-brand-700 to-brand-900 pb-20 pt-16 text-white">
        <div className="scholarships-header-inner container-page text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 ring-1 ring-white/20 backdrop-blur">
            <GraduationCap className="h-3.5 w-3.5" /> Explore opportunities
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white md:text-5xl">All Scholarships</h1>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">Search, filter and compare the full catalog. Save favorites and never miss a deadline.</p>

          <div className="mx-auto mt-8 max-w-3xl">
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4 shadow-lift">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                type="text"
                className="w-full bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                placeholder="Search university, subject, category, country..."
                value={localQ}
                onChange={(e) => setLocalQ(e.target.value)}
                aria-label="Search scholarships"
              />
              {localQ && (
                <button onClick={() => setLocalQ("")} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Clear search"><X className="h-4 w-4" /></button>
              )}
              <button onClick={() => setShowFilters((v) => !v)} className={`hidden shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold sm:inline-flex ${showFilters ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters {activeFilters.length ? `(${activeFilters.length})` : ""}
              </button>
              <span className="hidden shrink-0 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white sm:inline-flex">{total} results</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })} className="rounded-xl border-0 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
                {SORT_OPTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
              <div className="inline-flex overflow-hidden rounded-xl bg-white/90 p-1 shadow-sm backdrop-blur">
                <button onClick={() => updateParams({ view: "grid" })} className={`rounded-lg px-3 py-1.5 ${view === "grid" ? "bg-slate-900 text-white" : "text-slate-600"}`} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></button>
                <button onClick={() => updateParams({ view: "list" })} className={`rounded-lg px-3 py-1.5 ${view === "list" ? "bg-slate-900 text-white" : "text-slate-600"}`} aria-label="List view"><List className="h-4 w-4" /></button>
              </div>
              <button onClick={() => setShowFilters((v) => !v)} className="inline-flex items-center gap-1 rounded-xl bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm sm:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page relative -mt-8">
        {activeFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-soft">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Active:</span>
            {activeFilters.map((f) => <FilterChip key={f.k} label={f.label} onRemove={() => updateParams({ [f.k]: "" })} />)}
            <button onClick={clearAll} className="ml-auto text-xs font-semibold text-brand-600 hover:text-brand-700">Clear all</button>
          </div>
        )}

        <div className="scholarships-layout grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className={`scholarships-aside ${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-20 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Filters</h3>
                <button onClick={clearAll} className="text-xs font-semibold text-slate-500 hover:text-slate-700">Reset</button>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</span>
                  <select value={category} onChange={(e) => updateParams({ category: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">
                    <option value="">All categories</option>
                    {CATEGORY_OPTS.filter(Boolean).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Degree</span>
                  <select value={degree} onChange={(e) => updateParams({ degree: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">
                    <option value="">All degrees</option>
                    {DEGREE_OPTS.filter(Boolean).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Field</span>
                  <select value={subject} onChange={(e) => updateParams({ subject: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">
                    <option value="">All fields</option>
                    {SUBJECT_OPTS.filter(Boolean).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Country</span>
                  <div className="flex gap-2">
                    <input value={localCountry} onChange={(e) => setLocalCountry(e.target.value)} placeholder="e.g. United Kingdom" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
                    <button onClick={() => updateParams({ country: localCountry.trim() })} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">Apply</button>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Max fee (USD)</span>
                  <div className="flex gap-2">
                    <input type="number" min="0" value={localMaxFees} onChange={(e) => setLocalMaxFees(e.target.value)} placeholder="e.g. 500" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
                    <button onClick={() => updateParams({ maxFees: localMaxFees })} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">Apply</button>
                  </div>
                  <input type="range" min="0" max="2000" step="50" value={localMaxFees || 2000} onChange={(e) => { setLocalMaxFees(e.target.value); updateParams({ maxFees: e.target.value === "2000" ? "" : e.target.value }); }} className="mt-3 w-full accent-brand-600" />
                </label>

                <p className="rounded-xl bg-brand-50 p-3 text-xs leading-relaxed text-brand-700">Tip: combine filters — e.g. <b>Full-fund + Masters in UK</b> — then sort by <b>Deadline</b> to catch closing soon.</p>
              </div>
            </div>
          </aside>

          <div className="scholarships-content">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-slate-500">Showing <b className="text-slate-900">{list.length}</b> of <b className="text-slate-900">{total}</b> {total === 1 ? "scholarship" : "scholarships"}</span>
              <span className="hidden text-slate-400 sm:inline">Page {page} of {totalPages}</span>
            </div>

            {view === "list" ? (
              <ScholarshipList scholarships={list} isLoading={isLoading} savedIds={savedIds} onToggleSave={handleToggleSave} compareIds={compareIds} onToggleCompare={handleToggleCompare} emptyTitle={debouncedQ || activeFilters.length ? "No matching scholarships" : "No scholarships yet"} emptyMessage={debouncedQ ? "Try broadening your search or clearing filters." : "Check back soon — new opportunities are added regularly."} emptyAction={activeFilters.length || debouncedQ ? <button onClick={clearAll} className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Clear filters</button> : <Link to="/" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white">Back to home</Link>} />
            ) : (
              <ScholarshipGrid scholarships={list} isLoading={isLoading} savedIds={savedIds} onToggleSave={handleToggleSave} compareIds={compareIds} onToggleCompare={handleToggleCompare} emptyTitle={debouncedQ || activeFilters.length ? "No matching scholarships" : "No scholarships yet"} emptyMessage={debouncedQ ? "Try broadening your search or clearing filters." : "Check back soon — new opportunities are added regularly."} emptyAction={activeFilters.length || debouncedQ ? <button onClick={clearAll} className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Clear filters</button> : <Link to="/" className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white">Back to home</Link>} />
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button disabled={page <= 1} onClick={() => updateParams({ page: page - 1 })} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  return (
                    <button key={p} onClick={() => updateParams({ page: p })} className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold ${p === page ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{p}</button>
                  );
                })}
                <button disabled={page >= totalPages} onClick={() => updateParams({ page: page + 1 })} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
              </div>
            )}
          </div>
        </div>
      </div>

      {compareIds.size > 0 && (
        <div className="fixed bottom-4 left-1/2 z-40 flex max-w-[min(640px,95vw)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lift">
          <Scale className="h-5 w-5 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">{compareIds.size} selected</span>
          <span className="hidden text-xs text-slate-400 sm:inline">Compare up to 4</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => clearCompare()} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">Clear</button>
            <Link to={`/compare?ids=${[...compareIds].join(",")}`} className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800">Compare</Link>
          </div>
        </div>
      )}
    </section>
  );
}
