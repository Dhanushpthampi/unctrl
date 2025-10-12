"use client";

import { useState, useEffect } from "react";
import { ASSETS } from "../const/assets";
import MobileVideo from "@/components/MobileVideo";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section id="home" className="relative w-full h-screen bg-black overflow-hidden">
      {/* Hero Video with poster fallback */}
      <MobileVideo
        src={isMobile ? ASSETS.heroV : ASSETS.hero}
        poster={ASSETS.posterHeroV}
        className="absolute inset-0 w-full h-full"
        autoPlay={true}
        loop={true}
        muted={true}
        onError={(e) => {
          console.warn("Hero video failed to load:", e);
        }}
        onCanPlay={() => {
          console.log("Hero video can play");
        }}
      />
    </section>
  );
}