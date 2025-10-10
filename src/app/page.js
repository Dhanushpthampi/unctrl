"use client";

import { useState } from "react";
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

  return (
    <main className="w-full overflow-x-hidden">
      {showIntro && <IntroOverlay onFinished={() => setShowIntro(false)} />}

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