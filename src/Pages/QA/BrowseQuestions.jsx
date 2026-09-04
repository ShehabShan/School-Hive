import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { Search, SlidersHorizontal, X, Plus, FilterX, Inbox, Loader2 } from "lucide-react";
import FilterChip from "../../Component/scholarship/FilterChip";
import { QUESTION_CATEGORIES, STUDY_LEVELS, COUNTRIES } from "../../constants/qa";
import { QuestionListItem } from "../../Component/QA/QuestionCard";

const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";
const SORTS = [["newest","Newest"],["votes","Top voted"],["views","Most viewed"],["relevance","Relevance"]];

function useDebounced(v, ms=400){
  const [d,setD]=useState(v);
  useEffect(()=>{ const t=setTimeout(()=>setD(v),ms); return ()=>clearTimeout(t); },[v,ms]);
  return d;
}

function BrowseSkeleton(){
  return (
    <div className="space-y-4">
      {Array.from({length:5}).map((_,i)=> (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-slate-100" /><div className="h-3 w-24 rounded bg-slate-100" /><div className="h-3 w-12 rounded bg-slate-100" /></div>
          <div className={`mt-3 h-4 rounded bg-slate-200 ${i%2?"w-2/3":"w-5/6"}`} />
          <div className="mt-2 h-3 w-full rounded bg-slate-100" />
          <div className="mt-1 h-3 w-3/4 rounded bg-slate-100" />
          <div className="mt-3 flex gap-1.5"><div className="h-5 w-20 rounded-full bg-slate-100" /><div className="h-5 w-16 rounded-full bg-slate-100" /></div>
          <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3"><div className="h-3 w-12 rounded bg-slate-100" /><div className="h-3 w-16 rounded bg-slate-100" /><div className="h-3 w-12 rounded bg-slate-100" /></div>
        </div>
      ))}
    </div>
  );
}

function FiltersBody({ updateParams, tag, destinationCountry, homeCountry, studyLevel }){
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-xs font-extrabold tracking-wide text-slate-500 uppercase">Tag</span>
        <input value={tag} onChange={e=>updateParams({tag:e.target.value.toLowerCase()})} placeholder="e.g. ielts, canada" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-50 focus:outline-none" />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-extrabold tracking-wide text-slate-500 uppercase">Destination country</span>
        <select value={destinationCountry} onChange={e=>updateParams({destinationCountry:e.target.value})} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-50 focus:outline-none">
          <option value="">Any</option>
          {COUNTRIES.map(c=> <option key={c.value} value={c.value}>{c.flag} {c.label}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-extrabold tracking-wide text-slate-500 uppercase">Home country</span>
        <select value={homeCountry} onChange={e=>updateParams({homeCountry:e.target.value})} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-50 focus:outline-none">
          <option value="">Any</option>
          {COUNTRIES.map(c=> <option key={c.value} value={c.value}>{c.flag} {c.label}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-extrabold tracking-wide text-slate-500 uppercase">Study level</span>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={()=>updateParams({studyLevel:""})} className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors ${!studyLevel?"bg-slate-900 text-white ring-slate-900":"bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}>Any</button>
          {STUDY_LEVELS.map(s=> (
            <button key={s} type="button" onClick={()=>updateParams({studyLevel: studyLevel===s?"":s})} className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ring-1 transition-colors ${studyLevel===s?"bg-slate-900 text-white ring-slate-900":"bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}>{s}</button>
          ))}
        </div>
      </label>
      <p className="rounded-xl bg-brand-50 px-3 py-2.5 text-xs leading-relaxed text-brand-700">The corridor filter — <b>Destination × Home × Level</b> — is what no Facebook group search can do. Try <b>Canada · Bangladesh · masters</b>.</p>
    </div>
  );
}

export default function BrowseQuestions(){
  const [searchParams,setSearchParams]=useSearchParams();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const tag = searchParams.get("tag") || "";
  const destinationCountry = searchParams.get("destinationCountry") || "";
  const homeCountry = searchParams.get("homeCountry") || "";
  const studyLevel = searchParams.get("studyLevel") || "";
  const sort = searchParams.get("sort") || "newest";

  const [localQ,setLocalQ]=useState(q);
  const debouncedQ = useDebounced(localQ,400);
  const [drawerOpen,setDrawerOpen]=useState(false);
  const sentinelRef = useRef(null);

  // clean deprecated view/page params for fast single-column post style
  useEffect(()=> {
    if (searchParams.get("view") || searchParams.get("page")) {
      const n=new URLSearchParams(searchParams);
      n.delete("view"); n.delete("page");
      setSearchParams(n,{replace:true});
    }
  }, [searchParams, setSearchParams]);
  useEffect(()=> setLocalQ(q),[q]);

  const updateParams=(patch)=>{
    const next=new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k,v])=>{
      if(v===""||v==null) next.delete(k); else next.set(k,String(v));
    });
    setSearchParams(next,{replace:true});
  };
  useEffect(()=>{ if(debouncedQ!==q) updateParams({ q: debouncedQ }); },[debouncedQ, q]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError } = useInfiniteQuery({
    queryKey: ["questions-browse", { q: debouncedQ, category, tag, destinationCountry, homeCountry, studyLevel, sort }],
    initialPageParam: 1,
    queryFn: async ({ pageParam })=>{
      const params={};
      if(debouncedQ) params.q=debouncedQ;
      if(category) params.category=category;
      if(tag) params.tag=tag;
      if(destinationCountry) params.destinationCountry=destinationCountry;
      if(homeCountry) params.homeCountry=homeCountry;
      if(studyLevel) params.studyLevel=studyLevel;
      if(sort) params.sort=sort;
      params.page=pageParam;
      params.limit=12;
      const res= await axios.get(`${baseURL}/questions`, { params });
      return res.data;
    },
    getNextPageParam: (lastPage)=> {
      const cur = lastPage?.page ?? 1;
      const totalPages = lastPage?.totalPages ?? 1;
      return cur < totalPages ? cur + 1 : undefined;
    },
  });

  const pages = data?.pages || [];
  const list = pages.flatMap(p=> p.data || []);
  const total = pages[0]?.total ?? list.length;
  const activeFilters=[];
  if(q) activeFilters.push({k:"q", label:`"${q}"`});
  if(tag) activeFilters.push({k:"tag", label:`#${tag}`});
  if(destinationCountry) activeFilters.push({k:"destinationCountry", label:destinationCountry});
  if(homeCountry) activeFilters.push({k:"homeCountry", label:homeCountry});
  if(studyLevel) activeFilters.push({k:"studyLevel", label:studyLevel});

  const clearAll=()=>{
    setLocalQ("");
    setSearchParams(new URLSearchParams({ sort }),{replace:true});
  };

  const activeCategoryLabel = QUESTION_CATEGORIES.find(c=>c.value===category)?.label;
  const isFiltered = activeFilters.length>0 || Boolean(category) || Boolean(debouncedQ);

  // reset scroll on filter/sort/search change
  useEffect(()=>{ window.scrollTo({ top: 0, behavior: "smooth" }); }, [debouncedQ, category, tag, destinationCountry, homeCountry, studyLevel, sort]);

  // IntersectionObserver sentinel for infinite scroll
  useEffect(()=>{
    if(!sentinelRef.current) return;
    if(!hasNextPage || isFetchingNextPage) return;
    const el = sentinelRef.current;
    const obs = new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting && hasNextPage && !isFetchingNextPage){
        fetchNextPage();
      }
    }, { rootMargin: "200px", threshold: 0.1 });
    obs.observe(el);
    return ()=> obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, list.length]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Workspace header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 pt-6 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{activeCategoryLabel || (debouncedQ ? `Search: “${debouncedQ}”` : "All Questions")}</h1>
              <p className="mt-1 text-sm text-slate-500">{total} question{total===1?"":"s"} · permanent, sourced, searchable — not another group chat</p>
            </div>
            <Link to="/questions/ask" className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:from-brand-700 hover:to-indigo-700">
              <Plus className="h-4 w-4" /> Ask a question
            </Link>
          </div>

          {/* Search + controls */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-all focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-50">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input value={localQ} onChange={e=>setLocalQ(e.target.value)} placeholder="Search questions, tags, context…" className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none" aria-label="Search questions" />
              {localQ && <button onClick={()=>setLocalQ("")} className="rounded-full p-1 text-slate-400 hover:bg-slate-100" aria-label="Clear search"><X className="h-3.5 w-3.5" /></button>}
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-0.5 shadow-sm">
                {SORTS.map(([v,l])=> (
                  <button key={v} onClick={()=>updateParams({sort:v})} className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${sort===v?"bg-slate-900 text-white":"text-slate-500 hover:text-slate-800"}`}>{l}</button>
                ))}
              </div>
              <button onClick={()=>setDrawerOpen(true)} className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 lg:hidden">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters{activeFilters.length?` (${activeFilters.length})`:""}
              </button>
            </div>
          </div>

          {/* Category pills — landing nav */}
          <div className="scrollbar-none mt-4 flex gap-1.5 overflow-x-auto pb-4">
            <button onClick={()=>updateParams({category:""})} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ring-1 transition-colors ${!category?"bg-brand-600 text-white ring-brand-600":"bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}>All</button>
            {QUESTION_CATEGORIES.map(c=> (
              <button key={c.value} onClick={()=>updateParams({category: category===c.value?"":c.value})} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold ring-1 transition-colors ${category===c.value?"bg-brand-600 text-white ring-brand-600":"bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}>{c.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Active filters */}
        {activeFilters.length>0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Filters</span>
            {activeFilters.map(f=> <FilterChip key={f.k} label={f.label} onRemove={()=>updateParams({[f.k]:""})} />)}
            <button onClick={clearAll} className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"><FilterX className="h-3.5 w-3.5" /> Clear all</button>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900"><SlidersHorizontal className="h-4 w-4 text-slate-400" /> Refine</h3>
                {isFiltered && <button onClick={clearAll} className="text-xs font-bold text-rose-600 hover:text-rose-700">Reset</button>}
              </div>
              <FiltersBody updateParams={updateParams} tag={tag} destinationCountry={destinationCountry} homeCountry={homeCountry} studyLevel={studyLevel} />
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
              <span className="hidden sm:block">Showing {list.length} of {total}</span>
              <span className="sm:hidden">{list.length} of {total}</span>
            </div>

            {isLoading ? <BrowseSkeleton /> : isError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700">Failed to load questions.</div>
            ) : list.length===0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <Inbox className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 font-extrabold text-slate-800">{isFiltered ? "No matching questions" : "No questions yet"}</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{isFiltered ? "Try broadening the filters or search — or be the first to ask this." : "Be the founding voice — the first questions set the tone for the corridor."}</p>
                <div className="mt-4 flex justify-center gap-2">
                  {isFiltered && <button onClick={clearAll} className="btn btn-sm btn-outline">Clear filters</button>}
                  <Link to="/questions/ask" className="btn btn-sm btn-primary">Ask a question</Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">{list.map(q=> <QuestionListItem key={q._id} q={q} />)}</div>
            )}

            {/* Infinite sentinel + Load more fallback + end */}
            {list.length > 0 && hasNextPage && (
              <div ref={sentinelRef} className="mt-6 flex justify-center py-4">
                {isFetchingNextPage ? (
                  <span className="inline-flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading more…</span>
                ) : (
                  <button onClick={()=>fetchNextPage()} className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">Load more</button>
                )}
              </div>
            )}
            {list.length > 0 && !hasNextPage && <p className="mt-6 text-center text-xs text-slate-400">You’ve reached the end · {total} questions</p>}
            {isFetchingNextPage && list.length > 0 && <div className="mt-3"><BrowseSkeleton /></div>}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={()=>setDrawerOpen(false)} />
            <motion.div initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}} transition={{type:"spring", damping:30, stiffness:300}} className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-lift lg:hidden">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-base font-extrabold text-slate-900"><SlidersHorizontal className="h-4 w-4 text-slate-400" /> Refine</h3>
                <button onClick={()=>setDrawerOpen(false)} className="rounded-full p-2 hover:bg-slate-100" aria-label="Close filters"><X className="h-5 w-5" /></button>
              </div>
              <FiltersBody updateParams={(p)=>updateParams(p)} tag={tag} destinationCountry={destinationCountry} homeCountry={homeCountry} studyLevel={studyLevel} />
              <div className="mt-5 flex gap-2">
                {isFiltered && <button onClick={()=>{clearAll();}} className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-bold text-rose-600">Reset</button>}
                <button onClick={()=>setDrawerOpen(false)} className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-bold text-white">Show {total} results</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
