import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import ScrollEffects from "@/components/ScrollEffects";
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
        {/* Warm Draco WASM decoder early */}
        <link rel="preload" href="https://www.gstatic.com/draco/v1/decoders/draco_wasm_wrapper.js" as="script" crossOrigin="anonymous" />
        <link rel="preload" href="https://www.gstatic.com/draco/v1/decoders/draco_decoder.wasm" as="fetch" crossOrigin="anonymous" />
        {/* Preload Draco GLB */}
        <link rel="preload" href="/models/c3d.glb" as="fetch" crossOrigin="anonymous" />

        {/* Preload Hero videos */}
        <link rel="preload" as="video" href="/assets/videos/mouth.mp4" />
        <link rel="preload" as="video" href="/assets/videos/mm.mp4" media="(max-width: 768px)" />

        {/* Prefetch intro videos */}
        <link rel="prefetch" as="video" href="/assets/videos/intro.mp4" />
        <link rel="prefetch" as="video" href="/assets/videos/introVertical.mp4" media="(max-width: 768px)" />
      </head>
      <body className={`${chakra.variable} antialiased bg-[#020104] text-white`}>
        {showIntroOverlay}
        <ScrollEffects>
          <SiteHeader />
          {children}
        </ScrollEffects>
      </body>
    </html>
  );
}
