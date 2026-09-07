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
    <div className="rounded-3xl bg-white shadow-soft ring-1 ring-slate-200">
      {/* gradient accent bar */}
      <div className="h-1 w-full rounded-t-3xl bg-gradient-to-r from-brand-500 via-brand-600 to-violet-600" />
      
      <div className="px-5 py-7 sm:px-8 sm:py-9">
        {/* top row: avatar + name/role + actions */}
        <div className="flex gap-5 sm:gap-6">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-md ring-2 ring-white sm:h-28 sm:w-28">
            {photo ? (
              <img src={photo} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-white sm:text-4xl">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {/* name + verified badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                    {name}
                  </h1>
                  {verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 ring-1 ring-sky-200">
                      <BadgeCheck className="h-4 w-4" /> Verified
                    </span>
                  )}
                </div>

                {/* role + org */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <RoleBadge role={role} />
                  {isInstitution && hasValue(user?.orgName) && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Building2 className="h-4 w-4 text-violet-600" /> 
                      <span>{user.orgName}</span>
                      {hasValue(user?.orgType) && <span className="text-slate-400">•</span>}
                      {hasValue(user?.orgType) && <span className="text-slate-500">{user.orgType}</span>}
                    </span>
                  )}
                </div>

                {/* bio/headline */}
                {oneLine && (
                  <p className="mt-3 line-clamp-2 text-base leading-relaxed text-slate-600">{oneLine}</p>
                )}

                {/* location + joined */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
                  {location && <span>{location}</span>}
                  {joined && (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" /> 
                      <span>Joined {joined}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* action buttons */}
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                {isOwner ? (
                  <button
                    onClick={onEdit}
                    aria-label="Edit profile"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 active:scale-95"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                ) : (
                  <>
                    {onFollow && (
                      <button
                        onClick={onFollow}
                        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition active:scale-95 ${
                          following
                            ? "bg-slate-100 text-slate-700 ring-1 ring-slate-300 hover:bg-slate-200"
                            : "bg-brand-600 text-white hover:bg-brand-700"
                        }`}
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
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 transition ring-1 ring-slate-200 hover:bg-slate-200 active:scale-95"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* stats grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
          {statItems.map((s) => (
            <div key={s.label} className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 ring-1 ring-slate-200 transition hover:ring-slate-300">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{s.label}</p>
              <p className="mt-1.5 text-2xl font-extrabold text-slate-900 sm:text-3xl">{String(s.value)}</p>
            </div>
          ))}
        </div>

        {/* credentials panel */}
        <div className="mt-8">
          <BadgeRow user={user} />
        </div>
      </div>
    </div>
  );
}
