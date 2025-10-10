"use client";

export default function Story() {
  return (
    <section
      id="story"
      className="relative w-screen h-screen bg-black md:bg-[#b34a00] overflow-hidden flex items-center justify-center"
    >
      {/* XL screens — blurred background filler */}
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

      {/* Foreground main desktop video */}
      <div className="hidden md:flex items-center justify-center w-full h-full relative z-10">
        <video
          className="w-full h-full md:object-cover xl:object-contain"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/assets/videos/rage-story.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Mobile — full width, centered horizontally */}
      <div className="absolute inset-0 block md:hidden overflow-hidden flex items-center justify-center">
        <video
          className="w-full max-w-full h-auto"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/assets/videos/s2.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
