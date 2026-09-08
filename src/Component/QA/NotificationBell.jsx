import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useNotifications from "../../Hooks/useNotifications";

export default function NotificationBell() {
  const navigate = useNavigate();
  const { unread } = useNotifications();
  return (
    <button
      onClick={() => navigate("/notifications")}
      className="relative text-slate-700 hover:bg-slate-100 p-2 rounded-xl"
      aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-brand-600 px-1 text-[10px] font-medium text-white flex items-center justify-center">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );
}
