// src/pages/AdvancedSearchPage.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import { useTheme } from "../theme/ThemeContext";
import { useMergedData } from "../hooks/useMergedData";

function AdvancedSearchPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 🔹 merged data (base + admin)
  const { allCategories, allSemesters, allSubjects, allMaterials } =
    useMergedData();

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [semFilter, setSemFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // 🔹 Enriched materials — readable names ke saath
  const enrichedMaterials = useMemo(
    () =>
      allMaterials.map((m) => {
        const sub = allSubjects.find((s) => s.id === m.subjectId);
        const sem = allSemesters.find((s) => s.id === m.semesterId);
        const cat = allCategories.find((c) => c.id === m.categoryId);

        return {
          ...m,
          subjectName: sub?.name || "",
          semesterName: sem?.name || "",
          categoryName: cat?.title || "",
        };
      }),
    [allMaterials, allSubjects, allSemesters, allCategories]
  );

  const filteredResults = useMemo(() => {
    let result = enrichedMaterials;

    // text search
    if (query.trim() !== "") {
      const q = query.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subjectName.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q) ||
          (item.year || "").toLowerCase().includes(q)
      );
    }

    // category filter
    if (categoryFilter !== "all") {
      result = result.filter((m) => m.categoryId === categoryFilter);
    }

    // semester filter
    if (semFilter !== "all") {
      result = result.filter((m) => m.semesterId === semFilter);
    }

    // subject filter
    if (subjectFilter !== "all") {
      result = result.filter((m) => m.subjectId === subjectFilter);
    }

    // sorting
    if (sortOption === "newest") {
      result = [...result].sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      );
    } else if (sortOption === "oldest") {
      result = [...result].sort(
        (a, b) => (a.createdAt || 0) - (b.createdAt || 0)
      );
    } else if (sortOption === "az") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    } else if (sortOption === "za") {
      result = [...result].sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }

    return result;
  }, [
    enrichedMaterials,
    query,
    categoryFilter,
    semFilter,
    subjectFilter,
    sortOption,
  ]);

  const openPDF = (id) => {
    navigate(`/pdf/${id}`);
  };

  const pageBg =
    theme === "dark"
      ? "min-h-screen bg-slate-950 text-slate-100"
      : "min-h-screen bg-slate-100 text-slate-900";

  const inputBase =
    theme === "dark"
      ? "bg-slate-900/80 text-slate-100 border-slate-700"
      : "bg-white text-slate-900 border-slate-300";

  return (
    <div className={pageBg}>
      <Navbar />

      <motion.main
        className="max-w-7xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-xs text-slate-400 hover:text-indigo-400 transition"
        >
          ← Back
        </button>

        {/* 2-column layout: left filters, right search+results */}
        <div className="grid md:grid-cols-[260px_1fr] gap-8 items-start">
          {/* LEFT: Filter panel */}
          <aside className="space-y-4 border-r border-slate-800 pr-0 md:pr-4 text-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider">
              Filters
            </h3>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={
                  inputBase +
                  " w-full rounded-2xl px-3 py-2 text-xs border outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }
              >
                <option value="all">All</option>
                {allCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block">
                Semester
              </label>
              <select
                value={semFilter}
                onChange={(e) => setSemFilter(e.target.value)}
                className={
                  inputBase +
                  " w-full rounded-2xl px-3 py-2 text-xs border outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }
              >
                <option value="all">All</option>
                {allSemesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block">
                Subject
              </label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className={
                  inputBase +
                  " w-full rounded-2xl px-3 py-2 text-xs border outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }
              >
                <option value="all">All</option>
                {allSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block">
                Sort
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={
                  inputBase +
                  " w-full rounded-2xl px-3 py-2 text-xs border outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="az">Title A → Z</option>
                <option value="za">Title Z → A</option>
              </select>
            </div>
          </aside>

          {/* RIGHT: Search + results */}
          <section>
            {/* Search bar */}
            <div className="mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes, PYQs, assignments, subjects, years..."
                className={
                  inputBase +
                  " w-full rounded-2xl px-4 py-3 text-sm border outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                }
              />
            </div>

            <h2 className="text-sm font-semibold mb-3">
              Results ({filteredResults.length})
            </h2>

            <motion.div
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.05 },
                },
              }}
            >
              {filteredResults.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 6 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  onClick={() => openPDF(item.id)}
                  className="cursor-pointer rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/70 hover:-translate-y-0.5 transition p-4 text-xs"
                >
                  <h3 className="text-sm font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {item.subjectName || item.subjectId} ·{" "}
                    {item.semesterName || item.semesterId} ·{" "}
                    {item.categoryName || item.categoryId}
                    {item.year ? ` · ${item.year}` : ""}
                  </p>
                  {item.isPremium && (
                    <span className="inline-block mt-2 px-2 py-1 rounded-full bg-amber-400 text-slate-900 text-[10px] font-semibold">
                      PREMIUM
                    </span>
                  )}
                </motion.div>
              ))}

              {filteredResults.length === 0 && (
                <p className="text-xs text-slate-500">
                  No results found. Try changing filters or search term.
                </p>
              )}
            </motion.div>
          </section>
        </div>
      </motion.main>
    </div>
  );
}

export default AdvancedSearchPage;
