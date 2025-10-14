"use client";

import { useEffect, useRef } from "react";

export default function ScrollEffects({ children }) {
  const ioRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Wait until the browser is idle (after paint, idle thread)
    requestIdleCallback(() => {
      const main = document.querySelector("main");
      if (!main) return;

      // --- Create intersection observer ---
      ioRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in-view");
              ioRef.current.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.25 }
      );

      // --- Observe all main sections ---
      const targets = main.querySelectorAll("section, footer, [data-section]");
      targets.forEach((el) => ioRef.current.observe(el));

      // --- Light mutation observer for newly added sections ---
      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          m.addedNodes.forEach((node) => {
            if (
              node.nodeType === 1 &&
              (node.matches("section, footer, [data-section]"))
            ) {
              ioRef.current.observe(node);
            }
          });
        }
      });

      // Only watch direct children; no deep subtree scanning
      mo.observe(main, { childList: true });

      // --- Cleanup ---
      return () => {
        ioRef.current?.disconnect();
        mo.disconnect();
      };
    });
  }, []);

  return children;
}
