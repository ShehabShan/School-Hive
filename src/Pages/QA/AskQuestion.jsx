import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useRole from "../../Hooks/useRole";
import RoleBadge from "../../Component/profile/RoleBadge";
import QuestionForm from "../../Component/QA/QuestionForm";
import toast from "react-hot-toast";

export default function AskQuestion(){
  const axiosSecure = useAxiosSecure();
  const { me, role } = useRole();
  const navigate = useNavigate();
  const [submitting,setSubmitting]=useState(false);

  const isStaff = ["admin","superadmin","modaretor"].includes(role);
  const badgeRole = isStaff ? role : role==="institution" ? "institution" : null;

  const handleSubmit= async (payload)=>{
    setSubmitting(true);
    try{
      const res = await axiosSecure.post("/questions", payload);
      const q = res.data?.data;
      toast.success("Question posted");
      if(q?._id) navigate(`/questions/${q._id}`);
      else navigate("/questions");
    } catch(e){
      const msg = e?.response?.data?.message || e?.response?.data?.errors?.join(", ") || e.message || "Failed to post";
      toast.error(msg);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold">Ask a question</h1>
      <p className="text-sm opacity-70 mt-1">Structured fields make your question searchable and filterable. Context helps the right people answer.</p>

      {me && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <img src={me.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(me.name||me.email)}`} alt="" className="w-8 h-8 rounded-full object-cover" />
          <span className="font-medium">{me.name || me.email}</span>
          {badgeRole && <RoleBadge role={badgeRole} size="sm" />}
          {!badgeRole && role && <span className="text-xs opacity-60 capitalize">{role}</span>}
        </div>
      )}

      <div className="mt-6 card bg-base-100 shadow p-6">
        <QuestionForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
