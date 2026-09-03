import RoleBadge from "../profile/RoleBadge";

function formatDate(d){
  try{ return new Date(d).toLocaleDateString(); } catch{ return ""; }
}

function MarkdownBody({ text }){
  // simple markdown image render: ![alt](url) -> <img>
  const parts = String(text||"").split(/(!\[.*?\]\(.*?\))/g);
  return (
    <div className="prose max-w-none whitespace-pre-wrap text-sm">
      {parts.map((p,i)=>{
        const m = p.match(/!\[(.*?)\]\((.*?)\)/);
        if(m) return <img key={i} src={m[2]} alt={m[1]} className="my-2 max-w-full rounded border" loading="lazy" />;
        // linkify http urls
        const linkParts = p.split(/(https?:\/\/[^\s]+)/g);
        return <span key={i}>{linkParts.map((lp,ji)=> /https?:\/\//.test(lp) ? <a key={ji} href={lp} target="_blank" rel="noreferrer" className="link">{lp}</a> : lp)}</span>;
      })}
    </div>
  );
}

export default function AnswerCard({ answer, isAsker, onAccept, accepting }){
  const role = answer.authorRole;
  const isStaff = ["admin","superadmin","modaretor"].includes(role);
  const badgeRole = isStaff ? role : role==="institution" ? "institution" : null;
  const isAccepted = Boolean(answer.accepted);

  return (
    <div className={`card bg-base-100 shadow-sm border ${isAccepted ? "border-emerald-300 bg-emerald-50/30" : ""}`}>
      <div className="card-body p-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{answer.authorEmail}</span>
          {badgeRole && <RoleBadge role={badgeRole} size="sm" />}
          {isAccepted && <span className="badge badge-success badge-sm gap-1">✓ Accepted</span>}
          <span className="ml-auto text-xs opacity-60">{formatDate(answer.createdAt)} • score {answer.voteScore ?? 0}</span>
        </div>
        <MarkdownBody text={answer.body} />
        {answer.sourceLink && <a href={answer.sourceLink} target="_blank" rel="noreferrer" className="link text-xs mt-2 block">{answer.sourceLink}</a>}
        {(answer.downvoteReasons||[]).length>0 && <div className="text-xs opacity-60 mt-1">Downvote reasons: {(answer.downvoteReasons||[]).join(", ")}</div>}
        {isAsker && !isAccepted && (
          <button onClick={()=>onAccept(answer._id)} disabled={accepting} className="btn btn-sm btn-success mt-3">
            {accepting ? "..." : "Mark as Accepted"}
          </button>
        )}
      </div>
    </div>
  );
}
