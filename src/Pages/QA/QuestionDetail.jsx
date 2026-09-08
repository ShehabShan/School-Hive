import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowBigUp,
  ArrowBigDown,
  BellOff,
  BellPlus,
  CheckCircle2,
  Eye,
  MessageSquare,
  Share2,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  Users,
  Lock,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import AnswerCard from "../../Component/QA/AnswerCard";
import AnswerForm from "../../Component/QA/AnswerForm";
import CommentThread from "../../Component/QA/CommentThread";
import QAPageSchema from "../../Component/QA/QAPageSchema";
import MarkdownBody from "../../Component/QA/MarkdownBody";
import AuthorBlock from "../../Component/QA/AuthorBlock";
import { timeAgo } from "../../Component/QA/QuestionCard";
import { tagLabel, QUESTION_CATEGORIES } from "../../constants/qa";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";
const categoryLabel = (slug) => QUESTION_CATEGORIES.find((c) => c.value === slug)?.label || tagLabel(slug);

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1280px] animate-pulse px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded-full bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-full bg-slate-100" />
          <div className="h-8 w-28 rounded-full bg-slate-900/10" />
        </div>
      </div>
      <div className="mt-6 h-4 w-48 rounded bg-slate-100" />
      <div className="mt-3 h-8 w-3/4 rounded-xl bg-slate-200" />
      <div className="mt-2 h-8 w-1/2 rounded-xl bg-slate-200/70" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
            <div className="overflow-hidden rounded-[20px] border border-slate-100 bg-white">
              {/* Mobile pill skeleton */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:hidden">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-slate-100" />
                  <div className="h-4 w-12 rounded bg-slate-100" />
                </div>
                <div className="h-4 w-20 rounded bg-slate-100" />
              </div>
              <div className="flex flex-col sm:flex-row">
                <div className="hidden w-[84px] shrink-0 flex-col items-center gap-2 border-r border-slate-100 bg-slate-50/50 px-3 py-5 sm:flex">
                  <div className="h-10 w-10 rounded-xl bg-slate-100" />
                  <div className="h-4 w-8 rounded bg-slate-100" />
                  <div className="h-3 w-10 rounded bg-slate-100" />
                </div>
                <div className="min-w-0 flex-1 p-4 sm:p-6">
                  <div className="space-y-3">
                    <div className="h-3.5 w-full rounded bg-slate-100" />
                    <div className="h-3.5 w-5/6 rounded bg-slate-100" />
                    <div className="h-3.5 w-4/6 rounded bg-slate-100" />
                    <div className="h-6 w-24 rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>
          <div className="h-12 rounded-2xl bg-slate-100" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5">
                <div className="h-4 w-40 rounded bg-slate-100" />
                <div className="mt-3 h-3 w-full rounded bg-slate-100" />
                <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden space-y-4 lg:block">
          <div className="h-32 rounded-[20px] bg-slate-100" />
          <div className="h-40 rounded-[20px] bg-slate-100" />
          <div className="h-48 rounded-[20px] bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function QuestionDetail() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading, tokenLoaded } = useAuth();
  const { me, loading: roleLoading } = useRole();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [acceptingId, setAcceptingId] = useState(null);
  const [submittingAns, setSubmittingAns] = useState(false);
  const [answerSort, setAnswerSort] = useState("votes");
  const [followBusy, setFollowBusy] = useState(false);

  const { data: q, isLoading, error } = useQuery({
    queryKey: ["question", id],
    enabled: Boolean(id && id !== "undefined"),
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/questions/${id}`);
      return res.data?.data || null;
    },
  });

  const isAsker = Boolean(q && me && String(q.authorEmail || "").toLowerCase() === String(me.email || "").toLowerCase());
  const myEmail = String(me?.email || "").toLowerCase();
  const iUpvoted = Boolean(q && Array.isArray(q.upvoterIds) && q.upvoterIds.map(String).includes(myEmail));
  const iDownvoted = Boolean(q && Array.isArray(q.downvoterIds) && q.downvoterIds.map(String).includes(myEmail));
  const hasVoted = iUpvoted || iDownvoted;
  const authReady = !authLoading && !roleLoading;
  const [qMenuOpen, setQMenuOpen] = useState(false);
  const [qEditing, setQEditing] = useState(false);
  const [qEditTitle, setQEditTitle] = useState("");
  const [qEditBody, setQEditBody] = useState("");
  const [qSaving, setQSaving] = useState(false);
  const [showQDownvote, setShowQDownvote] = useState(false);
  const [qDownvoteReason, setQDownvoteReason] = useState("");

  const { data: followState } = useQuery({
    queryKey: ["question-follow", id, myEmail],
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    queryFn: async () => {
      // public GET — no auth needed, avoids 401 for guests
      const res = await axios.get(`${baseURL}/questions/${id}/follow${myEmail ? `?email=${encodeURIComponent(myEmail)}` : ""}`);
      return res.data?.data || { followersCount: 0, following: false };
    },
  });

  const handleFollowToggle = async () => {
    if (authLoading || roleLoading) return;
    if (!user) {
      toast.error("Sign in to follow — get notified on new answers");
      navigate("/signIn", { state: { from: `/questions/${id}` }, replace: false });
      return;
    }
    // optional: wait briefly if token not yet loaded after login
    if (!tokenLoaded) {
      toast.loading("Finishing sign-in…", { id: "follow-token" });
      // small delay to allow AuthProvider JWT to settle; interceptor will handle 401 anyway
      await new Promise((r) => setTimeout(r, 400));
      toast.dismiss({ id: "follow-token" });
    }
    try {
      setFollowBusy(true);
      const res = await axiosSecure.post(`/questions/${id}/follow`, null, { _skipAuthRedirect: false });
      toast.success(res.data?.data?.following ? "Following — you'll be notified of new answers" : "Unfollowed");
      qc.invalidateQueries({ queryKey: ["question-follow", id] });
      qc.invalidateQueries({ queryKey: ["question-follow", id, myEmail] });
    } catch (e) {
      // if 401/403, global interceptor will redirect + toast; still show local error for other cases
      if (e?.response?.status !== 401 && e?.response?.status !== 403) {
        toast.error(e?.response?.data?.message || "Failed to update follow");
      }
    } finally {
      setFollowBusy(false);
    }
  };

  const relatedTag = (q?.tags || [])[0];
  const { data: relatedResp } = useQuery({
    queryKey: ["related-questions", relatedTag || q?.category, id],
    enabled: Boolean(q && (relatedTag || q.category)),
    staleTime: 60 * 1000,
    queryFn: async () => {
      const params = { limit: 6 };
      if (relatedTag) params.tag = relatedTag;
      else params.category = q.category;
      const res = await axios.get(`${baseURL}/questions`, { params });
      return res.data;
    },
  });
  const related = (relatedResp?.data || []).filter((r) => String(r._id) !== String(id)).slice(0, 5);

  const handleQuestionUpvote = async () => {
    if (!user) {
      toast.error("Sign in to vote");
      return;
    }
    if (hasVoted) return toast.error("Already voted");
    try {
      await axiosSecure.post(`/questions/${id}/upvote`);
      toast.success("Upvoted — asker earns +2");
      qc.invalidateQueries({ queryKey: ["question", id] });
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    }
  };
  const handleQuestionDownvote = async () => {
    if (!user) return toast.error("Sign in to vote");
    if (hasVoted) return toast.error("Already voted");
    try {
      const body = qDownvoteReason.trim() ? { reason: qDownvoteReason.trim() } : {};
      await axiosSecure.post(`/questions/${id}/downvote`, body);
      toast.success("Downvoted");
      setShowQDownvote(false); setQDownvoteReason("");
      qc.invalidateQueries({ queryKey: ["question", id] });
    } catch (e) { toast.error(e?.response?.data?.message || e.message); }
  };
  const handleQuestionEditSave = async () => {
    const t = qEditTitle.trim(); const b = qEditBody.trim();
    if (t.length < 10) return toast.error("Title must be at least 10 characters");
    if (b.length < 20) return toast.error("Body must be at least 20 characters");
    setQSaving(true);
    try { await axiosSecure.patch(`/questions/${id}`, { title: t, body: b }); toast.success("Question updated"); setQEditing(false); setQMenuOpen(false); qc.invalidateQueries({ queryKey: ["question", id] }); } catch(e){ toast.error(e?.response?.data?.message || e.message); } finally { setQSaving(false); }
  };
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  };
  const handleAnswer = async ({ body, sourceLink }) => {
    if (!user) {
      toast.error("Please sign in to answer");
      return;
    }
    setSubmittingAns(true);
    try {
      await axiosSecure.post(`/questions/${id}/answers`, { body, sourceLink });
      toast.success("Answer posted — thanks for helping!");
      qc.invalidateQueries({ queryKey: ["question", id] });
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    } finally {
      setSubmittingAns(false);
    }
  };
  const handleAccept = async (answerId) => {
    setAcceptingId(answerId);
    try {
      await axiosSecure.patch(`/questions/${id}/accept`, { answerId });
      toast.success("Accepted — answerer earns +15");
      qc.invalidateQueries({ queryKey: ["question", id] });
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    } finally {
      setAcceptingId(null);
    }
  };

  if (!id)
    return (
      <div className="p-6">
        <Link to="/questions" className="btn btn-sm btn-outline">
          ← Browse questions
        </Link>
      </div>
    );
  if (isLoading) return <DetailSkeleton />;
  if (error)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg font-bold text-rose-600">Failed to load question</p>
        <p className="mt-1 text-sm text-slate-500">{String(error.message)}</p>
        <Link to="/questions" className="btn btn-sm btn-outline mt-4">
          ← Back to Browse
        </Link>
      </div>
    );
  if (!q)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg font-bold text-slate-900">Question not found</p>
        <p className="mt-1 text-sm text-slate-500">It may have been removed by the author or staff.</p>
        <div className="mt-4 flex justify-center gap-2">
          <Link to="/questions" className="btn btn-sm btn-outline">
            Browse questions
          </Link>
          <Link to="/questions/ask" className="btn btn-sm btn-primary">
            Ask a question
          </Link>
        </div>
      </div>
    );

  const answersSorted = (() => {
    const list = [...(q.answers || [])];
    if (answerSort === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else list.sort((a, b) => (b.voteScore || 0) - (a.voteScore || 0));
    return list.sort((a, b) => (b.accepted ? 1 : 0) - (a.accepted ? 1 : 0));
  })();

  const stats = [
    { icon: ArrowBigUp, label: "votes", value: q.voteScore ?? 0 },
    { icon: MessageSquare, label: "answers", value: q.answerCount ?? (q.answers || []).length },
    { icon: Eye, label: "views", value: q.viewCount ?? 0 },
  ];

  const isFollowing = Boolean(followState?.following);
  const followerCount = followState?.followersCount || 0;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <QAPageSchema question={q} />
      {/* Subtle top gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-16 h-[360px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.08),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Top bar — breadcrumb + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex min-w-0 items-center gap-1 text-xs text-slate-500" aria-label="Breadcrumb">
            <Link to="/questions" className="shrink-0 font-medium text-slate-500 hover:text-slate-700 hover:underline">
              Questions
            </Link>
            <span className="text-slate-400">›</span>
            {(q.context?.destinationCountry || q.category) && (
              <>
                <Link
                  to={`/questions?${q.context?.destinationCountry ? `dest=${encodeURIComponent(q.context.destinationCountry)}` : `category=${encodeURIComponent(q.category)}`}`}
                  className="shrink-0 font-medium text-slate-500 hover:text-slate-700 hover:underline"
                >
                  {q.context?.destinationCountry || categoryLabel(q.category)}
                </Link>
                <span className="text-slate-400">›</span>
              </>
            )}
            <span className="min-w-0 truncate font-medium text-slate-900" title={q.title}>
              {q.title.length > 48 ? `${q.title.slice(0, 48)}…` : q.title}
            </span>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
            {isAsker && (
              <div className="relative">
                <button onClick={()=>{ setQMenuOpen(v=>!v); if(!qMenuOpen){ setQEditTitle(q.title||""); setQEditBody(q.body||""); } }} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50" aria-label="More"><MoreHorizontal className="h-4 w-4" /></button>
                {qMenuOpen && (
                  <div role="menu" className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    <button role="menuitem" onClick={()=>{ setQEditing(true); setQEditTitle(q.title||""); setQEditBody(q.body||""); setQMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"><Pencil className="h-4 w-4 text-slate-500" /> Edit</button>
                  </div>
                )}
              </div>
            )}
            <Link
              to="/questions/ask"
              className="hidden items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-700 sm:inline-flex"
            >
              <Sparkles className="h-3.5 w-3.5" /> Ask a question
            </Link>
          </div>
        </div>

        {/* Title zone — compact header above card */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {q.acceptedAnswerId && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 font-bold text-white">
                <CheckCircle2 className="h-3.5 w-3.5" /> Solved
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Clock className="h-3 w-3" /> Asked {timeAgo(q.createdAt)}
            </span>
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Eye className="h-3.5 w-3.5" /> {q.viewCount ?? 0} views
            </span>
          </div>
          <h1 className="mt-3 text-[22px] font-extrabold leading-[1.25] tracking-tight text-slate-900 sm:text-[26px]">
            {q.title} {(q.isEdited || (q.updatedAt && q.createdAt && new Date(q.updatedAt).getTime() - new Date(q.createdAt).getTime() > 1000)) && <span className="ml-2 align-middle rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">edited</span>}
          </h1>
          {qEditing && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <input value={qEditTitle} onChange={e=>setQEditTitle(e.target.value)} maxLength={200} placeholder="Title (min 10 chars)" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-100" />
              <textarea value={qEditBody} onChange={e=>setQEditBody(e.target.value)} rows={6} maxLength={10000} placeholder="Body (min 20 chars)" className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100" />
              <div className="mt-3 flex gap-2">
                <button onClick={handleQuestionEditSave} disabled={qSaving} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-black disabled:opacity-50">{qSaving?"Saving…":"Save"}</button>
                <button onClick={()=>setQEditing(false)} className="rounded-full bg-white px-4 py-2 text-xs font-semibold ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{qEditTitle.trim().length} chars title, {qEditBody.trim().length} chars body</p>
            </div>
          )}
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main column */}
          <div className="min-w-0 space-y-6">
            {/* Question card */}
            <motion.article
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-soft"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Mobile vote — plain, no box */}
                <div className="flex items-center justify-between gap-3 px-4 py-3 sm:hidden">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleQuestionUpvote}
                      disabled={hasVoted || !authReady || !user}
                      title={!user ? "Sign in to vote" : hasVoted ? "Already voted" : "Upvote — asker earns +2"}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${iUpvoted ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"} disabled:opacity-40`}
                    >
                      <ArrowBigUp className="h-5 w-5" />
                    </button>
                    <button onClick={()=>{ if(!user) return toast.error("Sign in to vote"); if(hasVoted) return toast.error("Already voted"); setShowQDownvote(v=>!v); }} disabled={hasVoted || !user} title={!user ? "Sign in to vote" : hasVoted ? "Already voted" : "Downvote (optional reason)"} className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${iDownvoted ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"} disabled:opacity-40`}>
                      <ArrowBigDown className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-bold text-slate-900">{q.voteScore ?? 0}</span>
                    <span className="text-xs text-slate-500">votes</span>
                  </div>
                  <span className="text-xs text-slate-400">Upvote to reward asker</span>
                </div>
                {showQDownvote && !hasVoted && (
                  <div className="mx-4 mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:hidden">
                    <input value={qDownvoteReason} onChange={e=>setQDownvoteReason(e.target.value)} maxLength={300} placeholder="Reason (optional)" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100" />
                    <div className="mt-2 flex gap-2">
                      <button onClick={handleQuestionDownvote} className="flex-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">Downvote</button>
                      <button onClick={()=>{setShowQDownvote(false); setQDownvoteReason("");}} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-slate-200">Cancel</button>
                    </div>
                  </div>
                )}
                {/* Desktop vote — plain vertical, no box */}
                <div className="hidden w-[68px] shrink-0 flex-col items-center gap-1 py-6 sm:flex">
                  <button
                    onClick={handleQuestionUpvote}
                    disabled={hasVoted || !authReady || !user}
                    title={!user ? "Sign in to vote" : hasVoted ? "Already voted" : "Upvote — asker earns +2"}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${iUpvoted ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"} disabled:opacity-40`}
                  >
                    <ArrowBigUp className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-bold text-slate-900">{q.voteScore ?? 0}</span>
                  <button onClick={()=>{ if(!user) return toast.error("Sign in to vote"); if(hasVoted) return toast.error("Already voted"); setShowQDownvote(v=>!v); }} disabled={hasVoted || !user} title={!user ? "Sign in to vote" : hasVoted ? "Already voted" : "Downvote (optional reason)"} className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${iDownvoted ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"} disabled:opacity-40`}>
                    <ArrowBigDown className="h-5 w-5" />
                  </button>
                  <span className="text-[11px] text-slate-500">votes</span>
                  {showQDownvote && !hasVoted && (
                    <div className="mt-2 w-[160px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                      <input value={qDownvoteReason} onChange={e=>setQDownvoteReason(e.target.value)} maxLength={300} placeholder="Reason (optional)" className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100" />
                      <div className="mt-2 flex gap-1">
                        <button onClick={handleQuestionDownvote} className="flex-1 rounded-full bg-slate-900 px-2 py-1 text-[11px] font-bold text-white">Downvote</button>
                        <button onClick={()=>{setShowQDownvote(false); setQDownvoteReason("");}} className="rounded-full bg-white px-2 py-1 text-[11px] ring-1 ring-slate-200">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 p-4 sm:p-6">
                  <div className="prose max-w-none prose-slate prose-sm sm:prose-base prose-p:leading-relaxed prose-a:text-brand-600 hover:prose-a:text-brand-700">
                    <MarkdownBody text={q.body} />
                  </div>
                  <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(q.tags || []).length > 0 &&
                        (q.tags || []).map((t) => (
                          <Link
                            key={t}
                            to={`/questions?tag=${encodeURIComponent(t)}`}
                            className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
                          >
                            #{tagLabel(t)}
                          </Link>
                        ))}
                    </div>
                    <AuthorBlock
                      email={q.authorEmail}
                      role={q.authorRole}
                      isVerified={q.authorIsVerified}
                      size="lg"
                    />
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Mobile follow — visible only on small screens */}
            <div className="rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">Follow this question</p>
                  <p className="text-xs text-slate-500">{followerCount} follower{followerCount === 1 ? "" : "s"} · get notified on new answers</p>
                </div>
                <button
                  onClick={handleFollowToggle}
                  disabled={followBusy || authLoading || roleLoading}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition disabled:opacity-50 ${
                    isFollowing ? "bg-slate-900 text-white hover:bg-black" : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  {isFollowing ? <BellOff className="h-4 w-4" /> : <BellPlus className="h-4 w-4" />}
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            </div>

            {/* Answers header — sticky */}
            <section>
              <div className="sticky top-[64px] z-10 -mx-1 flex flex-wrap items-center justify-between gap-3 border-y border-slate-200/60 bg-[#f8fafc]/80 px-1 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
                <h2 className="flex items-center gap-2 text-[15px] font-extrabold tracking-tight text-slate-900">
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                  {q.answerCount ?? (q.answers || []).length} Answer{(q.answerCount ?? (q.answers || []).length) === 1 ? "" : "s"}
                  {q.acceptedAnswerId && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white">
                      <CheckCircle2 className="h-3 w-3" /> Accepted
                    </span>
                  )}
                </h2>
                <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                  {[
                    ["votes", "Top"],
                    ["newest", "Newest"],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setAnswerSort(v)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                        answerSort === v ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-4">
                {answersSorted.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <MessageSquare className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="mt-4 text-[15px] font-extrabold text-slate-900">No answers yet</p>
                    <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
                      Be the first to help — sourced answers earn <span className="font-bold text-slate-700">+3</span> and accepted answers earn{" "}
                      <span className="font-bold text-emerald-600">+15</span>.
                    </p>
                    <Link to="#answer" className="btn btn-primary btn-sm mt-4 rounded-full">
                      Write an answer
                    </Link>
                  </div>
                ) : (
                  answersSorted.map((a) => {
                    const accepted = Boolean(a.accepted);
                    return (
                      <div key={a._id} className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${accepted ? "border-emerald-200" : "border-slate-200"}`}>
                        <AnswerCard
                          answer={a}
                          isAsker={isAsker}
                          onAccept={handleAccept}
                          accepting={acceptingId === String(a._id)}
                          questionId={id}
                          insideGroup
                        />
                        <CommentThread answerId={String(a._id)} questionId={id} isAccepted={accepted} />
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Your answer — match reference clean card */}
            <section id="answer" className="scroll-mt-28">
              {user ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 bg-white px-4 py-3">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Sparkles className="h-4 w-4 text-brand-600" /> Your Answer
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">Help the community by sharing your knowledge. Add source links for better reputation.</p>
                  </div>
                  <div className="p-4">
                    <AnswerForm
                      onSubmit={handleAnswer}
                      submitting={submittingAns}
                      questionId={id}
                      isAsker={isAsker}
                      me={me}
                      context={q.context}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-[20px] border border-slate-200 bg-white p-7 text-center shadow-soft">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Lock className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-[15px] font-extrabold text-slate-900">Sign in to answer</p>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                    Sourced answers earn <b className="text-slate-700">+3</b>, accepted earn <b className="text-emerald-600">+15</b>. Help the asker and the next reader.
                  </p>
                  <Link to="/signIn" state={{ from: `/questions/${id}` }} className="btn btn-primary btn-sm mt-4 rounded-full px-6">
                    Sign in to answer
                  </Link>
                  <p className="mt-2 text-xs text-slate-400">
                    New here?{" "}
                    <Link to="/registration" className="font-semibold text-brand-600 hover:text-brand-700">
                      Create account
                    </Link>
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-[88px] space-y-5">
              {/* Stay updated — match reference indigo card */}
              <div className="overflow-hidden rounded-2xl border border-indigo-600 bg-brand-600 shadow-sm">
                <div className="bg-brand-600 px-5 py-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                    <BellPlus className="h-4 w-4" /> Stay updated
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-indigo-100">Get notified via email when someone answers this question.</p>
                </div>
                <div className="bg-brand-600 px-4 pb-4">
                  <button
                    onClick={handleFollowToggle}
                    disabled={followBusy || authLoading || roleLoading}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-brand-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 ${
                      isFollowing ? "ring-1 ring-white/20" : ""
                    }`}
                  >
                    {isFollowing ? <BellOff className="h-4 w-4" /> : <BellPlus className="h-4 w-4" />}
                    {isFollowing ? "Following" : "Follow question"}
                  </button>
                  <div className="mt-2.5 flex items-center justify-center gap-1 text-xs text-indigo-200">
                    <Users className="h-3 w-3" />
                    <span className="font-semibold text-white">{followerCount}</span> follower{followerCount === 1 ? "" : "s"} tracking
                  </div>
                </div>
              </div>

              {/* Stats — match reference compact stats */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5" /> Stats
                </h3>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {stats.map((s) => (
                    <div key={s.label} className="flex flex-col items-center rounded-xl bg-slate-50 px-2 py-3 ring-1 ring-slate-100">
                      <s.icon className="h-4 w-4 text-slate-500" />
                      <span className="mt-1 text-[15px] font-extrabold tracking-tight text-slate-900">{s.value}</span>
                      <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Asked: {new Date(q.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="ml-auto text-slate-400">{new Date(q.createdAt).toLocaleDateString(undefined, { weekday: "short" })}</span>
                </div>
              </div>

              {/* Community tools / Related — match reference */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5" /> Community Tools
                </h3>
                <div className="mt-3 space-y-1">
                  <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500">○</span> How to write a good answer
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500">◧</span> Report content issue
                  </a>
                </div>
              </div>

              {related.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <Flame className="h-3.5 w-3.5" /> Related Questions
                  </h3>
                  <ul className="mt-3 space-y-1">
                    {related.map((r) => (
                      <li key={r._id}>
                        <Link
                          to={`/questions/${r._id}`}
                          className="group flex items-start gap-2 rounded-lg px-2 py-2 -mx-2 hover:bg-slate-50"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-300 group-hover:bg-brand-500" />
                          <span className="text-[13px] font-medium leading-snug text-slate-700 group-hover:text-brand-600 line-clamp-2">{r.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link to="/questions" className="mt-2 inline-flex text-xs font-semibold text-brand-600 hover:text-brand-700">
                    View all related →
                  </Link>
                </div>
              )}

              {/* CTA — keep hidden per reference? Reference has no CTA, but keep minimal */}
              <Link
                to="/questions/ask"
                className="hidden items-center justify-center gap-2 rounded-2xl bg-slate-900 p-3 text-sm font-bold text-white shadow-sm hover:bg-black lg:flex"
              >
                <Sparkles className="h-4 w-4" /> Ask a question
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
