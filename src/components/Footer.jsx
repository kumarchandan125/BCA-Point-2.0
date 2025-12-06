// src/components/Footer.jsx

export default function Footer() {
  const handleBackToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="mt-10">
      <div className="border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Credits */}
          <div className="text-center md:text-left space-y-1">
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} BCA Point 2.0 • All Rights Reserved
            </p>

            <p className="text-[11px] text-slate-500">
              Made with
              <span className="text-red-400 mx-1 animate-pulse">❤️</span>
              by
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent font-semibold mx-1">
                Chandan Pandey
              </span>
              • BCA Semester 2
            </p>

            <p className="text-[10px] text-slate-500/80">
              Version
              <span className="ml-1 text-slate-300 font-medium">
                v2.0.1
              </span>
            </p>
          </div>

          {/* Center: Social icons */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            {/* GitHub */}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-900/90 transition text-slate-300"
            >
              <span>🐙</span>
              <span className="hidden sm:inline">GitHub</span>
            </a>

            {/* Instagram */}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 hover:border-pink-500/70 hover:bg-slate-900/90 transition text-slate-300"
            >
              <span>📸</span>
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>

          {/* Right: Back to top */}
          <div className="flex md:justify-end justify-center w-full md:w-auto">
            <button
              onClick={handleBackToTop}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 text-[11px] text-slate-200 hover:border-sky-500 hover:bg-slate-900/90 hover:text-white transition"
            >
              ⬆️ Back to top
            </button>
          </div>
        </div>

        {/* Glow strip */}
        <div className="pointer-events-none mx-auto h-1 w-40 rounded-full bg-gradient-to-r from-indigo-500/40 via-sky-400/40 to-emerald-400/40 blur-xl opacity-70" />
      </div>
    </footer>
  );
}
