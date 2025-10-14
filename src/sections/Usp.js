"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import USPCarousel from "@/components/USPCarousel";
import TapIndicator from "@/components/TapIndicator";

const ControllerScene = dynamic(
  () => import("../components/ControllerModel/ControllerScene"),
  { ssr: false }
);

const uspImages = [
  "/assets/usps/1.png",
  "/assets/usps/2.png",
  "/assets/usps/3.png",
  "/assets/usps/4.png",
];

export default function Usp() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "100% 0px 100% 0px" }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="usp"
      ref={sectionRef}
      className="relative w-screen max-w-[100vw] h-[100svh] bg-black overflow-hidden flex flex-col items-center justify-center"
    >
      {/* 3D Model */}
      <div className="w-full sm:w-[95vw] max-w-[100vw] aspect-square sm:aspect-[16/9] flex justify-center items-center overflow-hidden">
        <ControllerScene animateIn={isVisible} />
      </div>

      {/* Carousel for mobile */}
      <div className="w-full mt-4 sm:hidden">
        <USPCarousel items={uspImages} autoSpeed={2000} />
      </div>

      {/* Tap indicator only on desktop */}
      <TapIndicator />
    </section>
  );
}
