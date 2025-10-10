// file: components/IntroOverlay.js
"use client";

import { useEffect, useRef, useState } from "react";

export default function IntroOverlay({ onFinished }) {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  // Keep src stable between SSR and initial client render to avoid hydration mismatch
  const [videoSrc, setVideoSrc] = useState("/assets/videos/intro.mp4");

  useEffect(() => {
    // After mount, adjust source based on device size
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setVideoSrc("/assets/videos/introVertical.mp4");
    }

    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsVideoLoaded(true);
    const handleEnd = () => onFinished?.();

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnd);

    // Start loading and autoplay
    const tryPlay = () => {
      try {
        video.currentTime = 0;
      } catch {}
      video.load();
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // iOS/Safari may block autoplay until muted is set and play called again
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    };
    tryPlay();

    // Kick off controller asset preloading ASAP in parallel with intro
    import("@/components/ControllerModel/preloadAssets")
      .then((m) => m.preloadControllerAssets?.())
      .catch(() => {});

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnd);
      video.pause();
    };
  }, [onFinished]);

  // Re-run play when the src changes after mount (mobile switch)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Reset load state for fade
    setIsVideoLoaded(false);
    const p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  }, [videoSrc]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      <video
        ref={videoRef}
        src={videoSrc}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
        muted
        playsInline
        autoPlay
        preload="auto"
      />
    </div>
  );
}
