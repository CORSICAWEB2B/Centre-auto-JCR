import React, { useEffect, useRef, useState } from 'react';
import { loadSavedVideoFromIndexedDB } from '../utils/videoStorage';

// Default static public video path (compatible with Vite, GitHub, Cloudflare Pages/Workers)
export const HERO_VIDEO_URL = '/hero-video.mp4';

export interface BackgroundVideoProps {
  customVideoUrl?: string | null;
  overlayOpacity?: number;
  sensitivity?: number;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  customVideoUrl,
  overlayOpacity = 0.40,
  sensitivity = 0.8,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const prevXRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const pendingSeekTimeRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const hasSyncedToDisk = useRef<boolean>(false);

  // Default to relative public asset /hero-video.mp4
  const [activeSrc, setActiveSrc] = useState<string>(customVideoUrl || HERO_VIDEO_URL);

  // Sync with prop if provided
  useEffect(() => {
    if (customVideoUrl) {
      setActiveSrc(customVideoUrl);
    }
  }, [customVideoUrl]);

  // Check if browser has a custom user-imported video stored in IndexedDB.
  // If so, use it and automatically sync it to /api/save-hero-video so it is permanently
  // written to /public/hero-video.mp4 on disk for GitHub and Cloudflare export!
  useEffect(() => {
    async function restoreAndSyncSavedVideo() {
      if (customVideoUrl) return;

      try {
        const saved = await loadSavedVideoFromIndexedDB();
        if (saved && saved.blob) {
          const blobUrl = URL.createObjectURL(saved.blob);
          setActiveSrc(blobUrl);

          // Auto-sync blob to /public/hero-video.mp4 on disk via development server API
          if (!hasSyncedToDisk.current) {
            hasSyncedToDisk.current = true;
            fetch('/api/save-hero-video', {
              method: 'POST',
              body: saved.blob,
            }).catch((err) => {
              console.warn('Auto-sync to /public/hero-video.mp4:', err);
            });
          }
        }
      } catch (err) {
        console.warn('Could not restore video from IndexedDB:', err);
      }
    }

    restoreAndSyncSavedVideo();
  }, [customVideoUrl]);

  // Ensure autoplay starts reliably across all browsers (Chrome, Safari, iOS, Cloudflare)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(() => {
        // Autoplay policy fallback: retry on first interaction
        const handleFirstInteraction = () => {
          video.play().catch(() => {});
          window.removeEventListener('click', handleFirstInteraction);
          window.removeEventListener('touchstart', handleFirstInteraction);
        };
        window.addEventListener('click', handleFirstInteraction, { once: true });
        window.addEventListener('touchstart', handleFirstInteraction, { once: true });
      });
    }
  }, [activeSrc]);

  // Horizontal mouse-scrub & touch-scrub seeking logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const video = videoRef.current;
      if (!video || !video.duration || isNaN(video.duration)) {
        return;
      }

      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const duration = video.duration;
      const timeOffset = (delta / window.innerWidth) * sensitivity * duration;
      const newTarget = Math.max(0, Math.min(duration, targetTimeRef.current + timeOffset));
      targetTimeRef.current = newTarget;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = newTarget;
      } else {
        pendingSeekTimeRef.current = newTarget;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const currentX = e.touches[0].clientX;
      const video = videoRef.current;
      if (!video || !video.duration || isNaN(video.duration)) {
        return;
      }

      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const duration = video.duration;
      const timeOffset = (delta / window.innerWidth) * sensitivity * duration;
      const newTarget = Math.max(0, Math.min(duration, targetTimeRef.current + timeOffset));
      targetTimeRef.current = newTarget;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = newTarget;
      } else {
        pendingSeekTimeRef.current = newTarget;
      }
    };

    const handlePointerEnd = () => {
      prevXRef.current = null;
      // Resume playback after scrubbing
      const video = videoRef.current;
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handlePointerEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handlePointerEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerEnd);
    };
  }, [sensitivity]);

  const handleSeeked = () => {
    const video = videoRef.current;
    if (pendingSeekTimeRef.current !== null && video && video.duration) {
      const nextTime = pendingSeekTimeRef.current;
      pendingSeekTimeRef.current = null;
      video.currentTime = nextTime;
    } else {
      isSeekingRef.current = false;
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      if (video.duration && !isNaN(video.duration)) {
        targetTimeRef.current = video.currentTime || 0;
      }
      video.play().catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#07080a]">
      {/* 
        HERO BACKGROUND VIDEO:
        - Autoplay, muted, loop, playsinline
        - Static relative path /hero-video.mp4 (compatible with Vite, GitHub, Cloudflare Pages/Workers)
        - Exact framing: object-cover with object-position 70% center
      */}
      <video
        ref={videoRef}
        key={activeSrc}
        src={activeSrc}
        className="fixed inset-0 w-full h-full object-cover z-0"
        style={{ objectPosition: '70% center' }}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        onLoadedMetadata={handleLoadedMetadata}
        onError={() => {
          // If a blob URL fails, fallback to static /hero-video.mp4
          if (activeSrc !== HERO_VIDEO_URL) {
            setActiveSrc(HERO_VIDEO_URL);
          }
        }}
      />

      {/* Subtle contrast overlay ensuring crisp legibility of white typography */}
      <div
        className="fixed inset-0 z-0 bg-black pointer-events-none transition-opacity duration-300"
        style={{ opacity: overlayOpacity }}
      />

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
