import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function BadgeRow({ user }){
  const email = user?.email;
  const baseURL = import.meta.env.VITE_server_url || "https://server-six-vert.vercel.app";
  const reputation = typeof user?.reputation === "number" ? user.reputation : 0;

  const { data: qCount } = useQuery({
    queryKey: ["badge-q", email],
    enabled: Boolean(email),
    queryFn: async ()=>{
      const res = await axios.get(`${baseURL}/questions`, { params: { authorEmail: email, limit:1 } });
      return res.data?.total ?? 0;
    }
  });

  const badges = [
    { key:"firstQ", label:"First Question", desc:"Asked your first question", unlocked: (qCount||0) > 0 },
    { key:"firstA", label:"First Answer", desc:"Posted your first answer", unlocked: reputation >= 3 || reputation >0 },
    { key:"helpful", label:"Helpful Answer", desc:"Your answer got an upvote", unlocked: reputation >= 10 },
    { key:"sourced", label:"Sourced Answer", desc:"Answer with source link", unlocked: reputation >= 3 },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(b=> (
        <span key={b.key} title={b.desc} className={`badge ${b.unlocked ? "badge-primary" : "badge-ghost opacity-50"} gap-1`}>
          {b.unlocked ? "✓" : "○"} {b.label}
        </span>
      ))}
    </div>
  );
}
