import { MapPin, CalendarDays, Edit3, BadgeCheck, Building2, Share2, UserPlus, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RoleBadge from "./RoleBadge";
import bg from "../../assist/bgImg/profileBg.webp";
import CompletenessMeter from "./CompletenessMeter";
import SocialLinks from "./SocialLinks";

export default function ProfileHeroV2({ user, isOwnProfile, onEdit, stats, completeness, onFollow, following, onShare }) {
  const name = user?.name || "Anonymous";
  const photo = user?.photoURL;
  const cover = user?.coverPhoto || bg;
  const role = user?.role || "user";
  const headline = user?.headline;
  const city = user?.city;
  const country = user?.country;
  const isInstitution = role === "institution";
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "Recently";
  const verified = user?.verified || (isInstitution && user?.status === "approved");

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
      <div className="relative h-44 overflow-hidden sm:h-52 md:h-64">
        <img src={cover} alt="Cover" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {verified && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow"><BadgeCheck className="h-3.5 w-3.5" /> Verified</span>}
          <RoleBadge role={role} />
        </div>
        {isInstitution && user?.orgName && (
          <div className="absolute bottom-3 left-4 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur sm:flex">
            <Building2 className="h-3.5 w-3.5 text-violet-600" /> {user.orgName} • {user.orgType}
          </div>
        )}
      </div>

      <div className="px-4 pb-5 pt-0 sm:px-6">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lift ring-4 ring-white sm:h-24 sm:w-24 md:h-28 md:w-28">
              {photo ? <img src={photo} alt={name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-3xl font-extrabold text-white">{name.charAt(0).toUpperCase()}</div>}
            </div>
            <div className="min-w-0 pt-8 sm:pt-10">
              <h1 className="flex items-center gap-2 truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{name} {verified && <BadgeCheck className="h-5 w-5 text-emerald-500" />}</h1>
              {headline && <p className="mt-0.5 text-sm font-medium text-slate-600 line-clamp-1">{headline}</p>}
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {(city || country) && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {[city,country].filter(Boolean).join(", ")}</span>}
                <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Joined {joined}</span>
                {isInstitution && user?.orgCountry && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {user.orgCountry}</span>}
              </div>
              <div className="mt-2">
                <SocialLinks socials={user?.socials} email={isOwnProfile ? user?.email : null} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            {isOwnProfile ? (
              <button onClick={onEdit} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"><Edit3 className="h-4 w-4" /> Edit Profile</button>
            ) : (
              <>
                {onFollow && <button onClick={onFollow} className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold ${following ? "bg-slate-100 text-slate-700" : "bg-brand-600 text-white hover:bg-brand-700"}`}>{following ? <><UserCheck className="h-4 w-4" /> Following</> : <><UserPlus className="h-4 w-4" /> Follow</>}</button>}
                {onShare && <button onClick={onShare} className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Share2 className="h-4 w-4" /> Share</button>}
              </>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_280px]">
          <div>
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                {stats.map((s)=> {
                  const Tag = s.to ? Link : "div";
                  const props = s.to ? { to: s.to } : {};
                  return (
                    <Tag key={s.label} {...props} className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 px-2 py-3 text-center hover:-translate-y-0.5 hover:shadow-sm">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.color}`}><s.icon className="h-4 w-4" /></span>
                      <span className="mt-1 text-sm font-extrabold text-slate-900">{s.value}</span>
                      <span className="text-[11px] font-medium leading-tight text-slate-500">{s.label}</span>
                    </Tag>
                  );
                })}
              </div>
            )}
          </div>
          {isOwnProfile && typeof completeness === "number" && (
            <CompletenessMeter value={completeness} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
