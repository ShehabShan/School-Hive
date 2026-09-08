import { useState, useRef, useEffect, Children } from "react";
import { ArrowBigUp, ArrowBigDown, MoreHorizontal, Pencil, Trash2, Minus, Plus } from "lucide-react";
import MarkdownBody from "./MarkdownBody";
import AuthorBlock from "./AuthorBlock";
import ReplyComposer from "./ReplyComposer";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { timeAgo } from "./QuestionCard";

export default function CommentItem({ comment, depth = 0, answerId, questionId, onReplySuccess, children, isLast = false }) {
  const [showReply, setShowReply] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body || "");
  const [saving, setSaving] = useState(false);
  const [voting, setVoting] = useState(false);
  const [showDownvote, setShowDownvote] = useState(false);
  const [downvoteReason, setDownvoteReason] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const qc = useQueryClient();
  const menuRef = useRef(null);
  const isOwner = user && String(comment.authorEmail || "").toLowerCase() === String(user.email || "").toLowerCase();
  const myEmail = String(user?.email || "").toLowerCase();
  const upvoters = Array.isArray(comment.upvoterIds) ? comment.upvoterIds.map(String) : [];
  const downvoters = Array.isArray(comment.downvoterIds) ? comment.downvoterIds.map(String) : [];
  const iUpvoted = upvoters.includes(myEmail);
  const iDownvoted = downvoters.includes(myEmail);
  const hasVoted = iUpvoted || iDownvoted;
  const isDeleted = Boolean(comment.isDeleted) || comment.body === "[deleted]" || comment.authorEmail === "[deleted]";

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onEsc = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onEsc); };
  }, [menuOpen]);

  const handleDelete = async () => {
    if (!confirm("Delete this reply?")) return;
    try {
      await axiosSecure.delete(`/comments/${comment._id}`);
      toast.success("Reply deleted");
      setMenuOpen(false);
      qc.invalidateQueries({ queryKey: ["comments", String(answerId)] });
      qc.invalidateQueries({ queryKey: ["question", String(questionId)] });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const handleEditSave = async () => {
    const body = editBody.trim();
    if (body.length < 1) return toast.error("Body must be at least 1 character");
    if (body.length > 2000) return toast.error("Body must be at most 2000 characters");
    setSaving(true);
    try {
      await axiosSecure.patch(`/comments/${comment._id}`, { body });
      toast.success("Reply updated");
      setEditing(false); setMenuOpen(false);
      qc.invalidateQueries({ queryKey: ["comments", String(answerId)] });
    } catch (e) { toast.error(e?.response?.data?.message || e.message); } finally { setSaving(false); }
  };

  const handleUpvote = async () => {
    if (isDeleted) return;
    if (!user) return toast.error("Sign in to vote");
    if (hasVoted) return toast.error("Already voted");
    setVoting(true);
    try { await axiosSecure.post(`/comments/${comment._id}/upvote`); toast.success("Upvoted"); qc.invalidateQueries({ queryKey: ["comments", String(answerId)] }); } catch (e) { toast.error(e?.response?.data?.message || e.message); } finally { setVoting(false); }
  };
  const handleDownvote = async () => {
    if (isDeleted) return;
    if (!user) return toast.error("Sign in to vote");
    if (hasVoted) return toast.error("Already voted");
    setVoting(true);
    try {
      const payload = downvoteReason.trim() ? { reason: downvoteReason.trim() } : {};
      await axiosSecure.post(`/comments/${comment._id}/downvote`, payload);
      toast.success("Downvoted");
      setShowDownvote(false); setDownvoteReason("");
      qc.invalidateQueries({ queryKey: ["comments", String(answerId)] });
    } catch (e) { toast.error(e?.response?.data?.message || e.message); } finally { setVoting(false); }
  };

  const handleReplySuccess = () => {
    setShowReply(false);
    onReplySuccess?.();
  };

  const visualDepth = Math.min(depth, 3);
  const indentPad = visualDepth === 0 ? "" : visualDepth === 1 ? "ml-4" : visualDepth === 2 ? "ml-6 sm:ml-8" : "ml-8 sm:ml-10";
  const score = comment.voteScore ?? 0;
  const hasChildren = !!children;
  const isLeafLast = isLast && !hasChildren;
  const isEdited = !isDeleted && (Boolean(comment.isEdited) || (comment.updatedAt && comment.createdAt && new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() > 1000));

  // count direct children for collapsed pill
  const countChildren = (() => {
    if (!children) return 0;
    try {
      let count = 0;
      const countRec = (nodes) => {
        Children.forEach(nodes, (n) => {
          if (!n) return;
          if (n.props && n.props.comment) count += 1;
          if (n.props && n.props.children) countRec(n.props.children);
        });
      };
      countRec(children);
      return count || 1;
    } catch { return 1; }
  })();

  if (isDeleted) {
    return (
      <div className={`${indentPad} relative ${visualDepth > 0 ? "pl-6 sm:pl-7" : ""}`}>
        {visualDepth > 0 && (
          <>
            <span aria-hidden className={`absolute left-0 top-0 w-px bg-slate-200 ${isLeafLast ? "h-[22px]" : "bottom-0"}`} />
            <span aria-hidden className="absolute left-0 top-[22px] h-[10px] w-4 sm:w-5 -translate-y-[9px] border-b border-l border-slate-200 rounded-bl-lg" />
          </>
        )}
        <div className="flex gap-2.5 py-3.5">
          {hasChildren && (
            <button onClick={() => setCollapsed(v=>!v)} className="absolute -left-[9px] top-[14px] flex h-[18px] w-[18px] items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-sm" aria-label={collapsed ? "Expand" : "Collapse"}>
              {collapsed ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            </button>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-400">⊘</span>
              <span className="text-sm font-medium text-slate-400 italic">Comment was deleted</span>
              <span className="hidden sm:inline text-slate-300">·</span>
              <span className="shrink-0 text-[11px] text-slate-400">{comment.createdAt ? timeAgo(comment.createdAt) : ""}</span>
            </div>
            <div className="mt-1.5 text-[13px] leading-relaxed text-slate-400 italic">Comment was deleted</div>
            {hasChildren && collapsed && (
              <button onClick={() => setCollapsed(false)} className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                <Plus className="h-3 w-3" /> {countChildren || 1} more {countChildren===1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        </div>
        {hasChildren && !collapsed && <div>{children}</div>}
      </div>
    );
  }

  return (
    <div className={`${indentPad} relative ${visualDepth > 0 ? "pl-6 sm:pl-7" : ""}`}>
      {visualDepth > 0 && (
        <>
          <span
            aria-hidden
            className={`absolute left-0 top-0 w-px bg-slate-200 ${isLeafLast && !collapsed ? "h-[22px]" : collapsed && hasChildren ? "h-[22px]" : "bottom-0"}`}
          />
          <span
            aria-hidden
            className="absolute left-0 top-[22px] h-[10px] w-4 sm:w-5 -translate-y-[9px] border-b border-l border-slate-200 rounded-bl-lg"
          />
        </>
      )}
      <div className="flex gap-2.5 py-3.5">
        {hasChildren && (
          <button onClick={() => setCollapsed(v=>!v)} className="absolute -left-[9px] top-[14px] flex h-[18px] w-[18px] items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-sm hover:bg-slate-100" aria-label={collapsed ? "Expand" : "Collapse"}>
            {collapsed ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          </button>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <AuthorBlock email={comment.authorEmail} role={comment.authorRole} isVerified={comment.authorIsVerified} size="sm" />
              <span className="hidden sm:inline text-slate-300">·</span>
              <span className="shrink-0 text-[11px] text-slate-400">{comment.createdAt ? timeAgo(comment.createdAt) : ""}{isEdited && <span className="ml-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200">edited</span>}</span>
            </div>
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(v=>!v)} className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="More" aria-haspopup="menu" aria-expanded={menuOpen}>
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div role="menu" className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  {isOwner && (
                    <button role="menuitem" onClick={()=>{ setEditing(true); setEditBody(comment.body||""); setMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <Pencil className="h-4 w-4 text-slate-500" /> Edit
                    </button>
                  )}
                  {isOwner && (
                    <>
                      <div className="border-t border-slate-100" />
                      <button role="menuitem" onClick={handleDelete} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50">
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </>
                  )}
                  {!isOwner && (
                    <div className="px-3 py-2.5 text-xs text-slate-400">No actions</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {editing ? (
            <div className="mt-2 space-y-2">
              <textarea value={editBody} onChange={e=>setEditBody(e.target.value)} maxLength={2000} rows={3} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100" />
              <div className="flex gap-2">
                <button onClick={handleEditSave} disabled={saving} className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-black disabled:opacity-50">{saving?"Saving…":"Save"}</button>
                <button onClick={()=>setEditing(false)} className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
              </div>
              <p className="text-[11px] text-slate-400">{editBody.trim().length}/2000</p>
            </div>
          ) : (
            <div className="mt-1.5 text-[13px] leading-relaxed text-slate-700">
              <MarkdownBody text={comment.body} className="prose-sm" />
            </div>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-1.5 py-1 ring-1 ring-slate-200">
              <button onClick={handleUpvote} disabled={voting || !user || hasVoted} title={!user ? "Sign in to vote" : hasVoted ? "Already voted" : "Upvote"} className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${iUpvoted ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-white hover:text-brand-600"} disabled:opacity-40`}>
                <ArrowBigUp className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-4 text-center text-xs font-bold text-slate-700">{score}</span>
              <button onClick={()=>{ if(!user) return toast.error("Sign in to vote"); if(hasVoted) return toast.error("Already voted"); setShowDownvote(v=>!v); }} disabled={voting || !user || hasVoted} title={!user ? "Sign in to vote" : hasVoted ? "Already voted" : "Downvote (optional reason)"} className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${iDownvoted ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-white hover:text-slate-700"} disabled:opacity-40`}>
                <ArrowBigDown className="h-3.5 w-3.5" />
              </button>
            </span>
            <button
              onClick={() => setShowReply((v) => !v)}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Reply
            </button>
          </div>

          {showDownvote && !hasVoted && (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-700">Downvote reason (optional)</p>
              <input value={downvoteReason} onChange={e=>setDownvoteReason(e.target.value)} maxLength={300} placeholder="e.g. outdated…" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-100" />
              <div className="mt-2 flex gap-2">
                <button onClick={handleDownvote} disabled={voting} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-black disabled:opacity-50">Confirm downvote</button>
                <button onClick={()=>{setShowDownvote(false); setDownvoteReason("");}} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-slate-200">Cancel</button>
              </div>
            </div>
          )}

          {showReply && (
            <div className="mt-3">
              <ReplyComposer
                answerId={answerId}
                parentId={comment._id}
                questionId={questionId}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReply(false)}
              />
            </div>
          )}
          {hasChildren && collapsed && (
            <button onClick={() => setCollapsed(false)} className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              <Plus className="h-3 w-3" /> {countChildren || 1} more {countChildren===1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>
      {hasChildren && !collapsed && <div>{children}</div>}
    </div>
  );
}
