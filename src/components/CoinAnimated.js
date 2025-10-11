"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ASSETS } from "../const/assets";

// Helper to check WebM support
const isWebMSupported = () => {
  if (typeof document === "undefined") return false;
  const elem = document.createElement("video");
  return !!elem.canPlayType && elem.canPlayType("video/webm; codecs='vp8, vorbis'") !== "";
};

export default function CoinAnimated({
  size = 133,
  className = "",
  label = "Animated coin",
  onClick: onClickProp,
}) {
  const [coinSrc, setCoinSrc] = useState(ASSETS.logoBig);
  const [useWebM, setUseWebM] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const timeoutsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const videoRef = useRef(null);

  // Detect WebM support
  useEffect(() => {
    setUseWebM(isWebMSupported());
  }, []);

  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const runSequence = useCallback((frames, durations) => {
    clearAllTimers();
    isAnimatingRef.current = true;
    let total = 0;

    frames.forEach((src, idx) => {
      const id = setTimeout(() => {
        setCoinSrc(src);

        // Detect spinning frame
        if (src === ASSETS.logoFlip || src === ASSETS.logoFlipWebm) {
          setIsSpinning(true);
        } else {
          setIsSpinning(false);
        }

        if (idx === frames.length - 1) {
          const endId = setTimeout(() => {
            isAnimatingRef.current = false;
            setIsSpinning(false);
          }, 20);
          timeoutsRef.current.push(endId);
        }
      }, total);

      timeoutsRef.current.push(id);
      total += durations[idx];
    });
  }, [clearAllTimers]);

  // Hover animation: Big → Black → Big
  const playHoverCycle = useCallback(() => {
    runSequence([ASSETS.logoBig, ASSETS.logoBlack, ASSETS.logoBig], [0, 160, 160]);
  }, [runSequence]);

  // Click/spin animation: Big → Flip → Big
  const playSpinCycle = useCallback(() => {
    const spinSrc = useWebM ? ASSETS.logoFlipWebm : ASSETS.logoFlip;
    runSequence([ASSETS.logoBig, spinSrc, ASSETS.logoBig], [0, 800, 0]);
  }, [runSequence, useWebM]);

  const handleMouseEnter = () => {
    if (!isAnimatingRef.current) playHoverCycle();
  };
  const handleMouseLeave = () => {
    if (!isSpinning) {
      clearAllTimers();
      isAnimatingRef.current = false;
      setCoinSrc(ASSETS.logoBig);
    }
  };
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearAllTimers();
    playSpinCycle();
    if (onClickProp) onClickProp(e);
  };

  // Force video to play when spinning
  useEffect(() => {
    if (videoRef.current && isSpinning) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => console.log("Video play failed:", err));
    }
  }, [coinSrc, isSpinning]);

  useEffect(() => () => clearAllTimers(), [clearAllTimers]);

  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div
      className={`relative select-none cursor-pointer ${className}`}
      style={containerStyle}
      aria-label={label}
      role="button"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      {coinSrc.endsWith(".webm") ? (
        <video
          ref={videoRef}
          src={coinSrc}
          autoPlay
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
          key={coinSrc}
        />
      ) : (
        <img
          src={coinSrc}
          alt="Animated coin"
          style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
          key={coinSrc}
        />
      )}
    </div>
  );
}
