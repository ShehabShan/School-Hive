import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, Ellipsis, VolumeX, Settings, Loader2, Inbox } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import useNotifications from "../../Hooks/useNotifications";
import toast from "react-hot-toast";
import { TYPE_META, FALLBACK_META, FILTERS, timeAgo, getNotificationLink } from "../../lib/notificationMeta";

const PAGE_LIMIT = 15;

function useNotificationsPage(page) {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", "me", "paged", page],
    enabled: !!user,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/notifications/me?page=${page}&limit=${PAGE_LIMIT}`);
      return data;
    },
  });
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { unread, markAllRead, markRead } = useNotifications();
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServer, setTotalServer] = useState(0);
  const [menuId, setMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState(null);

  const paged = useNotificationsPage(page);
  const data = paged.data;
  const isLoading = paged.isLoading;
  const isFetching = paged.isFetching;

  // accumulate pages for Load more — dedup by _id to avoid duplicates on refetch
  useEffect(() => {
    if (!data) return;
    setTotalPages(data.totalPages || 1);
    setTotalServer(data.total || 0);
    const incoming = data.data || [];
    if (page === 1) setAccumulated(incoming);
    else setAccumulated((prev) => {
      const map = new Map(prev.map((x) => [String(x._id), x]));
      for (const n of incoming) map.set(String(n._id), n);
      // preserve order: prev order + new arrivals appended, but update existing in place
      const merged = [...prev];
      for (const n of incoming) {
        const idx = merged.findIndex((x) => String(x._id) === String(n._id));
        if (idx === -1) merged.push(n);
        else merged[idx] = n;
      }
      return merged;
    });
  }, [data, page]);

  // invalidate sync: when page query refetches, keep accumulated in sync via above
  const filtered = useMemo(() => {
    const f = FILTERS.find((x) => x.key === activeFilter);
    if (!f || activeFilter === "all") return accumulated;
    return accumulated.filter((n) => f.match(n));
  }, [accumulated, activeFilter]);

  const counts = useMemo(() => {
    const c = { all: accumulated.length };
    for (const f of FILTERS) if (f.key !== "all") c[f.key] = accumulated.filter((n) => f.match(n)).length;
    return c;
  }, [accumulated]);

  const { mutate: mute } = useMutation({
    mutationFn: async ({ type, questionId, scholarshipId }) => {
      const body = {};
      if (type) body.type = type;
      if (questionId) body.questionId = String(questionId);
      if (scholarshipId) body.scholarshipId = String(scholarshipId);
      return axiosSecure.patch("/notifications/preferences/mute", body);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setPage(1);
      setAccumulated([]);
      paged.refetch();
      setMenuId(null);
      setMenuPos(null);
      const label = vars.type || (vars.questionId ? "this question" : vars.scholarshipId ? "this scholarship" : "notification");
      toast((t) => (
        <span className="flex items-center gap-2 text-sm">
          <span>Muted {label}</span>
          <button
            onClick={async () => {
              try {
                await axiosSecure.patch("/notifications/preferences/unmute", vars.type ? { type: vars.type } : vars.questionId ? { questionId: vars.questionId } : { scholarshipId: vars.scholarshipId });
                queryClient.invalidateQueries({ queryKey: ["notifications"] });
                setPage(1); setAccumulated([]); paged.refetch();
                toast.success("Unmuted");
              } catch (e) { toast.error(e?.response?.data?.message || "Unmute failed"); }
              toast.dismiss(t.id);
            }}
            className="rounded bg-slate-900 px-2 py-1 text-xs font-bold text-white hover:bg-black"
          >Undo</button>
        </span>
      ), { duration: 4000 });
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Mute failed"),
  });

  const openMenu = (e, id) => {
    e.stopPropagation();
    if (menuId === String(id)) { setMenuId(null); setMenuPos(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    let top = rect.bottom + 8;
    const menuH = 92;
    if (top + menuH > window.innerHeight - 12) top = rect.top - menuH - 8;
    if (top < 12) top = 12;
    let left = rect.right - 224;
    if (left < 8) left = 8;
    if (left + 224 > window.innerWidth - 8) left = window.innerWidth - 224 - 8;
    setMenuPos({ top, left });
    setMenuId(String(id));
  };

  useEffect(() => {
    const onDown = (e) => {
      if (e.target.closest("[data-notification-menu]") || e.target.closest("[data-kebab-btn]")) return;
      if (menuId) { setMenuId(null); setMenuPos(null); }
    };
    const onEsc = (e) => { if (e.key === "Escape") { setMenuId(null); setMenuPos(null); } };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onEsc); };
  }, [menuId]);

  const handleItemClick = (n) => {
    if (!n.read) {
      markRead(n._id);
      setAccumulated((prev) => prev.map((x) => String(x._id) === String(n._id) ? { ...x, read: true } : x));
    }
    setMenuId(null); setMenuPos(null);
    const link = getNotificationLink(n);
    navigate(link);
  };

  const handleMarkAllRead = () => {
    markAllRead();
    setAccumulated((prev) => prev.map((x) => ({ ...x, read: true })));
  };

  const handleLoadMore = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    // keep accumulated, just filter client-side. No page reset needed.
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Notifications</h1>
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={handleMarkAllRead}
            disabled={!unread}
            className="font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
          >
            <CheckCheck className="h-4 w-4" /> Mark All As Read
          </button>
          <span className="text-slate-300">·</span>
          <Link to="/notifications/preferences" className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters sidebar */}
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          {/* Mobile pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 lg:hidden scrollbar-thin">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${activeFilter === f.key ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"}`}
              >
                {f.label} {f.key !== "all" && counts[f.key] > 0 ? `· ${counts[f.key]}` : f.key === "all" ? `· ${totalServer || counts.all}` : ""}
              </button>
            ))}
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-extrabold text-slate-900">Filters</p>
            </div>
            <nav className="p-2" aria-label="Notification filters">
              {FILTERS.map((f) => {
                const active = activeFilter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => handleFilterChange(f.key)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"}`}
                    aria-current={active ? "true" : undefined}
                  >
                    <span>{f.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600"}`}>{f.key === "all" ? totalServer || counts.all : counts[f.key] || 0}</span>
                  </button>
                );
              })}
            </nav>
            <div className="border-t border-slate-100 px-4 py-3">
              <p className="text-xs leading-relaxed text-slate-500">Filters use your existing data. Scholarship types appear once activity exists. Manage muted types in <Link to="/notifications/preferences" className="font-semibold text-brand-600 hover:underline">Settings</Link>.</p>
            </div>
          </div>
        </aside>

        {/* Feed */}
        <section className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {isLoading ? (
              <div className="divide-y divide-slate-100">
                {[0,1,2].map((i) => (
                  <div key={i} className="flex gap-3 px-4 py-4 animate-pulse">
                    <div className="h-8 w-8 rounded-lg bg-slate-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-slate-100" />
                      <div className="h-3 w-1/2 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><Inbox className="h-6 w-6" /></span>
                <p className="mt-4 text-sm font-bold text-slate-900">No notifications yet</p>
                <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                  {activeFilter === "all" ? "Activity on your questions, answers, applications, reviews and scholarships will show up here." : `No ${FILTERS.find(f=>f.key===activeFilter)?.label || ""} notifications. Try another filter.`}
                </p>
                {activeFilter !== "all" && (
                  <button onClick={() => setActiveFilter("all")} className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-black">Show all</button>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-slate-100" role="list">
                {filtered.map((n) => {
                  const meta = TYPE_META[n.type] || FALLBACK_META;
                  const isMenuOpen = menuId === String(n._id);
                  // subtitle context line
                  const context = (() => {
                    if (n.payload?.scholarshipName) return `${n.payload.scholarshipName}`;
                    if (n.payload?.questionTitle) return `${n.payload.questionTitle}`;
                    return n.type?.replace(/_/g, " ");
                  })();
                  return (
                    <li key={n._id} className={`relative flex items-stretch ${n.read ? "bg-white" : "bg-brand-50/40"}`}>
                      <button
                        onClick={() => handleItemClick(n)}
                        className="flex min-w-0 flex-1 items-start gap-3 px-4 py-4 text-left hover:bg-slate-50 transition"
                      >
                        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${meta.tone}`}>
                          <meta.Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-medium text-slate-500 truncate" title={`${n.actorEmail || "System"} · ${context}`}>
                            {[n.actorEmail, context].filter(Boolean).join(" · ")} {n.createdAt ? `· ${timeAgo(n.createdAt)}` : ""}
                          </span>
                          <span className={`mt-1 block text-sm leading-snug ${n.read ? "font-medium text-slate-700" : "font-bold text-slate-900"}`} title={meta.text(n)}>
                            {meta.text(n)}
                          </span>
                          {n.payload?.scholarshipName && n.payload?.questionTitle ? (
                            <span className="mt-1 block text-xs text-slate-500 truncate">{n.payload.questionTitle}</span>
                          ) : null}
                        </span>
                        {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-hidden />}
                      </button>
                      <button
                        data-kebab-btn
                        aria-label="Notification options"
                        aria-haspopup="menu"
                        aria-expanded={isMenuOpen}
                        onClick={(e) => openMenu(e, n._id)}
                        className="flex w-11 shrink-0 items-center justify-center border-l border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                      >
                        <Ellipsis className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Load more */}
          {!isLoading && filtered.length > 0 && page < totalPages && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isFetching}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isFetching ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
          {!isLoading && accumulated.length > 0 && filtered.length > 0 && (
            <p className="mt-3 text-center text-xs text-slate-400">
              Showing {filtered.length} of {totalServer} notifications · page {page} of {totalPages}
            </p>
          )}
        </section>
      </div>

      {menuId && menuPos && createPortal(
        <div data-notification-menu role="menu" style={{ position: "fixed", top: menuPos.top, left: menuPos.left, width: 224 }} className="z-[100] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl" onClick={(e)=>e.stopPropagation()}>
          {(() => {
            const n = accumulated.find((x)=>String(x._id)===String(menuId));
            if (!n) return null;
            const qid = n.payload?.questionId;
            const sid = n.payload?.scholarshipId;
            return (
              <>
                <button role="menuitem" disabled={!qid && !sid} onClick={() => {
                  if (qid) mute({ questionId: qid });
                  else if (sid) mute({ scholarshipId: sid });
                  else toast.error("Nothing to mute for this notification");
                }} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <VolumeX className="h-4 w-4 text-slate-500" /> Mute this {qid ? "question" : sid ? "scholarship" : "item"}
                </button>
                <div className="border-t border-slate-100" />
                <button role="menuitem" onClick={()=> mute({ type: n.type })} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <VolumeX className="h-4 w-4 text-slate-500" /> Mute {n.type || "this type"}
                </button>
              </>
            );
          })()}
        </div>,
        document.body
      )}
    </div>
  );
}
