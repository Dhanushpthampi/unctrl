import { useRef, useEffect } from "react";

export default function LazyVideo({ src, className, ...props }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.01 } // play as soon as 1% visible
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return <video
    ref={videoRef}
    className={className}
    preload="auto"   // <-- preloads immediately
    muted
    loop
    playsInline
    {...props}
  />
}
