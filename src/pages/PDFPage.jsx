// src/pages/PDFPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import PDFViewer from "../components/PDFViewer";
import materials from "../data/materials.json";
import { useTheme } from "../theme/ThemeContext";
import { useToast } from "../toast/ToastProvider";

function PDFPage() {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const material = materials.find((m) => m.id === materialId);
  const [bookmarked, setBookmarked] = useState(false);

  // mark as viewed (unique)
  useEffect(() => {
    if (!material) return;
    const raw = localStorage.getItem("bca_viewed") || "[]";
    let viewed = [];

    try {
      viewed = JSON.parse(raw);
    } catch {
      viewed = [];
    }

    if (!viewed.includes(material.id)) {
      viewed.push(material.id);
      localStorage.setItem("bca_viewed", JSON.stringify(viewed));
    }
  }, [material]);

  // check bookmark state
  useEffect(() => {
    if (!material) return;
    const raw = localStorage.getItem("bca_viewed") || "[]";
    let viewed = [];

    try {
      viewed = JSON.parse(raw);
    } catch {
      viewed = [];
    }

    const id = material.id;

    // agar pehle se list me hai to usko remove karke last me daal do
    const existingIndex = viewed.indexOf(id);
    if (existingIndex !== -1) {
      viewed.splice(existingIndex, 1);
    }

    viewed.push(id); // ab ye sabse recent hoga
    localStorage.setItem("bca_viewed", JSON.stringify(viewed));
  }, [material]);

  const toggleBookmark = () => {
    if (!material) return;
    const raw = localStorage.getItem("bca_bookmarks") || "[]";
    let saved = [];

    try {
      saved = JSON.parse(raw);
    } catch {
      saved = [];
    }

    if (saved.includes(material.id)) {
      saved = saved.filter((id) => id !== material.id);
      setBookmarked(false);
      showToast("Removed from saved notes", "success");
    } else {
      saved.push(material.id);
      setBookmarked(true);
      showToast("Saved to your notes", "success");
    }

    localStorage.setItem("bca_bookmarks", JSON.stringify(saved));
  };

  if (!material) {
    return (
      <div
        className={
          theme === "dark"
            ? "min-h-screen bg-slate-950 text-slate-100"
            : "min-h-screen bg-slate-100 text-slate-900"
        }
      >
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-sm text-red-400">Material not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen bg-slate-950 text-slate-100 flex flex-col"
          : "min-h-screen bg-slate-100 text-slate-900 flex flex-col"
      }
    >
      <Navbar />
      <motion.main
        className="max-w-6xl mx-auto px-4 py-4 flex-1 flex flex-col gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-slate-400 hover:text-indigo-400"
        >
          ← Back
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm md:text-base font-semibold line-clamp-2">
            {material.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBookmark}
              className={
                (bookmarked
                  ? "bg-amber-400 text-slate-900"
                  : "bg-slate-900/80 text-slate-100 border border-slate-700") +
                " text-[11px] px-3 py-1.5 rounded-full hover:opacity-90 transition"
              }
            >
              {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
            </button>

            <a
              href={material.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 transition"
            >
              Download PDF
            </a>
          </div>
        </div>

        <div className="flex-1 min-h-[400px]">
          <PDFViewer url={material.pdfUrl} />
        </div>
      </motion.main>
    </div>
  );
}

export default PDFPage;
