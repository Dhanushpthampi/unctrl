"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function USPCarousel({ items }) {
  const controls = useAnimation();
  const containerRef = useRef();
  const [scrollWidth, setScrollWidth] = useState(0);

  // Duplicate items for seamless infinite scroll
  const extendedItems = [...items, ...items];

  useEffect(() => {
    if (!containerRef.current) return;
    const totalWidth = containerRef.current.scrollWidth / 2; // half because we duplicated
    setScrollWidth(totalWidth);

    let x = 0;
    let speed = 0.5; // pixels per frame, tweak for speed
    let animationFrame;

    const animate = () => {
      x += speed;
      if (x >= totalWidth) x = 0; // loop
      controls.set({ x: -x });
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [controls, extendedItems]);

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        ref={containerRef}
        className="flex gap-4 cursor-grab"
        drag="x"
        dragConstraints={{ left: -scrollWidth, right: 0 }}
        dragElastic={0.2}
        animate={controls}
        whileTap={{ cursor: "grabbing" }}
      >
        {extendedItems.map((img, idx) => (
          <motion.img
            key={idx}
            src={img}
            alt={`USP ${idx + 1}`}
            className="w-[80vw] h-auto rounded-xl select-none flex-shrink-0"
            draggable={false}
          />
        ))}
      </motion.div>
    </div>
  );
}
