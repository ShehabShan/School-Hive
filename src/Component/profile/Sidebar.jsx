import { Mail, Phone, MapPin, Globe, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar({ user }) {
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  const contactItems = [
    { icon: Mail, label: user?.email, href: user?.email ? `mailto:${user.email}` : null },
    { icon: Phone, label: user?.phone || null },
    { icon: MapPin, label: user?.city || user?.country ? [user.city, user.country].filter(Boolean).join(", ") : null },
    { icon: Globe, label: user?.orgWebsite || null, href: user?.orgWebsite || null },
  ].filter((item) => item.label);

  return (
    <div className="space-y-4">
      {/* Contact info */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6"
      >
        <h3 className="text-base font-bold text-slate-900">Contact</h3>
        <div className="mt-3 space-y-3">
          {contactItems.map((item) => {
            const Content = item.href ? "a" : "span";
            return (
              <Content
                key={item.label}
                href={item.href || undefined}
                target={item.href ? "_blank" : undefined}
                rel={item.href ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-brand-600"
              >
                <item.icon className="h-4 w-4 shrink-0 text-brand-500" />
                <span className="truncate">{item.label}</span>
              </Content>
            );
          })}
        </div>
      </motion.div>

      {/* Member info */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6"
      >
        <h3 className="text-base font-bold text-slate-900">Member Info</h3>
        <div className="mt-3 flex items-center gap-2.5 text-sm text-slate-600">
          <CalendarDays className="h-4 w-4 shrink-0 text-brand-500" />
          <span>Joined {joined}</span>
        </div>
      </motion.div>
    </div>
  );
}
