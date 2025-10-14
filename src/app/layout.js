// app/layout.js
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

export default function RootLayout({ children, showIntroOverlay }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Preload both intro videos for faster first-frame
        <link rel="preload" as="video" href={ASSETS.intro} type="video/mp4" />
        <link rel="preload" as="video" href={ASSETS.introV} type="video/mp4" /> */}

        {/* Preload logo image */}
        <link rel="preload" href="/images/logo.png" as="image" />
      </Head>
      <body className={`${chakra.variable} antialiased bg-[#020104] text-white`}>
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
