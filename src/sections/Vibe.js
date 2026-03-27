"use client";

import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CoinMan from "../components/CoinMan";
import { ASSETS } from "../const/assets";
import MobileVideo from "../components/MobileVideo";

const allVideos = [
  ASSETS.vibe1,
  ASSETS.vibe2,
  ASSETS.vibe3,
  ASSETS.vibe4,
  ASSETS.vibe5,
  ASSETS.vibe6,
];

function VideoCard({ src, isVisible }) {
  const videoRef = useRef(null);

  // Extra hint: if the carousel says this slide is NOT active, force-pause
  // (the MobileVideo IO will handle play when it enters the viewport)
  useEffect(() => {
    if (!videoRef.current) return;
    if (!isVisible) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  return (
    <div className="video-card">
      <MobileVideo
        ref={videoRef}
        src={src}
        className="video-el"
        autoPlay={isVisible}
        loop={true}
        muted={true}
      />
    </div>
  );
}

function Row({ videos, onReady, space = 30, activeIndex = 0 }) {
  return (
    <div className="w-full relative z-10">
      <Swiper
        loop
        slidesPerView="auto"
        spaceBetween={space}
        allowTouchMove={false}
        speed={300}
        onSwiper={(s) => onReady?.(s)}
        className="vibe-swiper"
      >
        {videos.map((src, i) => (
          <SwiperSlide key={i} className="vibe-slide">
            <VideoCard
              src={src}
              isVisible={i === activeIndex || i === (activeIndex + 1) % videos.length}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default function Vibe() {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const runningRef = useRef(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const stepSlides = 1;
  const slideDurationMs = 300;
  const pauseBetweenRowsMs = 300;
  const pauseBetweenCyclesMs = 1000;

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use 4 videos on mobile, 6 on desktop
  const videosToUse = isMobile ? allVideos.slice(0, 4) : allVideos;
  const topVideos = [...videosToUse.slice(0, videosToUse.length / 2), ...videosToUse.slice(0, videosToUse.length / 2)];
  const bottomVideos = [...videosToUse.slice(videosToUse.length / 2), ...videosToUse.slice(videosToUse.length / 2)];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => sectionRef.current && observer.unobserve(sectionRef.current);
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let cancelled = false;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const waitForTransition = (swiper) =>
      new Promise((resolve) => {
        const handler = () => {
          swiper.off("transitionEnd", handler);
          resolve();
        };
        swiper.on("transitionEnd", handler);
      });

    const moveSteps = async (swiper, direction, steps, updateIndex, videoCount) => {
      if (!swiper) return;
      for (let i = 0; i < steps && !cancelled; i++) {
        if (direction === "forward") {
          swiper.slideNext(slideDurationMs, true);
          updateIndex?.((p) => (p + 1) % videoCount);
        } else {
          swiper.slidePrev(slideDurationMs, true);
          updateIndex?.((p) => (p - 1 + videoCount) % videoCount);
        }
        await waitForTransition(swiper);
      }
    };

    const run = async () => {
      if (runningRef.current) return;
      runningRef.current = true;
      while (!cancelled) {
        if (topRef.current) await moveSteps(topRef.current, "forward", stepSlides, setTopIndex, topVideos.length);
        await sleep(pauseBetweenRowsMs);
        if (bottomRef.current) await moveSteps(bottomRef.current, "backward", stepSlides, setBottomIndex, bottomVideos.length);
        await sleep(pauseBetweenCyclesMs);
      }
    };

    run();
    return () => {
      cancelled = true;
      runningRef.current = false;
    };
  }, [isInView]);

  return (
    <section
      id="vibe"
      ref={sectionRef}
      className="relative min-h-[100vh] bg-black flex flex-col justify-center items-center pt-20 pb-5"
    >
      <div className="w-full max-w-[1600px] px-4 md:px-6 relative flex flex-col items-center space-y-4 md:space-y-6">
        <Row videos={topVideos} onReady={(s) => (topRef.current = s)} activeIndex={topIndex} />

        <div className="bottom-row-offset w-full z-30">
          <Row videos={bottomVideos} onReady={(s) => (bottomRef.current = s)} activeIndex={bottomIndex} />
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none">
          <div className="pointer-events-auto">
            <CoinMan />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .vibe-swiper {
          overflow: visible;
          width: 100%;
        }
        .vibe-slide {
          width: auto;
        }
        .video-card {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          width: 280px;
          height: 180px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          background: #000;
        }
        .video-el {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .bottom-row-offset {
          transform: translateX(-112px);
        }
        @media (min-width: 480px) {
          .bottom-row-offset {
            transform: translateX(-118px);
          }
          .video-card {
            width: 320px;
            height: 200px;
          }
        }
        @media (min-width: 640px) {
          .bottom-row-offset {
            transform: translateX(-124px);
          }
          .video-card {
            width: 360px;
            height: 220px;
          }
        }
        @media (min-width: 768px) {
          .bottom-row-offset {
            transform: translateX(-132px);
          }
          .video-card {
            width: 420px;
            height: 260px;
          }
        }
        @media (min-width: 1024px) {
          .bottom-row-offset {
            transform: translateX(-140px);
          }
          .video-card {
            width: 480px;
            height: 300px;
          }
        }
      `}</style>
    </section>
  );
}