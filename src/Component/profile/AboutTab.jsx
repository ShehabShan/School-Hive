import { Building2, Globe, Sparkles } from "lucide-react";
import { hasValue } from "../../utils/hasValue";
import Sidebar from "./Sidebar";
import { EducationTimeline, ExperienceTimeline, CertificationsSection, AchievementsSection, LanguagesInterests } from "./TimelineSection";
import GalleryStrip from "./GalleryStrip";
import SocialLinks from "./SocialLinks";

export default function AboutTab({ user, enabled }) {
  if (!enabled) return null;
  const isInstitution = user?.role === "institution";
  const bio = hasValue(user?.bio) ? user.bio : null;
  const headline = hasValue(user?.headline) ? user.headline : null;
  const skills = (user?.skills || []).filter(Boolean);

  if (isInstitution) {
    const hasInst = hasValue(user?.orgName) || hasValue(user?.orgDescription) || hasValue(user?.orgHighlights) || hasValue(user?.orgDepartments);
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Building2 className="h-5 w-5 text-violet-600" /> {user?.orgName || "Institution"}
            {hasValue(user?.orgType) && <span className="text-sm font-medium text-slate-500">· {user.orgType}</span>}
          </h3>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
            {hasValue(user?.orgCountry) && <p><span className="font-semibold text-slate-700">Country:</span> {user.orgCountry}</p>}
            {hasValue(user?.orgFounded) && <p><span className="font-semibold">Founded:</span> {user.orgFounded}</p>}
            {hasValue(user?.orgAccreditation) && <p><span className="font-semibold">Accreditation:</span> {user.orgAccreditation}</p>}
            {(hasValue(user?.orgStudentCount) || hasValue(user?.orgFacultyCount)) && (
              <p><span className="font-semibold">Community:</span> {user.orgStudentCount ?? "—"} students · {user.orgFacultyCount ?? "—"} faculty</p>
            )}
            {hasValue(user?.orgDescription) ? <p className="whitespace-pre-wrap">{user.orgDescription}</p> : !hasInst ? <p className="text-slate-500">No institution details yet.</p> : null}
            {Array.isArray(user?.orgHighlights) && user.orgHighlights.filter(Boolean).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {user.orgHighlights.filter(Boolean).map((h) => (
                  <span key={h} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">{h}</span>
                ))}
              </div>
            )}
            {Array.isArray(user?.orgDepartments) && user.orgDepartments.filter(Boolean).length > 0 && (
              <p className="text-xs text-slate-500">Departments: {user.orgDepartments.filter(Boolean).join(", ")}</p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {hasValue(user?.orgWebsite) && <a href={user.orgWebsite} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-100"><Globe className="h-3 w-3" /> Website</a>}
            {hasValue(user?.orgBrochureUrl) && <a href={user.orgBrochureUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">Brochure</a>}
            {hasValue(user?.orgMapUrl) && <a href={user.orgMapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Map</a>}
          </div>
        </div>
        <GalleryStrip images={user?.gallery} videoUrl={user?.videoIntro} orgGallery={user?.orgGallery} />
        <Sidebar user={user} />
      </div>
    );
  }

  // student
  return (
    <div className="space-y-5">
      {(bio || headline || skills.length > 0) && (
        <div className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><Sparkles className="h-4 w-4 text-brand-500" /> About</h3>
          {bio && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{bio}</p>}
          {headline && <p className="mt-3 border-l-2 border-brand-100 pl-3 text-sm italic text-slate-500">“{headline}”</p>}
          {skills.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Skills</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((s) => <span key={s} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">{s}</span>)}
              </div>
            </div>
          )}
          {hasValue(user?.socials) && <div className="mt-4"><SocialLinks socials={user.socials} /></div>}
        </div>
      )}
      {!bio && !headline && !skills.length && !hasValue(user?.socials) && (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-slate-100">No bio yet.</div>
      )}
      <LanguagesInterests languages={user?.languages} interests={user?.interests} />
      <GalleryStrip images={user?.gallery} videoUrl={user?.videoIntro} orgGallery={user?.orgGallery} />
      <EducationTimeline education={user?.education} />
      <ExperienceTimeline experience={user?.experience} />
      <CertificationsSection certifications={user?.certifications} />
      <AchievementsSection achievements={user?.achievements} />
      <Sidebar user={user} />
    </div>
  );
}
