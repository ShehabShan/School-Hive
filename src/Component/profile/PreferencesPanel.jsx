import { Eye } from "lucide-react";
import useRole from "../../Hooks/useRole";
import useSuperAdmin from "../../Hooks/useSuperAdmin";

export default function PreferencesPanel({ preferences, onChange }) {
  const p = preferences || { visibility: "public", showStatsOnPublic: true, showScheduledOnProfile: false, showFollowersOnPublic: true, emailNotifications: true };
  const { isApprovedInstitution } = useRole();
  const [isSuperAdmin] = useSuperAdmin();
  const canSchedule = isApprovedInstitution || isSuperAdmin;
  const Toggle = ({ label, desc, checked, onToggle }) => (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div>
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <input type="checkbox" checked={checked} onChange={(e)=> onToggle(e.target.checked)} className="toggle toggle-sm toggle-primary" />
    </label>
  );
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
      <h3 className="text-base font-bold text-slate-900">Preferences</h3>
      <div className="mt-4 space-y-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-800"><Eye className="h-4 w-4 text-brand-500" /> Profile visibility</p>
          <select value={p.visibility} onChange={(e)=> onChange({ ...p, visibility: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="public">Public — anyone can view</option>
            <option value="connections">Connections only</option>
            <option value="private">Private — only you</option>
          </select>
        </div>
        <Toggle label="Show stats on public profile" desc="Let visitors see your application & review counts" checked={p.showStatsOnPublic} onToggle={(v)=> onChange({ ...p, showStatsOnPublic: v })} />
        {canSchedule && <Toggle label="Show scheduled scholarships" desc="Display upcoming scholarships on your public page" checked={p.showScheduledOnProfile} onToggle={(v)=> onChange({ ...p, showScheduledOnProfile: v })} />}
        <Toggle label="Show followers on public profile" desc="Let visitors see who follows you and who you follow" checked={p.showFollowersOnPublic !== false} onToggle={(v)=> onChange({ ...p, showFollowersOnPublic: v })} />
        <Toggle label="Email notifications" desc="Receive updates about applications & scholarships" checked={p.emailNotifications} onToggle={(v)=> onChange({ ...p, emailNotifications: v })} />
      </div>
    </div>
  );
}
