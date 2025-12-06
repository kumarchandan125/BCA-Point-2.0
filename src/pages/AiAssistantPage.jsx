// src/pages/AiAssistantPage.jsx
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function getLocalAiReply(message) {
  const text = message.toLowerCase();

  if (text.includes("dbms")) {
    return "DBMS ke liye pehle ER model, keys (primary/foreign) aur normalization (1NF–3NF) strong karo. Phir PYQs se practice karo. Tumhare BCA Point 2.0 me bhi DBMS notes/PYQs check kar sakte ho.";
  }

  if (text.includes("c programming") || text.includes("c lang")) {
    return "C programming ke liye pehle control flow (if/else, loops), arrays, strings aur functions clear karo. Daily 5–10 small programs likho jaise pattern printing, max/min, sum of array, etc.";
  }

  if (text.includes("exam") || text.includes("prepare")) {
    return "Exam ke liye best approach: 1) Syllabus dekho 2) Har unit ke 2–3 strong notes banao 3) PYQs se important questions identify karo 4) Revision ke last 2 din sirf short notes + PYQs.";
  }

  if (text.includes("os") || text.includes("operating system")) {
    return "OS me scheduling algorithms, deadlock, memory management (paging, segmentation) aur file systems most important hote hain. Har topic ke 1–2 numerical zaroor solve karo.";
  }

  if (text.includes("pyq") || text.includes("previous year")) {
    return "PYQ ka use karo pattern samajhne ke liye: kaun se questions bar-bar repeat hote hain. Pehle unhe tayar karo, fir nayi cheezein padho. BCA Point 2.0 me PYQ filter se bhi search kar sakte ho.";
  }

  return "Samajh gaya 👍 Tum thoda aur specific likho: kaun sa subject (DBMS, C, OS, etc.) aur kya problem (theory, numericals, preparation plan)? Main uske hisaab se guide karunga.";
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi 😄 Main tumhara study assistant hoon. Tum BCA ka kaun sa subject ya topic padhna chahte ho? (e.g. DBMS keys, C programming loops, OS scheduling...)",
      time: "now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    const replyText = getLocalAiReply(trimmed);

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: replyText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Navbar top */}
      <Navbar />

      {/* Main chat area – takes remaining height */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 pt-4 pb-6 flex flex-col gap-4">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              AI STUDY ASSISTANT
            </p>
            <h1 className="text-lg sm:text-xl font-semibold mt-1">
              Ask doubts, get instant guidance ⚡
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Abhi ye local demo hai (frontend only). Baad me isse real AI se
              connect kar sakte ho jab backend ready ho.
            </p>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col overflow-hidden"
        >
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-3 py-2.5 text-xs sm:text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-slate-950 rounded-br-sm"
                      : "bg-slate-800/80 text-slate-50 border border-slate-700/80 rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>
                  <p
                    className={`mt-1 text-[10px] ${
                      msg.sender === "user"
                        ? "text-slate-900/70"
                        : "text-slate-400"
                    }`}
                  >
                    {msg.sender === "user" ? "You" : "Assistant"} • {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-800/70 border border-slate-700/80 px-3 py-2 text-[11px] text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Thinking…
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-slate-800 bg-slate-900/80 px-3 sm:px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 resize-none rounded-2xl bg-slate-900 border border-slate-700/80 px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500/70 focus:border-sky-500/70"
                placeholder="Example: Suggest a 7-day plan for DBMS revision..."
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-950 shadow-md shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-400">
              <button
                onClick={() =>
                  setInput("DBMS ke liye exam se pehle kaise prepare karu?")
                }
                className="px-2.5 py-1 rounded-full border border-slate-700 hover:border-slate-500 hover:text-slate-200 transition"
              >
                DBMS prep
              </button>
              <button
                onClick={() =>
                  setInput(
                    "C programming loops aur pattern printing kaise strong karu?"
                  )
                }
                className="px-2.5 py-1 rounded-full border border-slate-700 hover:border-slate-500 hover:text-slate-200 transition"
              >
                C programming
              </button>
              <button
                onClick={() =>
                  setInput("Mujhe ek weekly study routine suggest karo.")
                }
                className="px-2.5 py-1 rounded-full border border-slate-700 hover:border-slate-500 hover:text-slate-200 transition"
              >
                Study routine
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
}
