import { useState } from "react";
import { ArrowBigUp, ArrowBigDown, Trash2, MoreHorizontal } from "lucide-react";
import MarkdownBody from "./MarkdownBody";
import AuthorBlock from "./AuthorBlock";
import ReplyComposer from "./ReplyComposer";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { timeAgo } from "./QuestionCard";

export default function CommentItem({ comment, depth = 0, answerId, questionId, parentAuthorEmail, onReplySuccess, children }) {
  const [showReply, setShowReply] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const qc = useQueryClient();
  const isOwner = user && String(comment.authorEmail || "").toLowerCase() === String(user.email || "").toLowerCase();

  const handleDelete = async () => {
    if (!confirm("Delete this reply?")) return;
    try {
      await axiosSecure.delete(`/comments/${comment._id}`);
      toast.success("Reply deleted");
      qc.invalidateQueries({ queryKey: ["comments", String(answerId)] });
      qc.invalidateQueries({ queryKey: ["question", String(questionId)] });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const handleReplySuccess = () => {
    setShowReply(false);
    onReplySuccess?.();
  };

  const visualDepth = Math.min(depth, 3);
  const indentPad = visualDepth === 0 ? "" : visualDepth === 1 ? "ml-4" : visualDepth === 2 ? "ml-6 sm:ml-8" : "ml-8 sm:ml-10";
  const isFlattened = depth > 3;
  const parentName = parentAuthorEmail ? String(parentAuthorEmail).split("@")[0] : null;
  const score = comment.voteScore ?? 0;

  return (
    <div className={`${indentPad} ${visualDepth > 0 ? "border-l border-slate-200 pl-3 sm:pl-4" : ""}`}>
      <div className="flex gap-2.5 py-3.5">
        {/* spine gutter avatar - keep AuthorBlock but tighten */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <AuthorBlock email={comment.authorEmail} role={comment.authorRole} isVerified={comment.authorIsVerified} size="sm" />
              <span className="hidden sm:inline text-slate-300">·</span>
              <span className="shrink-0 text-[11px] text-slate-400">{comment.createdAt ? timeAgo(comment.createdAt) : ""}</span>
            </div>
            <button className="hidden sm:inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="More">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {isFlattened && parentName && (
            <p className="mt-1.5 text-xs text-slate-500">
              Replying to <span className="font-semibold text-slate-700">@{parentName}</span> · flattened
            </p>
          )}

          <div className="mt-1.5 text-[13px] leading-relaxed text-slate-700">
            <MarkdownBody text={comment.body} className="prose-sm" />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-1.5 py-1 ring-1 ring-slate-200">
              <button className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 hover:bg-white hover:text-brand-600" aria-label="Upvote" disabled title="Voting on replies coming soon">
                <ArrowBigUp className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-4 text-center text-xs font-bold text-slate-700">{score}</span>
              <button className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500 hover:bg-white hover:text-slate-700" aria-label="Downvote" disabled title="Voting on replies coming soon">
                <ArrowBigDown className="h-3.5 w-3.5" />
              </button>
            </span>
            <button
              onClick={() => setShowReply((v) => !v)}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Reply
            </button>
            {isOwner && (
              <button onClick={handleDelete} className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-xs font-medium text-rose-600 ring-1 ring-rose-100 hover:bg-rose-50">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            )}
            <span className="ml-auto inline-flex sm:hidden h-6 w-6 items-center justify-center rounded-full text-slate-400">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          </div>

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
        </div>
      </div>
      {children && <div className="divide-y divide-slate-100 border-t border-slate-100">{children}</div>}
    </div>
  );
}
