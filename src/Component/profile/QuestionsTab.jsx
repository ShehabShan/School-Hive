import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { QuestionListItem } from "../QA/QuestionCard";

export default function QuestionsTab({ email, enabled }) {
  const axiosPublic = useAxiosPublic();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile-questions", email],
    enabled: !!email && enabled,
    queryFn: async () => {
      const res = await axiosPublic.get("/questions", { params: { authorEmail: email, limit: 20 } });
      return res.data;
    },
  });

  if (!enabled) return null;
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <div className="h-4 w-3/4 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-full rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }
  if (isError) return <p className="rounded-2xl bg-white p-6 text-sm text-rose-600 ring-1 ring-slate-100">Failed to load questions.</p>;
  const list = data?.data || [];
  if (!list.length) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-100">
        <p className="text-sm font-semibold text-slate-700">No questions yet</p>
        <p className="mt-1 text-xs text-slate-500">Questions they ask will show here.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {list.map((q) => (
        <QuestionListItem key={q._id} q={q} />
      ))}
    </div>
  );
}
