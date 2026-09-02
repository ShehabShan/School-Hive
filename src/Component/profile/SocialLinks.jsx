import { Linkedin, Twitter, Github, Globe, Mail } from "lucide-react";

const links = [
  { key: "linkedin", icon: Linkedin, label: "LinkedIn", color: "text-sky-600 bg-sky-50 ring-sky-100" },
  { key: "twitter", icon: Twitter, label: "Twitter", color: "text-sky-500 bg-sky-50 ring-sky-100" },
  { key: "github", icon: Github, label: "GitHub", color: "text-slate-700 bg-slate-100 ring-slate-200" },
  { key: "website", icon: Globe, label: "Website", color: "text-brand-600 bg-brand-50 ring-brand-100" },
];

export default function SocialLinks({ socials, email }) {
  const items = [];
  if (socials) {
    for (const l of links) {
      const url = socials[l.key];
      if (url) items.push({ ...l, href: url.startsWith("http") ? url : `https://${url}` });
    }
  }
  if (email) items.push({ key: "email", icon: Mail, label: email, href: `mailto:${email}`, color: "text-emerald-600 bg-emerald-50 ring-emerald-100" });
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it) => (
        <a key={it.key} href={it.href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${it.color} hover:opacity-90`}>
          <it.icon className="h-3.5 w-3.5" /> <span className="max-w-[140px] truncate">{it.key === "email" ? email : it.label}</span>
        </a>
      ))}
    </div>
  );
}
