import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, SlidersHorizontal, X, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import FilterChip from "../../Component/scholarship/FilterChip";
import { QUESTION_CATEGORIES, STUDY_LEVELS } from "../../constants/qa";
import { QuestionCard, QuestionListItem } from "../../Component/QA/QuestionCard";

function useDebounced(v, ms=400){
  const [d,setD]=useState(v);
  useEffect(()=>{ const t=setTimeout(()=>setD(v),ms); return ()=>clearTimeout(t); },[v,ms]);
  return d;
}

export default function BrowseQuestions(){
  const [searchParams,setSearchParams]=useSearchParams();
  const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const tag = searchParams.get("tag") || "";
  const destinationCountry = searchParams.get("destinationCountry") || "";
  const homeCountry = searchParams.get("homeCountry") || "";
  const studyLevel = searchParams.get("studyLevel") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, parseInt(searchParams.get("page")||"1",10)||1);
  const view = searchParams.get("view") || "grid";

  const [localQ,setLocalQ]=useState(q);
  const debouncedQ = useDebounced(localQ,400);
  const [showFilters,setShowFilters]=useState(false);

  useEffect(()=> setLocalQ(q),[q]);

  const updateParams=(patch)=>{
    const next=new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k,v])=>{
      if(v===""||v==null) next.delete(k); else next.set(k,String(v));
    });
    if(patch.q!==undefined||patch.category!==undefined||patch.tag!==undefined||patch.destinationCountry!==undefined||patch.homeCountry!==undefined||patch.studyLevel!==undefined||patch.sort!==undefined){
      if(patch.page===undefined) next.set("page","1");
    }
    setSearchParams(next,{replace:true});
  };
  useEffect(()=>{ if(debouncedQ!==q) updateParams({ q: debouncedQ }); },[debouncedQ]);

  const queryKey = ["questions-browse", { q: debouncedQ, category, tag, destinationCountry, homeCountry, studyLevel, sort, page, view }];
  const { data: resp, isLoading } = useQuery({
    queryKey,
    queryFn: async ()=>{
      const params={};
      if(debouncedQ) params.q=debouncedQ;
      if(category) params.category=category;
      if(tag) params.tag=tag;
      if(destinationCountry) params.destinationCountry=destinationCountry;
      if(homeCountry) params.homeCountry=homeCountry;
      if(studyLevel) params.studyLevel=studyLevel;
      if(sort) params.sort=sort;
      params.page=page;
      params.limit= view==="list" ? 10 : 12;
      const res= await axios.get(`${baseURL}/questions`, { params });
      return res.data;
    }
  });

  const list = resp?.data || [];
  const total = resp?.total ?? list.length;
  const totalPages = resp?.totalPages || Math.max(1, Math.ceil(total / (view==="list"?10:12)));

  const activeFilters=[];
  if(q) activeFilters.push({k:"q", label:`"${q}"`});
  if(category) activeFilters.push({k:"category", label: category});
  if(tag) activeFilters.push({k:"tag", label: tag});
  if(destinationCountry) activeFilters.push({k:"destinationCountry", label: destinationCountry});
  if(homeCountry) activeFilters.push({k:"homeCountry", label: homeCountry});
  if(studyLevel) activeFilters.push({k:"studyLevel", label: studyLevel});

  const clearAll=()=>{
    setLocalQ("");
    setSearchParams(new URLSearchParams({ sort:"newest", view }),{replace:true});
  };

  return (
    <section className="bg-slate-50 pb-16">
      <div className="bg-gradient-to-b from-brand-700 to-brand-900 py-10 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold">Browse Questions</h1>
          <p className="mx-auto mt-2 max-w-xl text-brand-100 text-sm">Search, filter by category, tag, country, level — mobile-friendly with 400ms debounced search.</p>
          <div className="mx-auto mt-6 max-w-3xl flex items-center gap-2 rounded-2xl bg-white p-2 pl-4 shadow">
            <Search className="h-5 w-5 text-slate-400" />
            <input value={localQ} onChange={e=>setLocalQ(e.target.value)} placeholder="Search title, body, tags…" className="w-full bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none" aria-label="Search questions" />
            {localQ && <button onClick={()=>setLocalQ("")} className="p-1.5 text-slate-400"><X className="h-4 w-4" /></button>}
            <button onClick={()=>setShowFilters(v=>!v)} className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold ${showFilters?"bg-brand-600 text-white":"bg-slate-100 text-slate-600"}`}><SlidersHorizontal className="h-3.5 w-3.5"/>Filters {activeFilters.length?`(${activeFilters.length})`:""}</button>
            <span className="hidden sm:inline-flex rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">{total} results</span>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <select value={sort} onChange={e=>updateParams({sort:e.target.value})} className="rounded-xl bg-white/90 px-3 py-2 text-sm text-slate-700">
              <option value="newest">Newest</option>
              <option value="votes">Most votes</option>
              <option value="views">Most views</option>
              <option value="relevance">Relevance</option>
            </select>
            <div className="inline-flex bg-white/90 rounded-xl p-1">
              <button onClick={()=>updateParams({view:"grid"})} className={`rounded-lg px-3 py-1.5 ${view==="grid"?"bg-slate-900 text-white":"text-slate-600"}`}><LayoutGrid className="h-4 w-4"/></button>
              <button onClick={()=>updateParams({view:"list"})} className={`rounded-lg px-3 py-1.5 ${view==="list"?"bg-slate-900 text-white":"text-slate-600"}`}><List className="h-4 w-4"/></button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        {activeFilters.length>0 && (
          <div className="mb-4 flex flex-wrap gap-2 bg-white p-3 rounded-2xl shadow">
            <span className="text-xs font-semibold text-slate-400">Active:</span>
            {activeFilters.map(f=> <FilterChip key={f.k} label={f.label} onRemove={()=>updateParams({[f.k]:""})} />)}
            <button onClick={clearAll} className="ml-auto text-xs font-semibold text-brand-600">Clear all</button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className={`${showFilters?"block":"hidden"} lg:block`}>
            <div className="sticky top-20 bg-white p-5 rounded-2xl border shadow-sm space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold">Filters</h3><button onClick={clearAll} className="text-xs text-slate-500">Reset</button></div>
              <label className="block"><span className="text-xs font-semibold text-slate-500">Category</span>
                <select value={category} onChange={e=>updateParams({category:e.target.value})} className="w-full mt-1 rounded-xl border px-3 py-2 text-sm">
                  <option value="">All</option>
                  {QUESTION_CATEGORIES.map(c=> <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </label>
              <label className="block"><span className="text-xs font-semibold text-slate-500">Tag</span>
                <input value={tag} onChange={e=>updateParams({tag:e.target.value.toLowerCase()})} placeholder="e.g. ielts" className="w-full mt-1 rounded-xl border px-3 py-2 text-sm" />
              </label>
              <label className="block"><span className="text-xs font-semibold text-slate-500">Destination country</span>
                <input value={destinationCountry} onChange={e=>updateParams({destinationCountry:e.target.value})} placeholder="e.g. Canada" className="w-full mt-1 rounded-xl border px-3 py-2 text-sm" />
              </label>
              <label className="block"><span className="text-xs font-semibold text-slate-500">Home country</span>
                <input value={homeCountry} onChange={e=>updateParams({homeCountry:e.target.value})} placeholder="e.g. Bangladesh" className="w-full mt-1 rounded-xl border px-3 py-2 text-sm" />
              </label>
              <label className="block"><span className="text-xs font-semibold text-slate-500">Study level</span>
                <select value={studyLevel} onChange={e=>updateParams({studyLevel:e.target.value})} className="w-full mt-1 rounded-xl border px-3 py-2 text-sm">
                  <option value="">All</option>
                  {STUDY_LEVELS.map(s=> <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <p className="text-xs bg-brand-50 p-2 rounded-xl text-brand-700">Try: <b>Canada + Bangladesh + Masters</b> → 2 clicks filter path.</p>
            </div>
          </aside>

          <div>
            <div className="mb-3 text-sm text-slate-500">Showing <b className="text-slate-900">{list.length}</b> of <b className="text-slate-900">{total}</b> • Page {page} of {totalPages}</div>
            {isLoading ? <div className="text-center py-10">Loading…</div> : list.length===0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border"><p className="font-semibold">No matching questions</p><p className="text-sm opacity-60">Try broadening filters or search.</p><button onClick={clearAll} className="mt-3 btn btn-sm btn-primary">Clear filters</button></div>
            ) : view==="list" ? (
              <div className="space-y-3">{list.map(q=> <QuestionListItem key={q._id} q={q} />)}</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">{list.map(q=> <QuestionCard key={q._id} q={q} />)}</div>
            )}

            {totalPages>1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button disabled={page<=1} onClick={()=>updateParams({page: page-1})} className="h-10 w-10 border rounded-xl bg-white disabled:opacity-40"><ChevronLeft className="h-4 w-4 mx-auto"/></button>
                {Array.from({length: Math.min(5,totalPages)},(_,i)=>{
                  let p; if(totalPages<=5) p=i+1; else if(page<=3) p=i+1; else if(page>=totalPages-2) p=totalPages-4+i; else p=page-2+i;
                  return <button key={p} onClick={()=>updateParams({page:p})} className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold ${p===page?"bg-slate-900 text-white":"bg-white border"}`}>{p}</button>;
                })}
                <button disabled={page>=totalPages} onClick={()=>updateParams({page: page+1})} className="h-10 w-10 border rounded-xl bg-white disabled:opacity-40"><ChevronRight className="h-4 w-4 mx-auto"/></button>
              </div>
            )}
            <div className="mt-8 bg-white p-4 rounded-2xl border">
              <h3 className="font-bold">Trending / Best of</h3>
              <p className="text-sm opacity-60">Top voted questions in current filter — best-of placeholder (Task 8).</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
