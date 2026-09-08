import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, ChevronDown } from "lucide-react";
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
  const sortRec = (nodes) => {
    nodes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);
  return roots;
}

function renderNodes(nodes, depth, answerId, questionId, onSuccess, parentAuthorEmail = null) {
  return nodes.map((node, idx) => {
    const isLast = idx === nodes.length - 1;
    return (
      <CommentItem
        key={node._id}
        comment={node}
        depth={depth}
        isLast={isLast}
        answerId={answerId}
        questionId={questionId}
        parentAuthorEmail={parentAuthorEmail}
        onReplySuccess={onSuccess}
      >
        {node.children && node.children.length > 0 && renderNodes(node.children, depth + 1, answerId, questionId, onSuccess, node.authorEmail)}
      </CommentItem>
    );
  });
}

export default function CommentThread({ answerId, questionId, isAccepted = false }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showComposer, setShowComposer] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const { data: resp, isLoading, refetch } = useQuery({
    queryKey: ["comments", String(answerId)],
    queryFn: async () => {
      const res = await axios.get(`${baseURL}/answers/${answerId}/comments`, { params: { limit: 50 } });
      return res.data;
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  const flat = resp?.data || [];
  const tree = useMemo(() => buildTree(flat), [flat]);
  const count = resp?.total ?? flat.length;

  const handleSuccess = async () => {
    setShowComposer(false);
    await refetch();
    qc.invalidateQueries({ queryKey: ["question", String(questionId)] });
  };

  const handleReplySuccess = async () => {
    await refetch();
    qc.invalidateQueries({ queryKey: ["question", String(questionId)] });
  };

  const footerBg = isAccepted ? "bg-emerald-50/40" : "bg-slate-50/60";
  const borderTop = isAccepted ? "border-emerald-100" : "border-slate-100";

  return (
    <div className={`border-t ${borderTop} ${footerBg}`}>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
        >
          <MessageCircle className="h-3.5 w-3.5 text-slate-500" />
          {count === 0 ? "No replies yet" : `${count} repl${count === 1 ? "y" : "ies"}`}
          <span className="inline-flex items-center gap-0.5 font-medium text-slate-400">
            · {expanded ? "Hide" : "Show"} <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </span>
        </button>
        {user ? (
          <button
            onClick={() => setShowComposer((v) => !v)}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            {showComposer ? "Cancel" : "Reply"}
          </button>
        ) : (
          <span className="text-xs text-slate-400">Sign in to reply</span>
        )}
      </div>

      {showComposer && (
        <div className={`mx-3 mb-3 sm:mx-4 ${expanded || count === 0 ? "mt-0" : "mt-0"}`}>
          <ReplyComposer answerId={answerId} parentId={null} questionId={questionId} onSuccess={handleSuccess} onCancel={() => setShowComposer(false)} />
        </div>
      )}

      {expanded && (
        <div className={`px-3 pb-3 sm:px-4 ${showComposer ? "pt-0" : "pt-0"}`}>
          {isLoading ? (
            <div className="space-y-2 pt-2">
              <div className="h-14 animate-pulse rounded-lg bg-white ring-1 ring-slate-100" />
              <div className="h-14 animate-pulse rounded-lg bg-white ring-1 ring-slate-100" />
            </div>
          ) : flat.length === 0 ? (
            <p className="rounded-lg bg-white px-4 py-5 text-center text-xs text-slate-500 ring-1 ring-slate-100">No replies yet — be the first to reply.</p>
          ) : (
            <div className="divide-y divide-slate-100 rounded-lg bg-white ring-1 ring-slate-100">
              {renderNodes(tree, 0, answerId, questionId, handleReplySuccess)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
