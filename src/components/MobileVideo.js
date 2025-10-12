"use client";

import { useEffect, useRef, useState } from "react";

export default function MobileVideo({ 
  src, 
  poster, 
  className = "", 
  autoPlay = true, 
  loop = true, 
  muted = true,
  onError,
  onCanPlay,
  ...props 
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setShowPlayButton(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = (e) => {
      console.warn("Video error:", e);
      setHasError(true);
      onError?.(e);
    };

    const handleCanPlay = () => {
      onCanPlay?.();
      // Try to play on canplay for better mobile support
      if (autoPlay) {
        video.play().catch(() => {
          console.log("Autoplay blocked, showing play button");
          setShowPlayButton(true);
        });
      }
    };

    const handleUserInteraction = () => {
      if (showPlayButton) {
        video.play().catch(console.warn);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleCanPlay);

    // Add user interaction listeners for mobile browsers
    document.addEventListener("touchstart", handleUserInteraction, { once: true });
    document.addEventListener("click", handleUserInteraction, { once: true });

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("click", handleUserInteraction);
    };
  }, [autoPlay, onError, onCanPlay, showPlayButton]);

  if (hasError) {
    return (
      <div className={`${className} bg-black flex items-center justify-center`}>
        <p className="text-white">Video not supported</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className={`w-full h-full object-cover ${className}`}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        preload="metadata"
        {...props}
      />
      
      {/* Play button overlay for mobile browsers */}
      {showPlayButton && (
        <button
          onClick={() => {
            videoRef.current?.play().catch(console.warn);
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
