import { useEffect, useState, useRef } from "react";
import { Sparkles, Info, AlertTriangle, ExternalLink } from "lucide-react";
import RichTextEditor from "./wizard/RichTextEditor";

export default function AnswerForm({ onSubmit, submitting, questionId, isAsker, me, context }){
  const [body,setBody]=useState("");
  const [images,setImages]=useState([]);
  const [sourceLink,setSourceLink]=useState("");
  const [err,setErr]=useState({});
  const draftKey = questionId ? `answers:draft:${questionId}` : null;
  const saveTimeout = useRef(null);

  // restore draft on mount
  useEffect(()=>{
    if(!draftKey) return;
    try{
      const raw = localStorage.getItem(draftKey);
      if(raw){
        const d = JSON.parse(raw);
        if(typeof d.body === "string") setBody(d.body);
        if(typeof d.sourceLink === "string") setSourceLink(d.sourceLink);
        if(Array.isArray(d.images)) setImages(d.images);
      }
    } catch {}
  }, [draftKey]);

  // debounce save 500ms
  useEffect(()=>{
    if(!draftKey) return;
    if(saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(()=>{
      try{
        if(!body && !sourceLink && images.length===0) localStorage.removeItem(draftKey);
        else localStorage.setItem(draftKey, JSON.stringify({ body, sourceLink, images }));
      } catch {}
    }, 500);
    return ()=> clearTimeout(saveTimeout.current);
  }, [body, sourceLink, images, draftKey]);

  const clearDraft = ()=>{
    if(draftKey) try{ localStorage.removeItem(draftKey); } catch {}
  };

  const validate=()=>{
    const e={};
    if(!body.trim() || body.trim().length<20) e.body="Answer must be at least 20 characters";
    if(sourceLink && !/^https?:\/\//.test(sourceLink)) e.sourceLink="Must be http(s) URL";
    setErr(e);
    return Object.keys(e).length===0;
  };

  const canPost = body.trim().length >= 20 && (!sourceLink || /^https?:\/\//.test(sourceLink)) && !submitting;

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!validate()) return;
    const merged = body.trim() + (images.length ? "\n\n" + images.map((img)=>`![${img.name}](${img.url})`).join("\n\n") : "");
    onSubmit({ body: merged, sourceLink: sourceLink.trim() || null });
    setBody(""); setImages([]); setSourceLink(""); setErr({}); clearDraft();
  };

  const handleClear = ()=>{
    setBody(""); setSourceLink(""); setImages([]); setErr({}); clearDraft();
  };

  const name = me?.name || me?.email?.split("@")[0] || "You";
  const photo = me?.photoURL;

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">Your answer</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        Answer the specific question, cite official sources for factual claims — a source link earns <span className="rounded-full bg-sky-50 px-1.5 py-0.5 font-bold text-sky-700 ring-1 ring-sky-200">+3 rep</span> instantly.
      </p>

      {/* Guidance trust strip */}
      <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
        <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Info className="h-3.5 w-3.5" /> How to write a helpful answer</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
          <li>Answer the corridor question {context?.destinationCountry || context?.homeCountry || context?.studyLevel ? <span className="font-semibold text-slate-700">{[context.destinationCountry, context.homeCountry, context.studyLevel].filter(Boolean).join(" · ")}</span> : "directly"} — be specific to the ask.</li>
          <li>Cite a checkable source for numbers/dates/policy — paste official link below for <span className="font-semibold">+3</span> rep.</li>
          <li>Explain <em>why</em>, not just what — share steps, pitfalls, and how you verified it.</li>
        </ul>
      </div>

      {isAsker && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p><b>You asked this question</b> — only add an answer if you found a new solution or update. Otherwise edit the question for clarity.</p>
        </div>
      )}

      {/* Identity row */}
      {me && (
        <div className="mt-3 flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
          <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-xs font-extrabold text-white flex items-center justify-center">
            {photo ? <img src={photo} alt={name} className="h-full w-full object-cover" /> : name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-slate-600">Posting as <b className="text-slate-900">{name}</b>{typeof me.reputation === "number" ? <span className="text-slate-500"> · {me.reputation} rep</span> : null}</span>
          {me.email && <a href={`/profile/${encodeURIComponent(me.email)}`} className="ml-auto text-xs font-semibold text-brand-600 hover:underline inline-flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Profile</a>}
        </div>
      )}

      <div className="mt-4">
        <RichTextEditor label="Answer" value={body} onChange={setBody} images={images} onImagesChange={setImages} error={err.body} />
        {body.trim().length > 0 && body.trim().length < 20 && <p className="mt-1 text-xs font-medium text-amber-600">At least 20 characters — {body.trim().length}/20</p>}
      </div>
      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-extrabold tracking-wide text-slate-700 uppercase">Source link <span className="font-medium normal-case text-slate-400">(optional, +3)</span></label>
        <input value={sourceLink} onChange={e=>setSourceLink(e.target.value)} placeholder="https://official-source.example/…" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-50 focus:outline-none" />
        {err.sourceLink && <p className="mt-1 text-xs font-medium text-rose-600">{err.sourceLink}</p>}
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={handleClear} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Clear draft</button>
        <button type="submit" disabled={!canPost} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:from-brand-700 hover:to-indigo-700 disabled:opacity-50">
          <Sparkles className="h-4 w-4" /> {submitting ? "Posting…" : "Post answer"}
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">Draft autosaves locally until posted — refresh safe.</p>
    </form>
  );
}
