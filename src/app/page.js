"use client";

import { useEffect, useState } from "react";
import IntroOverlay from "@/components/IntroOverlay";
import Hero from "@/sections/Hero";
import dynamic from "next/dynamic";

const Story = dynamic(() => import("@/sections/Story"));
const Renders = dynamic(() => import("@/sections/Renders"));
const Usp = dynamic(() => import("@/sections/Usp"));
const Vibe = dynamic(() => import("@/sections/Vibe"));
const ComingSoon = dynamic(() => import("@/sections/ComingSoon"));
const Community = dynamic(() => import("@/sections/Community"));
const Faqs = dynamic(() => import("@/sections/Faqs"));

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  // Removed sessionStorage check so intro always plays during testing

  return (
    <main className="w-full overflow-x-hidden">
      {showIntro && (
        <IntroOverlay
          onFinished={() => setShowIntro(false)}
        />
      )}

      <Hero />
      <Story />
      <Renders />
      <Usp />
      <Vibe />
      <ComingSoon />
      <Community />
      <Faqs />
    </main>
  );
}
