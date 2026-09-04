import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";
import Spinner from "../../Component/ui/Spinner";
import ProfileHeaderQuora from "../../Component/profile/ProfileHeaderQuora";
import ProfileTabs from "../../Component/profile/ProfileTabs";
import AnswersTab from "../../Component/profile/AnswersTab";
import QuestionsTab from "../../Component/profile/QuestionsTab";
import ActivityTab from "../../Component/profile/ActivityTab";
import AboutTab from "../../Component/profile/AboutTab";
import { usePublicStats } from "../../Hooks/useProfileStats";
import { useFollow } from "../../Hooks/useFollow";
import { hasValue } from "../../utils/hasValue";

export default function PublicProfile() {
  const { email } = useParams();
  const decodedEmail = decodeURIComponent(email || "");
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profileUser, isLoading } = useQuery({
    queryKey: ["public-profile", decodedEmail],
    enabled: !!decodedEmail,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/public/${encodeURIComponent(decodedEmail)}`);
      return res.data.data;
    },
  });

  const { data: stats } = usePublicStats(decodedEmail);

  // header counts: questions asked, answers given (light limit 1 for total)
  const { data: qTotal } = useQuery({
    queryKey: ["profile-q-total", decodedEmail],
    enabled: !!decodedEmail,
    queryFn: async () => {
      const res = await axiosPublic.get("/questions", { params: { authorEmail: decodedEmail, limit: 1 } });
      return res.data?.total ?? 0;
    },
  });
  const { data: aTotal } = useQuery({
    queryKey: ["profile-a-total", decodedEmail],
    enabled: !!decodedEmail,
    queryFn: async () => {
      try {
        const res = await axiosPublic.get("/answers", { params: { authorEmail: decodedEmail, limit: 1 } });
        return res.data?.total ?? 0;
      } catch {
        return 0;
      }
    },
  });

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
        } catch {
          return [];
        }
      }
    },
  });

  // for Activity tab we reuse reviews; scholarships not shown there but About handles institution
  const follow = useFollow(decodedEmail);
  const isFollowing = follow.isFollowingQ.data;

  const [active, setActive] = useState("answers");
  const [visited, setVisited] = useState({ answers: true });
  const hasInteractedRef = useRef(false);

  // default tab fallback: only once on mount when both totals are known and both zero — not after user clicks
  useEffect(() => {
    if (hasInteractedRef.current) return;
    if (typeof aTotal === "number" && typeof qTotal === "number" && aTotal === 0 && qTotal === 0) {
      setActive("about");
      setVisited((v) => ({ ...v, about: true }));
    }
  }, [aTotal, qTotal]);

  const onTab = (id) => {
    hasInteractedRef.current = true;
    setActive(id);
    setVisited((v) => ({ ...v, [id]: true }));
  };

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Spinner className="h-8 w-8 text-brand-600" /></div>;
  if (!profileUser) return <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500"><p className="text-lg font-semibold">User not found</p><Link to="/" className="text-sm font-semibold text-brand-600">Go home</Link></div>;

  const isOwn = user?.email?.toLowerCase() === decodedEmail.toLowerCase();

  const headerStats = {
    questions: qTotal,
    answers: aTotal,
    followers: stats?.followers ?? 0,
    following: stats?.following ?? 0,
    scholarshipsCreated: stats?.scholarshipsCreated,
    applications: stats?.applications,
    studentsCount: stats?.studentsCount,
  };

  const counts = { answers: aTotal, questions: qTotal, activity: reviews.length, about: undefined };

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  };

  const handleEdit = () => {
    if (profileUser.role === "institution") navigate("/institutionDashboard/myProfile");
    else if (user) navigate("/userDashboard/myProfile");
    else navigate("/myProfile");
  };

  const isInstitution = profileUser.role === "institution";

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto max-w-3xl px-4">
        <ProfileHeaderQuora
          user={profileUser}
          stats={headerStats}
          isOwner={isOwn}
          onEdit={handleEdit}
          onFollow={!isOwn ? () => follow.toggle.mutate() : undefined}
          following={isFollowing}
          onShare={handleShare}
        />

        <div className="mt-4 rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
          <ProfileTabs active={active} onChange={onTab} counts={counts} />
          <div className="p-4 sm:p-5">
            {active === "answers" && <AnswersTab email={decodedEmail} enabled={!!visited.answers} />}
            {active === "questions" && <QuestionsTab email={decodedEmail} enabled={!!visited.questions} />}
            {active === "activity" && <ActivityTab applications={[]} reviews={reviews} enabled={!!visited.activity} />}
            {active === "about" && <AboutTab user={profileUser} enabled={!!visited.about || active === "about"} />}
            {/* institution quick note when viewing answers but institution has no answers */}
            {isInstitution && active === "answers" && aTotal === 0 && hasValue(profileUser?.orgDescription) && (
              <p className="mt-4 text-center text-xs text-slate-500">Institution accounts primarily share scholarships — see About.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
