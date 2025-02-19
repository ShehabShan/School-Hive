"use client";

import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Cloud,
  Database,
  HelpCircle,
  Image,
  LayoutGrid,
  MessageSquare,
  Settings,
  ShoppingCart,
  User2,
} from "lucide-react";
import { AdminNavbar } from "./AdminNavbar";
import useAuth from "../Hooks/useAuth";
import useAdmin from "../Hooks/useAdmin";
import useUser from "../Hooks/useUser";
import useModaretor from "../Hooks/useModaretor";

// A simple utility to conditionally join class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AdminDashboard = () => {
  const [openSections, setOpenSections] = useState([]);
  const { user } = useAuth();
  const [isAdmin] = useAdmin();
  const [isModaretor] = useModaretor();
  const [isUser] = useUser();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // const menuItems = [
  //   { title: "Admin Profile", path: "/adminDashboard/adminProfile" },
  //   { title: "Add Scholarships", path: "/adminDashboard/addScholarships" },
  //   {
  //     title: "Manage Scholarships",
  //     path: "/adminDashboard/manageScholarships",
  //   },
  //   {
  //     title: "Applied Application",
  //     path: "/adminDashboard/manageAppliedApplication",
  //   },
  //   { title: "Manage Users", path: "/adminDashboard/manageUsers" },
  //   { title: "Manage Reviews", path: "/adminDashboard/manageReviews" },
  // ];

  const adminSubmenu = [
    { title: "Admin Profile", path: "/adminDashboard/adminProfile" },
    { title: "Add Scholarships", path: "/adminDashboard/addScholarships" },
    {
      title: "Manage Scholarships",
      path: "/adminDashboard/manageScholarships",
    },
    {
      title: "Applied Application",
      path: "/adminDashboard/manageAppliedApplication",
    },
    { title: "Manage Users", path: "/adminDashboard/manageUsers" },
  ];

  const moderatorSubmenu = [
    { title: "Moderator Profile", path: "/modaratorDashboard/myProfile" },
    {
      title: "Manage Scholarships",
      path: "/modaratorDashboard/manageScholarships",
    },
    {
      title: "All Reviews",
      path: "/modaratorDashboard/myReviews",
    },
    {
      title: "All Applied Scholarships",
      path: "/modaratorDashboard/allAppliedScholarships",
    },
    {
      title: "Add Scholarships",
      path: "/modaratorDashboard/addScholarships",
    },
  ];

  const userSubmenu = [
    { title: "User Profile", path: "/userDashboard/myProfile" },
    { title: "My Application", path: "/userDashboard/myApplication" },
    { title: "My Reviews", path: "/userDashboard/myReviews" },
  ];

  let submenuItems = [];
  if (isAdmin) {
    submenuItems = adminSubmenu;
  } else if (isModaretor) {
    submenuItems = moderatorSubmenu;
  } else if (isUser) {
    submenuItems = userSubmenu;
  }

  const navigationItems = [
    {
      section: "MAIN",
      items: [
        {
          title: "Dashboard",
          icon: <Cloud className="h-4 w-4" />,
          path: "/adminDashboard/dashboard",
          submenu: submenuItems,
        },
        {
          title: "Layouts",
          icon: <LayoutGrid className="h-4 w-4" />,
          path: "/adminDashboard/layouts",
          // Note: no submenu array provided here.
        },
      ],
    },
    {
      section: "Widget",
      items: [
        {
          title: "Statistics",
          icon: <BarChart3 className="h-4 w-4" />,
          path: "/adminDashboard/statistics",
        },
        {
          title: "User",
          icon: <User2 className="h-4 w-4" />,
          path: "/adminDashboard/manageUsers",
        },
        {
          title: "Data",
          icon: <Database className="h-4 w-4" />,
          path: "/adminDashboard/data",
        },
        {
          title: "Chart",
          icon: <BarChart3 className="h-4 w-4" />,
          path: "/adminDashboard/chart",
        },
      ],
    },
    {
      section: "Application",
      items: [
        {
          title: "Calendar",
          icon: <Calendar className="h-4 w-4" />,
          path: "/adminDashboard/calendar",
        },
        {
          title: "Chat",
          icon: <MessageSquare className="h-4 w-4" />,
          path: "/adminDashboard/chat",
        },
        {
          title: "Gallery",
          icon: <Image className="h-4 w-4" />,
          path: "/adminDashboard/gallery",
        },
        {
          title: "Ecommerce",
          icon: <ShoppingCart className="h-4 w-4" />,
          path: "/adminDashboard/ecommerce",
        },
        {
          title: "Helpdesk",
          icon: <HelpCircle className="h-4 w-4" />,
          path: "/adminDashboard/helpdesk",
        },
      ],
    },
  ];

  const toggleSection = (title) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="border-b px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary">
                <path
                  fill="currentColor"
                  d="M12 2L0 9L12 16L22 10.1667V17.5H24V9L12 2Z"
                />
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-semibold">SchoolHive</span>
              <span className="ml-auto rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 text-xs">
                v1.3.0
              </span>
            </div>
          </Link>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {navigationItems.map((section) => (
              <div key={section.section}>
                <h3 className="mb-2 px-2 text-xs font-medium text-gray-500">
                  {section.section}
                </h3>
                <nav className="space-y-1">
                  {section.items.map((item) =>
                    // If the item has a submenu array, render a collapsible button.
                    item.submenu ? (
                      <div key={item.path}>
                        <button
                          type="button"
                          onClick={() => toggleSection(item.title)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-gray-100 w-full",
                            openSections.includes(item.title)
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700"
                          )}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto rounded-full bg-blue-100 text-blue-600 px-2 py-0.5 text-xs">
                              {typeof item.badge === "string"
                                ? item.badge
                                : item.badge.text}
                            </span>
                          )}
                          <ChevronDown
                            className={cn(
                              "ml-auto h-4 w-4 transition-transform",
                              openSections.includes(item.title) && "rotate-180"
                            )}
                          />
                        </button>
                        {openSections.includes(item.title) && (
                          <div className="mt-1 space-y-1">
                            {item.submenu.map((subItem) => (
                              <NavLink
                                key={subItem.path}
                                to={subItem.path}
                                className={({ isActive }) =>
                                  cn(
                                    "flex items-center gap-2 rounded-lg pl-9 pr-2 py-2 text-sm transition-colors hover:bg-gray-100",
                                    isActive ? "text-blue-600" : "text-gray-600"
                                  )
                                }
                              >
                                <div className="h-1.5 w-1.5 rounded-full border border-current" />
                                <span>{subItem.title}</span>
                                {subItem.badge && (
                                  <span
                                    className={cn(
                                      "ml-auto text-xs px-2 py-0.5 rounded-full",
                                      subItem.badge.variant === "hot"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-600"
                                    )}
                                  >
                                    {subItem.badge.text}
                                  </span>
                                )}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700"
                          )
                        }
                      >
                        {item.icon}
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto rounded-full bg-blue-100 text-blue-600 px-2 py-0.5 text-xs">
                            {typeof item.badge === "string"
                              ? item.badge
                              : item.badge.text}
                          </span>
                        )}
                      </NavLink>
                    )
                  )}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <img
                src={user?.photoURL}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.displayName}</span>
              <span className="text-xs text-gray-500">
                {isAdmin && "Admin"}
                {isModaretor && "Modaretor"}
                {isUser && "User"}
              </span>
            </div>
            <Link to="/adminDashboard/adminProfile" className="ml-auto">
              <Settings className=" h-4 w-4 text-gray-500" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Sidebar Toggle Button (visible only on mobile) */}
        {/* <div className="md:hidden p-2 bg-gray-100">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="text-gray-700 hover:bg-gray-200 p-2 rounded"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <AdminNavbar setMobileSidebarOpen={setMobileSidebarOpen} />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
