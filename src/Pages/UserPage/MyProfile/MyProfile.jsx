import { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  FolderGit,
  UserPlus,
} from "lucide-react";

import bg from "../../../assist/bgImg/profileBg.jpg";
import useAuth from "../../../Hooks/useAuth";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner Image */}
      <div className="relative h-[300px]">
        <img
          src={bg}
          alt="Profile banner"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="relative -mt-16 pb-4">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                <img
                  src={user?.photoURL}
                  alt="Profile picture"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col lg:flex-row gap-5 lg:gap-[450px] mt-6">
                <div>
                  <h1 className="text-2xl font-bold">{user?.displayName}</h1>
                  <p className="text-gray-500">Admin of ScholeHive (C.E.O)</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Georgia
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Washington D.C
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-2">
                      <FolderGit className="w-4 h-4 text-blue-500" />
                      <span className="font-bold">113</span>
                    </div>
                    <p className="text-sm text-gray-500">Projects</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="font-bold">12.2k</span>
                    </div>
                    <p className="text-sm text-gray-500">Followers</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-green-500" />
                      <span className="font-bold">128</span>
                    </div>
                    <p className="text-sm text-gray-500">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mt-8">
            <div className="flex space-x-4 border-b">
              {["about", "edit", "timeline", "gallery", "friends"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-4 text-sm font-medium ${
                      activeTab === tab
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </div>

            {activeTab === "about" && (
              <div className="mt-6 grid md:grid-cols-3 gap-6">
                {/* Personal Info Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="font-semibold text-lg mb-4">Personal Info</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name:</p>
                      <p>{user?.displayName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email:</p>
                      <p>{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone:</p>
                      <p>+1(555)123-4567</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Age:</p>
                      <p>22</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience:</p>
                      <p>4 Years</p>
                    </div>
                  </div>
                </div>

                {/* About Me & Skills Card */}
                <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                  <h2 className="font-semibold text-lg mb-4">✨ About Me:</h2>
                  <p className="text-gray-500 mb-8">
                    Hello! I'm the dedicated admin behind our Scholarship
                    Management System. With a passion for both technology and
                    education, I strive to create a seamless, user-friendly
                    platform that connects deserving students with life-changing
                    scholarship opportunities. Every day, I work on refining our
                    system to ensure it not only runs smoothly but also empowers
                    students to pursue their dreams. Whether you're applying for
                    a scholarship or exploring new educational possibilities,
                    I'm here to support your journey every step of the way..
                  </p>

                  <h3 className="font-semibold mb-4">SKILLS:</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Project Management",
                      "Data Analysis",
                      "Marketing Strategy",
                      "Graphic Design",
                      "Content Creation",
                      "Market Research",
                      "Client Relations",
                      "Event Planning",
                      "Budgeting and Finance",
                      "Negotiation Skills",
                      "Team Collaboration",
                      "Adaptability",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-semibold mt-8 mb-4">
                    Contact Information:
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-gray-500">{user?.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-gray-500">+1(555)123-4567</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span className="text-gray-500">
                        scholarhive-913e4.web.app
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
