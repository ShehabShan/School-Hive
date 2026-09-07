import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, MessagesSquare, CheckCircle2, UserPlus, Ellipsis, VolumeX } from "lucide-react";
import useNotifications from "../../Hooks/useNotifications";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";

const TYPE_META = {
  question_answered: { Icon: MessagesSquare, tone: "bg-brand-50 text-brand-600", text: (n) => `${n.actorEmail || "Someone"} answered "${n.payload?.questionTitle || "your question"}"` },
  answer_accepted: { Icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600", text: (n) => `Your answer on "${n.payload?.questionTitle || "a question"}" was accepted` },
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
  const [menuId, setMenuId] = useState(null);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { notifications, unread, markRead, markAllRead } = useNotifications();

  useEffect(() => {
    const onDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
        setMenuId(null);
      } else if (menuId && !e.target.closest("[data-notification-menu]") && !e.target.closest("[data-kebab-btn]")) {
        setMenuId(null);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        if (menuId) setMenuId(null);
        else setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuId]);

  const { mutate: mute } = useMutation({
    mutationFn: async ({ type, questionId }) => {
      const body = {};
      if (type) body.type = type;
      if (questionId) body.questionId = String(questionId);
      return axiosSecure.patch("/notifications/preferences/mute", body);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      const isType = !!vars.type;
      const label = isType ? vars.type : "this question";
      toast(
        (t) => (
          <span className="flex items-center gap-2 text-sm">
            <span>Muted {label}</span>
            <button
              onClick={() => {
                unmute(vars);
                toast.dismiss(t.id);
              }}
              className="rounded bg-slate-900 px-2 py-1 text-xs font-bold text-white hover:bg-black"
            >
              Undo
            </button>
          </span>
        ),
        { duration: 4000 }
      );
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Mute failed"),
  });

  const { mutate: unmute } = useMutation({
    mutationFn: async ({ type, questionId }) => {
      const body = {};
      if (type) body.type = type;
      if (questionId) body.questionId = String(questionId);
      return axiosSecure.patch("/notifications/preferences/unmute", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Unmuted");
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Unmute failed"),
  });

  const handleItemClick = (n) => {
    if (!n.read) markRead(n._id);
    setOpen(false);
    setMenuId(null);
    if (n.payload?.questionId) navigate(`/questions/${n.payload.questionId}`);
  };

  const handleMuteQuestion = (n) => {
    const qid = n.payload?.questionId;
    if (!qid) {
      toast.error("No question to mute");
      return;
    }
    mute({ questionId: qid });
    setMenuId(null);
  };

  const handleMuteType = (n) => {
    if (!n.type) return;
    mute({ type: n.type });
    setMenuId(null);
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
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-slate-100 sm:w-96" role="dialog" aria-label="Notifications">
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
            <ul className="max-h-96 overflow-y-auto" role="menu" aria-label="Notifications list">
              {notifications.map((n) => {
                const meta = TYPE_META[n.type] || { Icon: Bell, tone: "bg-slate-100 text-slate-500", text: () => "New activity" };
                const isMenuOpen = menuId === String(n._id);
                return (
                  <li key={n._id} role="none" className="relative flex items-stretch border-b border-slate-50 last:border-0 group">
                    <button
                      role="menuitem"
                      onClick={() => handleItemClick(n)}
                      className={`flex flex-1 items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${n.read ? "" : "bg-brand-50/40"}`}
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
                    <button
                      data-kebab-btn
                      aria-label="Mute options"
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuId(isMenuOpen ? null : String(n._id));
                      }}
                      className="flex w-10 shrink-0 items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-700 focus-visible:bg-slate-50 opacity-60 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
                    >
                      <Ellipsis className="h-4 w-4" />
                    </button>
                    {isMenuOpen && (
                      <div
                        data-notification-menu
                        role="menu"
                        className="absolute right-2 top-[46px] z-20 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          role="menuitem"
                          disabled={!n.payload?.questionId}
                          onClick={() => handleMuteQuestion(n)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <VolumeX className="h-4 w-4 text-slate-500" /> Mute this question
                        </button>
                        <div className="border-t border-slate-100" />
                        <button
                          role="menuitem"
                          onClick={() => handleMuteType(n)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <VolumeX className="h-4 w-4 text-slate-500" /> Mute {n.type || "this type"}
                        </button>
                      </div>
                    )}
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
