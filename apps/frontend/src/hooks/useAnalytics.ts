import { useEffect, useRef, useCallback } from 'react';
import { analyticsApi } from '@/services/api';

// Section IDs for tracking
export type SectionId = 'meeting-recap' | 'value-proposition' | 'next-steps';

// Generate a unique session ID that persists during the page visit
const generateSessionId = () => {
  const stored = sessionStorage.getItem('analytics_session_id');
  if (stored) return stored;

  const newId = crypto.randomUUID();
  sessionStorage.setItem('analytics_session_id', newId);
  return newId;
};

// Detect device type
const getDeviceType = (): 'MOBILE' | 'TABLET' | 'DESKTOP' => {
  const width = window.innerWidth;
  if (width < 768) return 'MOBILE';
  if (width < 1024) return 'TABLET';
  return 'DESKTOP';
};

// Detect browser
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
};

export function useAnalytics(followupId: string | undefined) {
  const sessionIdRef = useRef<string>(generateSessionId());
  const hasTrackedRef = useRef(false);
  const sessionStartRef = useRef<string | null>(null);

  useEffect(() => {
    if (!followupId || hasTrackedRef.current) return;

    const trackView = async () => {
      try {
        // Start a new analytics session
        const session = await analyticsApi.startSession({
          followupId,
          deviceType: getDeviceType(),
          browser: getBrowser(),
        });

        sessionStartRef.current = session.id;

        // Track PAGE_VIEW event
        await analyticsApi.trackEvent({
          followupId,
          sessionId: session.id,
          eventType: 'PAGE_VIEW',
          deviceType: getDeviceType(),
          browser: getBrowser(),
        });

        hasTrackedRef.current = true;
      } catch (error) {
        console.error('Failed to track analytics:', error);
      }
    };

    trackView();

    // End session when page is unloaded
    const handleUnload = () => {
      if (sessionStartRef.current) {
        // Use sendBeacon for reliable tracking on page unload
        navigator.sendBeacon(
          `/api/analytics/sessions/end`,
          JSON.stringify({ sessionId: sessionStartRef.current })
        );
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [followupId]);

  /**
   * Track a link click event
   * @param url - The URL that was clicked
   * @param linkText - The text of the link (optional)
   * @param sectionId - The section where the link was located (e.g., 'recap', 'valueProp', 'header')
   */
  const trackLinkClick = async (url: string, linkText?: string, sectionId?: string) => {
    if (!followupId || !sessionStartRef.current) return;

    try {
      await analyticsApi.trackEvent({
        followupId,
        sessionId: sessionStartRef.current,
        eventType: 'LINK_CLICK',
        eventData: {
          url,
          linkText,
          sectionId,
        },
        deviceType: getDeviceType(),
        browser: getBrowser(),
      });
    } catch (error) {
      console.error('Failed to track link click:', error);
    }
  };

  /**
   * Track when a section comes into view
   * @param sectionId - The ID of the section (e.g., 'meeting-recap', 'value-proposition', 'next-steps')
   * @param sectionTitle - The display title of the section
   */
  const trackSectionView = useCallback(async (sectionId: SectionId, sectionTitle: string) => {
    if (!followupId || !sessionStartRef.current) return;

    try {
      await analyticsApi.trackEvent({
        followupId,
        sessionId: sessionStartRef.current,
        eventType: 'SECTION_VIEW',
        eventData: {
          sectionId,
          sectionType: sectionId.replace(/-/g, ''),
          sectionTitle,
        },
        deviceType: getDeviceType(),
        browser: getBrowser(),
      });
    } catch (error) {
      console.error('Failed to track section view:', error);
    }
  }, [followupId]);

  /**
   * Track time spent in a section
   * @param sectionId - The ID of the section
   * @param timeSpentMs - Time spent in milliseconds
   */
  const trackSectionTime = useCallback(async (sectionId: SectionId, timeSpentMs: number) => {
    if (!followupId || !sessionStartRef.current) return;

    // Only track if meaningful time was spent (at least 1 second)
    if (timeSpentMs < 1000) return;

    try {
      await analyticsApi.trackEvent({
        followupId,
        sessionId: sessionStartRef.current,
        eventType: 'SECTION_TIME',
        eventData: {
          sectionId,
          timeSpentMs,
        },
        deviceType: getDeviceType(),
        browser: getBrowser(),
      });
    } catch (error) {
      console.error('Failed to track section time:', error);
    }
  }, [followupId]);

  /**
   * Track scroll depth percentage
   * @param scrollDepthPercent - Current scroll depth (0-100)
   * @param maxScrollDepthPercent - Maximum scroll depth reached (0-100)
   */
  const trackScrollDepth = useCallback(async (scrollDepthPercent: number, maxScrollDepthPercent: number) => {
    if (!followupId || !sessionStartRef.current) return;

    try {
      await analyticsApi.trackEvent({
        followupId,
        sessionId: sessionStartRef.current,
        eventType: 'SCROLL_DEPTH',
        eventData: {
          scrollDepthPercent,
          maxScrollDepthPercent,
        },
        deviceType: getDeviceType(),
        browser: getBrowser(),
      });
    } catch (error) {
      console.error('Failed to track scroll depth:', error);
    }
  }, [followupId]);

  return {
    sessionId: sessionIdRef.current,
    trackEvent: async (eventType: string, eventData?: Record<string, unknown>) => {
      if (!followupId || !sessionStartRef.current) return;

      try {
        await analyticsApi.trackEvent({
          followupId,
          sessionId: sessionStartRef.current,
          eventType: eventType as any,
          eventData,
          deviceType: getDeviceType(),
          browser: getBrowser(),
        });
      } catch (error) {
        console.error('Failed to track event:', error);
      }
    },
    trackLinkClick,
    trackSectionView,
    trackSectionTime,
    trackScrollDepth,
  };
}
