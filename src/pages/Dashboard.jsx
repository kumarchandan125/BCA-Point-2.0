// src/pages/Dashboard.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

import Navbar from "../components/Navbar";
import CategoryCard from "../components/CategoryCard";
import IntroSplash from "../components/IntroSplash";
import CategorySkeleton from "../components/CategorySkeleton";
import SavedNoteSkeleton from "../components/SavedNoteSkeleton";
import { useTheme } from "../theme/ThemeContext";
import { useMergedData } from "../hooks/useMergedData";

function Dashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 🔹 merged data from base JSON + admin localStorage
  const { allCategories, allSemesters, allSubjects, allMaterials } =
    useMergedData();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | free | premium
  const [showIntro, setShowIntro] = useState(() => {
    const played = sessionStorage.getItem("introPlayed");
    return played ? false : true;
  });

  const [loading, setLoading] = useState(true); // skeleton ke liye

  // 🔹 Parallax ke liye motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const heroOffsetX = useTransform(mouseX, [-0.5, 0.5], [-14, 14]);
  const heroOffsetY = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);
  const statsOffsetX = useTransform(mouseX, [-0.5, 0.5], [10, -10]);
  const statsOffsetY = useTransform(mouseY, [-0.5, 0.5], [6, -6]);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width / 2)) / rect.width; // -0.5..0.5
    const relY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    mouseX.set(relX);
    mouseY.set(relY);
  };

  // intro sirf first visit pe
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("introPlayed", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // skeleton loading (fake delay)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800); // 0.8 sec
    return () => clearTimeout(t);
  }, []);

  // 🔹 Bookmarked materials (no setState, only useMemo)
  const bookmarkedMaterials = useMemo(() => {
    try {
      const raw = localStorage.getItem("bca_bookmarks") || "[]";
      const ids = JSON.parse(raw);
      if (!Array.isArray(ids)) return [];
      return allMaterials.filter((m) => ids.includes(m.id));
    } catch {
      return [];
    }
  }, [allMaterials]);

  // 🔹 Recently viewed materials (useMemo, no setState)
  const recentMaterials = useMemo(() => {
    try {
      const rawViewed = localStorage.getItem("bca_viewed") || "[]";
      const viewedIds = JSON.parse(rawViewed);
      if (!Array.isArray(viewedIds)) return [];

      const lastIds = viewedIds.slice(-5).reverse(); // last 5, latest first

      return lastIds
        .map((id) => allMaterials.find((m) => m.id === id))
        .filter(Boolean);
    } catch {
      return [];
    }
  }, [allMaterials]);

  // 1) Category filter (admin + base)
  const filteredCategories = allCategories
    .filter((cat) => {
      if (filter === "premium") return cat.isPremium === true;
      if (filter === "free") return !cat.isPremium;
      return true;
    })
    .filter((cat) => {
      const q = search.toLowerCase();
      return (
        cat.title.toLowerCase().includes(q) ||
        (cat.description || "").toLowerCase().includes(q)
      );
    });

  // 2) Subject quick search (admin + base)
  const subjectMatches =
    search.trim().length > 0
      ? allSubjects.filter((sub) =>
          sub.name.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  const handleSubjectQuickOpen = (subject) => {
    const defaultCategoryId = "notes"; // Notes category id
    const semId = subject.semesterId;

    navigate(
      `/category/${defaultCategoryId}/semester/${semId}/subject/${subject.id}`
    );
  };

  const openSavedPdf = (id) => {
    navigate(`/pdf/${id}`);
  };

  const openRecentPdf = (id) => {
    navigate(`/pdf/${id}`);
  };

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen bg-slate-950 text-slate-100 relative"
          : "min-h-screen bg-slate-100 text-slate-900 relative"
      }
    >
      {/* Intro overlay */}
      <AnimatePresence>{showIntro && <IntroSplash />}</AnimatePresence>

      <Navbar />

      <motion.main
        className="max-w-6xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Top welcome section */}
        <section className="mb-4">
          <p className="text-xs text-slate-400 mb-1">Welcome back,</p>
          <h2 className="text-2xl font-semibold leading-tight">
            Chandan Kumar Pandey
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Annada College Hazaribagh · BCA
          </p>
        </section>

        {/* Hero section with parallax */}
        <motion.section
          className="mb-6 relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-5 py-5 md:px-6 md:py-6"
          onMouseMove={handleHeroMouseMove}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"
            animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-emerald-500/15 blur-3xl"
            animate={{ x: [0, 12, 0], y: [0, -8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <motion.div
              style={{ x: heroOffsetX, y: heroOffsetY }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-indigo-300/80 mb-2">
                BCA Point · 2.0
              </p>
              <h3 className="text-xl md:text-2xl font-semibold mb-1">
                Your Best BCA Study Companion
              </h3>
              <p className="text-xs md:text-sm text-slate-300 max-w-md">
                All semesters, notes, PYQs, assignments & more in one clean,
                distraction-free dashboard.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <button
                  onClick={() => navigate("/category/notes")}
                  className="px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-slate-50 font-medium transition"
                >
                  Browse notes
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="px-4 py-2 rounded-full border border-slate-600 hover:border-emerald-400 text-slate-200 transition"
                >
                  Saved notes & profile
                </button>
              </div>
            </motion.div>

            {/* Small stats with counter-parallax (admin + base) */}
            <motion.div
              style={{ x: statsOffsetX, y: statsOffsetY }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              className="flex flex-row md:flex-col gap-2 text-xs min-w-[180px]"
            >
              <div className="flex-1 rounded-2xl bg-slate-950/60 border border-slate-800 px-3 py-2">
                <p className="text-slate-400 mb-1">Semesters</p>
                <p className="text-lg font-semibold text-indigo-300">
                  {allSemesters.length}
                </p>
              </div>
              <div className="flex-1 rounded-2xl bg-slate-950/60 border border-slate-800 px-3 py-2">
                <p className="text-slate-400 mb-1">Subjects</p>
                <p className="text-lg font-semibold text-emerald-300">
                  {allSubjects.length}
                </p>
              </div>
              <div className="flex-1 rounded-2xl bg-slate-950/60 border border-slate-800 px-3 py-2">
                <p className="text-slate-400 mb-1">Study materials</p>
                <p className="text-lg font-semibold text-sky-300">
                  {allMaterials.length}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Saved notes */}
        {bookmarkedMaterials.length > 0 && (
          <motion.section
            className="mb-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Saved notes</h3>
              <button
                onClick={() => navigate("/profile")}
                className="text-[11px] text-indigo-400 hover:text-indigo-300"
              >
                View all in profile →
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {loading ? (
                <>
                  <SavedNoteSkeleton />
                  <SavedNoteSkeleton />
                  <SavedNoteSkeleton />
                </>
              ) : (
                bookmarkedMaterials.map((mat) => {
                  const sub = allSubjects.find(
                    (s) => s.id === mat.subjectId
                  );
                  const cat = allCategories.find(
                    (c) => c.id === mat.categoryId
                  );

                  return (
                    <div
                      key={mat.id}
                      onClick={() => openSavedPdf(mat.id)}
                      className="min-w-[220px] cursor-pointer rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/70 hover:-translate-y-1 transition p-3 text-xs flex flex-col justify-between"
                    >
                      <div>
                        <p className="font-semibold line-clamp-2">
                          {mat.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {(sub && sub.name) || mat.subjectId} ·{" "}
                          {(cat && cat.title) || mat.categoryId}
                        </p>
                      </div>
                      <span className="mt-2 text-[11px] text-indigo-400">
                        Open PDF →
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.section>
        )}

        {/* Recently viewed */}
        {recentMaterials.length > 0 && (
          <motion.section
            className="mb-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Recently viewed</h3>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {loading ? (
                <>
                  <SavedNoteSkeleton />
                  <SavedNoteSkeleton />
                </>
              ) : (
                recentMaterials.map((mat) => {
                  const sub = allSubjects.find(
                    (s) => s.id === mat.subjectId
                  );
                  const cat = allCategories.find(
                    (c) => c.id === mat.categoryId
                  );

                  return (
                    <div
                      key={mat.id}
                      onClick={() => openRecentPdf(mat.id)}
                      className="min-w-[220px] cursor-pointer rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/70 hover:-translate-y-1 transition p-3 text-xs flex flex-col justify-between"
                    >
                      <div>
                        <p className="font-semibold line-clamp-2">
                          {mat.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {(sub && sub.name) || mat.subjectId} ·{" "}
                          {(cat && cat.title) || mat.categoryId}
                        </p>
                      </div>
                      <span className="mt-2 text-[11px] text-indigo-400">
                        Open again →
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.section>
        )}

        {/* Search + filters */}
        <section className="mb-4 space-y-3">
          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories or subjects (e.g. notes, pyq, C Programming)..."
              className={
                (theme === "dark"
                  ? "bg-slate-950/80 text-slate-100 placeholder-slate-500 border-slate-700"
                  : "bg-slate-50 text-slate-900 placeholder-slate-500 border-slate-300") +
                " w-full rounded-2xl px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              }
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-full border ${
                filter === "all"
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-500"
              } transition`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("free")}
              className={`px-3 py-1.5 rounded-full border ${
                filter === "free"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-500"
              } transition`}
            >
              Free only
            </button>
            <button
              onClick={() => setFilter("premium")}
              className={`px-3 py-1.5 rounded-full border ${
                filter === "premium"
                  ? "border-amber-400 bg-amber-400/10 text-amber-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-500"
              } transition`}
            >
              Premium only
            </button>
          </div>
        </section>

        {/* Category cards */}
        <section className="space-y-3 mb-6">
          {loading ? (
            <>
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
            </>
          ) : (
            filteredCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))
          )}

          {filteredCategories.length === 0 && !search && !loading && (
            <p className="text-xs text-slate-500">
              No category matches your filter.
            </p>
          )}
        </section>

        {/* Subject quick results */}
        {search.trim().length > 0 && (
          <section className="mt-4 space-y-2">
            <h3 className="text-xs font-semibold text-slate-300">
              Subjects matching “{search}”
            </h3>

            {subjectMatches.length > 0 ? (
              <div className="space-y-2 text-xs">
                {subjectMatches.map((sub) => {
                  const sem = allSemesters.find(
                    (s) => s.id === sub.semesterId
                  );
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-900/70 border border-slate-800 px-3 py-2"
                    >
                      <div>
                        <p className="font-medium text-slate-100">
                          {sub.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {sem ? sem.name : "Semester"} · Opens in Notes
                          category
                        </p>
                      </div>
                      <button
                        onClick={() => handleSubjectQuickOpen(sub)}
                        className="px-3 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-[11px] font-medium transition"
                      >
                        Open
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                No subjects found with this name.
              </p>
            )}
          </section>
        )}
      </motion.main>
      
    </div>
  );
}

export default Dashboard;
