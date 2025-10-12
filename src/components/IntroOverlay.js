// file: components/IntroOverlay.js
"use client";

import { useEffect, useRef, useState } from "react";
import { ASSETS } from "../const/assets";

export default function IntroOverlay({ onFinished }) {
  const videoRef = useRef(null);
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

  // Handle video events: canplay & ended
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsVideoLoaded(true);
    const handleEnd = () => {
      setIsFadingOut(true);
      setTimeout(() => onFinished?.(), 700);
    };

    const handleError = () => {
      // Fallback: if video fails to load, skip intro
      console.warn("Video failed to load, skipping intro");
      setIsFadingOut(true);
      setTimeout(() => onFinished?.(), 700);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnd);
    video.addEventListener("error", handleError);

    // Start video with better error handling
    video.currentTime = 0;
    video.load();
    
    // Try to play with user interaction fallback
    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn("Autoplay failed, video will play on user interaction");
        // If autoplay fails, we'll let the user interaction start it
        setIsVideoLoaded(true);
      }
    };
    
    playVideo();

    // Preload heavy 3D assets
    // import("@/components/ControllerModel/preloadAssets")
    //   .then((m) => m.preloadControllerAssets?.())
    //   .catch(() => {});

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnd);
      video.removeEventListener("error", handleError);
      video.pause();
    };
  }, [videoSrc, onFinished]);

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
      <video
        ref={videoRef}
        src={videoSrc}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
        muted
        playsInline
        autoPlay
        preload="metadata" // better for initial load
      />
    </div>
  );
}
