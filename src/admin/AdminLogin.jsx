// src/admin/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../theme/ThemeContext";

function AdminLogin() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isDark = theme === "dark";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    // simple hard-coded admin credentials
    if (email === "admin@bca.com" && password === "123456") {
      localStorage.setItem("bca_admin_auth", "true");
      setError("");
      navigate("/admin", { replace: true });
      return;
    }

    setError("Invalid admin credentials");
  };

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4"
          : "min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center px-4"
      }
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-6 text-center">
          <p className="text-xs text-slate-400 mb-1">BCA Study Hub</p>
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
          <p className="text-xs text-slate-500 mt-1">
            Only for authorized administrators.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-indigo-500/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">
                Admin Email
              </label>
              <input
                type="email"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="admin@bca.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="123456"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Demo admin: <span className="text-indigo-400">admin@bca.com</span> /{" "}
                <span className="text-indigo-400">123456</span>
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/60 rounded-2xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-indigo-500 py-2.5 text-sm font-medium hover:bg-indigo-600 transition shadow-sm shadow-indigo-500/40"
            >
              Login as admin
            </button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="mt-4 text-[11px] text-slate-500 hover:text-indigo-400 inline-flex items-center gap-1"
          >
            ← Back to student site
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
