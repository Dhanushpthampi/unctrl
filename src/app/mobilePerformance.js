"use client";

/**
 * Mobile Performance Optimization — Simplified
 *
 * The heavy lifting (lazy-loading video src, play/pause on visibility)
 * is now handled inside the MobileVideo component itself via its own
 * IntersectionObserver. This module only provides lightweight
 * supplementary optimisations that don't overlap with the component.
 */

function isMobileDevice() {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent.toLowerCase();
  const mobileUA = /mobile|android|iphone|ipad|ipod/.test(ua);
  const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const small = window.innerWidth <= 768;

  return mobileUA || (touch && small);
}

class MobilePerformanceMonitor {
  constructor() {
    this.isMobile = isMobileDevice();
    this.isInitialized = false;
  }

  init() {
    if (!this.isMobile || this.isInitialized) return;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.apply());
    } else {
      this.apply();
    }

    this.isInitialized = true;
  }

  apply() {
    // 1. Set lazy loading on images that haven't opted out
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => this.lazyImages());
    } else {
      setTimeout(() => this.lazyImages(), 1);
    }

    // Scroll listener removed as it hurt mobile compositing performance
  }
  lazyImages() {
    document.querySelectorAll("img").forEach((img) => {
      if (!img.loading) img.loading = "lazy";
    });
  }

  destroy() {
    // nothing to tear down
  }
}

let mobilePerformance = null;

export function initMobilePerformance() {
  if (typeof window === "undefined") return;
  if (!mobilePerformance) {
    mobilePerformance = new MobilePerformanceMonitor();
  }
  mobilePerformance.init();
}

export function destroyMobilePerformance() {
  if (mobilePerformance) {
    mobilePerformance.destroy();
    mobilePerformance = null;
  }
}

export default mobilePerformance;
