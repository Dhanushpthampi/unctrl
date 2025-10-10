"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import IntroOverlay from "@/components/IntroOverlay";
import Hero from "@/sections/Hero";

const Story = dynamic(() => import("@/sections/Story"));
const Renders = dynamic(() => import("@/sections/Renders"));
const Usp = dynamic(() => import("@/sections/Usp"));
const Vibe = dynamic(() => import("@/sections/Vibe"));
const ComingSoon = dynamic(() => import("@/sections/ComingSoon"));
const Community = dynamic(() => import("@/sections/Community"));
const Faqs = dynamic(() => import("@/sections/Faqs"));

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  // Show intro only on first visit
  useEffect(() => {
    try {
      const seen = typeof window !== "undefined" && window.localStorage.getItem("introSeen");
      if (seen === "1") setShowIntro(false);
    } catch {}
  }, []);

  return (
    <main className="w-full overflow-x-hidden">
      {showIntro && (
        <IntroOverlay
          onFinished={() => {
            try {
              window.localStorage.setItem("introSeen", "1");
            } catch {}
            setShowIntro(false);
          }}
        />
      )}

      {/* Always render sections so their assets start loading under the intro overlay */}
      <>
        <Hero />
        <Story />
        <Renders />
        <Usp />
        <Vibe />
        <ComingSoon />
        <Community />
        <Faqs />
      </>
    </main>
  );
}