"use client";

/**
 * Mobile Performance Optimization System
 * 
 * This module provides comprehensive mobile performance optimizations for:
 * - Video loading and playback
 * - Animation performance
 * - Scroll performance
 * - Hardware acceleration
 * - Lazy loading
 * - Resource management
 */

// Mobile detection with comprehensive user agent checking
function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
    'windows phone', 'opera mini', 'iemobile', 'palm', 'smartphone'
  ];
  
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  
  return isMobileUA || (isTouchDevice && isSmallScreen);
}

// Performance monitoring
class MobilePerformanceMonitor {
  constructor() {
    this.isMobile = isMobileDevice();
    this.observers = new Map();
    this.deferredTasks = [];
    this.isInitialized = false;
  }

  // Initialize mobile optimizations
  init() {
    if (!this.isMobile || this.isInitialized) return;
    
    console.log('🚀 Initializing mobile performance optimizations...');
    
    // Apply optimizations after first paint
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.applyOptimizations());
    } else {
      this.applyOptimizations();
    }
    
    this.isInitialized = true;
  }

  // Apply all mobile optimizations
  applyOptimizations() {
    this.optimizeVideos();
    this.optimizeAnimations();
    this.optimizeScroll();
    this.enableHardwareAcceleration();
    this.setupLazyLoading();
    this.optimizeResources();
    this.setupIntersectionObserver();
  }

  // Video optimizations
  optimizeVideos() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
      // Essential mobile video attributes
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-playsinline', 'true');
      video.setAttribute('x5-video-player-type', 'h5');
      video.setAttribute('x5-video-player-fullscreen', 'true');
      
      // Performance optimizations
      video.setAttribute('preload', 'metadata');
      video.setAttribute('muted', 'true');
      video.setAttribute('autoplay', 'true');
      video.setAttribute('loop', 'true');
      
      // Force hardware acceleration
      video.style.transform = 'translateZ(0)';
      video.style.backfaceVisibility = 'hidden';
      video.style.willChange = 'transform';
      video.style.webkitTransform = 'translateZ(0)';
      
      // Disable controls and interactions
      video.controls = false;
      video.controlsList = 'nodownload nofullscreen noremoteplayback';
      video.disablePictureInPicture = true;
      video.style.pointerEvents = 'none';
      
      // Optimize for mobile playback
      video.addEventListener('loadstart', () => {
        video.style.opacity = '1';
      });
      
      // Handle autoplay failures gracefully
      video.addEventListener('canplay', () => {
        video.play().catch(() => {
          // Fallback: play on first user interaction
          const playOnInteraction = () => {
            video.play().catch(() => {});
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('click', playOnInteraction);
          };
          document.addEventListener('touchstart', playOnInteraction, { once: true });
          document.addEventListener('click', playOnInteraction, { once: true });
        });
      });
    });
  }

  // Animation optimizations
  optimizeAnimations() {
    // Reduce animation complexity on mobile
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        /* Reduce animation complexity */
        .marquee-left .marquee-track,
        .marquee-right .marquee-track {
          animation-duration: 20s !important;
        }
        
        /* Disable heavy hover effects on mobile */
        .coinman-hover:hover {
          animation: none !important;
        }
        
        /* Optimize transitions */
        * {
          transition-duration: 0.2s !important;
        }
        
        /* Reduce particle effects */
        .particle, .glitch-effect {
          display: none !important;
        }
        
        /* Simplify transforms */
        .video-card {
          transform: translateZ(0) !important;
          will-change: transform !important;
        }
      }
      
      /* Force hardware acceleration for mobile */
      @media (max-width: 768px) {
        video, canvas, .r3f-canvas, .video-card {
          transform: translateZ(0) !important;
          backface-visibility: hidden !important;
          will-change: transform !important;
          -webkit-transform: translateZ(0) !important;
          -webkit-backface-visibility: hidden !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Scroll optimizations
  optimizeScroll() {
    // Optimize scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Reduce scroll sensitivity on mobile
    let scrollTimeout;
    const optimizedScrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Batch scroll updates
        requestAnimationFrame(() => {
          // Update scroll-dependent elements here
        });
      }, 16); // ~60fps
    };
    
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    // Avoid mutating <body> inline styles before hydration to prevent mismatch
  }

  // Enable hardware acceleration
  enableHardwareAcceleration() {
    const elements = document.querySelectorAll('video, canvas, .r3f-canvas, .video-card, .marquee-track');
    
    elements.forEach(el => {
      el.style.transform = 'translateZ(0)';
      el.style.backfaceVisibility = 'hidden';
      el.style.willChange = 'transform';
      el.style.webkitTransform = 'translateZ(0)';
      el.style.webkitBackfaceVisibility = 'hidden';
    });
  }

  // Setup lazy loading for videos and heavy content
  setupLazyLoading() {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Load videos when they come into view
          if (element.tagName === 'VIDEO' && !element.src) {
            const dataSrc = element.getAttribute('data-src');
            if (dataSrc) {
              element.src = dataSrc;
              element.load();
            }
          }
          
          // Load images when they come into view
          if (element.tagName === 'IMG' && !element.src) {
            const dataSrc = element.getAttribute('data-src');
            if (dataSrc) {
              element.src = dataSrc;
            }
          }
          
          // Start animations when visible
          if (element.classList.contains('animate-on-scroll')) {
            element.classList.add('animate');
          }
          
          lazyObserver.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Observe all lazy-loadable elements
    const lazyElements = document.querySelectorAll('[data-src], .animate-on-scroll');
    lazyElements.forEach(el => lazyObserver.observe(el));
  }

  // Resource optimizations
  optimizeResources() {
    // Defer non-critical resources
    const deferResource = (url, type = 'script') => {
      if (type === 'script') {
        const script = document.createElement('script');
        script.src = url;
        script.defer = true;
        document.head.appendChild(script);
      } else if (type === 'style') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.media = 'print';
        link.onload = () => { link.media = 'all'; };
        document.head.appendChild(link);
      }
    };

    // Preload critical resources
    const preloadResource = (url, as) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = as;
      document.head.appendChild(link);
    };

    // Use requestIdleCallback for non-critical tasks
    const scheduleTask = (task) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(task);
      } else {
        setTimeout(task, 1);
      }
    };

    // Schedule non-critical optimizations
    scheduleTask(() => {
      // Optimize images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.loading) {
          img.loading = 'lazy';
        }
      });
    });
  }

  // Setup intersection observer for performance monitoring
  setupIntersectionObserver() {
    const performanceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element is visible - can start heavy operations
          // Start video playback if it's a video
          if (entry.target.tagName === 'VIDEO') {
            entry.target.play().catch(() => {});
          }
        } else {
          // Element is not visible - pause heavy operations
          
          // Pause video if it's a video
          if (entry.target.tagName === 'VIDEO') {
            entry.target.pause();
          }
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.1
    });

    // Observe all sections and videos
    const sections = document.querySelectorAll('section, video');
    sections.forEach(section => performanceObserver.observe(section));
  }

  // Cleanup method
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.deferredTasks = [];
  }
}

// Global mobile performance instance
let mobilePerformance = null;

// Initialize mobile performance optimizations
export function initMobilePerformance() {
  if (typeof window === 'undefined') return;
  
  if (!mobilePerformance) {
    mobilePerformance = new MobilePerformanceMonitor();
  }
  
  mobilePerformance.init();
}

// Cleanup function
export function destroyMobilePerformance() {
  if (mobilePerformance) {
    mobilePerformance.destroy();
    mobilePerformance = null;
  }
}

// Note: Initialization happens from layout via initMobilePerformance() to avoid hydration mismatches

export default mobilePerformance;

