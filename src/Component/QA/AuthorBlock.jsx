import { Link } from "react-router-dom";
import useAuthor from "../../Hooks/useAuthor";
import RoleBadge from "../profile/RoleBadge";
import { BadgeCheck } from "lucide-react";
import { timeAgo } from "./QuestionCard";

/**
 * Identity block for a post author: avatar, name (falls back to email
 * prefix), Staff/Institution role badge, Verified check, optional meta
 * (timeAgo) on the right.
 */
export default function AuthorBlock({ email, role, isVerified, time, size = "sm", className = "" }) {
  const { author } = useAuthor(email);
  const name = author?.name || String(email || "").split("@")[0] || "Anonymous";
  const photo = author?.photoURL;
  const r = role || author?.role;
  const verified = isVerified ?? Boolean(author?.verified);
  const isStaff = ["admin", "superadmin", "modaretor"].includes(r);
  const badgeRole = isStaff ? r : r === "institution" ? "institution" : null;
  const avatarCls = size === "lg" ? "h-10 w-10" : "h-8 w-8";

  const profileHref = email ? `/profile/${encodeURIComponent(email)}` : null;
  const Avatar = (
    <div className={`shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 ${avatarCls} ${photo ? "" : "flex items-center justify-center text-sm font-extrabold text-white"}`}>
      {photo ? <img src={photo} alt={name} className="h-full w-full object-cover" loading="lazy" /> : name.charAt(0).toUpperCase()}
    </div>
  );
  const NameEl = <span className={`truncate font-semibold text-slate-900 hover:text-brand-600 hover:underline ${size === "lg" ? "text-sm" : "text-[13px]"}`}>{name}</span>;

  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      {profileHref ? <Link to={profileHref} onClick={(e)=> e.stopPropagation()} className="shrink-0">{Avatar}</Link> : Avatar}
      <div className="min-w-0 leading-tight">
        <div className="flex flex-wrap items-center gap-1.5">
          {profileHref ? <Link to={profileHref} onClick={(e)=> e.stopPropagation()}>{NameEl}</Link> : NameEl}
          {badgeRole && <RoleBadge role={badgeRole} size="sm" />}
          {verified && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-50 px-1.5 py-0.5 text-[11px] font-bold text-sky-700 ring-1 ring-sky-200" title="Verified — credential reviewed">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
        {time && <span className="text-[11px] text-slate-400">{timeAgo(time)}</span>}
      </div>
    </div>
  );
}
