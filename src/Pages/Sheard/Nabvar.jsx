import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  GraduationCap,
  LogOut,
  Menu,
  Sparkles,
  UserCircle2,
  X,
} from "lucide-react";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import { cn } from "../../lib/cn";

const navLinkClass = ({ isActive }) =>
  cn(
    "rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200",
    isActive
      ? "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100"
      : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900"
  );

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { isAdmin, isModaretor, isUser } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    const handleEsc = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [profileOpen]);

  const handleSignOut = () => {
    setProfileOpen(false);
    logOut()
      .then(() => navigate("/"))
      .catch(() => {});
  };

  const dashboardLink = isAdmin
    ? "/adminDashboard/adminProfile"
    : isModaretor
    ? "/modaratorDashboard/myProfile"
    : "/userDashboard/myProfile";

  const dashboardLabel = isAdmin
    ? "Admin Dashboard"
    : isModaretor
    ? "Moderator Dashboard"
    : "User Dashboard";

  const links = (
    <>
      <li>
        <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/allScholership"
          className={navLinkClass}
          onClick={() => setMobileOpen(false)}
        >
          Scholarships
        </NavLink>
      </li>
      <li>
        <NavLink to="/aboutUs" className={navLinkClass} onClick={() => setMobileOpen(false)}>
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={navLinkClass} onClick={() => setMobileOpen(false)}>
          Contact
        </NavLink>
      </li>
      {(isUser || isModaretor || isAdmin) && (
        <li>
          <NavLink
            to={dashboardLink}
            className={navLinkClass}
            onClick={() => setMobileOpen(false)}
          >
            {dashboardLabel}
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="h-0.5 bg-gradient-to-r from-brand-600 via-indigo-400 to-amber-300" />
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white shadow-soft transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="hidden text-xl font-extrabold tracking-tight text-slate-900 sm:block">
            School<span className="text-brand-600">Hive</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center lg:flex" aria-label="Main navigation">
          <ul className="flex items-center gap-1">{links}</ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {!user ? (
            <Link
              to="/signIn"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:from-brand-700 hover:to-brand-800 hover:shadow-lift sm:px-5"
            >
              <UserCircle2 className="h-4 w-4" />
              Sign In
            </Link>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-slate-100"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-brand-100 bg-brand-100 text-sm font-extrabold text-brand-700">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user?.displayName || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user?.displayName?.charAt(0)?.toUpperCase() || "U"
                  )}
                </span>
                <span className="hidden max-w-[120px] truncate text-sm font-semibold text-slate-700 md:block">
                  {user?.displayName?.split(" ")[0]}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-lift"
                  role="menu"
                >
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {user?.displayName}
                    </p>
                    <p className="truncate text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <Link
                    to={dashboardLink}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    role="menuitem"
                  >
                    <UserCircle2 className="h-4 w-4 text-slate-400" />
                    {dashboardLabel}
                  </Link>
                  <Link
                    to="/saved"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    role="menuitem"
                  >
                    <Sparkles className="h-4 w-4 text-slate-400" />
                    Saved Scholarships
                  </Link>
                  <div className="mx-4 my-1 flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Member access enabled
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="border-t border-slate-200/80 bg-white px-4 py-3 shadow-lg lg:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">{links}</ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
