"use client";

import Image from "next/image";
import UnCtrlButton from "@/components/UnCtrlButton";
import { CTA_LINKS } from "@/config/links";

export default function Community() {
  return (
    <section
      id="community"
      className="relative min-h-[100svh] flex items-end justify-center overflow-hidden"
    >
      {/* Responsive background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/videos/communityVertical.mp4" media="(max-width: 768px)" type="video/mp4" />
        <source src="/assets/videos/community.mp4" media="(min-width: 769px)" type="video/mp4" />
      </video>

      {/* Pixel decoration */}
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
        />
      </div>

      {/* Invisible overlay (future use) */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* CTA button */}
      <div className="relative z-20 w-full flex justify-center pb-24">
        <UnCtrlButton href={CTA_LINKS.joinCommunity} target="_blank" external>
          <h1>JOIN THE CHAOS</h1>
        </UnCtrlButton>
      </div>
    </section>
  );
}
