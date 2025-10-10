"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

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
      className="relative w-screen max-w-[100vw] min-h-[100svh] bg-black overflow-hidden flex items-center justify-center"
    >
      <div className="w-full sm:w-[95vw] max-w-[100vw] aspect-[16/9] flex justify-center items-center overflow-hidden">
        {/* Always mount the scene so assets are ready; animate in on visibility */}
        <ControllerScene animateIn={isVisible} />
      </div>
      
    </section>
  );
}
