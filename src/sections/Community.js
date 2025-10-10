"use client";
import Image from "next/image";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect } from "react";
import UnCtrlButton from "@/components/UnCtrlButton";
import { CTA_LINKS } from "@/config/links";

export default function Community() {
  const sectionRef = useRef(null);
  const y = useMotionValue(200);
  const scale = useMotionValue(1);

  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 1 });
  const springScale = useSpring(scale, { stiffness: 200, damping: 15, mass: 1 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            y.set(0);
            scale.set(1);
          } else {
            y.set(300);
            scale.set(0.8);
          }
        });
      },
      { threshold: [0, 0.1, 0.5, 0.9, 1], rootMargin: "-50px 0px -50px 0px" }
    );

    observer.observe(section);

    const handleKeydown = (e) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(
          e.key
        )
      ) {
        setTimeout(() => {
          const rect = section.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight && rect.bottom > 0;
          y.set(isInView ? 0 : 300);
          scale.set(isInView ? 1 : 0.8);
        }, 100);
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [y, scale]);

  return (
    <>
      <section
        ref={sectionRef}
        id="community"
        className="relative min-h-[100svh] flex items-end justify-center overflow-hidden"
      >
        {/* Desktop/Tablet video */}
        <video
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/assets/videos/community.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Mobile video */}
        <video
          className="absolute inset-0 w-full h-full object-cover block md:hidden"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/assets/videos/communityVertical.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Pixels centered horizontally at the bottom */}
        <div
          className="absolute bottom-0 sm:-bottom-20 left-1/2 flex items-end"
          style={{
            gap: "180px",
            transform: "translateX(-130%)", // slightly more to the left
          }}
        >
          <Image
            src="/images/yellowPixel.png"
            width={200}
            height={200}
            alt="yellow pixel"
            className="w-[200px] h-[200px] "
          />
        </div>

        <div className="absolute inset-0 pointer-events-none" />
      </section>

      {/* Fixed button */}
      <motion.div
        className="fixed bottom-44 sm:bottom-24 left-1/2 transform -translate-x-1/2 z-50"
        style={{
          y: springY,
          scale: springScale,
        }}
      >
        <UnCtrlButton href={CTA_LINKS.joinCommunity} external>
          <h1>JOIN THE CHAOS</h1>
        </UnCtrlButton>
      </motion.div>
    </>
  );
}
