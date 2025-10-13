"use client";

import { useEffect, useState } from "react";
import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";

export default function SiteHeader({ children }) {
  const [show, setShow] = useState(false);

  const desktopNavHeight = 80; // px
  const mobileNavTopHeight = 70; // px (matches your top navbar)
  const mobileNavBottomHeight = 75; // px (matches your bottom navbar)

  useEffect(() => {
    const intro = document.querySelector("#intro");
    if (!intro) { 
      setShow(true); 
      return; 
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setShow(!entry.isIntersecting || entry.intersectionRatio < 0.1);
      }, 
      { threshold: [0, 0.1, 0.5, 1], rootMargin: "-20px 0px 0px 0px" }
    );

    observer.observe(intro);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={`desktop-navbar fixed top-0 left-0 w-full z-[60] transition-transform duration-300 md:block hidden ${
          show ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ height: `${desktopNavHeight}px` }}
      >
        <DesktopNav height={desktopNavHeight} />
      </div>

      {/* Mobile Navbars - Both Top and Bottom */}
      <div className="md:hidden">
        {/* Pass the show state as a prop to MobileNav */}
        <MobileNav show={show} />
      </div>

      {/* Content wrapper */}
      <div className="relative overflow-x-hidden">
        {children}
      </div>
    </>
  );
}