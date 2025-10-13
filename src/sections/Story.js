"use client";

import { useState, useEffect } from "react";
import MobileVideo from "../components/MobileVideo";
import { ASSETS } from "../const/assets";

export default function Story() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Choose correct video source
  const videoSrc = isMobile ? ASSETS.storyV : ASSETS.story;

  return (
    <section
      id="story"
      className="relative w-screen h-screen bg-black md:bg-[#b34a00] overflow-hidden flex items-center justify-center"
    >
      {/* Background video for XL screens (optional) */}
      {!isMobile && (
        <div className="absolute inset-0 xl:block">
          <video
            src={ASSETS.story}
            className="w-full h-full object-cover blur-2xl scale-110 opacity-70"
            autoPlay
            loop
            muted
          />
        </div>
      )}

      {/* Main content */}
      <div className="absolute inset-0 flex items-center justify-center w-full h-full z-10">
        <video
          src={videoSrc}
          className="max-w-[100vw] w-auto h-auto md:max-h-[100vh] md:h-[100vh]"
          autoPlay
          loop
          muted
        />
      </div>
    </section>
  );
}