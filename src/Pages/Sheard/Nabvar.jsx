import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X, ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import useAuth from "../../Hooks/useAuth";
import useAdmin from "../../Hooks/useAdmin";
import useModaretor from "../../Hooks/useModaretor";
import useUser from "../../Hooks/useUser";
import { cn } from "../../lib/cn";

const navLinkClass = ({ isActive }) =>
  cn(
    "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  );

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isAdmin] = useAdmin();
  const [isModaretor] = useModaretor();
  const [isUser] = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 glass">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-soft">
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
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
            >
              <UserCircle2 className="h-4 w-4" />
              Sign In
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-slate-100"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <span className="h-9 w-9 overflow-hidden rounded-full border-2 border-brand-100">
                  <img
                    src={user?.photoURL || ""}
                    alt={user?.displayName || "Profile"}
                    className="h-full w-full object-cover"
                  />
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
        <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden" aria-label="Mobile navigation">
          <ul className="flex flex-col gap-1">{links}</ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
