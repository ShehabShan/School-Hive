import { MapPin, CalendarDays, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RoleBadge from "./RoleBadge";
import bg from "../../assist/bgImg/profileBg.jpg";

export default function ProfileHeader({ user, isOwnProfile, onEdit, stats }) {
  const name = user?.name || "Anonymous";
  // email available via user.email if needed
  const photo = user?.photoURL;
  const cover = user?.coverPhoto || bg;
  const role = user?.role || "user";
  const city = user?.city;
  const country = user?.country;
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" })
    : "Recently";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Cover photo */}
      <div className="relative h-40 overflow-hidden rounded-t-2xl sm:h-52 md:h-60">
        <img src={cover} alt="Cover" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 right-3">
          <RoleBadge role={role} />
        </div>
      </div>

      {/* Profile info card */}
      <div className="relative rounded-b-2xl bg-white px-4 pb-5 pt-0 shadow-soft ring-1 ring-slate-100 sm:px-6">
        {/* Avatar — overlaps cover */}
        <div className="-mt-12 mb-3 flex items-end gap-4 sm:-mt-14">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lift ring-4 ring-white sm:h-24 sm:w-24 md:h-28 md:w-28">
            {photo ? (
              <img src={photo} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-extrabold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 pb-1">
            <h1 className="truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              {(city || country) && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {[city, country].filter(Boolean).join(", ")}
                </span>
              )}
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                Joined {joined}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        {stats && stats.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {stats.map((s) => {
              const Tag = s.to ? Link : "div";
              const props = s.to ? { to: s.to } : {};
              return (
                <Tag
                  key={s.label}
                  {...props}
                  className="flex min-w-[80px] flex-col items-center rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${s.color}`}>
                    <s.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="mt-1 text-sm font-extrabold text-slate-900">{s.value}</span>
                  <span className="text-[11px] font-medium text-slate-500">{s.label}</span>
                </Tag>
              );
            })}
          </div>
        )}

        {/* Edit button */}
        {isOwnProfile && (
          <button
            onClick={onEdit}
            className="absolute right-4 top-3 inline-flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 backdrop-blur hover:bg-white sm:right-6 sm:top-4 sm:text-sm"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Profile
          </button>
        )}
      </div>
    </motion.div>
  );
}
