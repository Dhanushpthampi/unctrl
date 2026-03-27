"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollEffects — Lightweight section reveal on scroll.
 *
 * Uses a single IntersectionObserver with { once: true } semantics
 * (unobserves after adding the class) to avoid ongoing work.
 *
 * The MutationObserver only watches direct childList of <main>
 * (subtree: false) to pick up dynamically-loaded sections without
 * firing on every inner DOM change.
 */
export default function ScrollEffects({ children }) {
  const ioRef = useRef(null);
  const observedRef = useRef(new Set());

  useEffect(() => {
    let cancelled = false;

    const createObserver = (main) => {
      if (!main) return;

      ioRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in-view");
              // Once revealed, stop watching — no need to track it anymore
              ioRef.current?.unobserve(entry.target);
              observedRef.current.delete(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      const observeNewSections = () => {
        const nodes = main.querySelectorAll("section, footer, [data-section]");
        nodes.forEach((node) => {
          if (!observedRef.current.has(node) && !node.classList.contains("is-in-view")) {
            ioRef.current?.observe(node);
            observedRef.current.add(node);
          }
        });
      };

      observeNewSections();

      // Watch only DIRECT children of <main> — not the full subtree
      const mo = new MutationObserver(observeNewSections);
      mo.observe(main, { childList: true, subtree: false });

      return mo;
    };

    // Wait for <main> to exist
    let mo;
    const waitForMain = () => {
      const main = document.querySelector("main");
      if (!main && !cancelled) {
        requestAnimationFrame(waitForMain);
      } else if (main && !cancelled) {
        mo = createObserver(main);
      }
    };
    waitForMain();

    return () => {
      cancelled = true;
      if (ioRef.current) ioRef.current.disconnect();
      if (mo) mo.disconnect();
    };
  }, []);

  return children;
}
