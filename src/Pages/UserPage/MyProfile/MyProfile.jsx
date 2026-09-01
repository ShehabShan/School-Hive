import { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  FolderGit,
  UserPlus,
} from "lucide-react";

import bg from "../../../assist/bgImg/profileBg.jpg";
import useAuth from "../../../Hooks/useAuth";

const TABS = ["about", "edit", "timeline", "gallery", "friends"];

const stats = [
  { icon: FolderGit, label: "Projects", value: "113", color: "text-blue-500 bg-blue-50" },
  { icon: Users, label: "Followers", value: "12.2k", color: "text-purple-500 bg-purple-50" },
  { icon: UserPlus, label: "Following", value: "128", color: "text-emerald-500 bg-emerald-50" },
];

const skills = [
  "Project Management",
  "Data Analysis",
  "Marketing Strategy",
  "Graphic Design",
  "Content Creation",
  "Market Research",
  "Client Relations",
  "Event Planning",
  "Budgeting and Finance",
  "Negotiation Skills",
  "Team Collaboration",
  "Adaptability",
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="relative h-56 md:h-72">
        <img
          src={bg}
          alt="Profile banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"></div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12">
        <div className="-mt-14">
          {/* Profile Header */}
          <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lift ring-4 ring-white">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile picture"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-5xl font-extrabold text-white">
                      {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    {user?.displayName}
                  </h1>
                  <p className="text-sm font-medium text-brand-600">
                    Administrator of SchoolHive
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      Georgia
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      Washington D.C
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex min-w-[96px] flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
                      <stat.icon className="h-4 w-4" />
                    </span>
                    <span className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">
                      {stat.value}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-1.5 overflow-x-auto border-t border-slate-100 pt-4">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    activeTab === tab
                      ? "bg-brand-600 text-white shadow-soft"
                      : "text-slate-500 hover:bg-slate-100 hover:text-brand-600"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "about" && (
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {/* Personal Info */}
              <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Personal Info
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Name", value: user?.displayName },
                    { label: "Email", value: user?.email },
                    { label: "Phone", value: "+1(555)123-4567" },
                    { label: "Age", value: "22" },
                    { label: "Experience", value: "4 Years" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="border-b border-slate-50 pb-2 last:border-0"
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {row.label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-700">
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Me & Skills */}
              <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100 md:col-span-2">
                <h2 className="mb-3 text-lg font-bold text-slate-900">
                  About Me
                </h2>
                <p className="text-sm leading-relaxed text-slate-500">
                  Hello! I'm the dedicated admin behind our Scholarship
                  Management System. With a passion for both technology and
                  education, I strive to create a seamless, user-friendly
                  platform that connects deserving students with life-changing
                  scholarship opportunities. Every day, I work on refining our
                  system to ensure it not only runs smoothly but also empowers
                  students to pursue their dreams. Whether you're applying for
                  a scholarship or exploring new educational possibilities,
                  I'm here to support your journey every step of the way.
                </p>

                <h3 className="mt-6 mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100 transition-colors hover:bg-brand-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <h3 className="mt-6 mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
                  Contact Information
                </h3>
                <div className="space-y-2.5">
                  <p className="flex items-center gap-2.5 text-sm text-slate-500">
                    <Mail className="h-4 w-4 text-brand-500" />
                    {user?.email}
                  </p>
                  <p className="flex items-center gap-2.5 text-sm text-slate-500">
                    <Phone className="h-4 w-4 text-brand-500" />
                    +1(555)123-4567
                  </p>
                  <p className="flex items-center gap-2.5 text-sm text-slate-500">
                    <Globe className="h-4 w-4 text-brand-500" />
                    scholarhive-913e4.web.app
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
