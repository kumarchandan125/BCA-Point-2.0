// src/pages/SubjectPage.jsx
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import { useTheme } from "../theme/ThemeContext";
import { useMergedData } from "../hooks/useMergedData";

function SubjectPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { categoryId, semesterId, subjectId } = useParams();

  const { allCategories, allSemesters, allSubjects, allMaterials } =
    useMergedData();

  const isDark = theme === "dark";

  // find current category / semester / subject metadata
  const currentCategory = allCategories.find((c) => c.id === categoryId);
  const currentSemester = allSemesters.find((s) => s.id === semesterId);
  const currentSubject = allSubjects.find((s) => s.id === subjectId);

  // filter materials for this subject path
  const subjectMaterials = useMemo(
    () =>
      allMaterials.filter(
        (m) =>
          m.categoryId === categoryId &&
          m.semesterId === semesterId &&
          m.subjectId === subjectId
      ),
    [allMaterials, categoryId, semesterId, subjectId]
  );

  const pageBg = isDark
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-100 text-slate-900";

  const cardBase =
    "rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/70 hover:-translate-y-[2px] transition cursor-pointer px-4 py-3";

  const handleBack = () => {
    navigate(-1);
  };

  const openPDF = (id) => {
    navigate(`/pdf/${id}`);
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
        {/* Back and breadcrumb */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            onClick={handleBack}
            className="text-xs text-slate-400 hover:text-indigo-400 transition"
          >
            ← Back
          </button>

          {currentCategory && currentSemester && currentSubject && (
            <p className="text-[11px] text-slate-500 text-right">
              {currentCategory.title} · {currentSemester.name} ·{" "}
              <span className="text-slate-300">{currentSubject.name}</span>
            </p>
          )}
        </div>

        {/* Header */}
        <section className="mb-4">
          <h1 className="text-xl font-semibold">
            {currentSubject?.name || "Subject"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentSemester?.name || semesterId} ·{" "}
            {currentCategory?.title || categoryId}
          </p>
        </section>

        {/* Materials list */}
        <section className="space-y-3 mt-4">
          {subjectMaterials.length === 0 ? (
            <p className="text-xs text-slate-500">
              No study materials found for this subject yet.
            </p>
          ) : (
            subjectMaterials.map((m) => (
              <motion.div
                key={m.id}
                className={cardBase}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.18 }}
                onClick={() => openPDF(m.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold mb-1">
                      {m.title}
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      {currentSubject?.name || m.subjectId} ·{" "}
                      {m.year ? m.year : "Material"}
                    </p>
                    {m.fileName && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        File: {m.fileName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {m.isPremium && (
                      <span className="px-2 py-1 rounded-full bg-amber-400 text-slate-900 text-[10px] font-semibold">
                        PREMIUM
                      </span>
                    )}
                    <span className="text-[11px] text-indigo-400">
                      Open PDF →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </section>
      </motion.main>
    </div>
  );
}

export default SubjectPage;
