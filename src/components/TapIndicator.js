"use client";

import { motion } from "framer-motion";

export default function TapIndicator() {
  return (
    <div
      className="absolute left-5 z-40 bottom-5 hidden sm:block"
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0.7, 1, 0.7], scale: [0.98, 1, 0.98] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-3 text-white rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
      >
        <motion.img
          src="/images/Cursor_1011.png"
          alt="Tap indicator"
          className="w-6 h-6"
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <span className="text-sm tracking-wide uppercase opacity-90 whitespace-nowrap">
          Tap the button
        </span>
      </motion.div>
    </div>
  );
}
