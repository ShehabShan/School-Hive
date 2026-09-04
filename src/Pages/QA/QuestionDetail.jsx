import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowBigUp,
  ArrowLeft,
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
} from "lucide-react";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
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
          <div className="rounded-[20px] border border-slate-100 bg-white p-6">
            <div className="flex gap-5">
              <div className="h-20 w-12 rounded-xl bg-slate-100" />
              <div className="flex-1 space-y-3">
                <div className="h-3.5 w-full rounded bg-slate-100" />
                <div className="h-3.5 w-5/6 rounded bg-slate-100" />
                <div className="h-3.5 w-4/6 rounded bg-slate-100" />
                <div className="h-6 w-24 rounded-full bg-slate-100" />
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
  const authReady = !authLoading && !roleLoading;

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
    try {
      await axiosSecure.post(`/questions/${id}/upvote`);
      toast.success(iUpvoted ? "Upvote removed" : "Upvoted — asker earns +2");
      qc.invalidateQueries({ queryKey: ["question", id] });
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    }
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
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/questions"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> All questions
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
            <Link
              to="/questions/ask"
              className="hidden items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-black sm:inline-flex"
            >
              <Sparkles className="h-3.5 w-3.5" /> Ask
            </Link>
          </div>
        </div>

        {/* Title zone — hero */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 font-bold text-white shadow-sm">
              <Sparkles className="h-3 w-3" /> {categoryLabel(q.category)}
            </span>
            {q.context?.destinationCountry && (
              <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-indigo-700 ring-1 ring-indigo-100 shadow-sm">
                → {q.context.destinationCountry}
              </span>
            )}
            {q.context?.homeCountry && (
              <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-slate-600 ring-1 ring-slate-200 shadow-sm">
                {q.context.homeCountry}
              </span>
            )}
            {q.context?.studyLevel && (
              <span className="rounded-full bg-white px-3 py-1.5 font-semibold capitalize text-slate-600 ring-1 ring-slate-200 shadow-sm">
                {q.context.studyLevel}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3" /> asked {timeAgo(q.createdAt)}
            </span>
            {q.acceptedAnswerId && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 font-bold text-white">
                <CheckCircle2 className="h-3.5 w-3.5" /> Solved
              </span>
            )}
          </div>
          <h1 className="mt-4 text-[26px] font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-[32px] lg:text-[36px]">
            {q.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {followerCount} follower{followerCount === 1 ? "" : "s"}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" /> {q.answerCount ?? (q.answers || []).length} answers
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {q.viewCount ?? 0} views
            </span>
          </div>
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
              <div className="flex gap-0 sm:gap-0">
                {/* Vote rail */}
                <div className="flex w-[72px] shrink-0 flex-col items-center gap-1 border-r border-slate-100 bg-slate-50/70 px-3 py-5 sm:w-[84px]">
                  <button
                    onClick={handleQuestionUpvote}
                    disabled={!authReady}
                    title={
                      !user
                        ? "Sign in to vote"
                        : iUpvoted
                          ? "Upvoted — click to remove"
                          : "Upvote — asker earns +2"
                    }
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                      iUpvoted
                        ? "bg-brand-600 text-white shadow-md"
                        : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-brand-50 hover:text-brand-600 hover:ring-brand-200"
                    } disabled:opacity-40`}
                  >
                    <ArrowBigUp className={`h-6 w-6 ${iUpvoted ? "fill-white/20" : ""}`} />
                  </button>
                  <span className="text-[18px] font-extrabold tracking-tight text-slate-900">{q.voteScore ?? 0}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">votes</span>
                  <span className="mt-2 hidden text-center text-[10px] leading-tight text-slate-400 sm:block">
                    Upvote to
                    <br />
                    reward asker
                  </span>
                </div>
                <div className="min-w-0 flex-1 p-5 sm:p-6">
                  <div className="prose max-w-none prose-slate prose-p:leading-relaxed prose-a:text-brand-600 hover:prose-a:text-brand-700">
                    <MarkdownBody text={q.body} />
                  </div>
                  {(q.tags || []).length > 0 && (
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {(q.tags || []).map((t) => (
                        <Link
                          key={t}
                          to={`/questions?tag=${encodeURIComponent(t)}`}
                          className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-slate-900 hover:bg-black"
                        >
                          #{tagLabel(t)}
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <AuthorBlock
                      email={q.authorEmail}
                      role={q.authorRole}
                      isVerified={q.authorIsVerified}
                      size="lg"
                    />
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 font-medium text-slate-500 ring-1 ring-slate-200">
                        <Clock className="h-3 w-3" /> {new Date(q.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="hidden text-slate-300 sm:inline">·</span>
                      <span className="hidden text-slate-400 sm:inline">
                        {new Date(q.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
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
                  answersSorted.map((a) => (
                    <AnswerCard
                      key={a._id}
                      answer={a}
                      isAsker={isAsker}
                      onAccept={handleAccept}
                      accepting={acceptingId === String(a._id)}
                      questionId={id}
                    />
                  ))
                )}
              </div>
            </section>

            {/* Your answer */}
            <section id="answer" className="scroll-mt-28">
              {user ? (
                <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-soft">
                  <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                      <Sparkles className="h-4 w-4 text-brand-500" /> Your answer
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">Share what you know · add a source link for +3 reputation</p>
                  </div>
                  <div className="p-5">
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
              {/* Follow card */}
              <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-soft">
                <div className="bg-gradient-to-br from-brand-600 to-indigo-600 px-5 py-4">
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-white">
                    <BellPlus className="h-4 w-4" /> Stay updated
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-brand-100">Get notified when someone answers this question.</p>
                </div>
                <div className="p-4">
                  <button
                    onClick={handleFollowToggle}
                    disabled={followBusy || authLoading || roleLoading}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold shadow-sm transition disabled:opacity-50 ${
                      isFollowing ? "bg-slate-900 text-white hover:bg-black" : "bg-brand-600 text-white hover:bg-brand-700"
                    }`}
                  >
                    {isFollowing ? <BellOff className="h-4 w-4" /> : <BellPlus className="h-4 w-4" />}
                    {isFollowing ? "Following" : "Follow question"}
                  </button>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-bold text-slate-900">{followerCount}</span> follower{followerCount === 1 ? "" : "s"}
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400">notified on new answers</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-soft">
                <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Stats
                </h3>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {stats.map((s) => (
                    <div key={s.label} className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-white to-slate-50 px-2 py-4 ring-1 ring-slate-100">
                      <s.icon className="h-5 w-5 text-slate-400" />
                      <span className="mt-1.5 text-[18px] font-extrabold tracking-tight text-slate-900">{s.value}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">
                    Asked {timeAgo(q.createdAt)} · {new Date(q.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-soft">
                  <h3 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    <Flame className="h-3.5 w-3.5" /> Related
                  </h3>
                  <ul className="mt-3 space-y-1">
                    {related.map((r) => (
                      <li key={r._id}>
                        <Link
                          to={`/questions/${r._id}`}
                          className="group flex items-start gap-2 rounded-xl p-2.5 -mx-2.5 hover:bg-slate-50"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 group-hover:bg-brand-500" />
                          <span className="text-[13.5px] font-semibold leading-snug text-slate-700 group-hover:text-brand-600 line-clamp-2">{r.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link to="/questions" className="mt-3 inline-flex text-xs font-bold text-brand-600 hover:text-brand-700">
                    Browse all questions →
                  </Link>
                </div>
              )}

              {/* CTA */}
              <Link
                to="/questions/ask"
                className="flex items-center justify-center gap-2 rounded-[20px] bg-slate-900 p-4 text-sm font-extrabold text-white shadow-soft hover:bg-black"
              >
                <Sparkles className="h-4 w-4" /> Ask a question
              </Link>

              <p className="text-center text-[11px] leading-relaxed text-slate-400">
                Be specific · add context · include sources for <span className="font-bold text-slate-600">+3</span> bonus.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
