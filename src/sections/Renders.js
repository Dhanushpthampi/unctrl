"use client";

import { ASSETS } from "../const/assets";

export default function Renders() {
  return (
    <section
      id="renders"
      className="relative w-screen min-h-screen overflow-hidden bg-black flex items-center justify-center"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/assets/images/controller-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        {/* Mobile video */}
        <source src={ASSETS.renderV} media="(max-width: 768px)" type="video/mp4" />
        {/* Desktop video */}
        <source src={ASSETS.render} media="(min-width: 769px)" type="video/mp4" />
      </video>

      <div className="absolute md:bottom-[10%] bottom-[20%] left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
        <span className="text-white text-[clamp(20px,3.5vw,42px)] font-extrabold tracking-wider drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]">
          Level up your gaming
        </span>
      </div>
    </section>
  );
}
