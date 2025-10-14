"use client";

import { useEffect, useState } from "react";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import ScrollEffects from "@/components/ScrollEffects";
import ScrollDownIndicator from "@/components/ScrollDownIndicator";
import SiteHeader from "@/components/SiteHeader";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Head from "next/head";
import { ASSETS } from "@/const/assets";

const chakra = Chakra_Petch({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-chakra-petch",
});

// Centralized video preload + viewport fix
function VideoPreload() {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh * 100}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);

    // Preload correct video
    const isMobile = window.innerWidth <= 768;
    const src = isMobile ? ASSETS.introV : ASSETS.intro;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = src;
    link.type = "video/mp4";
    document.head.appendChild(link);

    return () => {
      window.removeEventListener("resize", setVh);
      document.head.removeChild(link);
    };
  }, []);

  return null;
}

export default function RootLayout({ children, showIntroOverlay }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        {/* Preload logo image */}
        <link rel="preload" href="/images/logo.png" as="image" />
      </Head>

      <body
        className={`${chakra.variable} antialiased bg-[#020104] text-white`}
      >
        {/* Client-side video preload + iOS viewport fix */}
        <VideoPreload />

        {showIntroOverlay}
        <ScrollEffects>
          <SiteHeader />
          {children}
          <ScrollDownIndicator />
          <Analytics />
          <SpeedInsights />
        </ScrollEffects>
      </body>
    </html>
  );
}
