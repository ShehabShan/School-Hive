import { useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import toast from "react-hot-toast";

export default function ReplyComposer({ answerId, parentId = null, onSuccess, onCancel, autoFocus = true }) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const len = body.trim().length;
  const canSubmit = len >= 1 && len <= 2000 && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to reply");
      return;
    }
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await axiosSecure.post(`/answers/${answerId}/comments`, { body: body.trim(), parentId });
      setBody("");
      toast.success("Reply posted");
      onSuccess?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors?.[0] || err.message || "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={parentId ? "Write a reply…" : "Write a reply to this answer…"}
        rows={3}
        maxLength={2000}
        autoFocus={autoFocus}
        className="min-h-[72px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={`text-xs ${len > 2000 ? "text-rose-600" : len < 1 ? "text-slate-400" : "text-slate-500"}`}>
          {len}/2000
        </span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100">
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting…" : "Reply"}
          </button>
        </div>
      </div>
    </form>
  );
}
