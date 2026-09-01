import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  CalendarDays,
  ShieldCheck,
  Award,
  GraduationCap,
  FileText,
  Star,
  Users,
  Settings,
  Edit3,
  Save,
  Upload,
  Crown,
  Briefcase,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import bg from "../../../assist/bgImg/profileBg.jpg";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAdmin from "../../../Hooks/useAdmin";
import useModaretor from "../../../Hooks/useModaretor";
import Spinner from "../../../Component/ui/Spinner";
import StatusBadge from "../../../Component/ui/StatusBadge";
import Stars from "../../../Component/ui/Stars";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const roleMeta = {
  superadmin: { label: "Owner", color: "bg-amber-100 text-amber-700 ring-amber-200", icon: Crown, desc: "Full platform owner" },
  admin: { label: "Administrator", color: "bg-brand-100 text-brand-700 ring-brand-200", icon: ShieldCheck, desc: "Administrator of SchoolHive" },
  modaretor: { label: "Moderator", color: "bg-sky-100 text-sky-700 ring-sky-200", icon: Award, desc: "Moderator — reviews & scholarships" },
  user: { label: "Student", color: "bg-emerald-100 text-emerald-700 ring-emerald-200", icon: GraduationCap, desc: "Student at SchoolHive" },
  institution: { label: "Institution", color: "bg-violet-100 text-violet-700 ring-violet-200", icon: Building2, desc: "University, college or school" },
};

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [isAdmin] = useAdmin();
  const [isModaretor] = useModaretor();
  const [activeTab, setActiveTab] = useState("about");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "", country: "", bio: "", skills: "", photoURL: "", coverPhoto: "" });

  // fetch profile from DB (GET /users/me + fallback /user?email)
  const { data: dbUser, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ["profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get("/users/me");
        return data.data;
      } catch {
        const { data } = await axiosSecure.get(`/user?email=${user.email}`);
        return data.data;
      }
    },
  });

  // stats: user activity
  const { data: myApply = [] } = useQuery({
    queryKey: ["profile-apply", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/apply?email=${user.email}`);
      return data.data;
    },
  });
  const { data: myReviews = [] } = useQuery({
    queryKey: ["profile-reviews", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/allReviews?email=${user.email}`);
      return data.data;
    },
  });
  const { data: scholership = [] } = useQuery({
    queryKey: ["profile-scholarships"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/allScholership");
      return data.data;
    },
  });
  const { data: reviewStats } = useQuery({
    queryKey: ["profile-review-stats"],
    enabled: !!isAdmin || !!isModaretor,
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get("/reviews/stats");
        return data;
      } catch {
        return null;
      }
    },
  });
  const { data: allUsers = [] } = useQuery({
    queryKey: ["profile-allUsers"],
    enabled: !!isAdmin,
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get("/users");
        return data.data;
      } catch {
        return [];
      }
    },
  });

  const role = dbUser?.role || (isAdmin ? "admin" : isModaretor ? "modaretor" : "user");
  const meta = roleMeta[role] || roleMeta.user;
  const RoleIcon = meta.icon;

  // init form when dbUser loads
  const startEdit = () => {
    setForm({
      name: dbUser?.name || user?.displayName || "",
      phone: dbUser?.phone || "",
      city: dbUser?.city || "",
      country: dbUser?.country || "",
      bio: dbUser?.bio || "",
      skills: (dbUser?.skills || []).join(", "),
      photoURL: dbUser?.photoURL || user?.photoURL || "",
      coverPhoto: dbUser?.coverPhoto || "",
    });
    setEditing(true);
    setActiveTab("settings");
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!image_hosting_key) {
      toast.error("Image hosting key missing");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      toast.loading("Uploading image...", { id: "upload" });
      const res = await axiosPublic.post(image_hosting_api, formData, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.data?.url;
      if (url) {
        setForm((f) => ({ ...f, [field]: url }));
        toast.success("Image uploaded", { id: "upload" });
      }
    } catch {
      toast.error("Upload failed", { id: "upload" });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArr = String(form.skills)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 20);
      const payload = {
        name: String(form.name).trim(),
        photoURL: String(form.photoURL).trim() || null,
        coverPhoto: String(form.coverPhoto).trim() || null,
        phone: String(form.phone).trim() || null,
        city: String(form.city).trim() || null,
        country: String(form.country).trim() || null,
        bio: String(form.bio).trim() || null,
        skills: skillsArr,
      };
      if (payload.name.length < 2) throw new Error("Name 2-80 chars");
      await axiosSecure.patch("/users/me", payload);
      // sync Firebase profile if name/photo changed
      if (payload.name !== user?.displayName || payload.photoURL !== user?.photoURL) {
        try {
          await updateUserProfile(payload.name, payload.photoURL);
        } catch {
          // ignore firebase sync error, DB is source of truth
        }
      }
      toast.success("Profile updated");
      setEditing(false);
      refetchProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-brand-600" />
      </div>
    );
  }

  const displayName = dbUser?.name || user?.displayName || "Anonymous";
  const displayEmail = dbUser?.email || user?.email;
  const displayPhoto = dbUser?.photoURL || user?.photoURL;
  const cover = dbUser?.coverPhoto || bg;
  const joined = dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" }) : "Recently";
  const skills = dbUser?.skills?.length ? dbUser.skills : ["Scholarship Seeker", "Academic Excellence"];
  const bio =
    dbUser?.bio ||
    (role === "admin" || role === "superadmin"
      ? "Dedicated administrator behind School Hive — building a seamless platform that connects deserving students with life-changing scholarships. Passionate about education and technology."
      : role === "modaretor"
      ? "Moderator at School Hive — curating scholarships and guiding applicants through verified reviews and fair evaluations."
      : "Aspiring scholar at School Hive — exploring scholarships to turn academic dreams into reality. Eager to learn and contribute to the community.");

  const userStats = [
    { label: "Applications", value: String(myApply.length), icon: FileText, color: "text-brand-600 bg-brand-50" },
    { label: "Reviews", value: String(myReviews.length), icon: Star, color: "text-amber-600 bg-amber-50" },
    { label: "Saved", value: String(scholership.length), icon: GraduationCap, color: "text-emerald-600 bg-emerald-50" },
  ];
  const adminStats = [
    { label: "Users", value: String(allUsers.length || "—"), icon: Users, color: "text-brand-600 bg-brand-50" },
    { label: "Scholarships", value: String(scholership.length), icon: GraduationCap, color: "text-sky-600 bg-sky-50" },
    { label: "Applications", value: String(myApply.length), icon: FileText, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Reviews", value: String(reviewStats?.pending ?? "—"), icon: Star, color: "text-amber-600 bg-amber-50" },
  ];
  const stats = isAdmin || isModaretor ? adminStats : userStats;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cover */}
      <div className="relative h-56 md:h-72">
        <img src={cover} alt="Profile banner" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-4 right-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${meta.color}`}>
            <RoleIcon className="h-3.5 w-3.5" /> {meta.label}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12">
        <div className="-mt-14">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lift ring-4 ring-white">
                  {displayPhoto ? (
                    <img src={displayPhoto} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-5xl font-extrabold text-white">
                      {(displayName || displayEmail || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{displayName}</h1>
                  <p className="text-sm font-medium text-brand-600">{meta.desc}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-slate-400" /> {displayEmail}
                    </span>
                    {(dbUser?.city || dbUser?.country) && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-400" /> {[dbUser.city, dbUser.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                    {!dbUser?.city && !dbUser?.country && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-400" /> Add location
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 text-slate-400" /> Joined {joined}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 md:items-end">
                <div className="flex gap-2">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex min-w-[84px] flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5 hover:-translate-y-0.5 hover:shadow-soft"
                    >
                      <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${stat.color}`}>
                        <stat.icon className="h-4 w-4" />
                      </span>
                      <span className="mt-1.5 text-base font-extrabold text-slate-900">{stat.value}</span>
                      <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={editing ? () => setEditing(false) : startEdit}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
                >
                  <Edit3 className="h-4 w-4" /> {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-1.5 overflow-x-auto border-t border-slate-100 pt-4">
              {[
                { key: "about", label: "About", icon: Briefcase },
                { key: "activity", label: "Activity", icon: FileText },
                { key: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${activeTab === tab.key ? "bg-brand-600 text-white shadow-soft" : "text-slate-500 hover:bg-slate-100 hover:text-brand-600"}`}
                >
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <div className="mt-6">
            {activeTab === "about" && (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
                  <h2 className="mb-4 text-lg font-bold text-slate-900">Personal Info</h2>
                  <div className="space-y-3">
                    {[
                      { label: "Name", value: displayName },
                      { label: "Email", value: displayEmail },
                      { label: "Phone", value: dbUser?.phone || "Not set" },
                      { label: "Location", value: dbUser?.city || dbUser?.country ? [dbUser.city, dbUser.country].filter(Boolean).join(", ") : "Not set" },
                      { label: "Role", value: meta.label },
                      { label: "Member since", value: joined },
                    ].map((row) => (
                      <div key={row.label} className="border-b border-slate-50 pb-2 last:border-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{row.label}</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-700">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100 md:col-span-2">
                  <h2 className="mb-3 text-lg font-bold text-slate-900">About Me</h2>
                  <p className="text-sm leading-relaxed text-slate-500">{bio}</p>

                  <h3 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-slate-700">Skills & Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100">
                        {s}
                      </span>
                    ))}
                  </div>

                  <h3 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-slate-700">Contact Information</h3>
                  <div className="space-y-2.5">
                    <p className="flex items-center gap-2.5 text-sm text-slate-500">
                      <Mail className="h-4 w-4 text-brand-500" /> {displayEmail}
                    </p>
                    <p className="flex items-center gap-2.5 text-sm text-slate-500">
                      <Phone className="h-4 w-4 text-brand-500" /> {dbUser?.phone || "Add phone in Settings"}
                    </p>
                    <p className="flex items-center gap-2.5 text-sm text-slate-500">
                      <Globe className="h-4 w-4 text-brand-500" /> scholarhive-913e4.web.app
                    </p>
                  </div>

                  {(isAdmin || isModaretor) && (
                    <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-amber-800">
                        <ShieldCheck className="h-4 w-4" /> Admin Authorities
                      </h4>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {[
                          { label: "Manage Users", to: "/adminDashboard/manageUsers", desc: "Roles & accounts" },
                          { label: "Manage Scholarships", to: "/adminDashboard/manageScholarships", desc: "Create & edit" },
                          { label: "Applications", to: "/adminDashboard/manageAppliedApplication", desc: "Accept/Reject" },
                          { label: "Moderate Reviews", to: "/adminDashboard/manageReviews", desc: "Queue & ratings" },
                        ].map((item) => (
                          <Link key={item.label} to={item.to} className="rounded-xl bg-white p-3 ring-1 ring-amber-100 hover:bg-amber-100/50">
                            <p className="text-sm font-bold text-slate-800">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                          </Link>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-amber-700">You have full moderation and user-management permissions.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <FileText className="h-5 w-5 text-brand-600" /> Recent Applications
                  </h3>
                  {myApply.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-500">No applications yet. Apply to a scholarship to get started.</p>
                  ) : (
                    <div className="mt-4 space-y-2">
                      {myApply.slice(0, 5).map((a) => (
                        <div key={a._id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{a.universityName}</p>
                            <p className="text-xs text-slate-500">{a.subjectName} • {a.scholarshipCategory}</p>
                          </div>
                          <StatusBadge status={a.applicationStatus} />
                        </div>
                      ))}
                      <Link to="/userDashboard/myApplication" className="inline-flex text-sm font-semibold text-brand-600 hover:underline">
                        View all →
                      </Link>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Star className="h-5 w-5 text-amber-500" /> Recent Reviews
                  </h3>
                  {myReviews.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-500">No reviews yet. After your application is accepted you can leave 1 review per scholarship.</p>
                  ) : (
                    <div className="mt-4 space-y-2">
                      {myReviews.slice(0, 5).map((r) => (
                        <div key={r._id} className="rounded-xl border border-slate-100 p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-800">{r.scholership_details?.universityName || "Scholarship"}</p>
                            <Stars rating={r.rating} />
                          </div>
                          <p className="mt-1 text-sm text-slate-600 line-clamp-2">{r.comment}</p>
                          <p className="mt-1 text-xs text-slate-400">{r.status} {r.isVerified ? "• Verified" : ""}</p>
                        </div>
                      ))}
                      <Link to="/userDashboard/myReviews" className="inline-flex text-sm font-semibold text-brand-600 hover:underline">
                        Manage reviews →
                      </Link>
                    </div>
                  )}
                </div>

                {(isAdmin || isModaretor) && (
                  <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-soft">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                      <Users className="h-5 w-5" /> Platform Overview (Admin)
                    </h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
                        <p className="text-xs uppercase tracking-wide text-brand-100">Users</p>
                        <p className="text-xl font-extrabold">{allUsers.length || "—"}</p>
                      </div>
                      <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
                        <p className="text-xs uppercase tracking-wide text-brand-100">Scholarships</p>
                        <p className="text-xl font-extrabold">{scholership.length}</p>
                      </div>
                      <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
                        <p className="text-xs uppercase tracking-wide text-brand-100">My Applications</p>
                        <p className="text-xl font-extrabold">{myApply.length}</p>
                      </div>
                      <div className="rounded-xl bg-white/10 p-3 ring-1 ring-white/20">
                        <p className="text-xs uppercase tracking-wide text-brand-100">Pending Reviews</p>
                        <p className="text-xl font-extrabold">{reviewStats?.pending ?? "—"}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-brand-200">You can manage platform data from the Admin Dashboard.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Settings className="h-5 w-5 text-brand-600" /> Profile Settings
                </h2>
                <p className="mt-1 text-sm text-slate-500">Update your information. Email and role are managed by the system.</p>

                {!editing ? (
                  <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                    <p className="text-sm text-slate-600">Click Edit to change name, photo, cover, phone, location, bio and skills.</p>
                    <button onClick={startEdit} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">
                      <Edit3 className="h-4 w-4" /> Edit Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="mt-6 grid gap-4 md:grid-cols-2">
                    <label className="md:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">Display Name *</span>
                      <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100" required minLength={2} />
                    </label>

                    <label>
                      <span className="text-sm font-semibold text-slate-700">Phone</span>
                      <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+1 (555) 123-4567" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-slate-700">Email (read-only)</span>
                      <input value={displayEmail} disabled className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500" />
                    </label>

                    <label>
                      <span className="text-sm font-semibold text-slate-700">City</span>
                      <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} placeholder="Washington" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-slate-700">Country</span>
                      <input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} placeholder="USA" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                    </label>

                    <label className="md:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">Bio (max 600)</span>
                      <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Tell us about yourself, your goals, or your role at SchoolHive..." className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100" maxLength={600} />
                      <span className="text-xs text-slate-400">{form.bio.length}/600</span>
                    </label>

                    <label className="md:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">Skills (comma separated, max 20)</span>
                      <input value={form.skills} onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))} placeholder="Project Management, Data Analysis, Marketing" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                    </label>

                    <label>
                      <span className="text-sm font-semibold text-slate-700">Avatar URL</span>
                      <input value={form.photoURL} onChange={(e) => setForm((f) => ({ ...f, photoURL: e.target.value }))} placeholder="https://..." className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "photoURL")} className="mt-2 w-full text-sm file:mr-3 file:rounded-lg file:border-none file:bg-brand-600 file:px-3 file:py-1 file:text-xs file:font-bold file:text-white" />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-slate-700">Cover Photo URL</span>
                      <input value={form.coverPhoto} onChange={(e) => setForm((f) => ({ ...f, coverPhoto: e.target.value }))} placeholder="https://..." className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "coverPhoto")} className="mt-2 w-full text-sm file:mr-3 file:rounded-lg file:border-none file:bg-brand-600 file:px-3 file:py-1 file:text-xs file:font-bold file:text-white" />
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Upload className="h-3 w-3" /> Upload via imgbb
                      </span>
                    </label>

                    <div className="md:col-span-2 flex gap-3 pt-2">
                      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
                        <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button type="button" onClick={() => setEditing(false)} className="rounded-xl bg-slate-100 px-6 py-2.5 text-sm font-bold text-slate-700">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-8 rounded-xl border border-rose-100 bg-rose-50 p-4">
                  <h4 className="text-sm font-bold text-rose-700">Danger zone</h4>
                  <p className="mt-1 text-xs text-rose-600">Account deletion is not enabled in this demo. Contact admin.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
