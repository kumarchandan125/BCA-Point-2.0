// src/pages/CategoryPage.jsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import { useTheme } from "../theme/ThemeContext";
import { useMergedData } from "../hooks/useMergedData";

function CategoryPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const { allCategories, allSemesters } = useMergedData();

  const isDark = theme === "dark";

  const currentCategory = allCategories.find((c) => c.id === categoryId);

  // Semesters list:
  // - Base semesters (jinme categoryId nahi hai) sab categories me dikhenge
  // - Admin-added semesters jinke paas categoryId hai, sirf ussi category par dikhenge
  const categorySemesters = useMemo(
    () =>
      allSemesters.filter((sem) => {
        if (sem.categoryId) {
          // admin-created semester, link to specific category
          return sem.categoryId === categoryId;
        }
        // base semesters (no categoryId) -> available for all categories
        return true;
      }),
    [allSemesters, categoryId]
  );

  const pageBg = isDark
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-100 text-slate-900";

  const cardClass =
    "rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/70 hover:-translate-y-[2px] transition cursor-pointer px-4 py-3";

  const handleBack = () => {
    navigate(-1);
  };

  const openSemester = (semId) => {
    navigate(`/category/${categoryId}/semester/${semId}`);
  };

  return (
    <div className={pageBg}>
      <Navbar />

      <motion.main
        className="max-w-6xl mx-auto px-4 py-6 md:py-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Top bar + breadcrumb */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            onClick={handleBack}
            className="text-xs text-slate-400 hover:text-indigo-400 transition"
          >
            ← Back
          </button>

          {currentCategory && (
            <p className="text-[11px] text-slate-500 text-right">
              Category · <span className="text-slate-300">{currentCategory.title}</span>
            </p>
          )}
        </div>

        {/* Header */}
        <section className="mb-4">
          <h1 className="text-xl font-semibold">
            {currentCategory?.title || "Category"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentCategory?.description || "Select semester to view materials."}
          </p>
        </section>

        {/* Semesters list */}
        <section className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categorySemesters.length === 0 ? (
            <p className="text-xs text-slate-500">
              No semesters found for this category.
            </p>
          ) : (
            categorySemesters.map((sem) => (
              <motion.div
                key={sem.id}
                className={cardClass}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.18 }}
                onClick={() => openSemester(sem.id)}
              >
                <h2 className="text-sm font-semibold mb-1">
                  {sem.name}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {currentCategory?.title || "Category"} · Semester
                </p>
              </motion.div>
            ))
          )}
        </section>
      </motion.main>
    </div>
  );
}

export default CategoryPage;
