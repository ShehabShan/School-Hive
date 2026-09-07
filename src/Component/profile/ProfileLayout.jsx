import { useRef, useState } from "react";
import { MapPin, CalendarDays, Edit3, Eye, BadgeCheck, Building2, Share2, UserPlus, UserCheck, Camera, Pencil, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import RoleBadge from "./RoleBadge";
import bg from "../../assist/bgImg/profileBg.webp";
import bgFallback from "../../assist/bgImg/profileBg.jpg";
import CompletenessMeter from "./CompletenessMeter";
import { hasValue, joinFiltered } from "../../utils/hasValue";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { optimizeImage, formatBytes } from "../../lib/optimizeImage";
import toast from "react-hot-toast";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function ProfileLayout({ user, isOwnProfile, onEdit, stats, completeness, onFollow, following, onShare, activeTab, onTabChange, tabs = [], onProfileUpdated }) {
  const name = hasValue(user?.name) ? user.name.trim() : "Anonymous";
  const photo = hasValue(user?.photoURL) ? user.photoURL : null;
  const cover = hasValue(user?.coverPhoto) ? user.coverPhoto : bg;
  const hasCover = hasValue(user?.coverPhoto);
  const role = hasValue(user?.role) ? user.role : "user";
  const headline = hasValue(user?.headline) ? user.headline : null;
  const city = hasValue(user?.city) ? user.city.trim() : null;
  const country = hasValue(user?.country) ? user.country.trim() : null;
  const location = joinFiltered([city, country], ", ");
  const isInstitution = role === "institution";
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "Recently";
  const verified = Boolean(user?.isVerified) || Boolean(user?.verified) || (isInstitution && user?.status === "approved");

  const { updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const triggerAvatarPick = () => avatarInputRef.current?.click();
  const triggerCoverPick = () => coverInputRef.current?.click();

  const patchProfile = async (patch) => {
    await axiosSecure.patch("/users/me", patch);
    if (onProfileUpdated) await onProfileUpdated();
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only image files allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    if (!image_hosting_key) { toast.error("Image hosting not configured"); return; }
    setUploadingAvatar(true);
    try {
      toast.loading("Optimizing image…", { id: "avatar-upload" });
      const optimized = await optimizeImage(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1024, quality: 0.82 });
      if (optimized.size < file.size) toast.loading(`Uploading ${formatBytes(optimized.size)} (was ${formatBytes(file.size)})…`, { id: "avatar-upload" });
      else toast.loading("Uploading image…", { id: "avatar-upload" });
      const fd = new FormData(); fd.append("image", optimized);
      const res = await axiosPublic.post(image_hosting_api, fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.data?.display_url || res.data?.data?.url;
      if (!url) throw new Error(res.data?.error?.message || "Upload failed");
      await patchProfile({ photoURL: url });
      try { await updateUserProfile(user?.name || name, url); } catch {}
      toast.success("Profile photo updated", { id: "avatar-upload" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Upload failed", { id: "avatar-upload" });
    } finally {
      setUploadingAvatar(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    if (!photo) return;
    setUploadingAvatar(true);
    try {
      await patchProfile({ photoURL: null });
      try { await updateUserProfile(user?.name || name, null); } catch {}
      toast.success("Profile photo removed");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Remove failed");
    } finally { setUploadingAvatar(false); }
  };

  const handleCoverFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only image files allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    if (!image_hosting_key) { toast.error("Image hosting not configured"); return; }
    setUploadingCover(true);
    try {
      toast.loading("Optimizing image…", { id: "cover-upload" });
      const optimized = await optimizeImage(file, { maxSizeMB: 0.9, maxWidthOrHeight: 1600, quality: 0.82 });
      if (optimized.size < file.size) toast.loading(`Uploading ${formatBytes(optimized.size)} (was ${formatBytes(file.size)})…`, { id: "cover-upload" });
      else toast.loading("Uploading image…", { id: "cover-upload" });
      const fd = new FormData(); fd.append("image", optimized);
      const res = await axiosPublic.post(image_hosting_api, fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.data?.display_url || res.data?.data?.url;
      if (!url) throw new Error(res.data?.error?.message || "Upload failed");
      await patchProfile({ coverPhoto: url });
      toast.success("Cover photo updated", { id: "cover-upload" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Upload failed", { id: "cover-upload" });
    } finally {
      setUploadingCover(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveCover = async () => {
    if (!hasCover) return;
    setUploadingCover(true);
    try {
      await patchProfile({ coverPhoto: null });
      toast.success("Cover photo removed");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Remove failed");
    } finally { setUploadingCover(false); }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
      <div className="relative h-44 overflow-hidden sm:h-52 md:h-56">
        <img src={cover} alt="Cover" className="h-full w-full object-cover" loading="lazy" decoding="async" onError={(e) => (e.currentTarget.src = bgFallback)} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {verified && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow"><BadgeCheck className="h-3.5 w-3.5" /> Verified</span>}
          <RoleBadge role={role} />
        </div>
        {isInstitution && hasValue(user?.orgName) && (
          <div className="absolute bottom-3 left-3 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur sm:flex">
            <Building2 className="h-3.5 w-3.5 text-violet-600" /> {user.orgName} {hasValue(user?.orgType) ? `• ${user.orgType}` : ""}
          </div>
        )}
        {isOwnProfile && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5">
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
            <button
              onClick={triggerCoverPick}
              disabled={uploadingCover}
              title={hasCover ? "Change cover photo" : "Add cover photo"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow ring-1 ring-white/60 backdrop-blur hover:bg-white disabled:opacity-60"
            >
              {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            </button>
            {hasCover && (
              <button
                onClick={handleRemoveCover}
                disabled={uploadingCover}
                title="Remove cover photo"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow ring-1 ring-white/60 backdrop-blur hover:bg-white disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-px sm:px-6 sm:pt-px">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between relative z-10 isolate">
          <div className="flex gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lift ring-4 ring-white sm:h-24 sm:w-24">
              {photo ? <img src={photo} alt={name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-white">{name.charAt(0).toUpperCase()}</div>}
              {isOwnProfile && (
                <>
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
                  <button
                    onClick={triggerAvatarPick}
                    disabled={uploadingAvatar}
                    title={photo ? "Change profile photo" : "Add profile photo"}
                    className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-700 shadow ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-60"
                  >
                    {uploadingAvatar ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                  </button>
                  {photo && (
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={uploadingAvatar}
                      title="Remove profile photo"
                      className="absolute bottom-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow ring-1 ring-slate-200 backdrop-blur hover:bg-white disabled:opacity-60"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="min-w-0 pt-8 sm:pt-10">
              <h1 className="flex items-center gap-2 truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{name} {verified && <BadgeCheck className="h-5 w-5 text-emerald-500" />}</h1>
              {headline && <p className="mt-0.5 text-sm font-medium text-slate-600 line-clamp-1">{headline}</p>}
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {location}</span>}
                <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Joined {joined}</span>
                {isInstitution && hasValue(user?.orgCountry) && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {user.orgCountry}</span>}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
            {isOwnProfile ? (
              <div className="flex flex-wrap gap-2">
                {hasValue(user?.email) && (
                  <Link
                    to={`/profile/${encodeURIComponent(user.email)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    <Eye className="h-4 w-4" /> Preview Public
                  </Link>
                )}
                <button onClick={onEdit} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"><Edit3 className="h-4 w-4" /> Edit Profile</button>
              </div>
            ) : (
              <>
                {onFollow && <button onClick={onFollow} className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold ${following ? "bg-slate-100 text-slate-700 ring-1 ring-slate-200" : "bg-brand-600 text-white hover:bg-brand-700"}`}>{following ? <><UserCheck className="h-4 w-4" /> Following</> : <><UserPlus className="h-4 w-4" /> Follow</>}</button>}
                {onShare && <button onClick={onShare} className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Share2 className="h-4 w-4" /> Share</button>}
              </>
            )}
          </div>
        </div>

        {hasValue(user?.socials) && (
          <div className="mt-3">
            {/* socials rendered via hasValue check inside SocialLinks; extra guard avoids empty wrapper */}
          </div>
        )}

        {(stats || typeof completeness === "number") && (
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="min-w-0">
              {/* StatsRow is rendered by parent; keep placeholder for spacing if needed */}
            </div>
            {isOwnProfile && typeof completeness === "number" && (
              <div className="flex justify-center lg:justify-end">
                <CompletenessMeter value={completeness} />
              </div>
            )}
          </div>
        )}

        {tabs.length > 0 && (
          <div className="mt-5 -mx-4 border-t border-slate-100 px-4 pt-3 sm:mx-0 sm:px-0">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onTabChange?.(t.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ring-1 transition ${activeTab === t.id ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}
                >
                  {t.icon && <t.icon className="h-3.5 w-3.5" />} {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
