import {
  Home,
  LayoutDashboard,
  FileText,
  History,
  GraduationCap,
  Briefcase,
  Scale,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ persona, setPersona }) {
  const location = useLocation();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    navigate("/Home");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-80 bg-white flex flex-col shadow-sm z-20">
      {/* Logo */}
      <Link
        to="/"
        className="h-20 flex items-center px-8 hover:bg-slate-50 transition"
      >
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Nyay Saar</h1>
          <p className="text-sm text-slate-500">AI Legal Assistant</p>
        </div>
      </Link>

      {/* Navigation */}
      <div className="px-5 mt-6 space-y-2">
        <Link
          to="/"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            location.pathname === "/"
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Home size={20} />
          Home
        </Link>

        <Link
          to="/dashboard"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            location.pathname === "/dashboard"
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition">
          <FileText size={20} />
          Documents
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition">
          <History size={20} />
          History
        </button>
      </div>

      {/* Persona */}
      <div className="px-5 mt-10">
        <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">
          Persona
        </p>

        <button
          onClick={() => setPersona("student")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition ${
            persona === "student"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 hover:bg-slate-200"
          }`}
        >
          <GraduationCap size={18} />
          General Public
        </button>

        <button
          onClick={() => setPersona("lawyer")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition ${
            persona === "lawyer"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 hover:bg-slate-200"
          }`}
        >
          <Briefcase size={18} />
          Journalist
        </button>

        <button
          onClick={() => setPersona("judge")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            persona === "judge"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 hover:bg-slate-200"
          }`}
        >
          <Scale size={18} />
          Legal Professional
        </button>
      </div>

      {/* Profile */}
      <div className="mt-auto border-t border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <p className="font-semibold">{user?.name || "User"}</p>

            <p className="text-sm text-slate-500">{user?.email || ""}</p>
          </div>
        </div>

        <button
          onClick={logoutUser}
          className="mt-6 w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 rounded-xl py-2 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
