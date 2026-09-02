import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Spinner from "../../Component/ui/Spinner";
import ProfileHeader from "../../Component/profile/ProfileHeader";
import AboutSection from "../../Component/profile/AboutSection";
import Sidebar from "../../Component/profile/Sidebar";
import ActivitySection from "../../Component/profile/ActivitySection";
import ScholarshipCard from "../../Component/scholarship/ScholarshipCard";
import { GraduationCap } from "lucide-react";

export default function PublicProfile() {
  const { email } = useParams();
  const decodedEmail = decodeURIComponent(email || "");
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const { data: user, isLoading } = useQuery({
    queryKey: ["public-profile", decodedEmail],
    enabled: !!decodedEmail,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/public/${encodeURIComponent(decodedEmail)}`);
      return res.data.data;
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["public-reviews", decodedEmail],
    enabled: !!decodedEmail,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/allReviews", {
          params: { email: decodedEmail, limit: 10 },
        });
        return res.data.data || [];
      } catch {
        return [];
      }
    },
  });

  const { data: scholarships = [] } = useQuery({
    queryKey: ["public-scholarships", decodedEmail],
    enabled: !!decodedEmail && user?.role === "institution",
    queryFn: async () => {
      const res = await axiosPublic.get("/allScholership", { params: { status: "all" } });
      const list = res.data.data || [];
      return list.filter((s) => {
        const isOwner = String(s.createdBy || "").toLowerCase() === decodedEmail.toLowerCase();
        if (!isOwner) return false;
        if (s.status === "draft") return false;
        if (s.status === "scheduled" && !s.showScheduledOnProfile) return false;
        return true;
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-brand-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
        <p className="text-lg font-semibold">User not found</p>
        <Link to="/" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <ProfileHeader user={user} isOwnProfile={false} />

        {/* Two-column layout */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* Main content */}
          <div className="space-y-5">
            <AboutSection user={user} />
            {user?.role === "institution" && (
              <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
                <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><GraduationCap className="h-5 w-5 text-brand-600" /> Scholarships by {user.orgName || user.name}</h3>
                {scholarships.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">No published scholarships yet {user.showScheduledOnProfile ? "" : "— scheduled hidden until publish"}</p>
                ) : (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {scholarships.map((s) => (
                      <ScholarshipCard key={s._id} scholarship={s} />
                    ))}
                  </div>
                )}
              </div>
            )}
            <ActivitySection
              reviews={reviews}
              viewAllLink="/allScholership"
            />
          </div>

          {/* Sidebar */}
          <div>
            <Sidebar user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
