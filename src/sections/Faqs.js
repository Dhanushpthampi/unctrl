"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { ASSETS } from "../const/assets";
import MobileVideo from "../components/MobileVideo";


const FAQ_ITEMS = [
  {
    q: "What makes the UNCTRL Controller so much better than Bluetooth?",
    a: "Simple. We ditch Bluetooth's unreliable lag. Our Type-C wired connection delivers zero-latency precision. Every flick, dodge, and combo registers instantly. Bluetooth is for amateurs.",
  },
  {
    q: "Will this controller work with my phone?",
    a: "If your phone is between 110mm and 185mm long and has a USB Type-C connection, it fits. Our reinforced telescopic grip is built to stretch and secure everything from compact smartphones to 7-inch gaming beasts. No wobbles. No broken clamps.",
  },
  {
    q: "Do I need a special app to use it?",
    a: "Our UNCTRL Companion App is your secret weapon. It instantly detects over 500 controller-ready games on your phone. No more guessing. Just launch and play. More games, less searching.",
  },
  {
    q: "What about stick drift? I'm sick of it.",
    a: "So are we. That's why we use Hall Effect Triggers & Joysticks. Magnetic sensors mean no physical wear, no drift, ever. Just ultra-precise control that stays accurate for millions of presses. Designed to last, built to dominate.",
  },
  {
    q: "Can I use this controller for PC or console streaming?",
    a: "Absolutely. Stream your Steam library, PlayStation, or gaming PC directly to your phone with low latency. It supports PS Mode for Remote Play and X-Input for PC. Carry your AAA titles anywhere.",
  },
  {
    q: "Is it compatible with both Android and iPhone?",
    a: "Yes. It features Multi-Platform Compatibility for Android and iOS. One controller, all your mobile devices, seamless.",
  },
  {
    q: "What are these 'Special Features' like Turbo and Macros?",
    a: "Pro-level advantage, unlocked. Turbo Mode gives you rapid-fire in shooters. Rapid Trigger delivers lightning-fast input response. Macros let you assign complex combos to a single button. Game smarter, react faster, dominate easier.",
  },
  {
    q: "Can I customize the look of the controller?",
    a: "Your vibe, your rules. The controller features Vibrant LED Backlights that you can customize with different colors and effects. Match your setup, match your mood, make it truly UNCTRL.",
  },
  {
    q: "Does it drain my phone battery? Can I charge while playing?",
    a: "Our Pass-Through Charging lets you power your phone through the controller. Game on indefinitely without running out of juice. Keep your phone charged, keep the domination going.",
  },
  {
    q: "What's the warranty on this thing?",
    a: "We build gear that doesn't suck. Your UNCTRL Controller comes with a 12 Month Limited Warranty against manufacturing defects. If it's our fault, we fix it. Period. Check our full warranty terms for details.",
  },
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
      {/* {isMobile ? (
        <img
          src={ASSETS.posterGlitch}
          alt="Background"
          className="absolute inset-0 -z-20 w-full h-full object-cover"
          loading="lazy"
        />
      ) : ( */}
        <MobileVideo
          ref={videoRef}
          src={ASSETS.glitch}
          poster={ASSETS.posterGlitch}
          className="absolute inset-0 -z-20 w-full h-full object-cover"
          autoPlay={true}
          loop={true}
          muted={true}
        />
      {/* )} */}

      {/* FAQ Content */}
      <div className="relative z-10 max-w-3xl mx-auto container-px py-12 sm:py-16 md:pt-24 lg:pt-28">
        <h2 className="h2 text-center mb-8 text-3xl sm:text-4xl font-bold md:mt-0 mt-12">FAQs</h2>
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