// DesktopNav.jsx
import Link from "next/link";
import { AnimatedLink } from "./AnimatedLink";
import UnCtrlButton from "./UnCtrlButton";
import LogoAnimated from "./LogoAnimated";
import { NAV_LINKS, CTA_LINKS } from "@/config/links";


export default function DesktopNav({ height = 78 }) {
  return (
    <div className="hidden md:block w-screen bg-black">
      <div
        className="max-w-7xl mx-auto flex items-center justify-between px-6"
        style={{ height: `${height}px` }}
      >
        <LogoAnimated baseSize={140} overlaySize={40} overlayOffsetX={-45} overlayOffsetY={0} />
        <nav className="flex items-center gap-10 text-white">
          {NAV_LINKS.map((item) => (
            item.external ? (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm tracking-widest">
                <AnimatedLink value={item.label.toUpperCase()} />
              </a>
            ) : (
              <Link key={item.href} href={item.href} className="text-sm tracking-widest">
                <AnimatedLink value={item.label.toUpperCase()} />
              </Link>
            )
          ))}
          <UnCtrlButton href={CTA_LINKS.orderNow} external>ORDER NOW</UnCtrlButton>
        </nav>
      </div>
    </div>
  );
}
