"use client";

import { useState, useEffect, useRef } from "react";
import { ASSETS } from "@/const/assets";

export default function IntroOverlay({ onFinished }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef(null);
  const loaderTimeoutRef = useRef(null);

  useEffect(() => {
    // Failsafe: if video doesn't load within 5 seconds, automatically skip.
    loaderTimeoutRef.current = setTimeout(() => {
      console.warn("Intro video load timeout. Auto-skipping.");
      handleSkip();
    }, 5000);

    return () => clearTimeout(loaderTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    
    // Determine source once on client immediately
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    videoRef.current.src = isMobile ? ASSETS.introV : ASSETS.intro;
    videoRef.current.load();
    
    // explicitly play
    videoRef.current.play().catch(e => {
        console.warn("Autoplay blocked or failed:", e);
        // If autoplay breaks, just skip
        handleSkip();
    });
  }, []);

  const handleVideoEnd = () => {
    setIsFadingOut(true);
    setTimeout(() => onFinished?.(), 700);
  };

  const handleSkip = () => {
    setIsFadingOut(true);
    if (loaderTimeoutRef.current) clearTimeout(loaderTimeoutRef.current);
    setTimeout(() => onFinished?.(), 700);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full transition-opacity duration-700 z-[9999] bg-black flex items-center justify-center ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ height: "var(--vh, 100vh)" }} // iOS-safe dynamic viewport height
    >
      {/* Loading spinner while video is buffering */}
      {!videoLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span className="text-white/80">Loading intro...</span>
        </div>
      )}

      {/* Responsive Video via <source media> — browser natively downloads the correct one */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 z-0 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        playsInline
        onLoadedData={() => {
          setVideoLoaded(true);
          if (loaderTimeoutRef.current) clearTimeout(loaderTimeoutRef.current);
        }}
        onEnded={handleVideoEnd}
      />

      {/* Skip button overlay */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-20 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-colors"
      >
        Skip
      </button>
    </div>
  );
}
