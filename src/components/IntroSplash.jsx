// src/components/IntroSplash.jsx
import { motion } from "framer-motion";

function IntroSplash() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="text-center px-6"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.05, opacity: 0, y: -10 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-400 mb-3">
          BCA Point 2.0
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-2">
          Your Best Study Companion
        </h1>
        <p className="text-sm text-slate-400">
          All semesters · Notes · PYQs · Syllabus in one clean place.
        </p>
      </motion.div>
    </motion.div>
  );
}

export default IntroSplash;
