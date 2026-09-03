import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function VerifyApprovals(){
  const axiosSecure = useAxiosSecure();
  const qc = useQueryClient();
  const [filter,setFilter]=useState("pending");
  const { data, isLoading } = useQuery({
    queryKey: ["verify-requests", filter],
    queryFn: async ()=>{
      const res = await axiosSecure.get("/verify-requests", { params: filter==="all" ? {} : { status: filter } });
      return res.data?.data || [];
    }
  });
  const handle = async (id, status, rejectReason)=>{
    try{
      await axiosSecure.patch(`/verify-request/${id}`, { status, rejectReason });
      toast.success(`${status}`);
      qc.invalidateQueries({ queryKey: ["verify-requests"] });
    } catch(e){ toast.error(e?.response?.data?.message || e.message); }
  };
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Verify Requests</h1>
      <div className="mt-3 flex gap-2">
        {["pending","approved","rejected","all"].map(s=> <button key={s} onClick={()=>setFilter(s)} className={`btn btn-sm ${filter===s?"btn-primary":"btn-outline"}`}>{s}</button>)}
      </div>
      {isLoading ? <div className="mt-4">Loading…</div> : (
        <div className="mt-4 space-y-3">
          {(data||[]).length===0 && <p className="text-sm opacity-60">No requests.</p>}
          {(data||[]).map(r=> (
            <div key={r._id} className="card bg-base-100 border p-4">
              <div className="text-sm font-medium">{r.email} • {r.credentialType} • <span className="badge badge-sm">{r.status}</span></div>
              <a href={r.credentialUrl} target="_blank" rel="noreferrer" className="link text-xs">{r.credentialUrl}</a>
              {r.note && <p className="text-xs opacity-70">Note: {r.note}</p>}
              {r.rejectReason && <p className="text-xs text-rose-600">Reject: {r.rejectReason}</p>}
              <div className="mt-2 flex gap-2">
                <button onClick={()=>handle(r._id,"approved")} className="btn btn-xs btn-success">Approve</button>
                <button onClick={()=>{
                  const reason=prompt("Reject reason?");
                  if(reason!==null) handle(r._id,"rejected",reason);
                }} className="btn btn-xs btn-error">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
