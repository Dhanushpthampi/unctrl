"use client";

import { useEffect, useRef } from "react";
import { ASSETS } from "../const/assets";

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Force play on mount to fix browser autoplay policies blocking React autoPlay
    if (videoRef.current) {
      videoRef.current.play().catch((e) => console.log("Hero autoplay blocked:", e));
    }
  }, []);

  return (
    <section id="home" className="relative w-full h-screen bg-black overflow-hidden">
      {/* Hero Video with poster fallback */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={ASSETS.posterHeroV}
      >
        <source src={ASSETS.heroV} media="(max-width: 768px)" type="video/mp4" />
        <source src={ASSETS.hero} type="video/mp4" />
      </video>
    </section>
  );
}