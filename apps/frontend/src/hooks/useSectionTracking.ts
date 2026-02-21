import { useEffect, useRef, useCallback } from 'react';
import { useAnalytics, SectionId } from './useAnalytics';

interface SectionTrackingOptions {
  /** Threshold for intersection observer (0-1). Default: 0.5 (50% visible) */
  threshold?: number;
  /** Minimum time (ms) to track as meaningful view. Default: 1000ms */
  minTimeMs?: number;
}

interface SectionRef {
  element: HTMLElement | null;
  sectionId: SectionId;
  sectionTitle: string;
}

/**
 * Custom hook for tracking section engagement on the public viewer page.
 * Uses Intersection Observer to detect when sections come into view and
 * tracks time spent in each section.
 */
export function useSectionTracking(
  followupId: string | undefined,
  options: SectionTrackingOptions = {}
) {
  const { threshold = 0.5, minTimeMs = 1000 } = options;

  const { trackSectionView, trackSectionTime, trackScrollDepth } = useAnalytics(followupId);

  // Track registered sections
  const sectionsRef = useRef<Map<SectionId, SectionRef>>(new Map());

  // Track which sections have been viewed (to avoid duplicate SECTION_VIEW events)
  const viewedSectionsRef = useRef<Set<SectionId>>(new Set());

  // Track time spent in each section
  const sectionTimersRef = useRef<Map<SectionId, { startTime: number; totalTime: number }>>(new Map());

  // Track current visible section
  const currentVisibleSectionRef = useRef<SectionId | null>(null);

  // Track max scroll depth
  const maxScrollDepthRef = useRef<number>(0);
  const lastReportedScrollDepthRef = useRef<number>(0);

  // Intersection Observer reference
  const observerRef = useRef<IntersectionObserver | null>(null);

  /**
   * Register a section element for tracking
   */
  const registerSection = useCallback((
    element: HTMLElement | null,
    sectionId: SectionId,
    sectionTitle: string
  ) => {
    if (element) {
      sectionsRef.current.set(sectionId, { element, sectionId, sectionTitle });

      // Initialize timer for this section
      if (!sectionTimersRef.current.has(sectionId)) {
        sectionTimersRef.current.set(sectionId, { startTime: 0, totalTime: 0 });
      }

      // Observe the element
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    }
  }, []);

  /**
   * Handle section visibility changes
   */
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const sectionData = Array.from(sectionsRef.current.values()).find(
        (s) => s.element === entry.target
      );

      if (!sectionData) return;

      const { sectionId, sectionTitle } = sectionData;
      const timer = sectionTimersRef.current.get(sectionId);

      if (entry.isIntersecting) {
        // Section came into view

        // Track SECTION_VIEW event (only once per section)
        if (!viewedSectionsRef.current.has(sectionId)) {
          viewedSectionsRef.current.add(sectionId);
          trackSectionView(sectionId, sectionTitle);
        }

        // Start timing this section
        if (timer && timer.startTime === 0) {
          timer.startTime = Date.now();
          currentVisibleSectionRef.current = sectionId;
        }
      } else {
        // Section left view

        // Stop timing and accumulate time
        if (timer && timer.startTime > 0) {
          const timeSpent = Date.now() - timer.startTime;
          timer.totalTime += timeSpent;
          timer.startTime = 0;

          // If this was the current section, clear it
          if (currentVisibleSectionRef.current === sectionId) {
            currentVisibleSectionRef.current = null;
          }
        }
      }
    });
  }, [trackSectionView]);

  /**
   * Handle scroll events for scroll depth tracking
   */
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollHeight <= 0) return;

    const currentScrollDepth = Math.round((scrollTop / scrollHeight) * 100);

    // Update max scroll depth
    if (currentScrollDepth > maxScrollDepthRef.current) {
      maxScrollDepthRef.current = currentScrollDepth;
    }

    // Report scroll depth at 25%, 50%, 75%, 100% milestones
    const milestones = [25, 50, 75, 100];
    const currentMilestone = milestones.find(
      (m) => maxScrollDepthRef.current >= m && lastReportedScrollDepthRef.current < m
    );

    if (currentMilestone) {
      lastReportedScrollDepthRef.current = currentMilestone;
      trackScrollDepth(currentScrollDepth, maxScrollDepthRef.current);
    }
  }, [trackScrollDepth]);

  /**
   * Send accumulated section time data before page unload
   */
  const flushSectionTimes = useCallback(() => {
    // Stop all active timers and send time data
    sectionTimersRef.current.forEach((timer, sectionId) => {
      let totalTime = timer.totalTime;

      // If timer is still running, add current time
      if (timer.startTime > 0) {
        totalTime += Date.now() - timer.startTime;
      }

      // Only track if meaningful time was spent
      if (totalTime >= minTimeMs) {
        trackSectionTime(sectionId, totalTime);
      }
    });

    // Send final scroll depth
    if (maxScrollDepthRef.current > lastReportedScrollDepthRef.current) {
      trackScrollDepth(
        Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100),
        maxScrollDepthRef.current
      );
    }
  }, [trackSectionTime, trackScrollDepth, minTimeMs]);

  // Set up Intersection Observer
  useEffect(() => {
    if (!followupId) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin: '0px',
    });

    // Observe any already-registered sections
    sectionsRef.current.forEach(({ element }) => {
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [followupId, handleIntersection, threshold]);

  // Set up scroll tracking
  useEffect(() => {
    if (!followupId) return;

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [followupId, handleScroll]);

  // Set up beforeunload handler to flush data
  useEffect(() => {
    if (!followupId) return;

    const handleBeforeUnload = () => {
      flushSectionTimes();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also flush on unmount
      flushSectionTimes();
    };
  }, [followupId, flushSectionTimes]);

  return {
    registerSection,
    flushSectionTimes,
  };
}
