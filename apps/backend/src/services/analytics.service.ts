// Analytics Service - Tracking and analytics
import { prisma } from '../lib/prisma';
import { NotFoundError, handlePrismaError } from '../utils/errors';
import type {
  AnalyticsEvent,
  AnalyticsSession,
  TrackEventDTO,
  StartSessionDTO,
  EndSessionDTO,
  FollowupAnalytics,
  AnalyticsSummary,
  TimeRange,
  DeviceType,
} from '@meeting-followup/shared';
import crypto from 'crypto';
import { notificationService } from './notification.service';

/**
 * Detailed analytics for a single followup including feedback and engagement
 */
export interface DetailedFollowupAnalytics {
  followupId: string;
  // Core metrics
  uniqueVisitors: number;
  totalPageViews: number;
  averageTimeOnPage: number; // in seconds
  // Feedback breakdown
  feedback: {
    recap: {
      positive: number; // RECAP_ACCURATE
      negative: number; // RECAP_INACCURATE
      total: number;
    };
    valueProposition: {
      positive: number; // VALUE_PROP_CLEAR
      negative: number; // VALUE_PROP_UNCLEAR
      total: number;
    };
  };
  // Section engagement (time spent per section from SECTION_TIME events)
  sectionEngagement: {
    sectionName: string;
    totalTimeSpent: number; // in seconds
    viewCount: number;
  }[];
  // Link clicks
  linkClicks: {
    url: string;
    count: number;
  }[];
  // Interest signals
  interestSignals: {
    interestedCount: number; // INTERESTED confirmations
    scheduleCallCount: number; // SCHEDULE_CALL confirmations
    totalInterest: number;
  };
  // Additional context
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  topLocations: {
    city: string;
    country: string;
    count: number;
  }[];
}

/**
 * Summary stats for all user's followups
 */
export interface UserAnalyticsSummary {
  totalFollowups: number;
  publishedFollowups: number;
  draftFollowups: number;
  mostRecentFollowupDate: string | null;
  totalViews: number;
  totalUniqueVisitors: number;
  totalEngagements: number;
  averageEngagementRate: number;
}

export class AnalyticsService {
  /**
   * Track an event (public - no auth required)
   */
  async trackEvent(data: TrackEventDTO): Promise<AnalyticsEvent> {
    try {
      // Verify followup exists and is published
      const followup = await prisma.followup.findUnique({
        where: { id: data.followupId, status: 'PUBLISHED' },
        select: { id: true },
      });

      if (!followup) {
        throw new NotFoundError('Follow-up');
      }

      // Hash IP address for privacy (would be from req.ip in actual implementation)
      const ipHash = this.hashIp('anonymous'); // Placeholder

      const event = await prisma.analyticsEvent.create({
        data: {
          followupId: data.followupId,
          sessionId: data.sessionId,
          eventType: data.eventType,
          eventData: data.eventData as any,
          deviceType: data.deviceType,
          browser: data.browser,
          locationCity: data.locationCity,
          locationCountry: data.locationCountry,
          ipHash,
        },
      });

      // Trigger notification check for PAGE_VIEW events
      if (data.eventType === 'PAGE_VIEW') {
        // Process asynchronously - don't wait for notification
        notificationService.processPageView(
          data.followupId,
          data.sessionId,
          ipHash,
          {
            deviceType: data.deviceType as DeviceType | undefined,
            browser: data.browser,
            locationCity: data.locationCity,
            locationCountry: data.locationCountry,
          }
        ).catch(err => {
          console.error('Error processing page view notification:', err);
        });
      }

      return event as AnalyticsEvent;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Start a new session (public)
   */
  async startSession(data: StartSessionDTO): Promise<AnalyticsSession> {
    try {
      const followup = await prisma.followup.findUnique({
        where: { id: data.followupId, status: 'PUBLISHED' },
        select: { id: true },
      });

      if (!followup) {
        throw new NotFoundError('Follow-up');
      }

      const session = await prisma.analyticsSession.create({
        data: {
          followupId: data.followupId,
          sessionStart: new Date(),
          deviceType: data.deviceType,
          browser: data.browser,
          locationCity: data.locationCity,
          locationCountry: data.locationCountry,
        },
      });

      return session as AnalyticsSession;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * End a session (public)
   */
  async endSession(data: EndSessionDTO): Promise<AnalyticsSession> {
    try {
      const session = await prisma.analyticsSession.findUnique({
        where: { id: data.sessionId },
      });

      if (!session) {
        throw new NotFoundError('Session');
      }

      const sessionEnd = new Date();
      const duration = Math.floor((sessionEnd.getTime() - session.sessionStart.getTime()) / 1000);

      const updatedSession = await prisma.analyticsSession.update({
        where: { id: data.sessionId },
        data: {
          sessionEnd,
          pageDuration: duration,
        },
      });

      return updatedSession as AnalyticsSession;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get analytics for a specific follow-up
   */
  async getFollowupAnalytics(
    followupId: string,
    userId: string,
    timeRange: TimeRange = '30d'
  ): Promise<FollowupAnalytics> {
    try {
      // Verify user owns the followup
      const followup = await prisma.followup.findUnique({
        where: { id: followupId },
        select: { userId: true },
      });

      if (!followup) {
        throw new NotFoundError('Follow-up', followupId);
      }

      if (followup.userId !== userId) {
        throw new NotFoundError('Follow-up', followupId);
      }

      const startDate = this.getStartDateForRange(timeRange);

      // Get event counts
      const [totalViews, uniqueVisitors, sessions, eventCounts, topLocations] = await Promise.all([
        prisma.analyticsEvent.count({
          where: {
            followupId,
            eventType: 'PAGE_VIEW',
            timestamp: { gte: startDate },
          },
        }),
        prisma.analyticsEvent.findMany({
          where: {
            followupId,
            eventType: 'PAGE_VIEW',
            timestamp: { gte: startDate },
          },
          distinct: ['sessionId'],
          select: { sessionId: true },
        }),
        prisma.analyticsSession.findMany({
          where: {
            followupId,
            sessionStart: { gte: startDate },
          },
          orderBy: { sessionStart: 'desc' },
          take: 10,
        }),
        prisma.analyticsEvent.groupBy({
          by: ['eventType'],
          where: {
            followupId,
            timestamp: { gte: startDate },
          },
          _count: true,
        }),
        prisma.analyticsEvent.groupBy({
          by: ['locationCity', 'locationCountry'],
          where: {
            followupId,
            timestamp: { gte: startDate },
            locationCity: { not: null },
            locationCountry: { not: null },
          },
          _count: true,
          orderBy: {
            locationCity: 'asc',
          },
          take: 5,
        }),
      ]);

      // Calculate metrics
      const fileDownloads = eventCounts.find((e) => e.eventType === 'FILE_DOWNLOAD')?._count || 0;
      const linkClicks = eventCounts.find((e) => e.eventType === 'LINK_CLICK')?._count || 0;
      const emailCopies = eventCounts.find((e) => e.eventType === 'COPY_EMAIL')?._count || 0;
      const phoneCopies = eventCounts.find((e) => e.eventType === 'COPY_PHONE')?._count || 0;

      const totalDuration = sessions.reduce((sum, s) => sum + (s.pageDuration || 0), 0);
      const avgDuration = sessions.length > 0 ? Math.floor(totalDuration / sessions.length) : 0;

      // Device breakdown
      const deviceCounts = await prisma.analyticsEvent.groupBy({
        by: ['deviceType'],
        where: {
          followupId,
          eventType: 'PAGE_VIEW',
          timestamp: { gte: startDate },
        },
        _count: true,
      });

      return {
        followupId,
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
        totalDuration,
        averageDuration: avgDuration,
        fileDownloads,
        linkClicks,
        emailCopies,
        phoneCopies,
        deviceBreakdown: {
          mobile: deviceCounts.find((d) => d.deviceType === 'MOBILE')?._count || 0,
          tablet: deviceCounts.find((d) => d.deviceType === 'TABLET')?._count || 0,
          desktop: deviceCounts.find((d) => d.deviceType === 'DESKTOP')?._count || 0,
        },
        topLocations: topLocations.map((loc) => ({
          city: loc.locationCity || 'Unknown',
          country: loc.locationCountry || 'Unknown',
          count: (loc._count as any) || 0,
        })),
        recentSessions: sessions as AnalyticsSession[],
      };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get analytics summary for all user's follow-ups
   */
  async getSummary(userId: string, timeRange: TimeRange = '30d'): Promise<AnalyticsSummary> {
    try {
      const startDate = this.getStartDateForRange(timeRange);

      const [followupCounts, analytics] = await Promise.all([
        prisma.followup.groupBy({
          by: ['status'],
          where: { userId },
          _count: true,
        }),
        prisma.analyticsEvent.groupBy({
          by: ['followupId'],
          where: {
            followup: { userId },
            timestamp: { gte: startDate },
          },
          _count: {
            _all: true,
          },
        }),
      ]);

      const totalFollowups = followupCounts.reduce((sum, fc) => sum + fc._count, 0);
      const publishedFollowups = followupCounts.find((fc) => fc.status === 'PUBLISHED')?._count || 0;
      const totalViews = analytics
        .filter((a) => a._count)
        .reduce((sum, a) => sum + a._count._all, 0);

      // Get engagement counts
      const engagements = await prisma.analyticsEvent.count({
        where: {
          followup: { userId },
          timestamp: { gte: startDate },
          eventType: { in: ['FILE_DOWNLOAD', 'LINK_CLICK', 'COPY_EMAIL', 'COPY_PHONE'] },
        },
      });

      // Top performing followups
      const topFollowups = await prisma.followup.findMany({
        where: { userId, status: 'PUBLISHED' },
        include: {
          company: {
            select: { name: true },
          },
          _count: {
            select: { analyticsEvents: true },
          },
        },
        orderBy: {
          analyticsEvents: {
            _count: 'desc',
          },
        },
        take: 5,
      });

      return {
        totalFollowups,
        publishedFollowups,
        totalViews,
        totalEngagements: engagements,
        averageEngagementRate:
          totalViews > 0 ? Math.round((engagements / totalViews) * 100) : 0,
        topPerformingFollowups: topFollowups.map((f) => ({
          followupId: f.id,
          title: f.title,
          companyName: f.company.name,
          views: f._count.analyticsEvents,
          engagements: 0, // Would need separate query for this
        })),
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  /**
   * Get detailed analytics for a single followup including feedback and engagement
   * This provides aggregated analytics data with feedback breakdown, section engagement, and interest signals
   */
  async getDetailedFollowupAnalytics(
    followupId: string,
    userId: string
  ): Promise<DetailedFollowupAnalytics> {
    try {
      // Verify user owns the followup
      const followup = await prisma.followup.findUnique({
        where: { id: followupId },
        select: { userId: true },
      });

      if (!followup) {
        throw new NotFoundError('Follow-up', followupId);
      }

      if (followup.userId !== userId) {
        throw new NotFoundError('Follow-up', followupId);
      }

      // Run all queries in parallel for performance
      const [
        // Unique visitors (count of unique sessionIds)
        uniqueSessionIds,
        // Total page views
        totalPageViews,
        // Sessions with duration for average time calculation
        sessions,
        // Feedback confirmations
        confirmations,
        // Section time events
        sectionTimeEvents,
        // Link click events
        linkClickEvents,
        // Device breakdown
        deviceCounts,
        // Location data
        topLocations,
      ] = await Promise.all([
        // Unique visitors
        prisma.analyticsEvent.findMany({
          where: { followupId, eventType: 'PAGE_VIEW' },
          distinct: ['sessionId'],
          select: { sessionId: true },
        }),
        // Total page views
        prisma.analyticsEvent.count({
          where: { followupId, eventType: 'PAGE_VIEW' },
        }),
        // Sessions with duration
        prisma.analyticsSession.findMany({
          where: { followupId, pageDuration: { not: null } },
          select: { pageDuration: true },
        }),
        // All confirmations grouped by type
        prisma.followupConfirmation.groupBy({
          by: ['type'],
          where: { followupId },
          _count: true,
        }),
        // Section time events
        prisma.analyticsEvent.findMany({
          where: { followupId, eventType: 'SECTION_TIME' },
          select: { eventData: true },
        }),
        // Link click events
        prisma.analyticsEvent.findMany({
          where: { followupId, eventType: 'LINK_CLICK' },
          select: { eventData: true },
        }),
        // Device breakdown
        prisma.analyticsEvent.groupBy({
          by: ['deviceType'],
          where: { followupId, eventType: 'PAGE_VIEW' },
          _count: true,
        }),
        // Top locations
        prisma.analyticsEvent.groupBy({
          by: ['locationCity', 'locationCountry'],
          where: {
            followupId,
            locationCity: { not: null },
            locationCountry: { not: null },
          },
          _count: true,
          orderBy: { locationCity: 'asc' },
          take: 5,
        }),
      ]);

      // Calculate average time on page
      const totalDuration = sessions.reduce((sum, s) => sum + (s.pageDuration || 0), 0);
      const averageTimeOnPage = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;

      // Build feedback breakdown from confirmations
      const confirmationCounts: Record<string, number> = {};
      confirmations.forEach((c) => {
        confirmationCounts[c.type] = c._count;
      });

      const feedback = {
        recap: {
          positive: confirmationCounts['RECAP_ACCURATE'] || 0,
          negative: confirmationCounts['RECAP_INACCURATE'] || 0,
          total: (confirmationCounts['RECAP_ACCURATE'] || 0) + (confirmationCounts['RECAP_INACCURATE'] || 0),
        },
        valueProposition: {
          positive: confirmationCounts['VALUE_PROP_CLEAR'] || 0,
          negative: confirmationCounts['VALUE_PROP_UNCLEAR'] || 0,
          total: (confirmationCounts['VALUE_PROP_CLEAR'] || 0) + (confirmationCounts['VALUE_PROP_UNCLEAR'] || 0),
        },
      };

      // Aggregate section engagement from SECTION_TIME events
      const sectionMap = new Map<string, { totalTime: number; viewCount: number }>();
      sectionTimeEvents.forEach((event) => {
        const data = event.eventData as { sectionName?: string; duration?: number } | null;
        if (data?.sectionName) {
          const existing = sectionMap.get(data.sectionName) || { totalTime: 0, viewCount: 0 };
          existing.totalTime += data.duration || 0;
          existing.viewCount += 1;
          sectionMap.set(data.sectionName, existing);
        }
      });

      const sectionEngagement = Array.from(sectionMap.entries()).map(([sectionName, data]) => ({
        sectionName,
        totalTimeSpent: data.totalTime,
        viewCount: data.viewCount,
      }));

      // Aggregate link clicks by URL
      const linkMap = new Map<string, number>();
      linkClickEvents.forEach((event) => {
        const data = event.eventData as { url?: string } | null;
        if (data?.url) {
          linkMap.set(data.url, (linkMap.get(data.url) || 0) + 1);
        }
      });

      const linkClicks = Array.from(linkMap.entries())
        .map(([url, count]) => ({ url, count }))
        .sort((a, b) => b.count - a.count);

      // Interest signals
      const interestSignals = {
        interestedCount: confirmationCounts['INTERESTED'] || 0,
        scheduleCallCount: confirmationCounts['SCHEDULE_CALL'] || 0,
        totalInterest: (confirmationCounts['INTERESTED'] || 0) + (confirmationCounts['SCHEDULE_CALL'] || 0),
      };

      // Device breakdown
      const deviceBreakdown = {
        mobile: deviceCounts.find((d) => d.deviceType === 'MOBILE')?._count || 0,
        tablet: deviceCounts.find((d) => d.deviceType === 'TABLET')?._count || 0,
        desktop: deviceCounts.find((d) => d.deviceType === 'DESKTOP')?._count || 0,
      };

      return {
        followupId,
        uniqueVisitors: uniqueSessionIds.length,
        totalPageViews,
        averageTimeOnPage,
        feedback,
        sectionEngagement,
        linkClicks,
        interestSignals,
        deviceBreakdown,
        topLocations: topLocations.map((loc) => ({
          city: loc.locationCity || 'Unknown',
          country: loc.locationCountry || 'Unknown',
          count: (loc._count as number) || 0,
        })),
      };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get summary stats for all of a user's followups
   * Returns total count, most recent date, and aggregate metrics
   */
  async getAnalyticsSummary(userId: string): Promise<UserAnalyticsSummary> {
    try {
      // Run queries in parallel
      const [
        followupCounts,
        mostRecentFollowup,
        uniqueVisitorSessions,
        totalPageViews,
        engagementCount,
      ] = await Promise.all([
        // Count followups by status
        prisma.followup.groupBy({
          by: ['status'],
          where: { userId },
          _count: true,
        }),
        // Get most recent followup date
        prisma.followup.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),
        // Unique visitors across all user's followups
        prisma.analyticsEvent.findMany({
          where: {
            followup: { userId },
            eventType: 'PAGE_VIEW',
          },
          distinct: ['sessionId'],
          select: { sessionId: true },
        }),
        // Total page views across all user's followups
        prisma.analyticsEvent.count({
          where: {
            followup: { userId },
            eventType: 'PAGE_VIEW',
          },
        }),
        // Engagement events count
        prisma.analyticsEvent.count({
          where: {
            followup: { userId },
            eventType: { in: ['FILE_DOWNLOAD', 'LINK_CLICK', 'COPY_EMAIL', 'COPY_PHONE', 'SECTION_TIME'] },
          },
        }),
      ]);

      const publishedCount = followupCounts.find((fc) => fc.status === 'PUBLISHED')?._count || 0;
      const draftCount = followupCounts.find((fc) => fc.status === 'DRAFT')?._count || 0;
      const totalFollowups = publishedCount + draftCount;

      return {
        totalFollowups,
        publishedFollowups: publishedCount,
        draftFollowups: draftCount,
        mostRecentFollowupDate: mostRecentFollowup?.createdAt?.toISOString() || null,
        totalViews: totalPageViews,
        totalUniqueVisitors: uniqueVisitorSessions.length,
        totalEngagements: engagementCount,
        averageEngagementRate: totalPageViews > 0 ? Math.round((engagementCount / totalPageViews) * 100) : 0,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  /**
   * Hash IP address for privacy (SHA-256)
   */
  private hashIp(ip: string): string {
    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  /**
   * Get start date for time range
   */
  private getStartDateForRange(range: TimeRange): Date {
    const now = new Date();
    switch (range) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case 'all':
      default:
        return new Date(0); // Beginning of time
    }
  }
}

export const analyticsService = new AnalyticsService();
