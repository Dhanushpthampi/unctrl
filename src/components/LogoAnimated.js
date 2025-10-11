"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ASSETS } from "../const/assets";

// Helper to check WebM support
const isWebMSupported = () => {
  if (typeof document === "undefined") return false;
  const elem = document.createElement("video");
  return !!elem.canPlayType && elem.canPlayType("video/webm; codecs='vp8, vorbis'") !== "";
};

export default function LogoAnimated({
  size,
  baseSize,
  overlaySize,
  overlayOffsetX = 0,
  overlayOffsetY = 0,
  containerClassName = "",
  overlayClassName = "",
  label = "UNCTRL logo",
}) {
  const resolvedBaseSize = baseSize || size || 133;
  const resolvedOverlaySize = overlaySize || resolvedBaseSize;

  const [overlaySrc, setOverlaySrc] = useState(ASSETS.logoBig);
  const [useWebM, setUseWebM] = useState(false);
  const timeoutsRef = useRef([]);
  const isAnimatingRef = useRef(false);

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
        setOverlaySrc(src);
        if (idx === frames.length - 1) {
          const endId = setTimeout(() => (isAnimatingRef.current = false), 20);
          timeoutsRef.current.push(endId);
        }
      }, total);
      timeoutsRef.current.push(id);
      total += durations[idx];
    });
  }, [clearAllTimers]);

  // Hover sequence: Big → Black → Big
  const playHoverCycle = useCallback(() => {
    runSequence([ASSETS.logoBig, ASSETS.logoBlack, ASSETS.logoBig], [0, 160, 160]);
  }, [runSequence]);

  // Click sequence: Big → Flip → Big
  const playClickCycle = useCallback(() => {
    const frames = useWebM
      ? [ASSETS.logoBig, ASSETS.logoFlipWebm, ASSETS.logoBig]
      : [ASSETS.logoBig, ASSETS.logoFlip, ASSETS.logoBig];
    const durations = [0, 380, 420];
    runSequence(frames, durations);
  }, [runSequence, useWebM]);

  const handleMouseEnter = () => {
    if (!isAnimatingRef.current) playHoverCycle();
  };
  const handleMouseLeave = () => {
    clearAllTimers();
    isAnimatingRef.current = false;
    setOverlaySrc(ASSETS.logoBig);
  };
  const handleClick = (e) => {
    e.preventDefault();
    clearAllTimers();
    isAnimatingRef.current = false;
    playClickCycle();
  };

  useEffect(() => () => clearAllTimers(), [clearAllTimers]);

  const containerStyle = { width: `${resolvedBaseSize}px`, height: `${resolvedBaseSize}px` };
  const overlayWrapperStyle = {
    width: `${resolvedOverlaySize}px`,
    height: `${resolvedOverlaySize}px`,
    left: "50%",
    top: "50%",
    transform: `translate(calc(-50% + ${overlayOffsetX}px), calc(-50% + ${overlayOffsetY}px))`,
  };

  return (
    <div
      className={`relative select-none pointer-events-none ${containerClassName}`}
      style={containerStyle}
      aria-label={label}
      role="img"
    >
      {/* Base layer */}
      {useWebM ? (
        <video
          src={ASSETS.logowebm}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
        />
      ) : (
        <img
          src={ASSETS.logoNoCoin}
          alt="UNCTRL base animation"
          style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
        />
      )}

      {/* Overlay */}
      <div
        className={`absolute pointer-events-auto boaring-hover ${overlayClassName}`}
        style={overlayWrapperStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {overlaySrc.endsWith(".webm") ? (
          <video
            src={overlaySrc}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
          />
        ) : (
          <img
            src={overlaySrc}
            alt="UNCTRL overlay"
            style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
          />
        )}
      </div>
    </div>
  );
}
