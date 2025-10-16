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
    preload="metadata"   // <-- optimized for mobile
    muted
    loop
    playsInline
    webkit-playsinline="true"
    x5-playsinline="true"
    x5-video-player-type="h5"
    x5-video-player-fullscreen="true"
    controls={false}
    controlsList="nodownload nofullscreen noremoteplayback"
    disablePictureInPicture={true}
    style={{
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      willChange: 'transform',
      pointerEvents: 'none'
    }}
    {...props}
  />
}
