"use client";

export default function Hero() {
  return (
    <section id="home" className="relative w-full h-screen bg-black overflow-hidden">
      {/* Hero Video with responsive sources */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/assets/images/hero-poster.jpg" // lightweight fallback image
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* Mobile video */}
        <source src="/assets/videos/mm.mp4" media="(max-width: 768px)" type="video/mp4" />
        {/* Desktop video */}
        <source src="/assets/videos/mouth.mp4" media="(min-width: 769px)" type="video/mp4" />
      </video>
    </section>
  );
}
