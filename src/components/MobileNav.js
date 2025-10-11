"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedLink } from "./AnimatedLink";
import LogoAnimated from "./LogoAnimated";
import { NAV_LINKS } from "@/config/links";

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef(null);

  // Handle clicks outside the overlay and navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && overlayRef.current && !overlayRef.current.contains(event.target)) {
        const navbar = document.querySelector('.fixed.bottom-0.left-0.w-full.z-\\[70\\]');
        if (navbar && !navbar.contains(event.target)) {
          setMenuOpen(false);
        }
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="md:hidden">
      {/* Bottom bar with border */}
      <div className="fixed bottom-0 left-0 w-full z-[70] h-[80px]">
        <div className="relative h-full">
          {/* Main black background */}
          <div
            className="absolute inset-0 bg-black"
            style={{
              clipPath: `polygon(
                0 0, calc(100% - 8px) 0, calc(100% - 8px) 5%, calc(100% - 4px) 5%, calc(100% - 4px) 10%,
                100% 10%, 100% 100%,
                0 100%, 0 10%, 4px 10%, 4px 5%, 8px 5%, 8px 0
              )`,
            }}
          />

          {/* Content row */}
          <div className="relative h-full flex items-center justify-between px-6">
            {/* Hamburger */}
            <button onClick={toggleMenu} className="relative p-2 bg-transparent boaring-hover">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange-500 relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeWidth={1} d="M4 6h16" />
                <path strokeWidth={2} d="M4 12h16" />
                <path strokeWidth={1} d="M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex-1 flex justify-center">
              <LogoAnimated baseSize={140} overlaySize={40} overlayOffsetX={-45} overlayOffsetY={0} />
            </div>

            {/* Spacer */}
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Overlay Menu */}
      <motion.div
        ref={overlayRef}
        className="fixed bottom-0 left-0 w-full z-[60] flex flex-col items-center justify-center text-white overflow-hidden"
        animate={{ height: menuOpen ? "60vh" : "82px" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#FF4500] to-[#FF6B35]"
          style={{
            clipPath: `polygon(
              0 0, calc(100% - 4px) 0, calc(100% - 4px) 4px,
              100% 4px, 100% 100%,
              0 100%, 0 4px, 4px 4px, 4px 0
            )`,
          }}
        />

        {/* Menu Links */}
        <nav className="flex flex-col items-center gap-6 text-xl tracking-widest relative z-10 font-mono mb-10">
          {NAV_LINKS.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : 30, filter: menuOpen ? "blur(0px)" : "blur(10px)" }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.6, ease: "easeOut" }}
            >
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-black transition-colors duration-300"
                >
                  <AnimatedLink value={item.label.toUpperCase()} />
                </a>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-black transition-colors duration-300"
                >
                  <AnimatedLink value={item.label.toUpperCase()} />
                </Link>
              )}
            </motion.div>
          ))}
        </nav>
      </motion.div>
    </div>
  );
}
