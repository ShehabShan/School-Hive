import { useState, useMemo } from "react";
import { QUESTION_CATEGORIES, QUESTION_TAGS, QUESTION_LANGUAGES, STUDY_LEVELS, tagLabel } from "../../constants/qa";
import DuplicatePanel from "./DuplicatePanel";
import toast from "react-hot-toast";

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
  const [images,setImages]=useState([]);
  const [dragOver,setDragOver]=useState(false);
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

  const handleImageUpload= async (file)=>{
    if(!file) return;
    if(!file.type.startsWith("image/")){ toast.error("Only images allowed"); return; }
    if(file.size > 5*1024*1024){ toast.error("Image must be under 5MB"); return; }
    const key=import.meta.env.VITE_IMAGE_HOSTING_KEY;
    if(!key){ toast.error("Image hosting not configured (VITE_IMAGE_HOSTING_KEY missing)"); return; }
    setImageUploading(true);
    try{
      const fd=new FormData(); fd.append("image", file);
      const res= await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method:"POST", body:fd });
      const j= await res.json();
      const url=j?.data?.url;
      if(!url) throw new Error(j?.error?.message || "Upload failed");
      setImages((prev)=> [...prev, { id: `${Date.now()}-${file.name}`, name: file.name, url }]);
      toast.success("Image added");
    } catch(e){
      toast.error(e?.message || "Upload failed");
    } finally { setImageUploading(false); }
  };
  const onFileChange=(e)=>{ handleImageUpload(e.target.files?.[0]); e.target.value=""; };
  const onDrop=(e)=>{ e.preventDefault(); setDragOver(false); const f=Array.from(e.dataTransfer.files||[]).find(f=>f.type.startsWith("image/")); if(f) handleImageUpload(f); };
  const removeImage=(id)=> setImages((prev)=> prev.filter(img=>img.id!==id));

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
    const mergedBody = body.trim() + (images.length ? "\n\n" + images.map((img)=> `![${img.name}](${img.url})`).join("\n\n") : "");
    onSubmit({ title: title.trim(), body: mergedBody, category, tags, context, language });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label"><span className="label-text font-medium">Title *</span></label>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. What IELTS score is needed for Canada Masters in CS?" className="input input-bordered w-full" />
        {showTitleNudge && <p className="text-xs text-amber-600 mt-1">Tip: phrase as a question (e.g. ends with “?”) — not required but helps search.</p>}
        {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
        <DuplicatePanel title={title} />
      </div>

      <div>
        <label className="label"><span className="label-text font-medium">Details *</span></label>
        <div
          onDragOver={(e)=>{ e.preventDefault(); setDragOver(true); }}
          onDragEnter={(e)=>{ e.preventDefault(); setDragOver(true); }}
          onDragLeave={()=> setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-2xl border bg-white shadow-sm transition-all ${dragOver ? "border-brand-400 ring-4 ring-brand-50" : errors.body ? "border-rose-300" : "border-slate-200 hover:border-slate-300"}`}
        >
          <textarea value={body} onChange={e=>setBody(e.target.value)} rows={7} placeholder="Describe the context, what you already tried, and what you need. Drag & drop an image here — e.g. screenshot of portal, rejection letter, test score." className="min-h-[160px] w-full resize-y rounded-t-2xl bg-transparent px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none" />
          {dragOver && <div className="mx-2 mb-2 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 px-4 py-4 text-sm font-semibold text-brand-700">Drop image to upload</div>}
          {images.length>0 && (
            <div className="border-t border-slate-100 bg-slate-50/70 px-3 py-3">
              <p className="mb-2 text-xs font-bold text-slate-700">{images.length} image{images.length>1?"s":""} attached — shown as thumbnails, not raw text</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {images.map((img)=> (
                  <div key={img.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <img src={img.url} alt={img.name} className="h-24 w-full object-cover" loading="lazy" />
                    <div className="p-2"><p className="truncate text-xs font-medium text-slate-700">{img.name}</p></div>
                    <button type="button" onClick={()=>removeImage(img.id)} className="absolute right-1.5 top-1.5 rounded-full bg-slate-900/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-600">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-xs">
            <span className="text-slate-500">Tip: images appear as thumbnails above, not raw markdown</span>
            <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white ${imageUploading ? "bg-slate-400" : "bg-slate-900 hover:bg-black"}`}>
              {imageUploading ? "Uploading…" : "Upload image"}
              <input type="file" accept="image/*" className="hidden" onChange={onFileChange} disabled={imageUploading} />
            </label>
          </div>
        </div>
        {body.trim().length>0 && body.trim().length<40 && <p className="text-xs text-amber-600 mt-1">Tip: add a bit more detail — short bodies get fewer answers.</p>}
        {errors.body && <p className="text-xs font-medium text-rose-600 mt-1">{errors.body}</p>}
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
