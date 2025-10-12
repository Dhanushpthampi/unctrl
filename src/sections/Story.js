"use client";

import { useState, useEffect } from "react";
import CoinAnimated from "../components/CoinAnimated";
import { ASSETS } from "../const/assets";
import MobileVideo from "../components/MobileVideo";

export default function Story() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="story"
      className="relative w-screen h-screen bg-black md:bg-[#b34a00] overflow-hidden flex items-center justify-center"
    >
      {/* Background video for XL screens */}
      <div className="absolute inset-0 hidden xl:block">
        <MobileVideo
          src={ASSETS.story}
          className="w-full h-full object-cover blur-2xl scale-110 opacity-70"
          autoPlay={true}
          loop={true}
          muted={true}
        />
      </div>

      {/* Foreground main content - Video for desktop, Image for mobile */}
      <div className="absolute inset-0 flex items-center justify-center w-full h-full z-10">
        {isMobile ? (
          <img
            src={ASSETS.posterStoryV}
            alt="Story"
            className="w-full h-full object-contain"
            loading="eager"
          />
        ) : (
          <MobileVideo
            src={ASSETS.story}
            poster={ASSETS.posterStoryV}
            className="w-full h-full md:object-cover xl:object-contain"
            autoPlay={true}
            loop={true}
            muted={true}
          />
        )}
      </div>

      {/* Coin - Mobile only */}
      <div
        className="absolute md:hidden z-20 left-1/2 -translate-x-1/2 animate-bounce"
        style={{ bottom: "30vh" }}
      >
        <CoinAnimated size={100} />
      </div>
    </section>
  );
}