'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Accessibility Check: Disable Lenis if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion) {
      return;
    }

    // 2. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !isMobile,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    // 3. Connect Lenis Scroll Event to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 4. GSAP Ticker Synchronization
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(500, 33);

    // Make lenis globally available for modal locking & back-to-top
    (window as any).__lenis = lenis;

    // 5. Cleanup on Unmount
    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerFn);
      delete (window as any).__lenis;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // 6. Refresh ScrollTrigger & Lenis on Route Change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
};
