"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Updated import for the new file
const ControllerScene = dynamic(
  () => import("../components/ControllerModel/ControllerScene"),
  { ssr: false } // disable server-side rendering
);

export default function Usp() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
  
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // disconnects after the section becomes visible
        }
      },
      {
        threshold: 0,
        rootMargin: "100% 0px 100% 0px" // triggers when section is 1 viewport above or below
      }
    );
  
    observer.observe(sectionRef.current);
  
    return () => observer.disconnect();
  }, []);
  

  // Fallback idle preloader in case Hero didn't trigger it (e.g., immediate scroll)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const run = () => {
      import("@/components/ControllerModel/preloadAssets")
        .then((m) => m.preloadControllerAssets?.())
        .catch(() => {});
      // Pre-warm the scene module as well
      import("@/components/ControllerModel/ControllerScene").catch(() => {});
    };
    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 1000 });
    } else {
      setTimeout(run, 500);
    }
  }, []);

  return (
    <section
      id="usp"
      ref={sectionRef}
      className="relative w-screen max-w-[100vw] h-[100svh] bg-black overflow-hidden flex items-center justify-center"
    >
      <div className="w-full sm:w-[95vw] max-w-[100vw] aspect-[16/9] flex justify-center items-center overflow-hidden">
        {/* Always mount the scene so assets are ready; animate in on visibility */}
        <ControllerScene animateIn={isVisible} />
      </div>

      {/* Tap Indicator */}
{/* Tap Indicator */}
<div
  className="absolute left-5 z-40 bottom-[15vh] md:bottom-5"
  aria-hidden="false"
>
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: [0.7, 1, 0.7], scale: [0.98, 1, 0.98] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    className="flex items-center gap-3 text-white rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
  >
    <div className="relative flex-shrink-0">
      {/* Finger pointing down */}
      <motion.svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path 
          d="M12 2C12.5523 2 13 2.44772 13 3V10H15C15.5523 10 16 10.4477 16 11V14C16 14.5523 15.5523 15 15 15H14L13 21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21L10 15H9C8.44772 15 8 14.5523 8 14V11C8 10.4477 8.44772 10 9 10H11V3C11 2.44772 11.4477 2 12 2Z" 
          fill="currentColor"
          opacity="0.9"
        />
      </motion.svg>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-white/40"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.1, 0.4]
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
    
    <span className="text-sm tracking-wide uppercase opacity-90 whitespace-nowrap">
      Tap the button
    </span>
  </motion.div>
</div>



      
    </section>
  );
}