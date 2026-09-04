import { BadgeCheck, Pencil, Building2, CalendarDays, Share2, UserPlus, UserCheck } from "lucide-react";
import RoleBadge from "./RoleBadge";
import BadgeRow from "../QA/BadgeRow";
import { hasValue, joinFiltered } from "../../utils/hasValue";

export default function ProfileHeaderQuora({
  user,
  stats,
  isOwner,
  onEdit,
  onFollow,
  following,
  onShare,
}) {
  const name = user?.name?.trim() || "Anonymous";
  const photo = hasValue(user?.photoURL) ? user.photoURL : null;
  const role = user?.role || "user";
  const isInstitution = role === "institution";
  const reputation = typeof user?.reputation === "number" ? user.reputation : 0;
  const verified = Boolean(user?.isVerified) || Boolean(user?.verified) || (isInstitution && user?.status === "approved");
  const bio = hasValue(user?.bio) ? String(user.bio).trim() : null;
  const headline = hasValue(user?.headline) ? String(user.headline).trim() : null;
  const oneLine = bio || headline || null;
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;
  const location = joinFiltered([user?.city?.trim(), user?.country?.trim()], ", ");

  // stats prop expected: { reputation, questions, answers, followers, following } raw numbers
  const statItems = [];
  if (isInstitution) {
    statItems.push(
      { label: "Scholarships", value: stats?.scholarshipsCreated ?? "—" },
      { label: "Applicants", value: stats?.applications ?? "—" },
      { label: "Students", value: stats?.studentsCount ?? "—" },
    );
  } else {
    statItems.push(
      { label: "Reputation", value: reputation },
      { label: "Questions", value: stats?.questions ?? "—" },
      { label: "Answers", value: stats?.answers ?? "—" },
    );
  }
  // followers/following only if exposed and allowed by preference
  const showFollowers = user?.preferences?.showFollowersOnPublic !== false || isOwner;
  if (showFollowers && stats && (typeof stats.followers === "number" || typeof stats.following === "number")) {
    statItems.push(
      { label: "Followers", value: stats.followers ?? 0 },
      { label: "Following", value: stats.following ?? 0 },
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
      <div className="px-5 py-6 sm:px-7 sm:py-7">
        {/* top row: avatar + name/role + actions */}
        <div className="flex gap-4 sm:gap-5">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm ring-1 ring-slate-200 sm:h-[84px] sm:w-[84px]">
            {photo ? (
              <img src={photo} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="flex flex-wrap items-center gap-2 text-[22px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl">
                  <span className="truncate">{name}</span>
                  {verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-700 ring-1 ring-sky-200">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  )}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <RoleBadge role={role} />
                  {isInstitution && hasValue(user?.orgName) && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                      <Building2 className="h-3.5 w-3.5 text-violet-600" /> {user.orgName}
                      {hasValue(user?.orgType) ? <span className="text-slate-400">· {user.orgType}</span> : null}
                    </span>
                  )}
                </div>
                {oneLine && (
                  <p className="mt-2 line-clamp-1 text-sm leading-relaxed text-slate-600">{oneLine}</p>
                )}
                {/* meta line */}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  {location && <span>{location}</span>}
                  {joined && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> Joined {joined}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {isOwner ? (
                  <button
                    onClick={onEdit}
                    aria-label="Edit profile"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                ) : (
                  <>
                    {onFollow && (
                      <button
                        onClick={onFollow}
                        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${following ? "bg-slate-100 text-slate-700 ring-1 ring-slate-200" : "bg-brand-600 text-white hover:bg-brand-700"}`}
                      >
                        {following ? (
                          <>
                            <UserCheck className="h-4 w-4" /> Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" /> Follow
                          </>
                        )}
                      </button>
                    )}
                    {onShare && (
                      <button
                        onClick={onShare}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                      >
                        <Share2 className="h-4 w-4" /> Share
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* stats row — quora-style numbers, no card chips */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-y border-slate-100 py-3 text-sm">
          {statItems.map((s) => (
            <span key={s.label} className="inline-flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-900">{String(s.value)}</span>
              <span className="text-xs font-medium text-slate-500">{s.label}</span>
            </span>
          ))}
        </div>

        {/* credentials panel — small */}
        <div className="mt-4">
          <BadgeRow user={user} />
        </div>
      </div>
    </div>
  );
}
