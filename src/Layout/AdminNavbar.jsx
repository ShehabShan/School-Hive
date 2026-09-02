import { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  Github,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserCircle2,
  History,
} from "lucide-react";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import { Link, useNavigate } from "react-router-dom";

export function AdminNavbar({ setMobileSidebarOpen }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logOut } = useAuth();
  const { isAdmin, isModaretor, isInstitution, isSuperAdmin } = useRole();
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    try {
      await logOut();
      navigate("/registration");
    } catch {
      navigate("/registration");
    }
  };

  useEffect(() => {
    const handleClickOutsideProfile = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    const handleEsc = (event) => {
      if (event.key === "Escape") setProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutsideProfile);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProfile);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const profileLink = isInstitution
    ? "/institutionDashboard/myProfile"
    : isAdmin
    ? "/adminDashboard/adminProfile"
    : isModaretor
    ? "/modaratorDashboard/myProfile"
    : "/userDashboard/myProfile";

  const isStaff = isAdmin || isModaretor;

  const historyLink = isAdmin
    ? "/adminDashboard/manageReviews/history"
    : "/modaratorDashboard/myReviews/history";

  const roleLabel = isInstitution
    ? "Institution"
    : isSuperAdmin
    ? "Owner"
    : isAdmin
    ? "Admin"
    : isModaretor
    ? "Moderator"
    : "User";

  return (
    // sticky so the navbar sticks to its scrollable parent (the <main> container).
    <header className="bg-white border-slate-100 px-4 py-2 shadow-soft ring-1 ring-slate-100 sticky top-0 z-10 lg:z-50">
      <div className="flex items-center justify-between">
        {/* Left side: Sidebar trigger and search */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-slate-100 rounded md:hidden"
            aria-label="Open sidebar"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden md:block">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[240px] lg:w-[380px] border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        {/* Right side: theme, notifications, profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="text-slate-700 hover:bg-slate-100 p-2 rounded-xl"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button className="relative text-slate-700 hover:bg-slate-100 p-2 rounded-xl" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-600 text-[10px] font-medium text-white flex items-center justify-center">
              0
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-slate-100"
              aria-haspopup="menu"
              aria-expanded={profileDropdownOpen}
            >
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 ring-2 ring-slate-100 text-sm font-bold text-white">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user?.displayName || "Avatar"} className="h-full w-full object-cover" />
                ) : (
                  (user?.displayName || user?.email || "U").charAt(0).toUpperCase()
                )}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white border-slate-100 shadow-soft rounded-2xl ring-1 ring-slate-100 py-2">
                {/* Dropdown Header */}
                <div className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 ring-2 ring-slate-100 text-sm font-bold text-white">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt={user?.displayName || "Avatar"} className="h-full w-full object-cover" />
                      ) : (
                        (user?.displayName || user?.email || "U").charAt(0).toUpperCase()
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{user?.displayName || user?.email}</p>
                      <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <span className="mt-2 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                    {roleLabel}
                  </span>
                </div>
                <hr className="my-2 border-t" />
                <Link
                  to={profileLink}
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <UserCircle2 className="h-4 w-4 text-slate-400" />
                  Profile
                </Link>
                {isStaff && (
                  <Link
                    to={historyLink}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <History className="h-4 w-4 text-slate-400" />
                    Review History
                  </Link>
                )}
                <div className="px-4 py-2 text-xs text-slate-400">Theme: <span className="font-semibold">{isDarkMode ? "Dark" : "Light"}</span></div>
                <hr className="my-1 border-t" />
                <a
                  href="https://github.com/ShehabShan/School-Hive.git"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <Github className="h-4 w-4 text-slate-400" />
                  GitHub
                </a>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
