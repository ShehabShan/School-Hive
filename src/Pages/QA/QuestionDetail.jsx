import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function QuestionDetail(){
  const { id } = useParams();
  const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";

  const { data, isLoading, error } = useQuery({
    queryKey: ["question", id],
    enabled: Boolean(id && id!=="undefined"),
    queryFn: async ()=>{
      const res = await axios.get(`${baseURL}/questions/${id}`);
      return res.data?.data || null;
    }
  });

  if(!id) return <div className="p-6">Browse questions — listing will be added in Task 8.</div>;
  if(isLoading) return <div className="p-6">Loading question…</div>;
  if(error) return <div className="p-6 text-rose-600">Failed to load: {String(error.message)}</div>;
  if(!data) return <div className="p-6">Question not found. <Link to="/questions/ask" className="link">Ask one</Link></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link to="/questions/ask" className="link text-sm">← Ask another</Link>
      <h1 className="text-2xl font-bold mt-2">{data.title}</h1>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="badge badge-outline">{data.category}</span>
        {(data.tags||[]).map(t=> <span key={t} className="badge badge-ghost">{t}</span>)}
        {data.context?.destinationCountry && <span className="badge badge-info">{data.context.destinationCountry}</span>}
      </div>
      <div className="mt-4 prose max-w-none whitespace-pre-wrap">{data.body}</div>
      <div className="mt-6 text-xs opacity-60">By {data.authorEmail} • {data.language} • viewCount {data.viewCount}</div>
      <div className="mt-8">
        <h2 className="font-semibold">Answers ({(data.answers||[]).length})</h2>
        <p className="text-sm opacity-60">Answering UI lands in Task 6.</p>
      </div>
    </div>
  );
}
