"use client";

import { useEffect, useRef, forwardRef, useCallback } from "react";

/**
 * MobileVideo — ultra-optimised lazy video for smooth scrolling.
 *
 * Lifecycle:
 *  1. Renders with NO src and preload="none" — zero network/decode cost.
 *  2. When within 400px of viewport → sets src, loads, and plays.
 *  3. When scrolled out of viewport → pauses immediately.
 *  4. When scrolled far away (>1200px) → removes src entirely to free memory.
 *     (Re-loads when scrolled back near.)
 *
 * All DOM mutations go through refs — zero React re-renders during scroll.
 */
const MobileVideo = forwardRef(function MobileVideo(
  {
    src,
    poster,
    className = "",
    autoPlay = true,
    loop = true,
    muted = true,
    onError,
    onCanPlay,
    onEnded,
    ...props
  },
  ref
) {
  const internalRef = useRef(null);
  const videoEl = ref || internalRef;
  const loadedRef = useRef(false);
  const srcRef = useRef(src);

  srcRef.current = src;

  const getVideo = useCallback(() => {
    return typeof videoEl === "object" ? videoEl.current : internalRef.current;
  }, [videoEl]);

  useEffect(() => {
    const video = getVideo();
    if (!video) return;

    // NEAR observer: load src + play when close to viewport
    const nearIO = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src || video.src === "" || video.src === window.location.href) {
            video.preload = "auto";
            video.src = srcRef.current;
            video.load();
            loadedRef.current = true;
          }
          if (autoPlay) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "400px 0px", threshold: 0.01 }
    );

    // FAR observer: unload src when very far away to reclaim memory
    const farIO = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && loadedRef.current) {
          // Video is far off-screen — free the decoded video data
          video.pause();
          video.removeAttribute("src");
          video.load(); // resets internal state, frees buffers
          video.preload = "none";
          loadedRef.current = false;
        }
      },
      { rootMargin: "1200px 0px", threshold: 0 }
    );

    nearIO.observe(video);
    farIO.observe(video);

    /* ── Event handlers ── */
    const handleError = (e) => onError?.(e);
    const handleCanPlay = () => {
      onCanPlay?.();
      if (autoPlay) video.play().catch(() => {});
    };
    const handleEnded = () => onEnded?.();

    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);

    return () => {
      nearIO.disconnect();
      farIO.disconnect();
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  // If parent changes src prop while loaded, update directly
  useEffect(() => {
    const video = getVideo();
    if (video && loadedRef.current && video.src !== src) {
      video.src = src;
      video.load();
      if (autoPlay) video.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <video
      ref={videoEl}
      poster={poster}
      className={`w-full h-full object-cover ${className}`}
      loop={loop}
      muted={muted}
      playsInline
      preload="none"
      {...props}
    />
  );
});

export default MobileVideo;
