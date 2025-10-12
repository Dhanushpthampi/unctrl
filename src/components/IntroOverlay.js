// file: components/IntroOverlay.js
"use client";

import { useEffect, useState } from "react";
import { ASSETS } from "../const/assets";
import MobileVideo from "./MobileVideo";

export default function IntroOverlay({ onFinished }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [videoSrc, setVideoSrc] = useState(ASSETS.intro);

  // Determine correct video source (desktop vs mobile)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateVideoSrc = () => {
      if (window.innerWidth <= 768) {
        setVideoSrc(ASSETS.introV); // vertical version for mobile
      } else {
        setVideoSrc(ASSETS.intro); // desktop version
      }
    };

    updateVideoSrc();
    window.addEventListener("resize", updateVideoSrc);

    return () => window.removeEventListener("resize", updateVideoSrc);
  }, []);

  // Handle video events
  const handleVideoCanPlay = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoEnd = () => {
    setIsFadingOut(true);
    setTimeout(() => onFinished?.(), 700);
  };

  const handleVideoError = () => {
    console.warn("Intro video failed to load, skipping intro");
    setIsFadingOut(true);
    setTimeout(() => onFinished?.(), 700);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-700
      ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Skip button for mobile browsers */}
      <button
        onClick={() => {
          setIsFadingOut(true);
          setTimeout(() => onFinished?.(), 700);
        }}
        className="absolute top-4 right-4 z-10 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-colors"
      >
        Skip
      </button>
      
      <MobileVideo
        src={videoSrc}
        className={`w-full h-full transition-opacity duration-500 ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay={true}
        loop={false}
        muted={true}
        onCanPlay={handleVideoCanPlay}
        onEnded={handleVideoEnd}
        onError={handleVideoError}
      />
    </div>
  );
}
