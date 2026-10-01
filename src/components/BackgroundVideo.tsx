import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  saveVideoToIndexedDB,
  loadSavedVideoFromIndexedDB,
  clearSavedVideoFromIndexedDB,
} from '../utils/videoStorage';

// Default video constant removed - no base template video
export const HERO_VIDEO_URL = "";

export interface BackgroundVideoProps {
  customVideoUrl?: string | null;
  overlayOpacity?: number;
  sensitivity?: number;
  onVideoSelected?: (file: File, objectUrl: string) => void;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  customVideoUrl,
  overlayOpacity = 0.40,
  sensitivity = 0.8,
  onVideoSelected,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const prevXRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const pendingSeekTimeRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);

  // Local active video source: only uses customVideoUrl or restored user-imported video
  const [activeSrc, setActiveSrc] = useState<string>(customVideoUrl || '');
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  // Sync with prop if passed
  useEffect(() => {
    if (customVideoUrl) {
      setActiveSrc(customVideoUrl);
    }
  }, [customVideoUrl]);

  // On mount and on custom event: restore saved user-imported video from IndexedDB or localStorage
  useEffect(() => {
    async function restoreSavedVideo() {
      if (customVideoUrl) return;

      try {
        const saved = await loadSavedVideoFromIndexedDB();
        if (saved && saved.blob) {
          const url = URL.createObjectURL(saved.blob);
          setActiveSrc(url);
          return;
        }

        // Check settings from localStorage
        const rawSettings = localStorage.getItem('centre_auto_video_settings');
        if (rawSettings) {
          const parsed = JSON.parse(rawSettings);
          if (parsed.type === 'url' && parsed.url) {
            setActiveSrc(parsed.url);
          }
        }
      } catch (err) {
        console.warn('Could not restore saved video:', err);
      }
    }

    restoreSavedVideo();

    const handleCustomVideoUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveSrc(customEvent.detail);
      } else {
        restoreSavedVideo();
      }
    };

    window.addEventListener('centre_auto_video_updated', handleCustomVideoUpdated);
    return () => {
      window.removeEventListener('centre_auto_video_updated', handleCustomVideoUpdated);
    };
  }, [customVideoUrl]);

  // Horizontal mouse-scrub seeking logic
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

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
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
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setVideoLoaded(true);
      targetTimeRef.current = video.duration * 0.15;
      video.currentTime = targetTimeRef.current;
    }
  };

  const isPlaceholder = !activeSrc || activeSrc === "REPLACE_WITH_CENTRE_AUTO_JCR_VIDEO";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#07080a]">
      {!isPlaceholder && (
        <>
          <video
            ref={videoRef}
            key={activeSrc}
            src={activeSrc}
            className="fixed inset-0 w-full h-full object-cover z-0"
            style={{ objectPosition: '70% center' }}
            muted
            playsInline
            preload="auto"
            autoPlay={false}
            onSeeked={handleSeeked}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() => setVideoLoaded(false)}
          />
          {/* Subtle contrast overlay ensuring crisp legibility of white typography */}
          <div
            className="fixed inset-0 z-0 bg-black pointer-events-none transition-opacity duration-300"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}

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
