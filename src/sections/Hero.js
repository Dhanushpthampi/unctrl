"use client";

import { ASSETS } from "../const/assets";

export default function Hero() {
  return (
    <section id="home" className="relative w-full h-screen bg-black overflow-hidden">
      {/* Hero Video with poster fallback */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={ASSETS.posterHeroV}
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* Mobile video */}
        <source src={ASSETS.heroV} media="(max-width: 768px)" type="video/mp4" />
        {/* Desktop video */}
        <source src={ASSETS.hero} media="(min-width: 769px)" type="video/mp4" />
      </video>
    </section>
  );
}