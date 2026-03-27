"use client";

import { useRef, useEffect, useState } from "react";

/**
 * USPCarousel — lightweight infinite-scroll carousel.
 *
 * Uses CSS animation instead of per-frame JS requestAnimationFrame + framer-motion.set()
 * to move the track, which runs entirely on the compositor thread without
 * touching the main thread or triggering React re-renders.
 */
export default function USPCarousel({ items }) {
  const containerRef = useRef();
  const [scrollWidth, setScrollWidth] = useState(0);

  // Duplicate items for seamless infinite scroll
  const extendedItems = [...items, ...items];

  useEffect(() => {
    if (!containerRef.current) return;
    const totalWidth = containerRef.current.scrollWidth / 2;
    setScrollWidth(totalWidth);
  }, [extendedItems.length]);

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={containerRef}
        className="flex gap-4"
        style={{
          // Pure CSS animation — runs on compositor thread, zero main-thread cost
          animation: scrollWidth
            ? `usp-scroll ${scrollWidth / 30}s linear infinite`
            : "none",
        }}
      >
        {extendedItems.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`USP ${(idx % items.length) + 1}`}
            className="w-[80vw] h-auto rounded-xl select-none flex-shrink-0"
            draggable={false}
            loading="lazy"
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes usp-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
