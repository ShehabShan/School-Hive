import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";
import Spinner from "../../Component/ui/Spinner";
import ProfileHeroV2 from "../../Component/profile/ProfileHeroV2";
import Sidebar from "../../Component/profile/Sidebar";
import ActivitySection from "../../Component/profile/ActivitySection";
import ScholarshipCard from "../../Component/scholarship/ScholarshipCard";
import GalleryStrip from "../../Component/profile/GalleryStrip";
import { EducationTimeline, ExperienceTimeline, CertificationsSection, AchievementsSection, LanguagesInterests } from "../../Component/profile/TimelineSection";
import { usePublicStats } from "../../Hooks/useProfileStats";
import { useFollow } from "../../Hooks/useFollow";
import { GraduationCap, FileText, Star, Users, Heart } from "lucide-react";
import { BookOpen } from "lucide-react";

export default function PublicProfile() {
  const { email } = useParams();
  const decodedEmail = decodeURIComponent(email || "");
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const { data: profileUser, isLoading } = useQuery({
    queryKey: ["public-profile", decodedEmail],
    enabled: !!decodedEmail,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/public/${encodeURIComponent(decodedEmail)}`);
      return res.data.data;
    },
  });

  const { data: stats } = usePublicStats(decodedEmail);

  const { data: reviews = [] } = useQuery({
    queryKey: ["public-reviews", decodedEmail],
    enabled: !!decodedEmail,
    queryFn: async () => {
      try {
        const res = await axiosPublic.get(`/allReviews/${encodeURIComponent(decodedEmail)}`);
        return res.data.data || [];
      } catch {
        try {
          const res2 = await axiosPublic.get("/allReviews", { params: { email: decodedEmail, limit: 10 } });
          return res2.data.data || [];
        } catch { return []; }
      }
    },
  });

  const { data: scholarships = [] } = useQuery({
    queryKey: ["public-scholarships", decodedEmail],
    enabled: !!decodedEmail && profileUser?.role === "institution",
    queryFn: async () => {
      const res = await axiosPublic.get("/allScholership", { params: { status: "all" } });
      const list = res.data.data || res.data || [];
      const arr = Array.isArray(list) ? list : [];
      return arr.filter((s) => {
        const isOwner = String(s.createdBy || "").toLowerCase() === decodedEmail.toLowerCase();
        if (!isOwner) return false;
        if (s.status === "draft") return false;
        if (s.status === "scheduled" && !s.showScheduledOnProfile) return false;
        return true;
      });
    },
  });

  const follow = useFollow(decodedEmail);
  const isFollowing = follow.isFollowingQ.data;
  const followersCount = stats?.followers ?? follow.followersQ.data?.followersCount ?? 0;

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Spinner className="h-8 w-8 text-brand-600" /></div>;
  if (!profileUser) return <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500"><p className="text-lg font-semibold">User not found</p><Link to="/" className="text-sm font-semibold text-brand-600">Go home</Link></div>;

  const isOwn = user?.email?.toLowerCase() === decodedEmail.toLowerCase();
  const heroStats = [
    ...(profileUser.role !== "institution" ? [
      { label: "Applications", value: String(stats?.applications ?? "—"), icon: FileText, color: "text-brand-600 bg-brand-50" },
      { label: "Reviews", value: String(stats?.reviews ?? "—"), icon: Star, color: "text-amber-600 bg-amber-50" },
    ] : [
      { label: "Scholarships", value: String(stats?.scholarshipsCreated ?? scholarships.length), icon: BookOpen, color: "text-violet-600 bg-violet-50" },
      { label: "Students", value: String(stats?.studentsCount ?? "—"), icon: Users, color: "text-emerald-600 bg-emerald-50" },
    ]),
    { label: "Followers", value: String(followersCount), icon: Heart, color: "text-rose-600 bg-rose-50" },
    { label: "Following", value: String(stats?.following ?? 0), icon: Users, color: "text-sky-600 bg-sky-50" },
  ];

  const handleShare = async () => {
    const url = window.location.href;
    try { await navigator.clipboard.writeText(url); } catch {}
    // toast handled via simple alert fallback
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto max-w-6xl px-4">
        <ProfileHeroV2 user={profileUser} isOwnProfile={false} stats={heroStats} completeness={profileUser.completeness} following={isFollowing} onFollow={!isOwn ? ()=> follow.toggle.mutate() : undefined} onShare={handleShare} />
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
              <h3 className="text-base font-bold text-slate-900">About</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{profileUser?.bio || "No bio provided."}</p>
              {profileUser.headline && <p className="mt-2 text-sm italic text-slate-500">&quot;{profileUser.headline}&quot;</p>}
              {profileUser.skills?.length>0 && <div className="mt-4 flex flex-wrap gap-1.5">{profileUser.skills.map(s=> <span key={s} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">{s}</span>)}</div>}
            </div>
            <LanguagesInterests languages={profileUser.languages} interests={profileUser.interests} />
            <GalleryStrip images={profileUser.gallery} videoUrl={profileUser.videoIntro} orgGallery={profileUser.orgGallery} />
            <EducationTimeline education={profileUser.education} />
            <ExperienceTimeline experience={profileUser.experience} />
            <CertificationsSection certifications={profileUser.certifications} />
            <AchievementsSection achievements={profileUser.achievements} />
            {profileUser.role==="institution" && (
              <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><GraduationCap className="h-5 w-5 text-violet-600" /> Scholarships by {profileUser.orgName || profileUser.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{profileUser.orgDescription?.slice(0,120) || ""}</p>
                {scholarships.length===0 ? <p className="mt-3 text-sm text-slate-500">No published scholarships yet</p> : <div className="mt-4 grid gap-4 md:grid-cols-2">{scholarships.map(s=> <ScholarshipCard key={s._id} scholarship={s} />)}</div>}
              </div>
            )}
            <ActivitySection reviews={reviews} viewAllLink="/allScholership" />
          </div>
          <div className="space-y-5"><Sidebar user={profileUser} /></div>
        </div>
      </div>
    </div>
  );
}
