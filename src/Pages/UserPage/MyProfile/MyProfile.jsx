import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, FileText, Star, GraduationCap, Save, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAdmin from "../../../Hooks/useAdmin";
import useModaretor from "../../../Hooks/useModaretor";
import { useSaved } from "../../../Hooks/useSaved";
import Spinner from "../../../Component/ui/Spinner";
import ProfileHeader from "../../../Component/profile/ProfileHeader";
import AboutSection from "../../../Component/profile/AboutSection";
import Sidebar from "../../../Component/profile/Sidebar";
import ActivitySection from "../../../Component/profile/ActivitySection";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [isAdmin] = useAdmin();
  const [isModaretor] = useModaretor();
  const isAdminOrMod = isAdmin || isModaretor;
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "", country: "", bio: "", skills: "", photoURL: "", coverPhoto: "" });

  const { data: dbUser, isLoading, refetch } = useQuery({
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

  const { data: savedDocs = [] } = useSaved();

  const { data: scholership = [] } = useQuery({
    queryKey: ["profile-scholarships"],
    enabled: !!isAdminOrMod,
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

  const openEdit = () => {
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
      const res = await axiosPublic.post(image_hosting_api, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      if (payload.name.length < 2) throw new Error("Name must be 2-80 characters");
      await axiosSecure.patch("/users/me", payload);
      if (payload.name !== user?.displayName || payload.photoURL !== user?.photoURL) {
        try {
          await updateUserProfile(payload.name, payload.photoURL);
        } catch {
          /* ignore firebase sync error */
        }
      }
      toast.success("Profile updated");
      setEditing(false);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-brand-600" />
      </div>
    );
  }

  const userStats = [
    { label: "Applications", value: String(myApply.length), icon: FileText, color: "text-brand-600 bg-brand-50", to: "/userDashboard/myApplication" },
    { label: "Reviews", value: String(myReviews.length), icon: Star, color: "text-amber-600 bg-amber-50", to: "/userDashboard/myReviews" },
    { label: "Saved", value: String(savedDocs.length), icon: GraduationCap, color: "text-emerald-600 bg-emerald-50", to: "/saved" },
  ];
  const adminStats = [
    { label: "Users", value: String(allUsers.length || "—"), icon: Users, color: "text-brand-600 bg-brand-50" },
    { label: "Scholarships", value: String(scholership.length), icon: GraduationCap, color: "text-sky-600 bg-sky-50" },
    { label: "Applications", value: String(myApply.length), icon: FileText, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Reviews", value: String(reviewStats?.pending ?? "—"), icon: Star, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <ProfileHeader
          user={dbUser}
          isOwnProfile={true}
          onEdit={openEdit}
          stats={isAdminOrMod ? adminStats : userStats}
        />

        {/* Two-column layout */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* Main content */}
          <div className="space-y-5">
            <AboutSection user={dbUser} />
            <ActivitySection
              applications={myApply}
              reviews={myReviews}
              viewAllLink="/userDashboard/myApplication"
              reviewLink="/userDashboard/myReviews"
            />

            {/* Admin links */}
            {isAdminOrMod && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-soft sm:p-6"
              >
                <h3 className="flex items-center gap-2 text-sm font-bold text-amber-800">
                  <ShieldCheck className="h-4 w-4" /> Admin Authorities
                </h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    { label: "Manage Users", to: "/adminDashboard/manageUsers", desc: "Roles & accounts" },
                    { label: "Manage Scholarships", to: "/adminDashboard/manageScholarships", desc: "Create & edit" },
                    { label: "Applications", to: "/adminDashboard/manageAppliedApplication", desc: "Accept/Reject" },
                    { label: "Moderate Reviews", to: "/adminDashboard/manageReviews", desc: "Queue & ratings" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="rounded-xl bg-white p-3 ring-1 ring-amber-100 hover:bg-amber-100/50"
                    >
                      <p className="text-sm font-bold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Sidebar user={dbUser} />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onClick={() => setEditing(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Edit Profile</h2>
                <button onClick={() => setEditing(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-5 space-y-4">
                {/* Avatar preview + upload */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 ring-2 ring-white">
                    {form.photoURL ? (
                      <img src={form.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-white">
                        {(form.name || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200">
                      <Upload className="h-3.5 w-3.5" /> Upload photo
                    </span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "photoURL")} className="hidden" />
                  </label>
                </div>

                {/* Cover photo */}
                <label>
                  <span className="text-sm font-semibold text-slate-700">Cover Photo</span>
                  <input
                    value={form.coverPhoto}
                    onChange={(e) => setForm((f) => ({ ...f, coverPhoto: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                  <label className="mt-1.5 cursor-pointer">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
                      <Upload className="h-3 w-3" /> Or upload cover image
                    </span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "coverPhoto")} className="hidden" />
                  </label>
                </label>

                {/* Name */}
                <label>
                  <span className="text-sm font-semibold text-slate-700">Display Name *</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    required
                    minLength={2}
                  />
                </label>

                {/* Email (read-only) */}
                <label>
                  <span className="text-sm font-semibold text-slate-700">Email</span>
                  <input
                    value={dbUser?.email || user?.email || ""}
                    disabled
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
                  />
                </label>

                {/* Phone */}
                <label>
                  <span className="text-sm font-semibold text-slate-700">Phone</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </label>

                {/* City / Country */}
                <div className="grid grid-cols-2 gap-3">
                  <label>
                    <span className="text-sm font-semibold text-slate-700">City</span>
                    <input
                      value={form.city}
                      onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                      placeholder="Dhaka"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-slate-700">Country</span>
                    <input
                      value={form.country}
                      onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                      placeholder="Bangladesh"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </label>
                </div>

                {/* Bio */}
                <label>
                  <span className="text-sm font-semibold text-slate-700">Bio</span>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    maxLength={600}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                  <span className="text-xs text-slate-400">{form.bio.length}/600</span>
                </label>

                {/* Skills */}
                <label>
                  <span className="text-sm font-semibold text-slate-700">Skills (comma separated)</span>
                  <input
                    value={form.skills}
                    onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                    placeholder="Project Management, Data Analysis"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </label>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
