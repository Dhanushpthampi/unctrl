"use client";

import { useEffect, useState } from "react";
import { ASSETS } from "@/const/assets";

export default function IntroOverlay({ onFinished }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // pick correct video client-side
  const [videoSrc, setVideoSrc] = useState(null);
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setVideoSrc(isMobile ? ASSETS.introV : ASSETS.intro);
  }, []);

  if (!videoSrc) return null; // wait until client-side

  const handleVideoEnd = () => {
    setIsFadingOut(true);
    setTimeout(() => onFinished?.(), 700);
  };

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => onFinished?.(), 700);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full transition-opacity duration-700 z-[9999] bg-black flex items-center justify-center ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ height: "var(--vh, 100vh)" }} // iOS-safe dynamic viewport height
    >
      {/* Loading screen */}
      {!videoLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span className="text-white/80">Loading intro...</span>
        </div>
      )}

      {/* Video */}
      <video
        className={`w-full h-full object-cover transition-opacity duration-500 z-0 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        playsInline
        onCanPlayThrough={() => setVideoLoaded(true)}
        onEnded={handleVideoEnd}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-20 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-colors"
      >
        Skip
      </button>
    </div>
  );
}
