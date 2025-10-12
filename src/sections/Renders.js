"use client";

import { useState, useEffect } from "react";
import { ASSETS } from "../const/assets";
import MobileVideo from "../components/MobileVideo";

export default function Renders() {
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
    <section
      id="renders"
      className="relative w-screen min-h-screen overflow-hidden bg-black flex items-center justify-center"
    >
      <MobileVideo
        src={isMobile ? ASSETS.renderV : ASSETS.render}
        poster="/assets/images/controller-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center"
        autoPlay={true}
        loop={true}
        muted={true}
      />

      <div className="absolute md:bottom-[10%] bottom-[20%] left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
        <span className="text-white text-[clamp(20px,3.5vw,42px)] font-extrabold tracking-wider drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]">
          Level up your gaming
        </span>
      </div>
    </section>
  );
}
