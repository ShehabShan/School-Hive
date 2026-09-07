import { useState } from "react";
import { MessageCircle, Trash2 } from "lucide-react";
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
  const isStaff = false; // could use useRole but keep simple; server will enforce

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

  // Q3: cap visual nesting at 3 levels — depth 0-3 indented, 4+ flattened at same indent as 3 (Reddit pattern)
  const visualDepth = Math.min(depth, 3);
  const indentClass =
    visualDepth === 0 ? "" : visualDepth === 1 ? "ml-4 sm:ml-6" : visualDepth === 2 ? "ml-8 sm:ml-10" : "ml-10 sm:ml-12";
  const borderClass = visualDepth === 0 ? "" : "border-l-2 border-slate-100 pl-3";
  const isFlattened = depth > 3;
  const parentName = parentAuthorEmail ? String(parentAuthorEmail).split("@")[0] : null;

  return (
    <div className={`${indentClass} ${borderClass}`}>
      <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-slate-100">
        {isFlattened && parentName && (
          <p className="mb-1.5 text-xs text-slate-500">
            Replying to <span className="font-semibold text-slate-700">@{parentName}</span> · flattened
          </p>
        )}
        <div className="flex items-start justify-between gap-2">
          <AuthorBlock email={comment.authorEmail} role={comment.authorRole} isVerified={comment.authorIsVerified} size="sm" />
          <span className="shrink-0 text-[11px] text-slate-400">{comment.createdAt ? timeAgo(comment.createdAt) : ""}</span>
        </div>
        <div className="mt-2 text-sm leading-relaxed text-slate-700">
          <MarkdownBody text={comment.body} />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => setShowReply((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Reply
          </button>
          {(isOwner || isStaff) && (
            <button onClick={handleDelete} className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-rose-600 ring-1 ring-rose-100 hover:bg-rose-50">
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          )}
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
      {children && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}
