import { useState, useMemo } from "react";
import { QUESTION_CATEGORIES, QUESTION_TAGS, QUESTION_LANGUAGES, STUDY_LEVELS, tagLabel } from "../../constants/qa";

function isQuestionLike(title){
  const t = String(title||"").trim().toLowerCase();
  if(!t) return true;
  if(t.includes("?")) return true;
  return /^(how|what|why|when|where|which|can|does|is|are|should|would|do|did|will|has|have|any|best|need|looking)/.test(t);
}

export default function QuestionForm({ onSubmit, submitting }){
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const [category,setCategory]=useState("");
  const [tags,setTags]=useState([]);
  const [tagInput,setTagInput]=useState("");
  const [context,setContext]=useState({ destinationCountry:"", homeCountry:"", studyLevel:"", fieldOfStudy:"" });
  const [language,setLanguage]=useState("english");
  const [imageUploading,setImageUploading]=useState(false);
  const [errors,setErrors]=useState({});

  const showTitleNudge = useMemo(()=> title.trim().length>=10 && !isQuestionLike(title), [title]);
  const tagSuggestions = useMemo(()=>{
    const q = tagInput.trim().toLowerCase();
    if(!q) return [];
    return QUESTION_TAGS.filter(t=>t.includes(q) && !tags.includes(t)).slice(0,8);
  },[tagInput, tags]);

  const addTag=(t)=>{
    const v=String(t||tagInput).trim().toLowerCase();
    if(!v) return;
    if(tags.length>=5) return;
    if(tags.includes(v)) { setTagInput(""); return; }
    setTags([...tags, v]);
    setTagInput("");
  };
  const removeTag=(t)=> setTags(tags.filter(x=>x!==t));

  const handleImageUpload= async (e)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    setImageUploading(true);
    try{
      const key=import.meta.env.VITE_IMAGE_HOSTING_KEY;
      if(!key){ setBody(prev=> prev + `\n\n![${file.name}](upload-failed-no-key)`); return; }
      const fd=new FormData(); fd.append("image", file);
      const res= await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method:"POST", body:fd });
      const j= await res.json();
      const url=j?.data?.url;
      if(url) setBody(prev=> prev + `\n\n![${file.name}](${url})`);
    } finally { setImageUploading(false); e.target.value=""; }
  };

  const validate=()=>{
    const e={};
    if(!title.trim() || title.trim().length<10) e.title="Title required (at least 10 characters)";
    if(!body.trim() || body.trim().length<20) e.body="Body required (at least 20 characters)";
    if(!category) e.category="Category is required";
    if(tags.length<1 || tags.length>5) e.tags="Add 1 to 5 tags";
    if(!context.studyLevel && !context.destinationCountry && !context.homeCountry){
      // context optional but we don't block; no error
    }
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!validate()) return;
    onSubmit({ title: title.trim(), body: body.trim(), category, tags, context, language });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label"><span className="label-text font-medium">Title *</span></label>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. What IELTS score is needed for Canada Masters in CS?" className="input input-bordered w-full" />
        {showTitleNudge && <p className="text-xs text-amber-600 mt-1">Tip: phrase as a question (e.g. ends with “?”) — not required but helps search.</p>}
        {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="label"><span className="label-text font-medium">Body (markdown) *</span></label>
        <textarea value={body} onChange={e=>setBody(e.target.value)} rows={7} placeholder="Describe the context, what you already tried, and what you need. Markdown supported. Include links/images where helpful." className="textarea textarea-bordered w-full font-mono text-sm" />
        <div className="mt-2 flex items-center gap-2">
          <label className="btn btn-xs btn-outline">
            {imageUploading ? "Uploading..." : "Upload image"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={imageUploading} />
          </label>
          <span className="text-xs opacity-60">Images append as markdown <code>![alt](url)</code></span>
        </div>
        {errors.body && <p className="text-xs text-rose-600 mt-1">{errors.body}</p>}
      </div>

      <div>
        <label className="label"><span className="label-text font-medium">Category *</span></label>
        <select value={category} onChange={e=>setCategory(e.target.value)} className="select select-bordered w-full">
          <option value="">Select a category</option>
          {QUESTION_CATEGORIES.map(c=> <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        {errors.category && <p className="text-xs text-rose-600 mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="label"><span className="label-text font-medium">Tags * (1–5)</span></label>
        <div className="flex gap-2">
          <input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"){e.preventDefault(); addTag();} }} placeholder="Type tag and press Enter (e.g. ielts, canada)" className="input input-bordered flex-1" />
          <button type="button" onClick={()=>addTag()} className="btn btn-outline">Add</button>
        </div>
        {tagSuggestions.length>0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tagSuggestions.map(t=> <button type="button" key={t} onClick={()=>addTag(t)} className="badge badge-outline badge-sm hover:badge-primary">{tagLabel(t)}</button>)}
          </div>
        )}
        {tags.length>0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map(t=> <span key={t} className="badge badge-primary gap-1">{tagLabel(t)} <button type="button" onClick={()=>removeTag(t)} className="ml-1">×</button></span>)}
          </div>
        )}
        {errors.tags && <p className="text-xs text-rose-600 mt-1">{errors.tags}</p>}
        <p className="text-xs opacity-60 mt-1">Controlled vocab: ielts, canada, scholarship, visa, etc. Free-form allowed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label"><span className="label-text">Destination country</span></label>
          <input value={context.destinationCountry} onChange={e=>setContext({...context, destinationCountry:e.target.value})} placeholder="e.g. Canada" className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text">Home country / board</span></label>
          <input value={context.homeCountry} onChange={e=>setContext({...context, homeCountry:e.target.value})} placeholder="e.g. Bangladesh — National Curriculum" className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text">Study level</span></label>
          <select value={context.studyLevel} onChange={e=>setContext({...context, studyLevel:e.target.value})} className="select select-bordered w-full">
            <option value="">Select level</option>
            {STUDY_LEVELS.map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label"><span className="label-text">Field of study</span></label>
          <input value={context.fieldOfStudy} onChange={e=>setContext({...context, fieldOfStudy:e.target.value})} placeholder="e.g. Computer Science" className="input input-bordered w-full" />
        </div>
      </div>

      <div>
        <label className="label"><span className="label-text font-medium">Language</span></label>
        <div className="flex flex-wrap gap-2">
          {QUESTION_LANGUAGES.map(l=> (
            <button key={l.value} type="button" onClick={()=>setLanguage(l.value)} className={`btn btn-sm ${language===l.value ? "btn-primary" : "btn-outline"}`}>{l.label}</button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={submitting} className="btn btn-primary w-full">
        {submitting ? "Posting..." : "Post question"}
      </button>
    </form>
  );
}
