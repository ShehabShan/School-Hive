import { FaHome, FaStar, FaUserShield, FaArrowRight, FaPlusCircle, FaThList, FaClipboardList } from "react-icons/fa";
import { Link, NavLink, Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

const navItems = [
  { to: "/modaratorDashboard/myProfile", label: "My Profile", icon: <FaUserShield /> },
  { to: "/modaratorDashboard/manageScholarships", label: "Manage Scholarships", icon: <FaThList /> },
  { to: "/modaratorDashboard/myReviews", label: "All Reviews", icon: <FaStar /> },
  { to: "/modaratorDashboard/allAppliedScholarships", label: "All Applied", icon: <FaClipboardList /> },
  { to: "/modaratorDashboard/addScholarships", label: "Add Scholarship", icon: <FaPlusCircle /> },
];

const ModaratorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
        <aside className="bg-white shadow-soft lg:sticky lg:top-0 lg:h-screen lg:w-[280px] lg:shrink-0 lg:border-r lg:border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 lg:flex-col lg:items-stretch lg:border-b lg:px-0 lg:py-0">
            <Link to="/" className="flex items-center gap-3 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <FaUserShield />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                School Hive
              </span>
              <span className="ml-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-600 ring-1 ring-brand-100">
                Moderator
              </span>
            </Link>

            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-5 pb-6 pt-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-200">
                  Moderator Dashboard
                </p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white">
                  School Hive
                </h1>
                <p className="mt-1 text-xs font-medium text-brand-200">
                  Review & manage scholarships
                </p>
              </div>
              <div className="-mt-8 px-5">
                <div className="rounded-2xl bg-white p-4 shadow-lift ring-1 ring-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-base font-bold text-white">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user?.displayName || "avatar"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (user?.displayName || user?.email || "M").charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {user?.displayName || "Moderator"}
                      </p>
                      <p className="truncate text-xs text-slate-500">{user?.email}</p>
                      <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-100">
                        Moderator
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <nav className="px-3 py-5">
                <ul className="menu gap-1.5 p-0">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                            isActive
                              ? "bg-brand-50 text-brand-700 shadow-soft"
                              : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                                isActive
                                  ? "bg-brand-600 text-white"
                                  : "bg-slate-100 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600"
                              }`}
                            >
                              {item.icon}
                            </span>
                            {item.label}
                            {isActive && <FaArrowRight className="ml-auto text-xs text-brand-400" />}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                  <div className="my-2 border-t border-slate-100"></div>
                  <li>
                    <Link
                      to="/"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-brand-600"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <FaHome />
                      </span>
                      Back to Home
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-3 lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-600"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-brand-600"
            >
              <FaHome />
              Home
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ModaratorDashboard;
