"use client";

import { useState, useEffect } from "react";

export default function Story() {


  return (
<section
  id="story"
  className="relative w-screen h-screen bg-black md:bg-[#b34a00] overflow-hidden flex items-center justify-center"
>
  {/* Background video for XL screens */}
  <div className="absolute inset-0 hidden xl:block">
    <video
      className="w-full h-full object-cover blur-2xl scale-110 opacity-70"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    >
      <source src="/assets/videos/rage-story.mp4" media="(min-width:1280px)" type="video/mp4" />
    </video>
  </div>

  {/* Foreground main video */}
  <div className="absolute inset-0 flex items-center justify-center w-full h-full z-10">
    <video
      className="w-full h-full md:object-cover xl:object-contain"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    >
      {/* Desktop */}
      <source src="/assets/videos/rage-story.mp4" media="(min-width:768px)" type="video/mp4" />
      {/* Mobile */}
      <source src="/assets/videos/s2.mp4" media="(max-width:767px)" type="video/mp4" />
    </video>
  </div>
</section>

  );
}
