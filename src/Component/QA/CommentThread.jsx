import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import ReplyComposer from "./ReplyComposer";
import CommentItem from "./CommentItem";

const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";

function buildTree(flat) {
  const map = new Map();
  const roots = [];
  flat.forEach((c) => {
    map.set(String(c._id), { ...c, children: [] });
  });
  flat.forEach((c) => {
    const node = map.get(String(c._id));
    const parentId = c.parentId ? String(c.parentId) : null;
    if (parentId && map.has(parentId)) {
      map.get(parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });
  // sort children by createdAt asc (already sorted but ensure)
  const sortRec = (nodes) => {
    nodes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}

function renderNodes(nodes, depth, answerId, questionId, onSuccess, parentAuthorEmail = null) {
  return nodes.map((node) => (
    <CommentItem
      key={node._id}
      comment={node}
      depth={depth}
      answerId={answerId}
      questionId={questionId}
      parentAuthorEmail={parentAuthorEmail}
      onReplySuccess={onSuccess}
    >
      {node.children && node.children.length > 0 && renderNodes(node.children, depth + 1, answerId, questionId, onSuccess, node.authorEmail)}
    </CommentItem>
  ));
}

export default function CommentThread({ answerId, questionId }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showComposer, setShowComposer] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const { data: resp, isLoading } = useQuery({
    queryKey: ["comments", String(answerId)],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/answers/${answerId}/comments`, { params: { limit: 50 } });
      return res.data;
    },
    staleTime: 15 * 1000,
  });

  const flat = resp?.data || [];
  const tree = useMemo(() => buildTree(flat), [flat]);
  const count = resp?.total ?? flat.length;

  const handleSuccess = () => {
    setShowComposer(false);
    qc.invalidateQueries({ queryKey: ["comments", String(answerId)] });
    qc.invalidateQueries({ queryKey: ["question", String(questionId)] });
  };

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
        >
          <MessageCircle className="h-3.5 w-3.5 text-slate-500" />
          {count === 0 ? "No replies yet" : `${count} repl${count === 1 ? "y" : "ies"}`}
          <span className="text-slate-400">· {expanded ? "Hide" : "Show"}</span>
        </button>
        {user ? (
          <button
            onClick={() => setShowComposer((v) => !v)}
            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
          >
            {showComposer ? "Cancel" : "Reply"}
          </button>
        ) : (
          <span className="text-xs text-slate-400">Sign in to reply</span>
        )}
      </div>

      {showComposer && (
        <div className="mt-3">
          <ReplyComposer answerId={answerId} parentId={null} questionId={questionId} onSuccess={handleSuccess} onCancel={() => setShowComposer(false)} />
        </div>
      )}

      {expanded && (
        <div className="mt-3 space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-xl bg-white ring-1 ring-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-white ring-1 ring-slate-100" />
            </div>
          ) : flat.length === 0 ? (
            <p className="rounded-xl bg-white px-4 py-6 text-center text-sm text-slate-500 ring-1 ring-slate-100">No replies yet — be the first to reply.</p>
          ) : (
            renderNodes(tree, 0, answerId, questionId, handleSuccess)
          )}
        </div>
      )}
    </div>
  );
}
