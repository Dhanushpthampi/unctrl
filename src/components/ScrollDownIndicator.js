"use client";

import { motion } from "framer-motion";

export default function ScrollDownIndicator({ className = "" }) {
  const scrollByOneSection = (direction = 1, sourceEl) => {
    if (typeof document === "undefined") return;
    const main = document.querySelector("main") || document;
    const sections = Array.from(main.querySelectorAll("section[id]"));
    if (!sections.length) return;

    // Try determine current section relative to a button inside a section
    const currentSection = sourceEl?.closest?.("section[id]") ?? null;
    let idx = currentSection ? sections.indexOf(currentSection) : -1;

    if (idx < 0) {
      // Fallback: choose section that contains the viewport midpoint
      const mid = window.scrollY + window.innerHeight / 2;
      const tops = sections.map((el) => el.getBoundingClientRect().top + window.scrollY);
      // Find the last section whose top is <= mid
      idx = 0;
      for (let i = 0; i < tops.length; i++) {
        if (tops[i] <= mid) idx = i; else break;
      }
    }

    const targetIndex = Math.max(0, Math.min(sections.length - 1, idx + (direction > 0 ? 1 : -1)));
    const target = sections[targetIndex];
    if (target && target !== currentSection) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={`hidden md:flex fixed right-5 bottom-5 z-40 ${className}`}
      aria-hidden="false"
    >
      <div className="flex flex-col items-center gap-2 text-white rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: [0.5, 1, 0.5], y: [0, -3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 focus:outline-none hover:text-orange-300 transition-colors"
          onClick={(e) => scrollByOneSection(-1, e.currentTarget)}
          aria-label="Scroll to previous section"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase opacity-70">Up</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        <div className="w-8 h-px bg-white/20 self-stretch rotate-90 md:rotate-0" />

        <motion.button
          type="button"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: [0.5, 1, 0.5], y: [0, 3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 focus:outline-none hover:text-orange-300 transition-colors"
          onClick={(e) => scrollByOneSection(1, e.currentTarget)}
          aria-label="Scroll to next section"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase opacity-70">Down</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}


