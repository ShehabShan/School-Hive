import { Link } from "react-router-dom";
import useAuthor from "../../Hooks/useAuthor";
import { useFollow } from "../../Hooks/useFollow";
import useAuth from "../../Hooks/useAuth";
import RoleBadge from "../profile/RoleBadge";
import { BadgeCheck } from "lucide-react";
import { timeAgo } from "./QuestionCard";
import toast from "react-hot-toast";

/**
 * Identity block for a post author: avatar, name (falls back to email
 * prefix), Staff/Institution role badge, Verified check, optional meta
 * (timeAgo) on the right.
 */
export default function AuthorBlock({ email, role, isVerified, time, size = "sm", className = "" }) {
  const { author } = useAuthor(email);
  const { user } = useAuth();
  const follow = useFollow(email);
  const isFollowing = follow.isFollowingQ.data;
  const name = author?.name || String(email || "").split("@")[0] || "Anonymous";
  const photo = author?.photoURL;
  const r = role || author?.role;
  const verified = isVerified ?? Boolean(author?.verified);
  const isStaff = ["admin", "superadmin", "modaretor"].includes(r);
  const badgeRole = isStaff ? r : r === "institution" ? "institution" : null;
  const avatarCls = size === "lg" ? "h-10 w-10" : "h-7 w-7";
  const credential = author?.education?.[0]?.school ? `Studied at ${author.education[0].school}` : author?.headline ? author.headline.slice(0,60) : null;
  const timeLabel = time ? timeAgo(time).replace(" ago","") : null;

  const profileHref = email ? `/profile/${encodeURIComponent(email)}` : null;
  const isOwn = user?.email && email && user.email.toLowerCase() === String(email).toLowerCase();
  const handleFollow = (e)=>{
    e.preventDefault(); e.stopPropagation();
    if(!user){ toast.error("Sign in to follow"); return; }
    if(isOwn) return;
    follow.toggle.mutate();
  };
  const Avatar = (
    <div className={`shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 ${avatarCls} ${photo ? "" : "flex items-center justify-center text-xs font-extrabold text-white"}`}>
      {photo ? <img src={photo} alt={name} className="h-full w-full object-cover" loading="lazy" /> : name.charAt(0).toUpperCase()}
    </div>
  );
  const NameEl = <span className={`truncate font-semibold text-slate-900 hover:text-brand-600 hover:underline ${size === "lg" ? "text-sm" : "text-[13px]"}`}>{name}</span>;

  return (
    <div className={`flex min-w-0 gap-2 ${className}`}>
      {profileHref ? <Link to={profileHref} onClick={(e)=> e.stopPropagation()} className="shrink-0 self-start">{Avatar}</Link> : <div className="shrink-0 self-start">{Avatar}</div>}
      <div className="min-w-0 flex-1 leading-tight">
        <div className="flex flex-wrap items-center gap-1">
          {profileHref ? <Link to={profileHref} onClick={(e)=> e.stopPropagation()}>{NameEl}</Link> : NameEl}
          {profileHref && !isOwn && <><span className="text-slate-300">·</span><button onClick={handleFollow} className={`text-xs font-bold ${isFollowing ? "text-slate-500" : "text-sky-600 hover:underline"}`}>{isFollowing ? "Following" : "Follow"}</button></>}
          {badgeRole && <RoleBadge role={badgeRole} size="sm" />}
          {verified && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-50 px-1.5 py-0.5 text-[11px] font-bold text-sky-700 ring-1 ring-sky-200" title="Verified — credential reviewed">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
        {(credential || timeLabel) && (
          <div className="truncate text-xs text-slate-500">
            {credential && <span>{credential}</span>}
            {credential && timeLabel && <span> · </span>}
            {timeLabel && <span>{timeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
