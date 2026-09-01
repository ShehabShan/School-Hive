import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Spinner from "../../Component/ui/Spinner";
import ProfileHeader from "../../Component/profile/ProfileHeader";
import AboutSection from "../../Component/profile/AboutSection";
import Sidebar from "../../Component/profile/Sidebar";
import ActivitySection from "../../Component/profile/ActivitySection";

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
