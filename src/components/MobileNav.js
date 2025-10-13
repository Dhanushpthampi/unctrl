"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatedLink } from "./AnimatedLink";
import LogoAnimated from "./LogoAnimated";
import { Home, Package, Users, MessageCircle, BookOpen } from "lucide-react";
import { NAV_LINKS } from "@/config/links";
import UnCtrlButton from "./UnCtrlButton";
import { CTA_LINKS } from "@/config/links";
// Import your UnctrlButton component
// import UnctrlButton from "./UnctrlButton";



// Map navigation items with icons
const NAV_ITEMS = [
  { ...NAV_LINKS[0], icon: Home }, // Home
  { ...NAV_LINKS[1], icon: Package }, // Products
  { ...NAV_LINKS[2], icon: Users }, // About Us
  { ...NAV_LINKS[3], icon: MessageCircle }, // Community
  { ...NAV_LINKS[4], icon: BookOpen }, // Blog
];

export default function MobileNav({ show = true }) {
  const [activeTab, setActiveTab] = useState(NAV_LINKS[0].href);

  return (
    <div className="md:hidden">
      {/* Top Navbar */}
      <div 
        className={`fixed top-0 left-0 w-full z-[70] h-[85px] transition-transform duration-300 ${
          show ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="relative h-full">
          {/* Main black background */}
          <div className="absolute inset-0 bg-black" />

          {/* Content row */}
          <div className="relative h-full flex items-center justify-between px-4">
            {/* Logo on the left */}
            <div className="flex items-center">
              <Link href={NAV_LINKS[0].href}>
                <LogoAnimated 
                  baseSize={120} 
                  overlaySize={35} 
                  overlayOffsetX={-40} 
                  overlayOffsetY={0} 
                />
              </Link>
            </div>

            {/* UnctrlButton on the right */}
            <div className="flex items-center">
            <UnCtrlButton href={CTA_LINKS.orderNow} external>ORDER NOW</UnCtrlButton> 
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div 
        className={`fixed bottom-0 left-0 w-full z-[70] h-[75px] transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative h-full">
          {/* Main background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-black" />

          {/* Navigation Items */}
          <nav className="relative h-full flex items-center justify-around px-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.href;
              
              // Check if link is external (starts with http)
              const isExternal = item.href.startsWith('http');
              
              const linkContent = (
                <>
                  {/* Icon */}
                  <div
                    className={`transition-all duration-300 ${
                      isActive 
                        ? "text-orange-500 scale-110" 
                        : "text-gray-400 group-hover:text-orange-400 group-hover:scale-105"
                    }`}
                  >
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  
                  {/* Label with AnimatedLink */}
                  <div
                    className={`text-[9px] font-mono tracking-wider transition-colors duration-300 ${
                      isActive 
                        ? "text-orange-500" 
                        : "text-gray-400 group-hover:text-orange-400"
                    }`}
                  >
                    <AnimatedLink value={item.label.toUpperCase()} />
                  </div>
                </>
              );

              return isExternal ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setActiveTab(item.href)}
                  className="flex flex-col items-center justify-center gap-1 min-w-[60px] group"
                >
                  {linkContent}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setActiveTab(item.href)}
                  className="flex flex-col items-center justify-center gap-1 min-w-[60px] group"
                >
                  {linkContent}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}