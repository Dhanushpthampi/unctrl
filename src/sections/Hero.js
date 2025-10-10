"use client";

import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [isMobile]);

  return (
    <section id="home" className="relative w-full h-screen bg-black overflow-hidden">
      <video
        ref={videoRef}
        className={isMobile 
          ? "w-full h-full object-cover object-bottom" 
          : "absolute top-[-80px] left-0 w-full h-[calc(100vh+80px)] object-cover"
        }
        src={isMobile ? "/assets/videos/mm.mp4" : "/assets/videos/mouth.mp4"}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      
    </section>
  );
}