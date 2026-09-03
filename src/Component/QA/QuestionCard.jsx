import { Link } from "react-router-dom";
import { tagLabel } from "../../constants/qa";

export function QuestionCard({ q }){
  return (
    <Link to={`/questions/${q._id}`} className="card bg-base-100 shadow-sm border hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <h3 className="font-semibold line-clamp-2">{q.title}</h3>
        <p className="text-sm opacity-70 line-clamp-2 mt-1">{String(q.body||"").slice(0,120)}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="badge badge-outline badge-sm">{q.category}</span>
          {(q.tags||[]).slice(0,3).map(t=> <span key={t} className="badge badge-ghost badge-sm">{tagLabel(t)}</span>)}
        </div>
        <div className="mt-2 flex flex-wrap gap-1 text-xs opacity-60">
          {q.context?.destinationCountry && <span>{q.context.destinationCountry}</span>}
          {q.context?.homeCountry && <span>• {q.context.homeCountry}</span>}
          {q.context?.studyLevel && <span>• {q.context.studyLevel}</span>}
        </div>
        <div className="mt-2 text-xs opacity-60">score {q.voteScore ?? 0} • views {q.viewCount ?? 0} • {q.answersCount ?? (q.answers?.length ?? 0)} answers • {new Date(q.createdAt).toLocaleDateString()}</div>
      </div>
    </Link>
  );
}

export function QuestionListItem({ q }){
  return (
    <Link to={`/questions/${q._id}`} className="flex gap-4 p-4 bg-base-100 border rounded-xl hover:bg-base-200">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold">{q.title}</h3>
        <p className="text-sm opacity-70 line-clamp-1">{String(q.body||"").slice(0,160)}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span className="badge badge-outline badge-sm">{q.category}</span>
          {(q.tags||[]).slice(0,4).map(t=> <span key={t} className="badge badge-ghost badge-sm">{tagLabel(t)}</span>)}
        </div>
      </div>
      <div className="text-xs opacity-60 shrink-0 text-right">
        <div>{q.voteScore ?? 0} votes</div>
        <div>{q.viewCount ?? 0} views</div>
      </div>
    </Link>
  );
}
