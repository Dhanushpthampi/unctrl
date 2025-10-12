"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import UnCtrlButton from "../components/UnCtrlButton";
import { CTA_LINKS } from "../config/links";
import { ASSETS } from "../const/assets";
import MobileVideo from "../components/MobileVideo";

export default function Community() {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      id="community"
      className="relative min-h-[100svh] flex items-end justify-center overflow-hidden"
    >
      {/* Responsive background video with conditional source */}
      <MobileVideo
        src={isMobile ? ASSETS.communityV : ASSETS.community}
        poster="/images/community-poster.jpg"
        className="absolute inset-0 w-full h-full"
        autoPlay={true}
        loop={true}
        muted={true}
      />

      {/* Pixel decoration - only on desktop */}
      {!isMobile && (
        <div
          className="absolute bottom-0 sm:-bottom-10 left-1/2 flex"
          style={{ transform: "translateX(-130%)", gap: "180px" }}
        >
          <Image
            src="/images/yellowPixel.png"
            width={200}
            height={200}
            alt="yellow pixel"
            className="w-[200px] h-[200px] min-w-[200px] min-h-[200px] object-contain"
            priority={false}
            loading="lazy"
          />
        </div>
      )}

      {/* Invisible overlay (future use) */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* CTA button */}
      <div className="relative z-20 w-full flex justify-center pb-32 sm:pb-24">
        <UnCtrlButton href={CTA_LINKS.joinCommunity} external>
          <h1>JOIN THE CHAOS</h1>
        </UnCtrlButton>
      </div>
    </section>
  );
}