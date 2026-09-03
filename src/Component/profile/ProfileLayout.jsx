import { MapPin, CalendarDays, Edit3, BadgeCheck, Building2, Share2, UserPlus, UserCheck } from "lucide-react";
import RoleBadge from "./RoleBadge";
import bg from "../../assist/bgImg/profileBg.jpg";
import CompletenessMeter from "./CompletenessMeter";
import { hasValue, joinFiltered } from "../../utils/hasValue";

export default function ProfileLayout({ user, isOwnProfile, onEdit, stats, completeness, onFollow, following, onShare, activeTab, onTabChange, tabs = [] }) {
  const name = user?.name?.trim() || "Anonymous";
  const photo = hasValue(user?.photoURL) ? user.photoURL : null;
  const cover = hasValue(user?.coverPhoto) ? user.coverPhoto : bg;
  const role = user?.role || "user";
  const headline = hasValue(user?.headline) ? user.headline : null;
  const city = user?.city?.trim() || null;
  const country = user?.country?.trim() || null;
  const location = joinFiltered([city, country], ", ");
  const isInstitution = role === "institution";
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "Recently";
  const verified = Boolean(user?.isVerified) || Boolean(user?.verified) || (isInstitution && user?.status === "approved");

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
      <div className="relative h-44 overflow-hidden sm:h-52 md:h-56">
        <img src={cover} alt="Cover" className="h-full w-full object-cover" loading="lazy" onError={(e) => (e.currentTarget.src = bg)} />
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
      </div>

      <div className="px-4 pb-4 pt-0 sm:px-6">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lift ring-4 ring-white sm:h-24 sm:w-24">
              {photo ? <img src={photo} alt={name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-white">{name.charAt(0).toUpperCase()}</div>}
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
              <button onClick={onEdit} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"><Edit3 className="h-4 w-4" /> Edit Profile</button>
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
