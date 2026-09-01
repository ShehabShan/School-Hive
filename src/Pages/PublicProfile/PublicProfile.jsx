import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Mail, CalendarDays, ShieldCheck, Award, GraduationCap, Crown, Globe } from "lucide-react";
import { motion } from "framer-motion";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import bg from "../../assist/bgImg/profileBg.jpg";
import Spinner from "../../Component/ui/Spinner";
import Stars from "../../Component/ui/Stars";
import StatusBadge from "../../Component/ui/StatusBadge";

const roleMeta = {
  superadmin: { label: "Owner", color: "bg-amber-100 text-amber-700 ring-amber-200", icon: Crown },
  admin: { label: "Administrator", color: "bg-brand-100 text-brand-700 ring-brand-200", icon: ShieldCheck },
  modaretor: { label: "Moderator", color: "bg-sky-100 text-sky-700 ring-sky-200", icon: Award },
  user: { label: "Student", color: "bg-emerald-100 text-emerald-700 ring-emerald-200", icon: GraduationCap },
};

export default function PublicProfile() {
  const { email } = useParams();
  const decodedEmail = decodeURIComponent(email || "");
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const { data: pub, isLoading: loadingPub } = useQuery({
    queryKey: ["public-profile", decodedEmail],
    enabled: !!decodedEmail,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/public/${encodeURIComponent(decodedEmail)}`);
      return res.data.data;
    },
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["public-reviews", decodedEmail],
    enabled: !!decodedEmail,
    queryFn: async () => {
      try {
        const token = localStorage.getItem("access-token");
        if (!token) return [];
        const res = await axiosSecure.get("/allReviews", { params: { email: decodedEmail, limit: 20 } });
        return res.data.data || [];
      } catch {
        const res = await axiosPublic.get(`/allReviews/${""}`).catch(()=>({data:{data:[]}}));
        return [];
      }
    },
  });

  if (loadingPub) return <div className="container-page py-20 text-center"><Spinner /></div>;
  if (!pub) return <div className="container-page py-20 text-center text-slate-500">User not found</div>;

  const meta = roleMeta[pub.role] || roleMeta.user;
  const Icon = meta.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={pub.coverPhoto || bg} alt="cover" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-8 flex items-end gap-4">
          <img src={pub.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(pub.name||pub.email)}&background=4F46E5&color=fff`} alt={pub.name} className="h-20 w-20 md:h-28 md:w-28 rounded-2xl object-cover ring-4 ring-white shadow-lift" onError={(e)=> e.currentTarget.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(pub.name||pub.email)}&background=4F46E5&color=fff`} />
          <div className="pb-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-white drop-shadow">{pub.name || "Unnamed"}</h1>
            <p className="text-sm text-white/80 flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{pub.email}</p>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ring-1 ${meta.color}`}><Icon className="h-3.5 w-3.5" />{meta.label}</span>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-6">
            <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <h3 className="font-bold text-slate-900">About</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{pub.bio || "No bio provided."}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {pub.city && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"><MapPin className="h-3 w-3" />{pub.city}, {pub.country || ""}</span>}
                {pub.country && !pub.city && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"><Globe className="h-3 w-3" />{pub.country}</span>}
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"><CalendarDays className="h-3 w-3" />Joined {pub.createdAt ? new Date(pub.createdAt).toLocaleDateString() : "—"}</span>
              </div>
              {Array.isArray(pub.skills) && pub.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Skills</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {pub.skills.map((s)=> <span key={s} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">{s}</span>)}
                  </div>
                </div>
              )}
            </motion.div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <h3 className="font-bold text-slate-900">Recent reviews</h3>
              <p className="text-sm text-slate-500">Reviews by this user (approved only publicly)</p>
              <div className="mt-4 space-y-3">
                {(reviewsData||[]).length===0 ? <p className="text-sm text-slate-400">No public reviews yet.</p> :
                  reviewsData.slice(0,10).map((r)=> (
                    <div key={r._id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center gap-2"><Stars rating={r.rating} showValue /><StatusBadge status={r.status} /></div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700 line-clamp-3">{r.comment}</p>
                      <p className="mt-1 text-xs text-slate-400">{r.scholership_details?.universityName || r.scholarShip_id}</p>
                    </div>
                  ))
                }
              </div>
              <Link to="/allScholership" className="mt-4 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">Browse scholarships →</Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
              <h3 className="font-bold text-slate-900">Contact</h3>
              <div className="mt-3 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-slate-600"><Mail className="h-4 w-4 text-brand-500" />{pub.email}</p>
                {pub.city && <p className="flex items-center gap-2 text-slate-600"><MapPin className="h-4 w-4 text-brand-500" />{pub.city}, {pub.country}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
