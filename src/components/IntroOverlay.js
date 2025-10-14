"use client";

import { useEffect, useState } from "react";
import { ASSETS } from "@/const/assets";

export default function IntroOverlay({ onFinished }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Pick correct video client-side
  const [videoSrc, setVideoSrc] = useState(null);
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setVideoSrc(isMobile ? ASSETS.introV : ASSETS.intro);
  }, []);

  if (!videoSrc) return null;

  const handleVideoEnd = () => {
    setIsFadingOut(true);
    setTimeout(() => onFinished?.(), 700);
  };

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => onFinished?.(), 700);
  };

  // Track loading progress
  const handleProgress = (e) => {
    const video = e.target;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration;
      if (duration > 0) {
        setLoadProgress((bufferedEnd / duration) * 100);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-700
      ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      {/* Enhanced loading screen */}
      {!videoLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black">
          {/* Animated spinner */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-white border-r-white/60 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          
          {/* Loading text with animation */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-white/90 text-lg font-medium animate-pulse">
              Loading experience...
            </span>
            
            {/* Progress bar */}
            <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-white/60 to-white transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              ></div>
            </div>
            
            <span className="text-white/50 text-sm">
              {Math.round(loadProgress)}%
            </span>
          </div>
        </div>
      )}

      {/* Video with optimizations */}
      <video
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
        onProgress={handleProgress}
        onEnded={handleVideoEnd}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Skip button - only show when video is loaded */}
      {videoLoaded && (
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-10 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-all hover:scale-105"
        >
          Skip
        </button>
      )}
    </div>
  );
}