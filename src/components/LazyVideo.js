"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * LazyVideo — lightweight lazy video using refs (no re-renders during scroll).
 */
export default function LazyVideo({ src, className, ...props }) {
  const videoRef = useRef(null);
  const loadedRef = useRef(false);
  const srcRef = useRef(src);
  srcRef.current = src;

  const loadAndPlay = useCallback((video) => {
    if (!video || loadedRef.current) return;
    loadedRef.current = true;
    video.preload = "auto";
    video.src = srcRef.current;
    video.load();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video) return;
        if (entry.isIntersecting) {
          loadAndPlay(video);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "300px 0px", threshold: 0.01 }
    );

    observer.observe(video);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If parent changes src while already loaded, update directly
  useEffect(() => {
    const video = videoRef.current;
    if (video && loadedRef.current && video.src !== src) {
      video.src = src;
      video.load();
      video.play().catch(() => {});
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      preload="none"
      muted
      loop
      playsInline
      {...props}
    />
  );
}
