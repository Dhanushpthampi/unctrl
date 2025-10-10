"use client";


export default function Renders() {
  return (
    <section
      id="renders"
      className="relative w-screen min-h-screen overflow-hidden bg-black flex items-center justify-center"
      style={{ margin: 0, padding: 0 }}
    >
      {/* Desktop video (cropped top, centered) */}
      <div className="hidden md:block relative w-full h-[100vh] overflow-hidden">
        <video
          className="absolute top-[-80px] left-0 w-full h-[calc(100vh+80px)] object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/assets/videos/controller.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Mobile video (normal) */}
      <video
        className="block md:hidden w-full h-auto object-cover object-center"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/assets/videos_old/m.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Text (moved higher) */}
      <div className="absolute md:bottom-[10%] bottom-[20%] left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
        <span className="text-white text-[clamp(20px,3.5vw,42px)] font-extrabold tracking-wider drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]">
          Level up your gaming
        </span>
      </div>
      
      
    </section>
  );
}
