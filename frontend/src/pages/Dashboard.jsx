import DashboardAnalyzeGig from "../images/dashboard-analyze-gig.png"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GigBroLogo from "../images/logo.png";
import { logout } from "../utils/logout.js";

import {
  Plus,
  ChevronDown,
  LogOut,
  MoreVertical,
  Crown,
  Info,
  Columns3Cog,
} from "lucide-react";

const randomColor = [
  "bg-purple-100 text-purple-600",
  "bg-orange-100 text-orange-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100 text-green-700",
]


const scoreColor = (score) => {
  if (score >= 75) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-orange-100 text-orange-600";
};

const navItems = [
  // { label: "Dashboard", icon: Home, active: true },
  // { label: "My Projects", icon: Folder },
  // { label: "New Analysis", icon: Plus },
  // { label: "Reports", icon: BarChart2 },
  // { label: "Settings", icon: Settings },
];

const Dashboard = () => {
  const {setIsAuthenticated, user, setUser } = useAuth()
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [reports, setReports] = useState([])

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate()


  const liteUsed = 1;
  const liteLimit = 3;
  const proUsed = 2;
  const proLimit = 3;

  async function handleLogout() {
    const isLogout = await logout()
    if (isLogout.success) {
      setIsAuthenticated(false)
      setUser(null)
      navigate("/")
    }
  }


useEffect(() => {
  if (!user?.username) return;

  const getDashboardReports = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}${user.username}/getprojects`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      const reports = data.message.map(report => ({
        ...report,
        color: randomColor[Math.floor(Math.random() * randomColor.length)]
      }))
   
      setReports(reports)
    }
     catch (err) {
      console.error("Error: ",err);
    }
  };

  getDashboardReports();
}, [user?.username]);

console.log(reports)


  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-900 ">
      {/* Sidebar */}
      <aside className="hidden md:flex justify-between w-64 shrink-0 flex-col border-r border-gray-100 bg-white px-4 py-6">
        <div className="">
          <div className="mb-8 flex items-center gap-2 px-2">
            <img src={GigBroLogo} alt="Gigbro Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-fiver-green">GigBro</span>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active
                  ? "bg-green-50 text-fiver-green"
                  : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </div>


        {/* Credits card */}
        <div>
          <div className="rounded-2xl border border-gray-100 p-4">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="text-sm font-semibold">Your Credits</span>
              <Info size={14} className="text-gray-400" />
            </div>

            <div className="mb-4">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-fiver-green" />
                <span className="text-sm text-gray-600">Lite Reports</span>
              </div>
              <p className="mb-1.5 text-xs text-gray-400">
                Monthly limit: {liteLimit}
              </p>
              <p className="text-sm font-semibold">
                <span className="text-fiver-green">{liteUsed}</span> / {liteLimit}{" "}
                <span className="font-normal text-gray-400">used</span>
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full bg-fiver-green"
                  style={{ width: `${(liteUsed / liteLimit) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {liteLimit - liteUsed} remaining
              </p>
            </div>

            {user?.is_premium_user === 1 && (
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-sm text-gray-600">Pro Analyses</span>
                </div>
                <p className="mb-1.5 text-xs text-gray-400">
                  Monthly limit: {proLimit}
                </p>
                <p className="text-sm font-semibold">
                  <span className="text-purple-600">{proUsed}</span> / {proLimit}{" "}
                  <span className="font-normal text-gray-400">used</span>
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full bg-purple-500"
                    style={{ width: `${(proUsed / proLimit) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {proLimit - proUsed} remaining
                </p>
              </div>
            )}
          </div>

          {/* Upgrade card */}
          {user?.is_premium_user === 0 && (
            <div className="mt-4 rounded-2xl bg-green-50 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                <Crown size={16} className="text-fiver-green" />
                Go Pro Buddy
              </div>

              <p className="mb-3 text-xs text-gray-500">
                Unlock more Pro Analyses and grow your Fiverr business.
              </p>

              <button className="w-full rounded-full bg-fiver-green py-2 text-sm font-semibold text-white hover:bg-green-700">
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}

        <div className="flex items-center justify-between md:justify-end gap-4 border-b border-gray-100 bg-white px-6 py-4 md:px-10">
          <div className="flex md:hidden items-center gap-2 px-2">
            <img src={GigBroLogo} alt="Gigbro Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-fiver-green">GigBro</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-fiver-green" />
                Lite: {liteLimit - liteUsed} left
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Pro: {proLimit - proUsed} left
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5"
              >
                <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200" />
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                  {/* <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <User size={16} /> Profile
                </button>
                <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <SettingsIcon size={16} /> Settings
                </button> */}
                  <button
                    onClick={e => handleLogout()}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="flex flex-col justify-between px-6 py-8 md:px-10">
          <div className="flex flex-col gap-6">
            <div className="">
              <h1 className="text-3xl font-bold">Welcome {user?.username} 👋</h1>
              <p className="mt-1 text-gray-500">
                Analyze and optimize your Fiverr gigs to rank higher and get more
                orders.
              </p>
            </div>

            <div className="relative flex items-start justify-between overflow-hidden rounded-2xl
              bg-gradient-to-br from-green-50 to-white p-8">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold">Analyze a New Gig</h2>
                <p className="mt-2 text-gray-500">
                  Get AI-powered insights to improve your gig title,
                  description, tags and more.
                </p>
                <button className="mt-5 flex items-center gap-2 rounded-full bg-fiver-green px-6 py-2.5 font-semibold text-white hover:bg-green-700">
                  <Plus size={18} />
                  Start New Analysis
                </button>
              </div>

              <img src={DashboardAnalyzeGig} alt="" />
            </div>
          </div>

          {/* Projects */}
          <div className="mt-10 flex items-center justify-center">
            <h2 className="text-xl font-bold">Your Projects</h2>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="text-gray-400">
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">SEO Score</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Last Analyzed</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((p) => (
                  <tr key={p[0]} className="border-t border-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl font-semibold ${p["color"]} `}
                        >
                          {p[1][0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {p[1]}
                          </p>
                          <p className="text-xs text-gray-400">
                            {p[3]}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className=" py-4">
                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${scoreColor(
                          p[2]
                        )}`}
                      >
                        {p[2]} / 100
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${p.typeColor}`}
                      >
                        {p[3]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {p[4]}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-700">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;