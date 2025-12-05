// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { useToast } from "../toast/ToastProvider";

function LoginPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      showToast("Please fill all fields", "error");
      return;
    }

    // ----------------------------------
    // NORMAL STUDENT LOGIN
    // ----------------------------------
    if (email === "student@bca.com" && password === "123456") {
      localStorage.setItem("bca_auth", "true");
      localStorage.setItem("bca_isPremium", "false");

      // DEFAULT PROFILE DATA
      localStorage.setItem(
        "bca_profile",
        JSON.stringify({
          name: "Chandan Kumar",
          college: "Annada College, Hazaribagh",
          semester: "Semester 1",
        })
      );

      setError("");
      showToast("Logged in as Student", "success");
      navigate("/", { replace: true });
      return;
    }

    // ----------------------------------
    // PREMIUM STUDENT LOGIN
    // ----------------------------------
    if (email === "premium@bca.com" && password === "123456") {
      localStorage.setItem("bca_auth", "true");
      localStorage.setItem("bca_isPremium", "true");

      localStorage.setItem(
        "bca_profile",
        JSON.stringify({
          name: "Chandan Kumar (Premium)",
          college: "Annada College, Hazaribagh",
          semester: "Semester 1",
        })
      );

      setError("");
      showToast("Logged in as Premium Student", "success");
      navigate("/", { replace: true });
      return;
    }

    // ----------------------------------
    // INVALID LOGIN
    // ----------------------------------
    setError("Invalid email or password");
    showToast("Invalid login credentials", "error");
  };

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4"
          : "min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center px-4"
      }
    >
      <div className="w-full max-w-md">
        {/* Logo + title */}
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-2xl font-bold">
            B
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            BCA Point 2.0
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Login to access notes, PYQ & syllabus
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-indigo-500/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="student@bca.com or premium@bca.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
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
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/60 rounded-2xl px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full rounded-2xl bg-indigo-500 py-2.5 text-sm font-medium hover:bg-indigo-600 transition shadow-sm shadow-indigo-500/40"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-[11px] text-slate-500 text-center">
            This is a frontend-only demo login. Backend auth can be connected
            later.
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
