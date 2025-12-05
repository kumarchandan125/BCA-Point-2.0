// src/pages/SemesterPage.jsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import { useTheme } from "../theme/ThemeContext";
import { useMergedData } from "../hooks/useMergedData";

function SemesterPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { categoryId, semesterId } = useParams();

  const { allCategories, allSemesters, allSubjects } = useMergedData();

  const isDark = theme === "dark";

  const currentCategory = allCategories.find((c) => c.id === categoryId);
  const currentSemester = allSemesters.find((s) => s.id === semesterId);

  // 🔹 Is semester ke saare subjects (base + admin)
  const semesterSubjects = useMemo(
    () => allSubjects.filter((s) => s.semesterId === semesterId),
    [allSubjects, semesterId]
  );

  const pageBg = isDark
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-100 text-slate-900";

  const cardClass =
    "rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/70 hover:-translate-y-[2px] transition cursor-pointer px-4 py-3";

  const handleBack = () => {
    navigate(-1);
  };

  const openSubject = (subjectId) => {
    navigate(
      `/category/${categoryId}/semester/${semesterId}/subject/${subjectId}`
    );
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

          {currentCategory && currentSemester && (
            <p className="text-[11px] text-slate-500 text-right">
              {currentCategory.title} ·{" "}
              <span className="text-slate-300">{currentSemester.name}</span>
            </p>
          )}
        </div>

        {/* Header */}
        <section className="mb-4">
          <h1 className="text-xl font-semibold">
            {currentSemester?.name || "Semester"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentCategory?.title || "Category"} · Subjects
          </p>
        </section>

        {/* Subjects list */}
        <section className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {semesterSubjects.length === 0 ? (
            <p className="text-xs text-slate-500">
              No subjects found for this semester yet.
            </p>
          ) : (
            semesterSubjects.map((sub) => (
              <motion.div
                key={sub.id}
                className={cardClass}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.18 }}
                onClick={() => openSubject(sub.id)}
              >
                <h2 className="text-sm font-semibold mb-1">
                  {sub.name}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {currentSemester?.name || "Semester"} · Subject
                </p>
              </motion.div>
            ))
          )}
        </section>
      </motion.main>
    </div>
  );
}

export default SemesterPage;
