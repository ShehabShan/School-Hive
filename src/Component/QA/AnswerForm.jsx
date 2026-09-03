import { useState } from "react";
import { Sparkles } from "lucide-react";
import RichTextEditor from "./wizard/RichTextEditor";

export default function AnswerForm({ onSubmit, submitting }){
  const [body,setBody]=useState("");
  const [images,setImages]=useState([]);
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
    const merged = body.trim() + (images.length ? "\n\n" + images.map((img)=>`![${img.name}](${img.url})`).join("\n\n") : "");
    onSubmit({ body: merged, sourceLink: sourceLink.trim() || null });
    setBody(""); setImages([]);
  };
  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">Your answer</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        Answer the specific question, cite official sources for factual claims — a source link earns <span className="rounded-full bg-sky-50 px-1.5 py-0.5 font-bold text-sky-700 ring-1 ring-sky-200">+3 rep</span> instantly.
      </p>
      <div className="mt-4">
        <RichTextEditor label="Answer" value={body} onChange={setBody} images={images} onImagesChange={setImages} error={err.body} />
      </div>
      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-extrabold tracking-wide text-slate-700 uppercase">Source link <span className="font-medium normal-case text-slate-400">(optional, +3)</span></label>
        <input value={sourceLink} onChange={e=>setSourceLink(e.target.value)} placeholder="https://official-source.example/…" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-50 focus:outline-none" />
        {err.sourceLink && <p className="mt-1 text-xs font-medium text-rose-600">{err.sourceLink}</p>}
      </div>
      <button type="submit" disabled={submitting} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:from-brand-700 hover:to-indigo-700 disabled:opacity-60">
        <Sparkles className="h-4 w-4" /> {submitting ? "Posting…" : "Post answer"}
      </button>
    </form>
  );
}
