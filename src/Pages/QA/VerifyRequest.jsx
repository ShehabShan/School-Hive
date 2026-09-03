import { useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function VerifyRequest(){
  const axiosSecure = useAxiosSecure();
  const [credentialUrl,setCredentialUrl]=useState("");
  const [credentialType,setCredentialType]=useState("student_id");
  const [note,setNote]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [uploading,setUploading]=useState(false);

  const handleUpload= async (e)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    setUploading(true);
    try{
      const key=import.meta.env.VITE_IMAGE_HOSTING_KEY;
      if(!key){ toast.error("Upload key missing, paste URL manually"); return; }
      const fd=new FormData(); fd.append("image", file);
      const res= await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method:"POST", body:fd });
      const j= await res.json();
      const url=j?.data?.url;
      if(url){ setCredentialUrl(url); toast.success("Uploaded"); }
    } catch{ toast.error("Upload failed"); }
    finally{ setUploading(false); e.target.value=""; }
  };

  const handleSubmit= async (e)=>{
    e.preventDefault();
    if(!credentialUrl.trim()){ toast.error("Credential URL required"); return; }
    setSubmitting(true);
    try{
      await axiosSecure.post("/verify-request", { credentialUrl: credentialUrl.trim(), credentialType, note });
      toast.success("Submitted — pending review");
      setCredentialUrl(""); setNote("");
    } catch(err){
      toast.error(err?.response?.data?.message || err.message);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold">Get Verified</h1>
      <p className="text-sm opacity-70 mt-1">Upload student ID, admission letter, or enrollment confirmation. Staff reviews once — “BUET ’24, admitted TU Munich” badge visible from day one.</p>
      <form onSubmit={handleSubmit} className="mt-6 card bg-base-100 shadow p-6 space-y-4">
        <div>
          <label className="label"><span className="label-text font-medium">Credential image / PDF URL *</span></label>
          <input value={credentialUrl} onChange={e=>setCredentialUrl(e.target.value)} placeholder="https://..." className="input input-bordered w-full" />
          <label className="btn btn-xs btn-outline mt-2">
            {uploading ? "Uploading..." : "Upload image"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
          {credentialUrl && <img src={credentialUrl} alt="preview" className="mt-2 max-h-40 rounded border" loading="lazy" />}
        </div>
        <div>
          <label className="label"><span className="label-text">Type</span></label>
          <select value={credentialType} onChange={e=>setCredentialType(e.target.value)} className="select select-bordered w-full">
            <option value="student_id">Student ID</option>
            <option value="admission_letter">Admission letter</option>
            <option value="enrollment">Enrollment confirmation</option>
          </select>
        </div>
        <div>
          <label className="label"><span className="label-text">Note (optional)</span></label>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. BUET ’24, admitted TU Munich Fall 2025" className="input input-bordered w-full" />
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary w-full">{submitting ? "..." : "Submit for review"}</button>
      </form>
    </div>
  );
}
