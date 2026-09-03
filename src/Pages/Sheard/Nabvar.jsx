import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  GraduationCap,
  LogOut,
  Menu,
  MessageCircleQuestion,
  Sparkles,
  UserCircle2,
  X,
  Search,
  Plus,
  BadgeCheck,
  Compass,
  Clock,
} from "lucide-react";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import { cn } from "../../lib/cn";

const navLinkClass = ({ isActive }) =>
  cn(
    "rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-200",
    isActive
      ? "bg-slate-900 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  );

const softLinkClass = ({ isActive }) =>
  cn(
    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-brand-50 text-brand-700 ring-1 ring-brand-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  );

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { isAdmin, isModaretor, isInstitution, isPending, isRejected } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [qaOpen, setQaOpen] = useState(false);
  const [mobileQaOpen, setMobileQaOpen] = useState(false);
  const profileRef = useRef(null);
  const qaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    const handleEsc = (e) => { if (e.key === "Escape") setProfileOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [profileOpen]);

  useEffect(() => {
    if (!qaOpen) return;
    const handleClickOutside = (e) => {
      if (qaRef.current && !qaRef.current.contains(e.target)) setQaOpen(false);
    };
    const handleEsc = (e) => { if (e.key === "Escape") setQaOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [qaOpen]);

  const handleSignOut = () => {
    setProfileOpen(false);
    logOut().then(() => navigate("/registration")).catch(() => navigate("/registration"));
  };

  const dashboardLink = isInstitution
    ? isRejected ? "/rejectedApproval" : isPending ? "/pendingApproval" : "/institutionDashboard/myProfile"
    : isAdmin ? "/adminDashboard/adminProfile"
    : isModaretor ? "/modaratorDashboard/myProfile"
    : "/userDashboard/myProfile";

  const dashboardLabel = isInstitution
    ? isRejected || isPending ? "Institution Status" : "Institution Dashboard"
    : isAdmin ? "Admin Dashboard"
    : isModaretor ? "Moderator Dashboard"
    : "User Dashboard";

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.3)]">
      <div className="h-[2px] bg-gradient-to-r from-brand-600 via-indigo-500 to-amber-400" />
      <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="group flex shrink-0 items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-600 text-white shadow-lg ring-1 ring-brand-600/20 transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <span className="text-[18px] font-extrabold tracking-tight text-slate-900">School<span className="text-brand-600">Hive</span></span>
            <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">Study Abroad</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/allScholership" className={navLinkClass} onClick={() => setMobileOpen(false)}>Scholarships</NavLink>

          {/* Q&A dropdown — pro UX */}
          <div className="relative" ref={qaRef}>
            <button
              onClick={() => setQaOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={qaOpen}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                qaOpen ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <MessageCircleQuestion className="h-4 w-4" /> Q&A
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", qaOpen && "rotate-180")} />
              <span className="ml-1 hidden rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-slate-900 xl:inline-flex">NEW</span>
            </button>
            {qaOpen && (
              <div className="absolute left-1/2 top-[calc(100%+12px)] z-50 w-[360px] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="bg-gradient-to-br from-brand-50 via-indigo-50 to-white px-5 py-4">
                  <p className="text-xs font-extrabold tracking-widest text-brand-700 uppercase">Q&A Forum</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Ask, answer, get verified — knowledge that compounds.</p>
                </div>
                <div className="p-2">
                  <Link to="/questions" onClick={() => setQaOpen(false)} className="flex gap-3 rounded-xl p-3 hover:bg-slate-50" role="menuitem">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white"><Compass className="h-4 w-4" /></span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-slate-900">Browse Q&A</span>
                      <span className="block text-xs text-slate-500 line-clamp-1">Search by category, country, tag, level — debounced 400ms</span>
                    </span>
                  </Link>
                  <Link to="/questions/ask" onClick={() => setQaOpen(false)} className="flex gap-3 rounded-xl bg-brand-600 p-3 text-white hover:bg-brand-700" role="menuitem">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20"><Plus className="h-5 w-5" /></span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">Ask a Question</span>
                      <span className="block text-xs text-white/80 line-clamp-1">Title + category + tags + context — duplicate check live</span>
                    </span>
                  </Link>
                  <div className="my-2 border-t border-slate-100" />
                  <Link to="/verify" onClick={() => setQaOpen(false)} className="flex gap-3 rounded-xl p-3 hover:bg-slate-50" role="menuitem">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"><BadgeCheck className="h-4 w-4" /></span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900">Get Verified</span>
                      <span className="block text-xs text-slate-500">Student ID / admission letter — badge on answers</span>
                    </span>
                  </Link>
                  <div className="grid grid-cols-2 gap-2 px-1 pt-1">
                    <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-500 ring-1 ring-slate-200"><Search className="h-3.5 w-3.5" /> My Questions <span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">soon</span></span>
                    <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-500 ring-1 ring-slate-200"><Clock className="h-3.5 w-3.5" /> Trending <span className="ml-auto rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">soon</span></span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5 text-xs">
                  <span className="font-medium text-slate-500">Future: Saved Q&A • Following • Leaderboard</span>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/aboutUs" className={softLinkClass} onClick={() => setMobileOpen(false)}>About</NavLink>
          <NavLink to="/contact" className={softLinkClass} onClick={() => setMobileOpen(false)}>Contact</NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Desktop Ask CTA — secondary to dropdown but keeps 1-click */}
          <Link to="/questions/ask" className="hidden items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-black lg:inline-flex">
            <Plus className="h-4 w-4" /> Ask
          </Link>

          {!user ? (
            <Link to="/signIn" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:from-brand-700 hover:to-indigo-700">
              <UserCircle2 className="h-4 w-4" /> Sign In
            </Link>
          ) : (
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 shadow-sm hover:bg-slate-50" aria-haspopup="menu" aria-expanded={profileOpen}>
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 text-sm font-extrabold text-white">
                  {user?.photoURL ? <img src={user.photoURL} alt={user?.displayName || "Profile"} className="h-full w-full object-cover" /> : user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className="hidden max-w-[120px] truncate text-sm font-semibold text-slate-800 md:block">{user?.displayName?.split(" ")[0]}</span>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl" role="menu">
                  <div className="px-4 py-3">
                    <p className="truncate text-sm font-bold text-slate-900">{user?.displayName}</p>
                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    <span className="mt-1 inline-flex rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white">{dashboardLabel}</span>
                  </div>
                  <div className="border-t border-slate-100" />
                  <Link to={dashboardLink} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" role="menuitem">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100"><UserCircle2 className="h-4 w-4" /></span> {dashboardLabel}
                  </Link>
                  <Link to="/saved" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50" role="menuitem"><Sparkles className="h-4 w-4 text-slate-400" /> Saved Scholarships</Link>
                  <div className="my-1 border-t border-slate-100" />
                  <p className="px-4 py-1 text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">Q&A</p>
                  <Link to="/questions" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" role="menuitem"><Compass className="h-4 w-4 text-slate-400" /> Browse Q&A</Link>
                  <Link to="/questions/ask" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" role="menuitem"><Plus className="h-4 w-4 text-slate-400" /> Ask Question</Link>
                  <Link to="/verify" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" role="menuitem"><BadgeCheck className="h-4 w-4 text-slate-400" /> Get Verified</Link>
                  <div className="mx-4 my-2 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 px-3 py-2.5 text-xs font-semibold text-white">
                    <p className="font-bold">Q&A is live — knowledge compounds</p>
                    <p className="text-white/80">Browse, ask, earn reputation, get Verified.</p>
                  </div>
                  <button onClick={handleSignOut} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50" role="menuitem"><LogOut className="h-4 w-4" /> Sign Out</button>
                </div>
              )}
            </div>
          )}

          <button onClick={() => setMobileOpen((o) => !o)} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm lg:hidden" aria-label="Toggle navigation" aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <nav className="border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-4 shadow-lg lg:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={({ isActive }) => cn("rounded-xl px-3 py-2.5 text-sm font-semibold", isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100")} onClick={() => setMobileOpen(false)}>Home</NavLink>
            <NavLink to="/allScholership" className={({ isActive }) => cn("rounded-xl px-3 py-2.5 text-sm font-semibold", isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100")} onClick={() => setMobileOpen(false)}>Scholarships</NavLink>

            <button onClick={() => setMobileQaOpen((v) => !v)} className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white">
              <span className="inline-flex items-center gap-2"><MessageCircleQuestion className="h-4 w-4" /> Q&A Forum</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", mobileQaOpen && "rotate-180")} />
            </button>
            {mobileQaOpen && (
              <div className="ml-2 flex flex-col gap-1 border-l-2 border-slate-100 pl-3">
                <NavLink to="/questions" className={({ isActive }) => cn("rounded-lg px-3 py-2 text-sm", isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50")} onClick={() => setMobileOpen(false)}>Browse Q&A</NavLink>
                <NavLink to="/questions/ask" className={({ isActive }) => cn("rounded-lg px-3 py-2 text-sm font-bold", isActive ? "bg-brand-600 text-white" : "bg-slate-900 text-white")} onClick={() => setMobileOpen(false)}>Ask a Question</NavLink>
                <NavLink to="/verify" className={({ isActive }) => cn("rounded-lg px-3 py-2 text-sm", isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50")} onClick={() => setMobileOpen(false)}>Get Verified</NavLink>
                <span className="px-3 py-1 text-xs font-medium text-slate-400">My Questions • Trending — soon</span>
              </div>
            )}

            <NavLink to="/aboutUs" className={({ isActive }) => cn("rounded-xl px-3 py-2.5 text-sm font-semibold", isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100")} onClick={() => setMobileOpen(false)}>About Us</NavLink>
            <NavLink to="/contact" className={({ isActive }) => cn("rounded-xl px-3 py-2.5 text-sm font-semibold", isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100")} onClick={() => setMobileOpen(false)}>Contact</NavLink>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
