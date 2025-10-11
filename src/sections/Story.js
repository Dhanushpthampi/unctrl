"use client";

import { useState, useEffect } from "react";
import CoinAnimated from "../components/CoinAnimated"; // Adjust path as needed

export default function Story() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          <source src="/assets/videos/rage-story.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Foreground main video */}
      <div className="absolute inset-0 flex items-center justify-center w-full h-full z-10">
        <video
          key={isMobile ? 'mobile' : 'desktop'}
          className="w-full h-full md:object-cover xl:object-contain"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source 
            src={isMobile ? "/assets/videos/s2.mp4" : "/assets/videos/rage-story.mp4"} 
            type="video/mp4" 
          />
        </video>
      </div>

      {/* Coin - Mobile only, 30vh from bottom */}
      <div className="absolute md:hidden z-20 left-1/2 -translate-x-1/2 animate-bounce" style={{ bottom: '30vh' }}>
        <CoinAnimated size={100} />
      </div>
    </section>
  );
}