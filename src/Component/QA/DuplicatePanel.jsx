import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { tagLabel } from "../../constants/qa";

function timeAgo(d){
  try{
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff/86400000);
    if(days===0) return "today";
    if(days===1) return "1 day ago";
    if(days<7) return `${days} days ago`;
    if(days<30) return `${Math.floor(days/7)} weeks ago`;
    return `${Math.floor(days/30)} months ago`;
  } catch{ return ""; }
}

export default function DuplicatePanel({ title }){
  const [results,setResults]=useState([]);
  const [loading,setLoading]=useState(false);
  const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";

  useEffect(()=>{
    const q = String(title||"").trim();
    if(q.length<6){ setResults([]); return; }
    const t=setTimeout(async ()=>{
      setLoading(true);
      try{
        const res = await axios.get(`${baseURL}/questions`, { params: { q, limit:5 } });
        setResults((res.data?.data||[]).slice(0,5));
      } catch{ setResults([]); }
      setLoading(false);
    }, 400);
    return ()=> clearTimeout(t);
  },[title, baseURL]);

  if(String(title||"").trim().length<6) return null;
  if(loading) return <div className="mt-2 text-xs opacity-60">Searching similar questions…</div>;
  if(results.length===0) return <div className="mt-2 text-xs text-emerald-600">No duplicate found, ready to post.</div>;

  return (
    <div className="mt-2 border rounded-xl bg-amber-50/50 p-3">
      <p className="text-xs font-semibold">Similar questions found — maybe one already answers you:</p>
      <div className="mt-2 space-y-2">
        {results.map(q=> (
          <Link key={q._id} to={`/questions/${q._id}`} className="block bg-white p-2 rounded-lg border hover:bg-amber-50">
            <div className="text-sm font-medium line-clamp-1">{q.title}</div>
            <div className="text-xs opacity-60 flex flex-wrap gap-1 mt-1">
              <span className="badge badge-outline badge-xs">{q.category}</span>
              {(q.tags||[]).slice(0,2).map(t=> <span key={t} className="badge badge-ghost badge-xs">{tagLabel(t)}</span>)}
              {q.context?.destinationCountry && <span>{q.context.destinationCountry}</span>}
              <span>• Asked {timeAgo(q.createdAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
