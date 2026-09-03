import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useRole from "../../Hooks/useRole";
import RoleBadge from "../../Component/profile/RoleBadge";
import AnswerCard from "../../Component/QA/AnswerCard";
import AnswerForm from "../../Component/QA/AnswerForm";
import { tagLabel } from "../../constants/qa";
import toast from "react-hot-toast";

export default function QuestionDetail(){
  const { id } = useParams();
  const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";
  const axiosSecure = useAxiosSecure();
  const { me } = useRole();
  const qc = useQueryClient();
  const [acceptingId,setAcceptingId]=useState(null);
  const [submittingAns,setSubmittingAns]=useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["question", id],
    enabled: Boolean(id && id!=="undefined"),
    queryFn: async ()=>{
      const res = await axios.get(`${baseURL}/questions/${id}`);
      return res.data?.data || null;
    }
  });

  const q = data;
  const isAsker = Boolean(q && me && String(q.authorEmail||"").toLowerCase()===String(me.email||"").toLowerCase());

  const handleAnswer = async ({ body, sourceLink })=>{
    if(!me) { toast.error("Please sign in to answer"); return; }
    setSubmittingAns(true);
    try{
      await axiosSecure.post(`/questions/${id}/answers`, { body, sourceLink });
      toast.success("Answer posted");
      qc.invalidateQueries({ queryKey: ["question", id] });
    } catch(e){
      toast.error(e?.response?.data?.message || e.message);
    } finally { setSubmittingAns(false); }
  };

  const handleAccept = async (answerId)=>{
    setAcceptingId(answerId);
    try{
      await axiosSecure.patch(`/questions/${id}/accept`, { answerId });
      toast.success("Accepted +15 awarded");
      qc.invalidateQueries({ queryKey: ["question", id] });
    } catch(e){
      toast.error(e?.response?.data?.message || e.message);
    } finally { setAcceptingId(null); }
  };

  if(!id) return <div className="p-6">Browse questions — listing will be added in Task 8. <Link to="/questions/ask" className="link">Ask</Link></div>;
  if(isLoading) return <div className="p-6">Loading question…</div>;
  if(error) return <div className="p-6 text-rose-600">Failed to load: {String(error.message)}</div>;
  if(!q) return <div className="p-6">Question not found. <Link to="/questions/ask" className="link">Ask one</Link></div>;

  const badgeRole = (()=>{
    const r = q.authorRole;
    if(["admin","superadmin","modaretor"].includes(r)) return r;
    if(r==="institution") return "institution";
    return null;
  })();

  const answersSorted = (()=> {
    const list = [...(q.answers||[])];
    // accepted first, then voteScore desc
    return list.sort((a,b)=>{
      if(a.accepted && !b.accepted) return -1;
      if(!a.accepted && b.accepted) return 1;
      return (b.voteScore||0)-(a.voteScore||0);
    });
  })();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link to="/questions/ask" className="link text-sm">← Ask another</Link>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <span className="opacity-60">By {q.authorEmail}</span>
        {badgeRole && <RoleBadge role={badgeRole} size="sm" />}
      </div>
      <h1 className="text-2xl font-bold mt-2">{q.title}</h1>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="badge badge-outline">{q.category}</span>
        {(q.tags||[]).map(t=> <span key={t} className="badge badge-ghost">{tagLabel(t)}</span>)}
        {q.context?.destinationCountry && <span className="badge badge-info badge-outline">{q.context.destinationCountry}</span>}
        {q.context?.homeCountry && <span className="badge badge-outline">{q.context.homeCountry}</span>}
        {q.context?.studyLevel && <span className="badge badge-outline">{q.context.studyLevel}</span>}
        <span className="badge badge-ghost">{q.language}</span>
      </div>
      <div className="mt-4 prose max-w-none whitespace-pre-wrap text-sm">{q.body}</div>
      <div className="mt-2 text-xs opacity-60">viewCount {q.viewCount ?? 0} • {new Date(q.createdAt).toLocaleString()} {q.acceptedAnswerId && <span className="badge badge-success badge-sm ml-2">Accepted answer exists</span>}</div>

      <div className="mt-8 space-y-3">
        <h2 className="font-semibold text-lg">Answers ({answersSorted.length})</h2>
        {answersSorted.length===0 && <p className="text-sm opacity-60">No answers yet — be the first.</p>}
        {answersSorted.map(a=> <AnswerCard key={a._id} answer={a} isAsker={isAsker} onAccept={handleAccept} accepting={acceptingId===String(a._id)} />)}
      </div>

      <div className="mt-8">
        <AnswerForm onSubmit={handleAnswer} submitting={submittingAns} />
        {!me && <p className="text-xs opacity-60 mt-2">Sign in to post an answer.</p>}
      </div>
    </div>
  );
}
