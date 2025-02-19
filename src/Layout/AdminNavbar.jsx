"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronRight,
  Github,
  Keyboard,
  LogOut,
  MessageCircle,
  Moon,
  Search,
  Settings,
  Sun,
  Users,
  Menu,
} from "lucide-react";
import useAuth from "../Hooks/useAuth";
import { Link } from "react-router-dom";
import useUser from "../Hooks/useUser";
import useModaretor from "../Hooks/useModaretor";
import useAdmin from "../Hooks/useAdmin";

export function AdminNavbar({ setMobileSidebarOpen }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user } = useAuth();
  const [isUser] = useUser();
  const [isModaretor] = useModaretor();
  const [isAdmin] = useAdmin();

  const langDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const handleClickOutsideLang = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideLang);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideLang);
  }, []);

  useEffect(() => {
    const handleClickOutsideProfile = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideProfile);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideProfile);
  }, []);

  return (
    // Changed from `fixed` to `sticky` so that the navbar sticks to the top
    // of its scrollable parent (the `<main>` container) rather than the viewport.
    <header className="bg-white border px-4 py-2 shadow-sm sticky top-0 z-10 lg:z-50">
      <div className="flex items-center justify-between">
        {/* Left side: Sidebar trigger and search */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-gray-200 rounded"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden lg:block">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[300px] border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Right side: Language dropdown, theme toggle, notifications, messages, and profile dropdown */}
        <div className="flex items-center gap-4">
          {/* Language Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 p-2 rounded"
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-18%20232313-w1eYRWmxmWS3lyUapFSbYyQaIkRnuG.png"
                alt="US Flag"
                className="h-5 w-5 rounded-sm object-cover"
              />
              <span>En</span>
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border shadow-lg rounded">
                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  English
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  Spanish
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  French
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="text-gray-700 hover:bg-gray-200 p-2 rounded"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications Button */}
          <button className="relative text-gray-700 hover:bg-gray-200 p-2 rounded">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 text-[10px] font-medium text-white flex items-center justify-center">
              0
            </span>
          </button>

          {/* Messages Button */}
          <button className="relative text-gray-700 hover:bg-gray-200 p-2 rounded">
            <MessageCircle className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 text-[10px] font-medium text-white flex items-center justify-center">
              0
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="relative h-8 w-8 rounded-full overflow-hidden"
            >
              <img
                src={user?.photoURL}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </button>
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border shadow-lg rounded">
                {/* Dropdown Header */}
                <div className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img
                        src={user?.photoURL}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user?.displayName}</p>
                      <p className="text-xs text-gray-500">@Admin</p>
                    </div>
                  </div>
                </div>
                <hr className="border-t" />
                {/* Dropdown Items */}
                {isAdmin && (
                  <Link to="/adminDashboard/adminProfile">
                    <div
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Users className="h-4 w-4" />
                      <span>Admin Profile</span>
                    </div>
                  </Link>
                )}
                {isModaretor && (
                  <Link to="/modaratorDashboard/myProfile">
                    <div
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Users className="h-4 w-4" />
                      <span>Modaretor Profile</span>
                    </div>
                  </Link>
                )}
                {isUser && (
                  <Link to="/userDashboard/myProfile">
                    <div
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Users className="h-4 w-4" />
                      <span>User Profile</span>
                    </div>
                  </Link>
                )}

                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  {/* Billing icon */}
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 7H15M9 11H15M9 15H13M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Billing</span>
                </div>
                {/* <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <Keyboard className="h-4 w-4" />
                  <span>Keyboard Shortcuts</span>
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <Users className="h-4 w-4" />
                  <span>Team</span>
                </div> */}

                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <Users className="h-4 w-4" />
                  <span>Invite User</span>
                  <ChevronRight className="ml-auto h-4 w-4" />
                </div>

                <a href="https://github.com/ShehabShan/School-Hive.git">
                  <div
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <Github className="h-4 w-4" />
                    <span>Github</span>
                  </div>
                </a>
                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 17V17.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 13.5C11.9816 13.1754 12.0692 12.8536 12.2495 12.5832C12.4299 12.3127 12.6933 12.1091 13 12C13.3759 11.8563 13.7132 11.6274 13.9856 11.3309C14.2579 11.0344 14.4577 10.6779 14.5693 10.2926C14.6809 9.90733 14.7014 9.50369 14.6292 9.10963C14.557 8.71558 14.3939 8.34278 14.1514 8.02052C13.9089 7.69826 13.5935 7.43521 13.2306 7.25025C12.8677 7.06529 12.4664 6.96344 12.0576 6.95279C11.6487 6.94214 11.2426 7.02297 10.8705 7.18914C10.4984 7.35531 10.1696 7.60297 9.91001 7.915"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Support</span>
                  <ChevronRight className="ml-auto h-4 w-4" />
                </div>
                <hr className="border-t" />
                <div
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2 text-red-600"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
