import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Users, FileText, Star, GraduationCap, Save, X, Upload, Briefcase, Award, Trophy, Settings, LayoutDashboard, Building2, BookOpen, Heart, Globe, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAdmin from "../../../Hooks/useAdmin";
import useModaretor from "../../../Hooks/useModaretor";
import useRole from "../../../Hooks/useRole";
import { useSaved } from "../../../Hooks/useSaved";
import { useMeStats } from "../../../Hooks/useProfileStats";
import Spinner from "../../../Component/ui/Spinner";
import ProfileLayout from "../../../Component/profile/ProfileLayout";
import StatsRow from "../../../Component/profile/StatsRow";
import Sidebar from "../../../Component/profile/Sidebar";
import SocialLinks from "../../../Component/profile/SocialLinks";
import ActivitySection from "../../../Component/profile/ActivitySection";
import GalleryStrip from "../../../Component/profile/GalleryStrip";
import { EducationTimeline, ExperienceTimeline, CertificationsSection, AchievementsSection, LanguagesInterests } from "../../../Component/profile/TimelineSection";
import PreferencesPanel from "../../../Component/profile/PreferencesPanel";
import InstitutionStudentPortal from "../../../Component/profile/InstitutionStudentPortal";
import { hasValue } from "../../../utils/hasValue";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "activity", label: "Activity", icon: FileText },
  { id: "students", label: "Students", icon: Users, institutionOnly: true },
  { id: "settings", label: "Settings", icon: Settings },
];

function BioSection({ user, isOwner, onEdit }) {
  const bio = hasValue(user?.bio) ? user.bio : null;
  const skills = (user?.skills || []).filter(Boolean);
  const headline = hasValue(user?.headline) ? user.headline : null;
  const [expanded, setExpanded] = useState(false);
  const limit = 220;
  const isLong = bio && bio.length > limit;
  const displayBio = bio ? (expanded || !isLong ? bio : bio.slice(0, limit) + "…") : null;
  if (!bio && !skills.length && !headline) {
    if (!isOwner) return null;
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><Sparkles className="h-4 w-4 text-brand-500" /> About</h3>
        <p className="mt-2 text-sm text-slate-500">Tell your story — where you study, what you aim for, and how you help.</p>
        <button onClick={onEdit} className="mt-3 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700">+ Add your bio</button>
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><Sparkles className="h-4 w-4 text-brand-500" /> About</h3>
      {displayBio && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{displayBio} {isLong && <button onClick={()=> setExpanded(!expanded)} className="ml-1 font-bold text-brand-600 hover:underline">{expanded ? "Show less" : "Show more"}</button>}</p>}
      {!displayBio && isOwner && <button onClick={onEdit} className="mt-3 inline-flex rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-slate-200">+ Add bio</button>}
      {headline && <p className="mt-3 border-l-2 border-brand-100 pl-3 text-sm italic text-slate-500">“{headline}”</p>}
      {skills.length > 0 && <div className="mt-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Skills</p><div className="mt-2 flex flex-wrap gap-1.5">{skills.map(s=> <span key={s} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">{s}</span>)}</div></div>}
      {isOwner && !skills.length && <button onClick={onEdit} className="mt-3 inline-flex rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-slate-200">+ Add skills</button>}
    </div>
  );
}

function InstitutionCard({ user, isOwner, onEdit }) {
  if (!user || user.role !== "institution") return null;
  const hasAny = hasValue(user.orgName) || hasValue(user.orgDescription) || hasValue(user.orgCountry) || hasValue(user.orgHighlights) || hasValue(user.orgDepartments);
  if (!hasAny) {
    if (!isOwner) return null;
    return (
      <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><Building2 className="h-4 w-4 text-violet-600" /> Institution</h3>
        <p className="mt-2 text-sm text-slate-500">Add your institution profile to build trust.</p>
        <button onClick={onEdit} className="mt-3 inline-flex rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white">+ Add details</button>
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><Building2 className="h-4 w-4 text-violet-600" /> {user.orgName || "Institution"}</h3>
      <div className="mt-3 grid gap-2 text-sm">
        {hasValue(user.orgCountry) && <p><span className="font-semibold">Country:</span> {user.orgCountry}</p>}
        {hasValue(user.orgFounded) && <p><span className="font-semibold">Founded:</span> {user.orgFounded}</p>}
        {hasValue(user.orgAccreditation) && <p><span className="font-semibold">Accreditation:</span> {user.orgAccreditation}</p>}
        {(hasValue(user.orgStudentCount) || hasValue(user.orgFacultyCount)) && <p><span className="font-semibold">Community:</span> {user.orgStudentCount ?? "—"} students • {user.orgFacultyCount ?? "—"} faculty</p>}
        {hasValue(user.orgDescription) && <p className="text-slate-600 whitespace-pre-wrap">{user.orgDescription}</p>}
        {Array.isArray(user.orgHighlights) && user.orgHighlights.filter(Boolean).length>0 && <div className="flex flex-wrap gap-1.5">{user.orgHighlights.filter(Boolean).map(h=> <span key={h} className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">{h}</span>)}</div>}
        {Array.isArray(user.orgDepartments) && user.orgDepartments.filter(Boolean).length>0 && <p className="text-xs text-slate-500">Departments: {user.orgDepartments.filter(Boolean).join(", ")}</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {hasValue(user.orgWebsite) && <a href={user.orgWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"><Globe className="h-3 w-3" /> Website</a>}
        {hasValue(user.orgBrochureUrl) && <a href={user.orgBrochureUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700"><BookOpen className="h-3 w-3" /> Brochure</a>}
        {hasValue(user.orgMapUrl) && <a href={user.orgMapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"><Globe className="h-3 w-3" /> Map</a>}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [isAdmin] = useAdmin();
  const [isModaretor] = useModaretor();
  const { isInstitution } = useRole();
  const isAdminOrMod = isAdmin || isModaretor;
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname.includes("/students") ? "students" : "overview");
  useEffect(()=> { if (location.pathname.includes("/students")) setActiveTab("students"); }, [location.pathname]);
  const [editing, setEditing] = useState(false);
  const [editStep, setEditStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  const { data: dbUser, isLoading, refetch } = useQuery({
    queryKey: ["profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try { const { data } = await axiosSecure.get("/users/me"); return data.data; } catch { const { data } = await axiosSecure.get(`/user?email=${user.email}`); return data.data; }
    },
  });

  const { data: myApply = [] } = useQuery({
    queryKey: ["profile-apply", user?.email],
    enabled: !!user?.email && !isInstitution,
    queryFn: async () => { const { data } = await axiosSecure.get(`/apply?email=${user.email}`); return data.data; },
  });
  const { data: myReviews = [] } = useQuery({
    queryKey: ["profile-reviews", user?.email],
    enabled: !!user?.email && !isInstitution,
    queryFn: async () => { const { data } = await axiosSecure.get(`/allReviews?email=${user.email}`); return data.data; },
  });
  const { data: savedDocs = [] } = useSaved();
  const { data: statsData } = useMeStats();
  const { data: scholership = [] } = useQuery({
    queryKey: ["profile-scholarships"], enabled: !!isAdminOrMod,
    queryFn: async () => { const { data } = await axiosPublic.get("/allScholership", { params: { limit: 50 } }); return data.data; },
  });
  const { data: reviewStats } = useQuery({
    queryKey: ["profile-review-stats"], enabled: !!isAdmin || !!isModaretor,
    queryFn: async () => { try { const { data } = await axiosSecure.get("/reviews/stats"); return data; } catch { return null; } },
  });
  const { data: allUsers = [] } = useQuery({
    queryKey: ["profile-allUsers"], enabled: !!isAdminOrMod,
    queryFn: async () => { try { const { data } = await axiosSecure.get("/users"); return data.data; } catch { return []; } },
  });

  const openEdit = () => {
    setForm({
      name: dbUser?.name || user?.displayName || "",
      headline: dbUser?.headline || "",
      phone: dbUser?.phone || "",
      city: dbUser?.city || "",
      country: dbUser?.country || "",
      bio: dbUser?.bio || "",
      skills: (dbUser?.skills || []).join(", "),
      interests: (dbUser?.interests || []).join(", "),
      languages: dbUser?.languages || [],
      photoURL: dbUser?.photoURL || user?.photoURL || "",
      coverPhoto: dbUser?.coverPhoto || "",
      gallery: (dbUser?.gallery || []).join(", "),
      videoIntro: dbUser?.videoIntro || "",
      socials: dbUser?.socials || { linkedin: "", twitter: "", github: "", website: "" },
      education: dbUser?.education || [],
      experience: dbUser?.experience || [],
      certifications: dbUser?.certifications || [],
      achievements: dbUser?.achievements || [],
      preferences: dbUser?.preferences || { visibility: "public", showStatsOnPublic: true, showScheduledOnProfile: false, emailNotifications: true },
      orgName: dbUser?.orgName || "",
      orgType: dbUser?.orgType || "university",
      orgCountry: dbUser?.orgCountry || "",
      orgWebsite: dbUser?.orgWebsite || "",
      orgDescription: dbUser?.orgDescription || "",
      orgFounded: dbUser?.orgFounded || "",
      orgAccreditation: dbUser?.orgAccreditation || "",
      orgStudentCount: dbUser?.orgStudentCount || "",
      orgFacultyCount: dbUser?.orgFacultyCount || "",
      orgDepartments: (dbUser?.orgDepartments || []).join(", "),
      orgProgramsText: (dbUser?.orgPrograms || []).map(p=>p.name).join(", "),
      orgGallery: (dbUser?.orgGallery || []).join(", "),
      orgVideoUrl: dbUser?.orgVideoUrl || "",
      orgBrochureUrl: dbUser?.orgBrochureUrl || "",
      orgMapUrl: dbUser?.orgMapUrl || "",
      orgHighlights: (dbUser?.orgHighlights || []).join(", "),
      _edu: { school:"", degree:"", field:"", startYear:"", endYear:"", grade:"", description:"" },
      _exp: { title:"", org:"", location:"", startDate:"", endDate:"", current:false, description:"" },
      _cert: { name:"", issuer:"", issueDate:"", url:"" },
      _ach: { title:"", date:"", description:"", url:"" },
    });
    setEditStep(1);
    setEditing(true);
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!image_hosting_key) { toast.error("Image hosting key missing"); return; }
    const fd = new FormData(); fd.append("image", file);
    try {
      toast.loading("Uploading image...", { id: "upload" });
      const res = await axiosPublic.post(image_hosting_api, fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.data?.url;
      if (url) { setForm((f) => ({ ...f, [field]: url })); toast.success("Image uploaded", { id: "upload" }); }
    } catch { toast.error("Upload failed", { id: "upload" }); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArr = String(form.skills).split(",").map(s=>s.trim()).filter(Boolean).slice(0,20);
      const interestsArr = String(form.interests).split(",").map(s=>s.trim()).filter(Boolean).slice(0,12);
      const galleryArr = String(form.gallery).split(",").map(s=>s.trim()).filter(Boolean).slice(0,6);
      const orgGalleryArr = String(form.orgGallery).split(",").map(s=>s.trim()).filter(Boolean).slice(0,6);
      const orgDeptArr = String(form.orgDepartments).split(",").map(s=>s.trim()).filter(Boolean).slice(0,20);
      const orgHighArr = String(form.orgHighlights).split(",").map(s=>s.trim()).filter(Boolean).slice(0,10);
      const orgProgArr = String(form.orgProgramsText).split(",").map(s=>s.trim()).filter(Boolean).slice(0,20).map(name=>({ name }));
      const payload = {
        name: String(form.name).trim(),
        headline: String(form.headline).trim() || null,
        photoURL: String(form.photoURL).trim() || null,
        coverPhoto: String(form.coverPhoto).trim() || null,
        phone: String(form.phone).trim() || null,
        city: String(form.city).trim() || null,
        country: String(form.country).trim() || null,
        bio: String(form.bio).trim() || null,
        skills: skillsArr,
        interests: interestsArr,
        languages: form.languages,
        gallery: galleryArr,
        videoIntro: String(form.videoIntro).trim() || null,
        socials: form.socials,
        education: form.education,
        experience: form.experience,
        certifications: form.certifications,
        achievements: form.achievements,
        preferences: form.preferences,
      };
      if (isInstitution) {
        payload.orgName = String(form.orgName).trim() || null;
        payload.orgType = form.orgType;
        payload.orgCountry = String(form.orgCountry).trim() || null;
        payload.orgWebsite = String(form.orgWebsite).trim() || null;
        payload.orgDescription = String(form.orgDescription).trim() || null;
        payload.orgFounded = form.orgFounded ? Number(form.orgFounded) : null;
        payload.orgAccreditation = String(form.orgAccreditation).trim() || null;
        payload.orgStudentCount = form.orgStudentCount ? Number(form.orgStudentCount) : null;
        payload.orgFacultyCount = form.orgFacultyCount ? Number(form.orgFacultyCount) : null;
        payload.orgDepartments = orgDeptArr;
        payload.orgPrograms = orgProgArr;
        payload.orgGallery = orgGalleryArr;
        payload.orgVideoUrl = String(form.orgVideoUrl).trim() || null;
        payload.orgBrochureUrl = String(form.orgBrochureUrl).trim() || null;
        payload.orgMapUrl = String(form.orgMapUrl).trim() || null;
        payload.orgHighlights = orgHighArr;
      }
      if (payload.name.length < 2) throw new Error("Name must be 2-80 characters");
      await axiosSecure.patch("/users/me", payload);
      if (payload.name !== user?.displayName || payload.photoURL !== user?.photoURL) {
        try { await updateUserProfile(payload.name, payload.photoURL); } catch {}
      }
      toast.success("Profile updated");
      setEditing(false);
      refetch();
    } catch (err) { toast.error(err?.response?.data?.message || err.message || "Update failed"); } finally { setSaving(false); }
  };

  const addEdu = () => {
    const e = form._edu;
    if (!e.school) return toast.error("School required");
    setForm(f=> ({ ...f, education: [...f.education, { school:e.school, degree:e.degree, field:e.field, startYear:e.startYear?Number(e.startYear):null, endYear:e.endYear?Number(e.endYear):null, grade:e.grade, description:e.description }], _edu: { school:"", degree:"", field:"", startYear:"", endYear:"", grade:"", description:"" } }));
  };
  const addExp = () => {
    const e = form._exp;
    if (!e.title || !e.org) return toast.error("Title & Organization required");
    setForm(f=> ({ ...f, experience: [...f.experience, { title:e.title, org:e.org, location:e.location, startDate:e.startDate, endDate:e.endDate, current:e.current, description:e.description }], _exp: { title:"", org:"", location:"", startDate:"", endDate:"", current:false, description:"" } }));
  };
  const addCert = () => {
    const c = form._cert;
    if (!c.name) return toast.error("Name required");
    setForm(f=> ({ ...f, certifications: [...f.certifications, { name:c.name, issuer:c.issuer, issueDate:c.issueDate, url:c.url }], _cert: { name:"", issuer:"", issueDate:"", url:"" } }));
  };
  const addAch = () => {
    const a = form._ach;
    if (!a.title) return toast.error("Title required");
    setForm(f=> ({ ...f, achievements: [...f.achievements, { title:a.title, date:a.date, description:a.description, url:a.url }], _ach: { title:"", date:"", description:"", url:"" } }));
  };

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Spinner className="h-8 w-8 text-brand-600" /></div>;

  const completeness = statsData?.completeness ?? dbUser?.completeness ?? 0;
  const userStats = [
    ...(!isInstitution ? [
      { label: "Applications", value: statsData?.applications ?? myApply.length ?? 0, icon: FileText, color: "text-brand-600 bg-brand-50", to: "/userDashboard/myApplication" },
      { label: "Reviews", value: statsData?.reviews ?? myReviews.length ?? 0, icon: Star, color: "text-amber-600 bg-amber-50", to: "/userDashboard/myReviews" },
    ] : []),
    ...(isInstitution ? [
      { label: "Scholarships", value: statsData?.scholarshipsCreated ?? "—", icon: BookOpen, color: "text-violet-600 bg-violet-50", to: "/institutionDashboard/manageScholarships" },
      { label: "Students", value: statsData?.studentsCount ?? "—", icon: Users, color: "text-emerald-600 bg-emerald-50", to: "/institutionDashboard/students" },
      { label: "Applicants", value: statsData?.applications ?? "—", icon: Users, color: "text-sky-600 bg-sky-50" },
    ] : []),
    { label: "Saved", value: statsData?.saved ?? savedDocs.length ?? 0, icon: GraduationCap, color: "text-emerald-600 bg-emerald-50", to: "/saved" },
    { label: "Followers", value: statsData?.followers ?? dbUser?.followersCount ?? 0, icon: Heart, color: "text-rose-600 bg-rose-50" },
  ];
  const adminStats = [
    { label: "Users", value: allUsers?.length || allUsers?.total || "—", icon: Users, color: "text-brand-600 bg-brand-50", to: "/adminDashboard/manageUsers" },
    { label: "Scholarships", value: scholership.length ?? 0, icon: GraduationCap, color: "text-sky-600 bg-sky-50", to: "/adminDashboard/manageScholarships" },
    { label: "Applications", value: statsData?.applications ?? myApply.length ?? 0, icon: FileText, color: "text-emerald-600 bg-emerald-50", to: "/adminDashboard/manageAppliedApplication" },
    { label: "Pending", value: reviewStats?.pending ?? "—", icon: Star, color: "text-amber-600 bg-amber-50", to: "/adminDashboard/manageReviews" },
  ];

  const visibleTabs = TABS.filter(t=> !t.institutionOnly || isInstitution);

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto max-w-6xl px-4">
        <ProfileLayout user={dbUser} isOwnProfile={true} onEdit={openEdit} completeness={completeness} tabs={visibleTabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-4">
          <StatsRow stats={isAdminOrMod ? adminStats : userStats} />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            {activeTab==="overview" && (
              <>
                <BioSection user={dbUser} isOwner={true} onEdit={openEdit} />
                {hasValue(dbUser?.socials) && <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100"><h4 className="text-sm font-bold text-slate-900">Links</h4><div className="mt-3"><SocialLinks socials={dbUser.socials} email={dbUser.email} /></div></div>}
                <LanguagesInterests languages={dbUser?.languages} interests={dbUser?.interests} />
                <GalleryStrip images={dbUser?.gallery} videoUrl={dbUser?.videoIntro} orgGallery={dbUser?.orgGallery} />
                <InstitutionCard user={dbUser} isOwner={true} onEdit={openEdit} />
                {!isInstitution && <ActivitySection applications={myApply} reviews={myReviews} viewAllLink="/userDashboard/myApplication" reviewLink="/userDashboard/myReviews" />}
                {isAdminOrMod && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{opacity:1, y:0}} className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-soft">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-amber-800"><ShieldCheck className="h-4 w-4" /> Admin Authorities</h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {[{label:"Manage Users",to:"/adminDashboard/manageUsers",desc:"Roles & accounts"},{label:"Manage Scholarships",to:"/adminDashboard/manageScholarships",desc:"Create & edit"},{label:"Applications",to:"/adminDashboard/manageAppliedApplication",desc:"Accept/Reject"},{label:"Moderate Reviews",to:"/adminDashboard/manageReviews",desc:"Queue & ratings"}].map(item=> (
                        <Link key={item.label} to={item.to} className="rounded-xl bg-white p-3 ring-1 ring-amber-100 hover:bg-amber-100/50"><p className="text-sm font-bold text-slate-800">{item.label}</p><p className="text-xs text-slate-500">{item.desc}</p></Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
            {activeTab==="education" && (
              <>
                <EducationTimeline education={dbUser?.education} />
                <ExperienceTimeline experience={dbUser?.experience} />
                {(!hasValue(dbUser?.education) && !hasValue(dbUser?.experience)) && (
                  <div className="rounded-2xl bg-white p-8 text-center shadow-soft ring-1 ring-slate-100">
                    <GraduationCap className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm font-semibold text-slate-700">No education or experience yet</p>
                    <p className="text-xs text-slate-500">Add your journey to build credibility.</p>
                    <button onClick={openEdit} className="mt-3 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white">+ Add education</button>
                  </div>
                )}
              </>
            )}
            {activeTab==="achievements" && (
              <>
                <CertificationsSection certifications={dbUser?.certifications} />
                <AchievementsSection achievements={dbUser?.achievements} />
                {(!hasValue(dbUser?.certifications) && !hasValue(dbUser?.achievements)) && (
                  <div className="rounded-2xl bg-white p-8 text-center shadow-soft ring-1 ring-slate-100">
                    <Trophy className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm font-semibold text-slate-700">No certifications or achievements yet</p>
                    <button onClick={openEdit} className="mt-3 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white">+ Add achievement</button>
                  </div>
                )}
              </>
            )}
            {activeTab==="activity" && (
              <>
                {isInstitution ? (
                  <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Institution Activity</h3>
                    <p className="mt-2 text-sm text-slate-600">Scholarships created: <span className="font-bold">{statsData?.scholarshipsCreated ?? "—"}</span> • Total applicants: <span className="font-bold">{statsData?.applications ?? "—"}</span></p>
                    <Link to="/institutionDashboard/manageScholarships" className="mt-3 inline-flex rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white">Manage Scholarships</Link>
                  </div>
                ) : <ActivitySection applications={myApply} reviews={myReviews} viewAllLink="/userDashboard/myApplication" reviewLink="/userDashboard/myReviews" />}
              </>
            )}
            {activeTab==="students" && isInstitution && (
              <InstitutionStudentPortal institutionEmail={dbUser?.email || user?.email} />
            )}
            {activeTab==="settings" && (
              <PreferencesPanel preferences={dbUser?.preferences} onChange={async (newPref)=> {
                try { await axiosSecure.patch("/users/me", { preferences: newPref }); toast.success("Preferences saved"); refetch(); } catch(e){ toast.error(e?.response?.data?.message || "Failed"); }
              }} />
            )}
          </div>

          <div className="space-y-5">
            <Sidebar user={dbUser} />
            <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Globe className="h-4 w-4 text-brand-500" /> Highlights</h4>
              <div className="mt-3 space-y-2 text-xs text-slate-600">
                <p>Profile completeness <span className="font-bold text-brand-600">{completeness}%</span></p>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-brand-600" style={{width:`${Math.min(100,completeness)}%`}}/></div>
                <p className="text-[11px] text-slate-400">Add bio, skills, education and links to reach 100% and get more visibility.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editing && form && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm overflow-y-auto" onClick={()=> setEditing(false)}>
            <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:20 }} className="my-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(e)=> e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Edit Profile — Step {editStep}/4</h2>
                <button onClick={()=> setEditing(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="mt-3 flex gap-1">
                {[1,2,3,4].map(n=> <div key={n} className={`h-1 flex-1 rounded-full ${editStep>=n ? "bg-brand-600" : "bg-slate-200"}`} />)}
              </div>
              <form onSubmit={handleSave} className="mt-5 space-y-5">
                {editStep===1 && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 ring-2 ring-white">{form.photoURL ? <img src={form.photoURL} alt="Avatar" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-white">{(form.name||"U").charAt(0).toUpperCase()}</div>}</div>
                      <label className="cursor-pointer"><span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"><Upload className="h-3.5 w-3.5" /> Upload photo</span><input type="file" accept="image/*" onChange={(e)=> handleImageUpload(e, "photoURL")} className="hidden" /></label>
                    </div>
                    <div className="overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">{form.coverPhoto ? <img src={form.coverPhoto} alt="Cover" className="h-36 w-full object-cover" /> : <div className="flex h-36 items-center justify-center text-xs text-slate-400">No cover photo</div>}</div>
                    <input value={form.coverPhoto} onChange={(e)=> setForm(f=>({...f, coverPhoto:e.target.value}))} placeholder="Cover URL https://..." className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                    <label className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-slate-500"><Upload className="h-3 w-3" /> Or upload cover<input type="file" accept="image/*" onChange={(e)=> handleImageUpload(e,"coverPhoto")} className="hidden" /></label>
                    <label className="block"><span className="text-sm font-semibold text-slate-700">Display Name *</span><input value={form.name} onChange={(e)=> setForm(f=>({...f,name:e.target.value}))} required className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
                    <label className="block"><span className="text-sm font-semibold text-slate-700">Headline</span><input value={form.headline} onChange={(e)=> setForm(f=>({...f,headline:e.target.value}))} placeholder="CS Undergrad • Aspiring AI Researcher" maxLength={120} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
                    <label className="block"><span className="text-sm font-semibold text-slate-700">Email</span><input value={dbUser?.email || user?.email || ""} disabled className="mt-1 w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-slate-500" /></label>
                    <label className="block"><span className="text-sm font-semibold text-slate-700">Phone</span><input value={form.phone} onChange={(e)=> setForm(f=>({...f,phone:e.target.value}))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
                    <div className="grid grid-cols-2 gap-3"><label><span className="text-sm font-semibold text-slate-700">City</span><input value={form.city} onChange={(e)=> setForm(f=>({...f,city:e.target.value}))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label><label><span className="text-sm font-semibold text-slate-700">Country</span><input value={form.country} onChange={(e)=> setForm(f=>({...f,country:e.target.value}))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label></div>
                  </>
                )}
                {editStep===2 && (
                  <>
                    <label className="block"><span className="text-sm font-semibold text-slate-700">Bio</span><textarea value={form.bio} onChange={(e)=> setForm(f=>({...f,bio:e.target.value}))} rows={3} maxLength={600} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
                    <label className="block"><span className="text-sm font-semibold text-slate-700">Skills (comma)</span><input value={form.skills} onChange={(e)=> setForm(f=>({...f,skills:e.target.value}))} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></label>
                    <label className="block"><span className="text-sm font-semibold text-slate-700">Interests (comma)</span><input value={form.interests} onChange={(e)=> setForm(f=>({...f,interests:e.target.value}))} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></label>
                    <label className="block"><span className="text-sm font-semibold text-slate-700">Gallery URLs (comma, up to 6)</span><input value={form.gallery} onChange={(e)=> setForm(f=>({...f,gallery:e.target.value}))} placeholder="https://..., https://..." className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></label>
                    <label className="block"><span className="text-sm font-semibold text-slate-700">Video Intro URL</span><input value={form.videoIntro} onChange={(e)=> setForm(f=>({...f,videoIntro:e.target.value}))} placeholder="https://youtube.com/watch?v=..." className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></label>
                    <div className="grid grid-cols-2 gap-3">
                      <label><span className="text-xs font-semibold text-slate-700">LinkedIn</span><input value={form.socials.linkedin} onChange={(e)=> setForm(f=>({...f,socials:{...f.socials, linkedin:e.target.value}}))} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label>
                      <label><span className="text-xs font-semibold text-slate-700">Twitter</span><input value={form.socials.twitter} onChange={(e)=> setForm(f=>({...f,socials:{...f.socials, twitter:e.target.value}}))} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label>
                      <label><span className="text-xs font-semibold text-slate-700">GitHub</span><input value={form.socials.github} onChange={(e)=> setForm(f=>({...f,socials:{...f.socials, github:e.target.value}}))} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label>
                      <label><span className="text-xs font-semibold text-slate-700">Website</span><input value={form.socials.website} onChange={(e)=> setForm(f=>({...f,socials:{...f.socials, website:e.target.value}}))} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label>
                    </div>
                  </>
                )}
                {editStep===3 && (
                  <>
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1"><GraduationCap className="h-4 w-4" /> Add Education</p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input value={form._edu.school} onChange={(e)=> setForm(f=>({...f,_edu:{...f._edu,school:e.target.value}}))} placeholder="School *" className="rounded-lg border px-2 py-1.5 text-sm" />
                        <input value={form._edu.degree} onChange={(e)=> setForm(f=>({...f,_edu:{...f._edu,degree:e.target.value}}))} placeholder="Degree" className="rounded-lg border px-2 py-1.5 text-sm" />
                        <input value={form._edu.field} onChange={(e)=> setForm(f=>({...f,_edu:{...f._edu,field:e.target.value}}))} placeholder="Field" className="rounded-lg border px-2 py-1.5 text-sm" />
                        <input value={form._edu.startYear} onChange={(e)=> setForm(f=>({...f,_edu:{...f._edu,startYear:e.target.value}}))} placeholder="Start Year" className="rounded-lg border px-2 py-1.5 text-sm" />
                        <input value={form._edu.endYear} onChange={(e)=> setForm(f=>({...f,_edu:{...f._edu,endYear:e.target.value}}))} placeholder="End Year" className="rounded-lg border px-2 py-1.5 text-sm" />
                        <input value={form._edu.grade} onChange={(e)=> setForm(f=>({...f,_edu:{...f._edu,grade:e.target.value}}))} placeholder="Grade" className="rounded-lg border px-2 py-1.5 text-sm" />
                      </div>
                      <input value={form._edu.description} onChange={(e)=> setForm(f=>({...f,_edu:{...f._edu,description:e.target.value}}))} placeholder="Description" className="mt-2 w-full rounded-lg border px-2 py-1.5 text-sm" />
                      <button type="button" onClick={addEdu} className="mt-2 rounded-lg bg-brand-600 px-3 py-1 text-xs font-bold text-white">Add Education</button>
                      {form.education.length>0 && <ul className="mt-2 text-xs">{form.education.map((e,i)=> <li key={i} className="flex justify-between border-t py-1">{e.school} — {e.degree} <button type="button" onClick={()=> setForm(f=>({...f,education:f.education.filter((_,idx)=>idx!==i)}))} className="text-rose-600">remove</button></li>)}</ul>}
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1"><Briefcase className="h-4 w-4" /> Add Experience</p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input value={form._exp.title} onChange={(e)=> setForm(f=>({...f,_exp:{...f._exp,title:e.target.value}}))} placeholder="Title *" className="rounded-lg border px-2 py-1.5 text-sm" />
                        <input value={form._exp.org} onChange={(e)=> setForm(f=>({...f,_exp:{...f._exp,org:e.target.value}}))} placeholder="Organization *" className="rounded-lg border px-2 py-1.5 text-sm" />
                        <input value={form._exp.location} onChange={(e)=> setForm(f=>({...f,_exp:{...f._exp,location:e.target.value}}))} placeholder="Location" className="rounded-lg border px-2 py-1.5 text-sm" />
                        <input value={form._exp.startDate} onChange={(e)=> setForm(f=>({...f,_exp:{...f._exp,startDate:e.target.value}}))} placeholder="Start" className="rounded-lg border px-2 py-1.5 text-sm" />
                      </div>
                      <input value={form._exp.description} onChange={(e)=> setForm(f=>({...f,_exp:{...f._exp,description:e.target.value}}))} placeholder="Description" className="mt-2 w-full rounded-lg border px-2 py-1.5 text-sm" />
                      <button type="button" onClick={addExp} className="mt-2 rounded-lg bg-brand-600 px-3 py-1 text-xs font-bold text-white">Add Experience</button>
                      {form.experience.length>0 && <ul className="mt-2 text-xs">{form.experience.map((e,i)=> <li key={i} className="flex justify-between border-t py-1">{e.title} @ {e.org} <button type="button" onClick={()=> setForm(f=>({...f,experience:f.experience.filter((_,idx)=>idx!==i)}))} className="text-rose-600">remove</button></li>)}</ul>}
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1"><Award className="h-4 w-4" /> Add Certification</p>
                      <div className="grid grid-cols-2 gap-2"><input value={form._cert.name} onChange={(e)=> setForm(f=>({...f,_cert:{...f._cert,name:e.target.value}}))} placeholder="Name *" className="rounded-lg border px-2 py-1.5 text-sm" /><input value={form._cert.issuer} onChange={(e)=> setForm(f=>({...f,_cert:{...f._cert,issuer:e.target.value}}))} placeholder="Issuer" className="rounded-lg border px-2 py-1.5 text-sm" /></div>
                      <button type="button" onClick={addCert} className="mt-2 rounded-lg bg-brand-600 px-3 py-1 text-xs font-bold text-white">Add Certification</button>
                      {form.certifications.length>0 && <ul className="mt-2 text-xs">{form.certifications.map((c,i)=> <li key={i} className="flex justify-between border-t py-1">{c.name}<button type="button" onClick={()=> setForm(f=>({...f,certifications:f.certifications.filter((_,idx)=>idx!==i)}))} className="text-rose-600">remove</button></li>)}</ul>}
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1"><Trophy className="h-4 w-4" /> Add Achievement</p>
                      <div className="grid grid-cols-2 gap-2"><input value={form._ach.title} onChange={(e)=> setForm(f=>({...f,_ach:{...f._ach,title:e.target.value}}))} placeholder="Title *" className="rounded-lg border px-2 py-1.5 text-sm" /><input value={form._ach.date} onChange={(e)=> setForm(f=>({...f,_ach:{...f._ach,date:e.target.value}}))} placeholder="Date" className="rounded-lg border px-2 py-1.5 text-sm" /></div>
                      <button type="button" onClick={addAch} className="mt-2 rounded-lg bg-brand-600 px-3 py-1 text-xs font-bold text-white">Add Achievement</button>
                      {form.achievements.length>0 && <ul className="mt-2 text-xs">{form.achievements.map((a,i)=> <li key={i} className="flex justify-between border-t py-1">{a.title}<button type="button" onClick={()=> setForm(f=>({...f,achievements:f.achievements.filter((_,idx)=>idx!==i)}))} className="text-rose-600">remove</button></li>)}</ul>}
                    </div>
                  </>
                )}
                {editStep===4 && (
                  <>
                    {isInstitution ? (
                      <>
                        <label className="block"><span className="text-sm font-semibold text-slate-700">Organization Name</span><input value={form.orgName} onChange={(e)=> setForm(f=>({...f,orgName:e.target.value}))} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></label>
                        <div className="grid grid-cols-2 gap-3"><label><span className="text-sm font-semibold text-slate-700">Type</span><select value={form.orgType} onChange={(e)=> setForm(f=>({...f,orgType:e.target.value}))} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm"><option value="university">University</option><option value="college">College</option><option value="school">School</option></select></label><label><span className="text-sm font-semibold text-slate-700">Country</span><input value={form.orgCountry} onChange={(e)=> setForm(f=>({...f,orgCountry:e.target.value}))} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></label></div>
                        <label className="block"><span className="text-sm font-semibold text-slate-700">Website</span><input value={form.orgWebsite} onChange={(e)=> setForm(f=>({...f,orgWebsite:e.target.value}))} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></label>
                        <label className="block"><span className="text-sm font-semibold text-slate-700">Description</span><textarea value={form.orgDescription} onChange={(e)=> setForm(f=>({...f,orgDescription:e.target.value}))} rows={3} className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" /></label>
                        <div className="grid grid-cols-3 gap-2"><label><span className="text-xs font-semibold">Founded</span><input value={form.orgFounded} onChange={(e)=> setForm(f=>({...f,orgFounded:e.target.value}))} placeholder="1990" className="mt-1 w-full rounded-lg border px-2 py-1.5 text-sm" /></label><label><span className="text-xs font-semibold">Students</span><input value={form.orgStudentCount} onChange={(e)=> setForm(f=>({...f,orgStudentCount:e.target.value}))} className="mt-1 w-full rounded-lg border px-2 py-1.5 text-sm" /></label><label><span className="text-xs font-semibold">Faculty</span><input value={form.orgFacultyCount} onChange={(e)=> setForm(f=>({...f,orgFacultyCount:e.target.value}))} className="mt-1 w-full rounded-lg border px-2 py-1.5 text-sm" /></label></div>
                        <label className="block"><span className="text-xs font-semibold">Departments (comma)</span><input value={form.orgDepartments} onChange={(e)=> setForm(f=>({...f,orgDepartments:e.target.value}))} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label>
                        <label className="block"><span className="text-xs font-semibold">Highlights (comma)</span><input value={form.orgHighlights} onChange={(e)=> setForm(f=>({...f,orgHighlights:e.target.value}))} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label>
                        <label className="block"><span className="text-xs font-semibold">Campus Gallery URLs (comma)</span><input value={form.orgGallery} onChange={(e)=> setForm(f=>({...f,orgGallery:e.target.value}))} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" /></label>
                        <div className="grid grid-cols-1 gap-2"><label><span className="text-xs font-semibold">Video URL</span><input value={form.orgVideoUrl} onChange={(e)=> setForm(f=>({...f,orgVideoUrl:e.target.value}))} className="mt-1 w-full rounded-lg border px-2 py-1.5 text-sm" /></label><label><span className="text-xs font-semibold">Brochure URL</span><input value={form.orgBrochureUrl} onChange={(e)=> setForm(f=>({...f,orgBrochureUrl:e.target.value}))} className="mt-1 w-full rounded-lg border px-2 py-1.5 text-sm" /></label><label><span className="text-xs font-semibold">Map URL</span><input value={form.orgMapUrl} onChange={(e)=> setForm(f=>({...f,orgMapUrl:e.target.value}))} className="mt-1 w-full rounded-lg border px-2 py-1.5 text-sm" /></label></div>
                      </>
                    ) : (
                      <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-600">No institution fields for your role. Save previous steps or go back.</div>
                    )}
                  </>
                )}

                <div className="flex justify-between pt-2">
                  <button type="button" disabled={editStep===1} onClick={()=> setEditStep(s=> Math.max(1,s-1))} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-40">Back</button>
                  {editStep <4 ? <button type="button" onClick={()=> setEditStep(s=> Math.min(4,s+1))} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">Next</button> : <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" /> {saving?"Saving...":"Save Changes"}</button>}
                </div>
                {editStep===4 && <div className="flex justify-end"><button type="button" onClick={()=> setEditing(false)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Cancel</button></div>}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
