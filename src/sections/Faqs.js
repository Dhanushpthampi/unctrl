"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { ASSETS } from "../const/assets";

const FAQ_ITEMS = [
  { q: "What is UNCTRL?", a: "UNCTRL is a next-gen modular gaming controller designed for precision and creativity on mobile devices." },
  { q: "When can I pre-order?", a: "Pre-orders open soon. Join the community to be notified the second it goes live." },
  { q: "Which platforms are supported?", a: "We are focused on mobile gaming at launch, with broader platform support under exploration." },
  { q: "Is there software?", a: "Yes. Our companion app lets you map inputs, save profiles, and share setups with the community." },
  { q: "Can I customize buttons?", a: "Absolutely! UNCTRL modules can be swapped and mapped to suit your gameplay style." },
  { q: "Does it support Bluetooth?", a: "Yes, it connects seamlessly over Bluetooth with low latency for mobile devices." },
  { q: "Battery life?", a: "UNCTRL delivers up to 20 hours of continuous play on a single charge." },
  { q: "Is it compatible with games?", a: "It works with most mobile games that support controllers, plus the companion app lets you configure any game." },
];

export default function Faqs() {
  const videoRef = useRef(null);
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
    <section id="faqs" className="relative bg-transparent text-white overflow-hidden">
      {/* Conditional background - Image for mobile, Video for desktop */}
      {isMobile ? (
        <img
          src={ASSETS.posterGlitch}
          alt="Background"
          className="absolute inset-0 -z-20 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <video
          ref={videoRef}
          src={ASSETS.glitch}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={ASSETS.posterGlitch}
          className="absolute inset-0 -z-20 w-full h-full object-cover"
          aria-hidden
        />
      )}

      {/* FAQ Content */}
      <div className="relative z-10 max-w-3xl mx-auto container-px py-12 sm:py-16 md:pt-24 lg:pt-28">
        <h2 className="h2 text-center mb-8 text-3xl sm:text-4xl font-bold">FAQs</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <AccordionItem key={idx} index={idx + 1} q={item.q} a={item.a} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer className="relative z-10" />
    </section>
  );
}

function AccordionItem({ index, q, a }) {
  const [open, setOpen] = useState(index === 1);

  return (
    <div className="rounded-md overflow-hidden bg-[#FF5900] text-white shadow-[0_3px_0_0_rgba(0,0,0,0.25)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-4 flex items-center justify-between gap-4 sm:gap-6"
      >
        <span className="flex items-center gap-4 sm:gap-6">
          <span className="text-xl sm:text-2xl font-extrabold tabular-nums w-8 sm:w-10">
            {String(index).padStart(2, "0")}
          </span>
          <span className="text-base sm:text-lg font-bold">{q}</span>
        </span>
        <span
          aria-hidden
          className="w-7 h-7 sm:w-9 sm:h-9 grid place-items-center rounded-full bg-white text-black text-lg font-bold"
        >
          {open ? "−" : "+"}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 sm:px-6 pb-4 pt-0 text-white/95">
            <p className="text-sm sm:text-base leading-relaxed max-w-2xl">{a}</p>
          </div>
        </div>
      </div>
    </div>
  );
}