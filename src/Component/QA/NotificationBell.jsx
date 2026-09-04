import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, MessageSquareQuestion, CheckCircle2, MessageCircle, Reply, UserPlus } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const TYPE_META = {
  question_answered: { Icon: MessageSquareQuestion, tone: "bg-brand-50 text-brand-600", text: (n) => `${n.actorEmail || "Someone"} answered "${n.payload?.questionTitle || "your question"}"` },
  answer_accepted: { Icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600", text: (n) => `Your answer on "${n.payload?.questionTitle || "a question"}" was accepted` },
  question_comment: { Icon: MessageCircle, tone: "bg-sky-50 text-sky-600", text: (n) => `${n.actorEmail || "Someone"} commented on "${n.payload?.questionTitle || "your question"}"` },
  comment_reply: { Icon: Reply, tone: "bg-sky-50 text-sky-600", text: (n) => `${n.actorEmail || "Someone"} replied to your comment on "${n.payload?.questionTitle || "a question"}"` },
  question_followed: { Icon: UserPlus, tone: "bg-amber-50 text-amber-600", text: (n) => `${n.actorEmail || "Someone"} is following "${n.payload?.questionTitle || "your question"}"` },
};

const timeAgo = (date) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: resp } = useQuery({
    queryKey: ["notifications", "me"],
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
    queryFn: async () => {
      const { data } = await axiosSecure.get("/notifications/me?limit=10");
      return data;
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const { mutate: markRead } = useMutation({
    mutationFn: async (id) => axiosSecure.patch(`/notifications/read/${id}`),
    onSuccess: invalidate,
  });
  const { mutate: markAllRead } = useMutation({
    mutationFn: async () => axiosSecure.patch("/notifications/read-all"),
    onSuccess: invalidate,
  });

  useEffect(() => {
    const onDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const notifications = resp?.data || [];
  const unread = resp?.unreadCount || 0;

  const handleItemClick = (n) => {
    if (!n.read) markRead(n._id);
    setOpen(false);
    if (n.payload?.questionId) navigate(`/questions/${n.payload.questionId}`);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-slate-700 hover:bg-slate-100 p-2 rounded-xl"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-brand-600 px-1 text-[10px] font-medium text-white flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-slate-100 sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-extrabold text-slate-900">Notifications</p>
            {unread > 0 && (
              <button onClick={() => markAllRead()} className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-slate-500">No notifications yet — activity on your questions and answers will show up here.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((n) => {
                const meta = TYPE_META[n.type] || { Icon: Bell, tone: "bg-slate-100 text-slate-500", text: () => "New activity" };
                return (
                  <li key={n._id}>
                    <button
                      onClick={() => handleItemClick(n)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${n.read ? "" : "bg-brand-50/40"}`}
                    >
                      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.tone}`}>
                        <meta.Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-sm ${n.read ? "text-slate-600" : "font-semibold text-slate-900"}`}>{meta.text(n)}</span>
                        <span className="mt-0.5 block text-xs text-slate-400">{n.createdAt ? timeAgo(n.createdAt) : ""}</span>
                      </span>
                      {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
