// file: components/IntroOverlay.js
"use client";

import { useEffect, useRef, useState } from "react";

export default function IntroOverlay({ onFinished }) {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [videoSrc, setVideoSrc] = useState("/assets/videos/intro.mp4");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const video = videoRef.current;
    if (!video) return;

    // Pick correct video version
    if (window.innerWidth <= 768) {
      setVideoSrc("/assets/videos/introVertical.mp4");
    }

    // When video can start playing
    const handleCanPlay = () => setIsVideoLoaded(true);

    // When video ends → fade out before finishing
    const handleEnd = () => {
      setIsFadingOut(true);
      // Wait for fade-out to complete before calling onFinished
      setTimeout(() => onFinished?.(), 700);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnd);

    // Start loading & autoplay
    video.currentTime = 0;
    video.load();
    video.play().catch(() => {});

    // Preload heavy 3D assets while video plays
    import("@/components/ControllerModel/preloadAssets")
      .then((m) => m.preloadControllerAssets?.())
      .catch(() => {});

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnd);
      video.pause();
    };
  }, [onFinished]);

  // Replay when source changes (mobile vs desktop)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setIsVideoLoaded(false);
    video.load();
    video.play().catch(() => {});
  }, [videoSrc]);

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
        preload="auto"
      />
    </div>
  );
}
