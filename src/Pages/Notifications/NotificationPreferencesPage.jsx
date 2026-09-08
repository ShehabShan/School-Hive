import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, VolumeX, Trash2 } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function NotificationPreferencesPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const prefsQuery = useQuery({
    queryKey: ["notifications", "preferences"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/notifications/preferences");
      return data.data || { mutedTypes: [], mutedQuestionIds: [], mutedScholarshipIds: [] };
    },
  });

  const { mutate: unmute } = useMutation({
    mutationFn: async ({ type, questionId, scholarshipId }) => {
      const body = {};
      if (type) body.type = type;
      if (questionId) body.questionId = String(questionId);
      if (scholarshipId) body.scholarshipId = String(scholarshipId);
      return axiosSecure.patch("/notifications/preferences/unmute", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "preferences"] });
      toast.success("Unmuted");
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Unmute failed"),
  });

  const mutes = prefsQuery.data || { mutedTypes: [], mutedQuestionIds: [], mutedScholarshipIds: [] };

  return (
    <div className="mx-auto max-w-[720px] px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/notifications" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to notifications
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">Notification settings</h1>
      <p className="mt-2 text-sm text-slate-500">Mute types or specific threads. Muted items are hidden from your feed but you can unmute anytime. Preferences are stored per account.</p>

      {prefsQuery.isLoading ? (
        <div className="mt-8 space-y-3">
          <div className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900">Muted types</h2>
            {(!mutes.mutedTypes || mutes.mutedTypes.length === 0) ? (
              <p className="mt-3 text-sm text-slate-500">No types muted. Use the ··· menu on a notification to mute a type.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 border rounded-xl overflow-hidden">
                {mutes.mutedTypes.map((t) => (
                  <li key={t} className="flex items-center justify-between px-4 py-3">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-700"><VolumeX className="h-4 w-4 text-slate-400" /> {t}</span>
                    <button onClick={() => unmute({ type: t })} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      <Trash2 className="h-3.5 w-3.5" /> Unmute
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900">Muted questions</h2>
            {(!mutes.mutedQuestionIds || mutes.mutedQuestionIds.length === 0) ? (
              <p className="mt-3 text-sm text-slate-500">No questions muted.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 border rounded-xl overflow-hidden">
                {mutes.mutedQuestionIds.map((id) => (
                  <li key={id} className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs font-mono text-slate-600 truncate max-w-[220px]">{id}</span>
                    <button onClick={() => unmute({ questionId: id })} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      <Trash2 className="h-3.5 w-3.5" /> Unmute
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-extrabold text-slate-900">Muted scholarships</h2>
            {(!mutes.mutedScholarshipIds || mutes.mutedScholarshipIds.length === 0) ? (
              <p className="mt-3 text-sm text-slate-500">No scholarships muted.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 border rounded-xl overflow-hidden">
                {mutes.mutedScholarshipIds.map((id) => (
                  <li key={id} className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs font-mono text-slate-600 truncate max-w-[220px]">{id}</span>
                    <button onClick={() => unmute({ scholarshipId: id })} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      <Trash2 className="h-3.5 w-3.5" /> Unmute
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
