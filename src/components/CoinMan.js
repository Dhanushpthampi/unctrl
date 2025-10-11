"use client";

import React, { useState, useRef, useEffect } from "react";

const CoinMan = () => {
  const [showGlitch, setShowGlitch] = useState(false);
  const [isFlickering, setIsFlickering] = useState(false);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  // Preload images
  useEffect(() => {
    const images = ["/images/coinman.png", "/images/glichman.png"];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Flicker function
  const startFlicker = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setShowGlitch((prev) => !prev);
      }, 50); // adjust speed here
    }
  };

  const stopFlicker = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setShowGlitch(false);
  };

  // Desktop hover behavior
  const handleMouseEnter = () => {
    if (!("ontouchstart" in window)) { // ignore mobile
      startFlicker();
    }
  };

  const handleMouseLeave = () => {
    if (!("ontouchstart" in window)) {
      stopFlicker();
    }
  };

  // Mobile click behavior
  const handleClick = (e) => {
    if ("ontouchstart" in window) {
      e.stopPropagation();
      if (!isFlickering) {
        setIsFlickering(true);
        startFlicker();
      }
    }
  };

  // Stop flicker if clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = () => {
      if (isFlickering) {
        setIsFlickering(false);
        stopFlicker();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isFlickering]);

  return (
    <div
      ref={containerRef}
      className="relative w-[50vw] max-w-[300px] aspect-square flex items-center justify-center coinman-hover"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Images */}
      <img
        src="/images/coinman.png"
        alt="CoinMan"
        className={`absolute top-0 left-0 w-full h-full object-contain  ${
          showGlitch ? "opacity-0" : "opacity-100"
        }`}
        draggable={false}
      />
      <img
        src="/images/glichman.png"
        alt="CoinMan Glitch"
        className={`absolute top-0 left-0 w-full h-full object-contain ${
          showGlitch ? "opacity-100" : "opacity-0"
        }`}
        draggable={false}
      />
    </div>
  );
};

export default CoinMan;
    