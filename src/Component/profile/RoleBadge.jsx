import { Crown, ShieldCheck, Award, GraduationCap, Building2 } from "lucide-react";

export const roleMeta = {
  superadmin: { label: "Owner", color: "bg-amber-100 text-amber-700 ring-amber-200", icon: Crown, desc: "Full platform owner" },
  admin: { label: "Administrator", color: "bg-brand-100 text-brand-700 ring-brand-200", icon: ShieldCheck, desc: "Administrator of SchoolHive" },
  modaretor: { label: "Moderator", color: "bg-sky-100 text-sky-700 ring-sky-200", icon: Award, desc: "Moderator — reviews & scholarships" },
  user: { label: "Student", color: "bg-emerald-100 text-emerald-700 ring-emerald-200", icon: GraduationCap, desc: "Student at SchoolHive" },
  institution: { label: "Institution", color: "bg-violet-100 text-violet-700 ring-violet-200", icon: Building2, desc: "University, college or school" },
};

export default function RoleBadge({ role, size = "sm" }) {
  const meta = roleMeta[role] || roleMeta.user;
  const Icon = meta.icon;
  const sizeClasses = size === "sm"
    ? "px-2.5 py-0.5 text-xs gap-1"
    : "px-3 py-1 text-xs gap-1.5";
  return (
    <span className={`inline-flex items-center rounded-full font-bold ring-1 ${meta.color} ${sizeClasses}`}>
      <Icon className="h-3.5 w-3.5" /> {meta.label}
    </span>
  );
}
