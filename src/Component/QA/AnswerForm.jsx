import { useState } from "react";

export default function AnswerForm({ onSubmit, submitting }){
  const [body,setBody]=useState("");
  const [sourceLink,setSourceLink]=useState("");
  const [err,setErr]=useState({});

  const validate=()=>{
    const e={};
    if(!body.trim() || body.trim().length<20) e.body="Answer must be at least 20 characters";
    if(sourceLink && !/^https?:\/\//.test(sourceLink)) e.sourceLink="Must be http(s) URL";
    setErr(e);
    return Object.keys(e).length===0;
  };
  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!validate()) return;
    onSubmit({ body: body.trim(), sourceLink: sourceLink.trim() || null });
  };
  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow p-4">
      <h3 className="font-semibold">Your answer</h3>
      <p className="text-xs opacity-60">Nudge: include a source link for factual claims — you’ll get <span className="badge badge-sm">+3</span></p>
      <textarea value={body} onChange={e=>setBody(e.target.value)} rows={5} placeholder="Write a detailed, helpful answer (markdown supported)…" className="textarea textarea-bordered w-full mt-2" />
      {err.body && <p className="text-xs text-rose-600 mt-1">{err.body}</p>}
      <input value={sourceLink} onChange={e=>setSourceLink(e.target.value)} placeholder="Optional source link (https://...)" className="input input-bordered w-full mt-3" />
      {err.sourceLink && <p className="text-xs text-rose-600 mt-1">{err.sourceLink}</p>}
      <button type="submit" disabled={submitting} className="btn btn-primary mt-3">{submitting ? "Posting..." : "Post answer"}</button>
    </form>
  );
}
