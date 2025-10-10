"use client";
import Image from "next/image";
import UnCtrlButton from "@/components/UnCtrlButton";
import { CTA_LINKS } from "@/config/links";

export default function Community() {

  return (
    <>
      <section
        id="community"
        className="relative min-h-[100svh] flex items-end justify-center overflow-hidden"
      >
        {/* Desktop/Tablet video */}
        <video
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/assets/videos/community.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Mobile video */}
        <video
          className="absolute inset-0 w-full h-full object-cover block md:hidden"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/assets/videos/communityVertical.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Pixels centered horizontally at the bottom */}
        <div
          className="absolute bottom-0 sm:-bottom-20 left-1/2 flex items-end"
          style={{
            gap: "180px",
            transform: "translateX(-130%)", // slightly more to the left
          }}
        >
          <Image
            src="/images/yellowPixel.png"
            width={200}
            height={200}
            alt="yellow pixel"
            className="w-[200px] h-[200px] "
          />
        </div>

        <div className="absolute inset-0 pointer-events-none" />
        
        {/* Button as part of the section, bottom-center */}
        <div className="relative z-20 w-full flex justify-center pb-24">
          <UnCtrlButton href={CTA_LINKS.joinCommunity} target="_blank" external>
            <h1>JOIN THE CHAOS</h1>
          </UnCtrlButton>
        </div>

        
      </section>
    </>
  );
}
