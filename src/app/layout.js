import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import ScrollEffects from "@/components/ScrollEffects";
import ScrollDownIndicator from "@/components/ScrollDownIndicator";
import SiteHeader from "@/components/SiteHeader";

const chakra = Chakra_Petch({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-chakra-petch",
});

export const metadata = {
  title: "UNCTRL — Enter Chaos",
  description: "Landing experience for UNCTRL",
};

export default function RootLayout({ children, showIntroOverlay }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Meta tags for better mobile compatibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Opera mobile specific */}
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        {/* Safari specific */}
        <meta name="apple-touch-fullscreen" content="yes" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/images/logo.png" as="image" />
        
        {/* Warm Draco WASM decoder early - commented out to avoid blocking */}
        {/* <link rel="preload" href="https://www.gstatic.com/draco/v1/decoders/draco_wasm_wrapper.js" as="script" crossOrigin="anonymous" /> 
        <link rel="preload" href="https://www.gstatic.com/draco/v1/decoders/draco_decoder.wasm" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/models/c3d.glb" as="fetch" crossOrigin="anonymous" /> */}

        {/* Preload Hero videos - commented out to avoid blocking */}
        {/* <link rel="preload" as="video" href="/assets/videos/mouth.mp4" />
        <link rel="preload" as="video" href="/assets/videos/mm.mp4" media="(max-width: 768px)" /> */}

        {/* Prefetch intro videos - commented out to avoid blocking */}
        {/* <link rel="prefetch" as="video" href="/assets/videos/intro.mp4" />
        <link rel="prefetch" as="video" href="/assets/videos/introVertical.mp4" media="(max-width: 768px)" />  */}
      
      </head>
      <body className={`${chakra.variable} antialiased bg-[#020104] text-white`}>
        {showIntroOverlay}
        <ScrollEffects>
          <SiteHeader />
          {children}
          <ScrollDownIndicator />
        </ScrollEffects>
      </body>
    </html>
  );
}
