import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // milliseconds
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number; // pixels to translate
  duration?: number; // milliseconds
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 24,
  duration = 750,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  // Detect mobile viewport on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    // Smartphone-optimized rootMargin & threshold:
    // On mobile, trigger slightly before the item enters the viewport (rootMargin bottom +40px)
    // with a low threshold (0.04) to avoid any blank stutter during fast thumb-scrolling.
    // On desktop, trigger neatly at the viewport edge.
    const mobileThreshold = 0.04;
    const desktopThreshold = 0.08;
    const mobileRootMargin = '0px 0px 40px 0px';
    const desktopRootMargin = '0px 0px -30px 0px';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
            // Mark animation finished after duration + delay to clean up willChange
            setTimeout(() => {
              setHasAnimated(true);
            }, (isMobile ? Math.min(duration, 600) : duration) + (isMobile ? Math.min(delay, 120) : delay) + 100);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: isMobile ? mobileThreshold : desktopThreshold,
        rootMargin: isMobile ? mobileRootMargin : desktopRootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once, isMobile, duration, delay]);

  // Adjust distance & delay for smartphone screens to keep animations snappy and prevent excessive movement
  const effectiveDistance = isMobile ? Math.min(distance, 14) : distance;
  const effectiveDelay = isMobile ? Math.min(delay, 120) : delay;
  const effectiveDuration = isMobile ? Math.min(duration, 600) : duration;

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${effectiveDistance}px, 0)`;
      case 'down':
        return `translate3d(0, -${effectiveDistance}px, 0)`;
      case 'left':
        return `translate3d(${effectiveDistance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${effectiveDistance}px, 0, 0)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionProperty: 'opacity, transform',
        transitionDuration: `${effectiveDuration}ms`,
        transitionDelay: `${effectiveDelay}ms`,
        // Custom refined silk cubic-bezier: smooth start, organic deceleration
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        // Release GPU resources on mobile once animation is completed
        willChange: hasAnimated ? 'auto' : 'opacity, transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {children}
    </div>
  );
};
