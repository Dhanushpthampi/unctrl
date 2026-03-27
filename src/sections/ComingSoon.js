"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { ASSETS } from "../const/assets";
import MobileVideo from "../components/MobileVideo";

export default function ComingSoon() {
  const [isMobile, setIsMobile] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotation = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });
  const springRotation = useSpring(rotation, { stiffness: 120, damping: 20 });

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only run intersection observer on desktop
  useEffect(() => {
    if (isMobile) return;
    
    const community = document.querySelector("#community");
    if (!community) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          rotation.set(450);
          y.set(window.innerHeight * 1.2);
        } else {
          rotation.set(0);
          y.set(0);
          x.set(0);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(community);
    return () => observer.disconnect();
  }, [isMobile, x, y, rotation]);

  return (
    <section
      id="coming-soon"
      className="relative z-20 min-h-[100svh] bg-black flex flex-col items-center justify-center text-white px-5"
    >
      <div className="w-full max-w-[1100px] mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center pt-6 sm:pt-10">
          <span>Unleashing</span>
          <span className="text-orange-500"> soon</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center m-4 sm:m-10 relative">
          <MobileVideo
            src={ASSETS.keyboard}
            className="w-[85%] sm:w-full mx-auto h-auto object-cover aspect-square shadow-[6px_6px_0px_0px_rgba(255,255,0,1)] rounded-lg"
            autoPlay={true}
            loop={true}
            muted={true}
          />

          <div className="relative w-full h-full flex items-center justify-center">
            <MobileVideo
              src={ASSETS.mouse}
              className="w-[85%] sm:w-full mx-auto h-auto object-cover z-20 aspect-square shadow-[6px_6px_0px_0px_rgba(138,43,226,1)] rounded-lg"
              autoPlay={true}
              loop={true}
              muted={true}
            />
          </div>

          {/* Only render pixel animation on desktop */}
          {!isMobile && (
            <motion.div
              className="absolute top-1/2 z-10"
              style={{ x: springX, y: springY, rotate: springRotation, left: "60%" }}
            >
              <Image 
                src="/images/violetPixel.png" 
                width={150} 
                height={150} 
                alt="violet pixel"
                priority={false}
                loading="lazy"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}