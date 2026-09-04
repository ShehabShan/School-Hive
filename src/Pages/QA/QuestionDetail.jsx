import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowBigUp, ArrowLeft, BellOff, BellPlus, CheckCircle2, Eye, MessageSquare, Share2, Sparkles, Flame } from "lucide-react";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useRole from "../../Hooks/useRole";
import AnswerCard from "../../Component/QA/AnswerCard";
import AnswerForm from "../../Component/QA/AnswerForm";
import QAPageSchema from "../../Component/QA/QAPageSchema";
import MarkdownBody from "../../Component/QA/MarkdownBody";
import AuthorBlock from "../../Component/QA/AuthorBlock";
import { timeAgo } from "../../Component/QA/QuestionCard";
import { tagLabel, QUESTION_CATEGORIES } from "../../constants/qa";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";
const categoryLabel = (slug) => QUESTION_CATEGORIES.find((c) => c.value === slug)?.label || tagLabel(slug);

function DetailSkeleton(){
  return (
    <div className="mx-auto max-w-[1200px] animate-pulse px-4 py-6 sm:px-6">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded-xl bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-100" />
          <div className="rounded-2xl border border-slate-100 p-5">
            <div className="flex gap-4"><div className="h-16 w-10 rounded bg-slate-100" /><div className="flex-1 space-y-2.5"><div className="h-3.5 w-full rounded bg-slate-100" /><div className="h-3.5 w-5/6 rounded bg-slate-100" /><div className="h-3.5 w-2/3 rounded bg-slate-100" /><div className="h-3.5 w-3/4 rounded bg-slate-100" /></div></div>
          </div>
        </div>
        <div className="hidden space-y-4 lg:block"><div className="h-40 rounded-2xl bg-slate-100" /><div className="h-64 rounded-2xl bg-slate-100" /></div>
      </div>
    </div>
  );
}

export default function QuestionDetail(){
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { me } = useRole();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [acceptingId,setAcceptingId]=useState(null);
  const [submittingAns,setSubmittingAns]=useState(false);
  const [answerSort,setAnswerSort]=useState("votes");
  const [followBusy,setFollowBusy]=useState(false);

  const { data: q, isLoading, error } = useQuery({
    queryKey: ["question", id],
    enabled: Boolean(id && id!=="undefined"),
    queryFn: async ()=>{
      const res = await axios.get(`${baseURL}/questions/${id}`);
      return res.data?.data || null;
    }
  });

  const isAsker = Boolean(q && me && String(q.authorEmail||"").toLowerCase()===String(me.email||"").toLowerCase());
  const myEmail = String(me?.email||"").toLowerCase();
  const iUpvoted = Boolean(q && Array.isArray(q.upvoterIds) && q.upvoterIds.map(String).includes(myEmail));

  const { data: followState } = useQuery({
    queryKey: ["question-follow", id, myEmail],
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await axiosSecure.get(`/questions/${id}/follow${myEmail ? `?email=${encodeURIComponent(myEmail)}` : ""}`);
      return res.data?.data || { followersCount: 0, following: false };
    },
  });

  const handleFollowToggle = async () => {
    if (!me) return navigate("/signIn");
    try {
      setFollowBusy(true);
      const res = await axiosSecure.post(`/questions/${id}/follow`);
      toast.success(res.data?.data?.following ? "Following — you'll be notified of new answers" : "Unfollowed");
      qc.invalidateQueries({ queryKey: ["question-follow", id] });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update follow");
    } finally {
      setFollowBusy(false);
    }
  };

  const relatedTag = (q?.tags||[])[0];
  const { data: relatedResp } = useQuery({
    queryKey: ["related-questions", relatedTag || q?.category, id],
    enabled: Boolean(q && (relatedTag || q.category)),
    staleTime: 60 * 1000,
    queryFn: async ()=>{
      const params = { limit: 6 };
      if (relatedTag) params.tag = relatedTag; else params.category = q.category;
      const res = await axios.get(`${baseURL}/questions`, { params });
      return res.data;
    }
  });
  const related = (relatedResp?.data||[]).filter(r=>String(r._id)!==String(id)).slice(0,5);

  const handleQuestionUpvote = async ()=>{
    if(!me){ toast.error("Sign in to vote"); return; }
    try{
      await axiosSecure.post(`/questions/${id}/upvote`);
      toast.success(iUpvoted ? "Upvote removed" : "Upvoted — asker earns +2");
      qc.invalidateQueries({ queryKey: ["question", id] });
    } catch(e){
      toast.error(e?.response?.data?.message || e.message);
    }
  };
  const handleShare = async ()=>{
    try{ await navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); } catch{ toast.error("Copy failed"); }
  };
  const handleAnswer = async ({ body, sourceLink })=>{
    if(!me) { toast.error("Please sign in to answer"); return; }
    setSubmittingAns(true);
    try{
      await axiosSecure.post(`/questions/${id}/answers`, { body, sourceLink });
      toast.success("Answer posted — thanks for helping!");
      qc.invalidateQueries({ queryKey: ["question", id] });
    } catch(e){
      toast.error(e?.response?.data?.message || e.message);
    } finally { setSubmittingAns(false); }
  };
  const handleAccept = async (answerId)=>{
    setAcceptingId(answerId);
    try{
      await axiosSecure.patch(`/questions/${id}/accept`, { answerId });
      toast.success("Accepted — answerer earns +15");
      qc.invalidateQueries({ queryKey: ["question", id] });
    } catch(e){
      toast.error(e?.response?.data?.message || e.message);
    } finally { setAcceptingId(null); }
  };

  if(!id) return <div className="p-6"><Link to="/questions" className="btn btn-sm btn-outline">← Browse questions</Link></div>;
  if(isLoading) return <DetailSkeleton />;
  if(error) return <div className="mx-auto max-w-3xl px-4 py-16 text-center"><p className="text-lg font-bold text-rose-600">Failed to load question</p><p className="mt-1 text-sm text-slate-500">{String(error.message)}</p><Link to="/questions" className="btn btn-sm btn-outline mt-4">← Back to Browse</Link></div>;
  if(!q) return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-lg font-bold text-slate-900">Question not found</p>
      <p className="mt-1 text-sm text-slate-500">It may have been removed by the author or staff.</p>
      <div className="mt-4 flex justify-center gap-2"><Link to="/questions" className="btn btn-sm btn-outline">Browse questions</Link><Link to="/questions/ask" className="btn btn-sm btn-primary">Ask a question</Link></div>
    </div>
  );

  const answersSorted = (()=> {
    const list = [...(q.answers||[])];
    if(answerSort==="newest") list.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    else list.sort((a,b)=> (b.voteScore||0)-(a.voteScore||0));
    return list.sort((a,b)=> (b.accepted?1:0)-(a.accepted?1:0)); // accepted always pinned
  })();

  const stats = [
    { icon: ArrowBigUp, label: "votes", value: q.voteScore ?? 0 },
    { icon: MessageSquare, label: "answers", value: q.answerCount ?? (q.answers||[]).length },
    { icon: Eye, label: "views", value: q.viewCount ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <QAPageSchema question={q} />
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link to="/questions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-600"><ArrowLeft className="h-4 w-4" /> All questions</Link>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50"><Share2 className="h-3.5 w-3.5" /> Share</button>
            <Link to="/questions/ask" className="hidden items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-black sm:inline-flex"><Sparkles className="h-3.5 w-3.5" /> Ask</Link>
          </div>
        </div>

        {/* Title zone */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100">{categoryLabel(q.category)}</span>
            {q.context?.destinationCountry && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">→ {q.context.destinationCountry}</span>}
            {q.context?.homeCountry && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{q.context.homeCountry}</span>}
            {q.context?.studyLevel && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 capitalize">{q.context.studyLevel}</span>}
            <span className="text-xs text-slate-400">asked {timeAgo(q.createdAt)}</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">{q.title}</h1>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main column */}
          <div className="min-w-0 space-y-6">
            {/* Question card */}
            <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex gap-1 sm:gap-3">
                {/* Vote rail — questions are upvote-only (spec 1.5) */}
                <div className="flex w-10 shrink-0 flex-col items-center gap-0.5">
                  <button onClick={handleQuestionUpvote} disabled={!me} title={me ? (iUpvoted ? "Upvoted" : "Upvote — asker earns +2") : "Sign in to vote"} className={`rounded-lg p-1 transition-colors disabled:opacity-40 ${iUpvoted ? "text-brand-600" : "text-slate-400 hover:bg-brand-50 hover:text-brand-600"}`}>
                    <ArrowBigUp className={`h-7 w-7 ${iUpvoted ? "fill-brand-100" : ""}`} />
                  </button>
                  <span className="text-base font-extrabold text-slate-800">{q.voteScore ?? 0}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <MarkdownBody text={q.body} />
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    {(q.tags||[]).map(t=> (
                      <Link key={t} to={`/questions?tag=${encodeURIComponent(t)}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-200">{tagLabel(t)}</Link>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <AuthorBlock email={q.authorEmail} role={q.authorRole} isVerified={q.authorIsVerified} size="lg" />
                    <span className="hidden shrink-0 text-[11px] text-slate-400 sm:block">{new Date(q.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Answers */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
                  {q.answerCount ?? (q.answers||[]).length} Answer{(q.answerCount ?? (q.answers||[]).length) === 1 ? "" : "s"}
                  {q.acceptedAnswerId && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700"><CheckCircle2 className="h-3 w-3" /> accepted</span>}
                </h2>
                <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-xs font-semibold shadow-sm">
                  {[["votes","Votes"],["newest","Newest"]].map(([v,l])=> (
                    <button key={v} onClick={()=>setAnswerSort(v)} className={`rounded-full px-3.5 py-1.5 transition-colors ${answerSort===v ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="mt-3 space-y-4">
                {answersSorted.length===0
                  ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><p className="font-bold text-slate-800">No answers yet</p><p className="mt-1 text-sm text-slate-500">Be the first to help — your answer can be accepted for +15.</p></div>
                  : answersSorted.map(a=> <AnswerCard key={a._id} answer={a} isAsker={isAsker} onAccept={handleAccept} accepting={acceptingId===String(a._id)} questionId={id} />)}
              </div>
            </section>

            {/* Your answer */}
            <section id="answer" className="scroll-mt-24">
              {me
                ? <AnswerForm onSubmit={handleAnswer} submitting={submittingAns} questionId={id} isAsker={isAsker} me={me} context={q.context} />
                : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <p className="font-bold text-slate-900">Know the answer?</p>
                    <p className="mt-1 text-sm text-slate-500">Sign in to post — sourced answers earn +3, accepted earn +15.</p>
                    <Link to="/signIn" className="btn btn-primary btn-sm mt-3">Sign in to answer</Link>
                  </div>
                )}
            </section>
          </div>

          {/* Right rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <button
                  onClick={handleFollowToggle}
                  disabled={followBusy}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:opacity-50 ${
                    followState?.following
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  {followState?.following ? <BellOff className="h-4 w-4" /> : <BellPlus className="h-4 w-4" />}
                  {followState?.following ? "Following" : "Follow question"}
                </button>
                <p className="mt-2 text-center text-xs text-slate-400">
                  {followState?.followersCount || 0} follower{(followState?.followersCount || 0) === 1 ? "" : "s"} — get notified on new answers
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Stats</h3>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {stats.map(s=> (
                    <div key={s.label} className="flex flex-col items-center rounded-xl bg-slate-50 px-2 py-2.5 ring-1 ring-slate-100">
                      <s.icon className="h-4 w-4 text-slate-400" />
                      <span className="mt-1 text-sm font-extrabold text-slate-900">{s.value}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {related.length>0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-slate-400"><Flame className="h-3.5 w-3.5" /> Related</h3>
                  <ul className="mt-2 space-y-2.5">
                    {related.map(r=> (
                      <li key={r._id}>
                        <Link to={`/questions/${r._id}`} className="block rounded-lg p-1.5 -m-1.5 text-[13px] font-semibold leading-snug text-slate-700 hover:bg-slate-50 hover:text-brand-600">{r.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link to="/questions/ask" className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 p-4 text-sm font-bold text-white shadow-md hover:from-brand-700 hover:to-indigo-700">
                <Sparkles className="h-4 w-4" /> Ask a question
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
