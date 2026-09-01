import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  UserCircle2,
  LayoutGrid,
  FilePlus2,
  ClipboardList,
  Users,
  Star,
  Send,
  Settings,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { AdminNavbar } from "./AdminNavbar";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";

// A simple utility to conditionally join class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, isModaretor, isSuperAdmin, isInstitution, isApprovedInstitution } = useRole();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = isInstitution
    ? [
        { title: "Institution Profile", path: "/institutionDashboard/myProfile", icon: <UserCircle2 className="h-4 w-4" /> },
        { title: "Add Scholarship", path: "/institutionDashboard/addScholarships", icon: <FilePlus2 className="h-4 w-4" /> },
        { title: "My Scholarships", path: "/institutionDashboard/manageScholarships", icon: <LayoutGrid className="h-4 w-4" /> },
        { title: "Applications", path: "/institutionDashboard/allAppliedScholarships", icon: <ClipboardList className="h-4 w-4" /> },
      ]
    : isSuperAdmin
    ? [
        { title: "Admin Profile", path: "/adminDashboard/adminProfile", icon: <UserCircle2 className="h-4 w-4" /> },
        { title: "Add Scholarship", path: "/adminDashboard/addScholarships", icon: <FilePlus2 className="h-4 w-4" /> },
        { title: "Manage Scholarships", path: "/adminDashboard/manageScholarships", icon: <LayoutGrid className="h-4 w-4" /> },
        { title: "Manage Reviews", path: "/adminDashboard/manageReviews", icon: <Star className="h-4 w-4" /> },
        { title: "Review History", path: "/adminDashboard/manageReviews/history", icon: <BookOpen className="h-4 w-4" /> },
        { title: "Manage Applications", path: "/adminDashboard/manageAppliedApplication", icon: <ClipboardList className="h-4 w-4" /> },
        { title: "Manage Users", path: "/adminDashboard/manageUsers", icon: <Users className="h-4 w-4" /> },
        { title: "Institution Approvals", path: "/adminDashboard/institutionApprovals", icon: <ShieldCheck className="h-4 w-4" /> },
      ]
    : isAdmin
    ? [
        { title: "Admin Profile", path: "/adminDashboard/adminProfile", icon: <UserCircle2 className="h-4 w-4" /> },
        { title: "Manage Reviews", path: "/adminDashboard/manageReviews", icon: <Star className="h-4 w-4" /> },
        { title: "Review History", path: "/adminDashboard/manageReviews/history", icon: <BookOpen className="h-4 w-4" /> },
        { title: "Manage Applications", path: "/adminDashboard/manageAppliedApplication", icon: <ClipboardList className="h-4 w-4" /> },
        { title: "Manage Users", path: "/adminDashboard/manageUsers", icon: <Users className="h-4 w-4" /> },
      ]
    : isModaretor
    ? [
        { title: "Moderator Profile", path: "/modaratorDashboard/myProfile", icon: <UserCircle2 className="h-4 w-4" /> },
        { title: "Manage Reviews", path: "/modaratorDashboard/myReviews", icon: <Star className="h-4 w-4" /> },
        { title: "Review History", path: "/modaratorDashboard/myReviews/history", icon: <BookOpen className="h-4 w-4" /> },
        { title: "All Applications", path: "/modaratorDashboard/allAppliedScholarships", icon: <ClipboardList className="h-4 w-4" /> },
      ]
    : [
        { title: "User Profile", path: "/userDashboard/myProfile", icon: <UserCircle2 className="h-4 w-4" /> },
        { title: "My Application", path: "/userDashboard/myApplication", icon: <Send className="h-4 w-4" /> },
        { title: "My Reviews", path: "/userDashboard/myReviews", icon: <Star className="h-4 w-4" /> },
        { title: "Saved Scholarships", path: "/userDashboard/saved", icon: <BookOpen className="h-4 w-4" /> },
      ];

  const settingsLink = isInstitution
    ? "/institutionDashboard/myProfile"
    : isAdmin || isSuperAdmin
    ? "/adminDashboard/adminProfile"
    : isModaretor
    ? "/modaratorDashboard/myProfile"
    : "/userDashboard/myProfile";

  const roleLabel = isInstitution
    ? isApprovedInstitution
      ? "Institution"
      : "Institution (in review)"
    : isSuperAdmin
    ? "Owner"
    : isAdmin
    ? "Admin"
    : isModaretor
    ? "Moderator"
    : "User";

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-slate-100 transform transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="border-b border-slate-100 bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white">
                <path
                  fill="currentColor"
                  d="M12 2L0 9L12 16L22 10.1667V17.5H24V9L12 2Z"
                />
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-extrabold tracking-tight text-white">SchoolHive</span>
              <span className="ml-auto rounded-full bg-white/15 text-brand-100 ring-1 ring-white/20 px-2 py-0.5 text-xs">
                v1.3.0
              </span>
            </div>
          </Link>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <h3 className="mb-2 px-2 text-xs font-medium text-slate-500">MAIN</h3>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50",
                    isActive
                      ? "bg-brand-50 text-brand-600 ring-1 ring-brand-100"
                      : "text-slate-700"
                  )
                }
              >
                <span className="text-slate-400">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto border-t border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 ring-2 ring-slate-100 text-sm font-bold text-white">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user?.displayName || "Avatar"} className="h-full w-full object-cover" />
              ) : (
                (user?.displayName || user?.email || "U").charAt(0).toUpperCase()
              )}
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-slate-800">{user?.displayName || user?.email}</span>
              <span className="text-xs text-slate-500">{roleLabel}</span>
            </div>
            <Link to={settingsLink} className="ml-auto" aria-label="Settings">
              <Settings className="h-4 w-4 text-slate-500" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
          <AdminNavbar setMobileSidebarOpen={setMobileSidebarOpen} />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
