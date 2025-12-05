// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("bca_auth");
    localStorage.removeItem("bca_isPremium");
    navigate("/login", { replace: true });
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="h-8 w-8 rounded-2xl bg-indigo-500 flex items-center justify-center text-lg font-bold">
            B
          </span>
          <div>
            <h1 className="text-base font-semibold tracking-tight">
              BCA Point 2.0
            </h1>
            <p className="text-[11px] text-slate-400">Notes · PYQ · Syllabus</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/search")}
            className="text-[11px] px-3 py-1.5 rounded-full border border-slate-700 hover:border-indigo-500 transition"
          >
            🔍 Search
          </button>
          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="text-[11px] px-3 py-1.5 rounded-full border border-slate-700 hover:border-emerald-500 transition"
          >
            👤 Profile
          </button>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="text-[11px] text-white px-3 py-1.5 rounded-full border border-slate-700 hover:border-indigo-500 transition"
          >
            {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-[11px] text-white px-3 py-1.5 rounded-full border border-slate-700 hover:border-red-500 hover:text-red-400 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
