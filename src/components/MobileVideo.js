"use client";

import { useEffect, useRef, useState, forwardRef } from "react";

const MobileVideo = forwardRef(function MobileVideo({ 
  src, 
  poster, 
  className = "", 
  autoPlay = true, 
  loop = true, 
  muted = true,
  onError,
  onCanPlay,
  onEnded,
  ...props 
}, ref) {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set video attributes to prevent controls
    video.controls = false;
    video.controlsList = 'nodownload nofullscreen noremoteplayback';
    video.disablePictureInPicture = true;
    
    // Additional mobile-specific attributes
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('x5-playsinline', 'true');
    video.setAttribute('x5-video-player-type', 'h5');
    video.setAttribute('x5-video-player-fullscreen', 'true');

    // Force autoplay with multiple strategies
    const forceAutoplay = async () => {
      try {
        // Strategy 1: Direct play
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Direct play failed, trying alternative methods");
        
        // Strategy 2: Set currentTime and play
        video.currentTime = 0;
        try {
          await video.play();
          setIsPlaying(true);
        } catch (error2) {
          console.log("Alternative play failed, trying user interaction");
          
          // Strategy 3: Wait for user interaction
          const playOnInteraction = () => {
            video.play().then(() => {
              setIsPlaying(true);
            }).catch(console.warn);
          };
          
          // Add multiple interaction listeners
          document.addEventListener("touchstart", playOnInteraction, { once: true });
          document.addEventListener("click", playOnInteraction, { once: true });
          document.addEventListener("scroll", playOnInteraction, { once: true });
          document.addEventListener("touchend", playOnInteraction, { once: true });
          
          // Auto-play after a short delay (some browsers allow this)
          setTimeout(() => {
            video.play().then(() => {
              setIsPlaying(true);
            }).catch(console.warn);
          }, 100);
          
          // Additional iOS Safari specific attempts
          setTimeout(() => {
            video.currentTime = 0;
            video.play().then(() => {
              setIsPlaying(true);
            }).catch(console.warn);
          }, 500);
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = (e) => {
      console.warn("Video error:", e);
      setHasError(true);
      onError?.(e);
    };

    const handleCanPlay = () => {
      onCanPlay?.();
      if (autoPlay) {
        forceAutoplay();
      }
    };

    const handleEnded = () => {
      onEnded?.();
    };

    // Add event listeners
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadstart", handleCanPlay);

    // Force play immediately if video is already loaded
    if (video.readyState >= 3) {
      forceAutoplay();
    }

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadstart", handleCanPlay);
    };
  }, [autoPlay, onError, onCanPlay, onEnded]);

  if (hasError) {
    return (
      <div className={`${className} bg-black flex items-center justify-center`}>
        <p className="text-white">Video not supported</p>
      </div>
    );
  }

  return (
    <video
      ref={ref || videoRef}
      src={src}
      poster={poster}
      className={`w-full h-full object-cover ${className}`}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      webkit-playsinline="true"
      x5-playsinline="true"
      x5-video-player-type="h5"
      x5-video-player-fullscreen="true"
      preload="auto"
      style={{
        // Force hardware acceleration
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform'
      }}
      {...props}
    />
  );
});

export default MobileVideo;
