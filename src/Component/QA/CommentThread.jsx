import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import AuthorBlock from "./AuthorBlock";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";

export default function CommentThread({ questionId, answerId }){
  const id = questionId || answerId;
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyBody, setReplyBody] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["question-comments", id],
    enabled: Boolean(id && questionId),
    queryFn: async ()=>{
      const res = await axios.get(`${baseURL}/questions/${id}/comments`, { params: { limit: 50 } });
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async ({ text, parentId })=>{
      const payload = { body: text, parentCommentId: parentId || null };
      const res = await axiosSecure.post(`/questions/${id}/comments`, payload);
      return res.data;
    },
    onSuccess: ()=>{
      qc.invalidateQueries({ queryKey: ["question-comments", id] });
      setBody(""); setReplyBody(""); setReplyTo(null);
      toast.success("Comment added");
    },
    onError: (e)=> toast.error(e?.response?.data?.message || e.message)
  });

  if(!questionId) {
    // fallback for legacy answerId placeholder — keep minimal
    return <div className="text-xs opacity-60 mt-2">Comments for {String(answerId).slice(0,6)} — threaded comments land as follow-up research (placeholder).</div>;
  }

  const list = data?.data || [];
  const topLevel = list.filter(c=> !c.parentCommentId);
  const repliesMap = {};
  list.forEach(c=>{
    if(c.parentCommentId){
      const pid = String(c.parentCommentId);
      if(!repliesMap[pid]) repliesMap[pid]=[];
      repliesMap[pid].push(c);
    }
  });

  const handlePost = ()=>{
    if(!user) return toast.error("Sign in to comment");
    if(!body.trim()) return;
    createMutation.mutate({ text: body.trim(), parentId: null });
  };
  const handleReplyPost = (parentId)=>{
    if(!user) return toast.error("Sign in to reply");
    if(!replyBody.trim()) return;
    createMutation.mutate({ text: replyBody.trim(), parentId });
  };

  return (
    <div className="border-t border-slate-100 bg-slate-50/50">
      <div className="p-4">
        <div className="flex gap-2">
          <div className="h-7 w-7 shrink-0 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">{user?.displayName?.charAt(0)?.toUpperCase() || "G"}</div>
          <div className="flex-1 flex gap-2">
            <input value={body} onChange={e=>setBody(e.target.value)} placeholder="Add a comment..." className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-50 focus:outline-none" onKeyDown={e=>{ if(e.key==="Enter") handlePost(); }} />
            <button onClick={handlePost} disabled={createMutation.isPending || !body.trim()} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-40">Post</button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Comments</h4>
            <span className="text-xs text-slate-400">Recommended</span>
          </div>

          {isLoading ? (
            <div className="mt-3 space-y-3">
              {[1,2].map(i=> <div key={i} className="animate-pulse rounded-xl bg-white p-3 ring-1 ring-slate-100"><div className="h-3 w-24 rounded bg-slate-100" /><div className="mt-2 h-3 w-full rounded bg-slate-100" /></div>)}
            </div>
          ) : topLevel.length===0 ? (
            <p className="mt-3 text-sm text-slate-500">No comments yet — be the first.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {topLevel.map(c=> (
                <div key={c._id} className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
                  <AuthorBlock email={c.authorEmail} role={c.authorRole} isVerified={c.authorIsVerified} time={c.createdAt} size="sm" />
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{c.body}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <button onClick={()=> setReplyTo(replyTo===String(c._id) ? null : String(c._id))} className="font-semibold text-slate-500 hover:text-brand-600">Reply</button>
                    <span className="text-slate-400">· {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  {replyTo===String(c._id) && (
                    <div className="mt-2 flex gap-2">
                      <input value={replyBody} onChange={e=>setReplyBody(e.target.value)} placeholder="Write a reply..." className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none" onKeyDown={e=>{ if(e.key==="Enter") handleReplyPost(c._id); }} />
                      <button onClick={()=>handleReplyPost(c._id)} disabled={!replyBody.trim() || createMutation.isPending} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">Reply</button>
                    </div>
                  )}
                  {(repliesMap[String(c._id)]||[]).map(r=> (
                    <div key={r._id} className="mt-3 ml-4 border-l-2 border-slate-100 pl-3">
                      <AuthorBlock email={r.authorEmail} role={r.authorRole} isVerified={r.authorIsVerified} time={r.createdAt} size="sm" />
                      <p className="mt-1 text-sm text-slate-700">{r.body}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {list.length > 0 && <button className="mx-auto mt-3 block text-xs font-semibold text-slate-500 hover:text-slate-700">View more comments ∨</button>}
        </div>
      </div>
    </div>
  );
}
