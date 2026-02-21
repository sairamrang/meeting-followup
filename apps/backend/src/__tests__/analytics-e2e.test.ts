// Analytics and Feedback Flow E2E Tests
// Tests the complete flow for analytics tracking, confirmations, and data aggregation
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Prisma client before importing services
vi.mock('../lib/prisma', () => ({
  prisma: {
    followup: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      groupBy: vi.fn(),
    },
    analyticsEvent: {
      create: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
      groupBy: vi.fn(),
    },
    analyticsSession: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    followupConfirmation: {
      create: vi.fn(),
      findMany: vi.fn(),
      groupBy: vi.fn(),
    },
  },
}));

// Mock notification service
vi.mock('../services/notification.service', () => ({
  notificationService: {
    processPageView: vi.fn().mockResolvedValue(undefined),
  },
}));

import { AnalyticsService } from '../services/analytics.service';
import { ConfirmationService } from '../services/confirmation.service';
import { prisma } from '../lib/prisma';
import { NotFoundError } from '../utils/errors';
import type {
  EventType,
  DeviceType,
  ConfirmationType,
} from '@meeting-followup/shared';

// Test data constants
const TEST_USER_ID = 'user-analytics-test-123';
const TEST_FOLLOWUP_ID = 'followup-analytics-test-456';
const TEST_FOLLOWUP_SLUG = 'acme-corp-demo-followup';
const TEST_SESSION_ID_1 = 'session-visitor-1-789';
const TEST_SESSION_ID_2 = 'session-visitor-2-012';
const TEST_SESSION_ID_3 = 'session-visitor-3-345';

// Mock followup data
const MOCK_PUBLISHED_FOLLOWUP = {
  id: TEST_FOLLOWUP_ID,
  userId: TEST_USER_ID,
  slug: TEST_FOLLOWUP_SLUG,
  status: 'PUBLISHED',
  title: 'Acme Corp - Product Demo Follow-up',
  meetingDate: new Date('2026-02-10'),
  company: {
    name: 'Acme Corp',
  },
};

describe('E2E: Analytics and Feedback Flow', () => {
  let analyticsService: AnalyticsService;
  let confirmationService: ConfirmationService;

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    vi.clearAllMocks();

    analyticsService = new AnalyticsService();
    confirmationService = new ConfirmationService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // CONFIRMATION FLOW TESTS
  // ============================================

  describe('Confirmation Flow', () => {
    describe('Multiple visitors can provide feedback on the same followup', () => {
      it('should allow visitor 1 to submit recap accurate confirmation', async () => {
        // Setup: Followup exists and is published
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

        const confirmationData = {
          id: 'confirmation-1',
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_1,
          type: 'RECAP_ACCURATE' as ConfirmationType,
          confirmedAt: new Date(),
          comment: null,
        };

        vi.mocked(prisma.followupConfirmation.create).mockResolvedValue(confirmationData as any);

        const result = await confirmationService.createConfirmation(TEST_FOLLOWUP_SLUG, {
          type: 'RECAP_ACCURATE' as ConfirmationType,
          sessionId: TEST_SESSION_ID_1,
        });

        expect(result.type).toBe('RECAP_ACCURATE');
        expect(result.sessionId).toBe(TEST_SESSION_ID_1);
        expect(result.followupId).toBe(TEST_FOLLOWUP_ID);
      });

      it('should allow visitor 2 to submit value prop clear confirmation', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

        const confirmationData = {
          id: 'confirmation-2',
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_2,
          type: 'VALUE_PROP_CLEAR' as ConfirmationType,
          confirmedAt: new Date(),
          comment: null,
        };

        vi.mocked(prisma.followupConfirmation.create).mockResolvedValue(confirmationData as any);

        const result = await confirmationService.createConfirmation(TEST_FOLLOWUP_SLUG, {
          type: 'VALUE_PROP_CLEAR' as ConfirmationType,
          sessionId: TEST_SESSION_ID_2,
        });

        expect(result.type).toBe('VALUE_PROP_CLEAR');
        expect(result.sessionId).toBe(TEST_SESSION_ID_2);
      });

      it('should allow visitor 3 to submit interested confirmation', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

        const confirmationData = {
          id: 'confirmation-3',
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_3,
          type: 'INTERESTED' as ConfirmationType,
          confirmedAt: new Date(),
          comment: 'Would like to schedule a call next week',
        };

        vi.mocked(prisma.followupConfirmation.create).mockResolvedValue(confirmationData as any);

        const result = await confirmationService.createConfirmation(TEST_FOLLOWUP_SLUG, {
          type: 'INTERESTED' as ConfirmationType,
          sessionId: TEST_SESSION_ID_3,
          comment: 'Would like to schedule a call next week',
        });

        expect(result.type).toBe('INTERESTED');
        expect(result.sessionId).toBe(TEST_SESSION_ID_3);
        expect(result.comment).toBe('Would like to schedule a call next week');
      });

      it('should track all confirmations from different visitors', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue({
          ...MOCK_PUBLISHED_FOLLOWUP,
          userId: TEST_USER_ID,
        } as any);

        const allConfirmations = [
          {
            id: 'confirmation-1',
            followupId: TEST_FOLLOWUP_ID,
            sessionId: TEST_SESSION_ID_1,
            type: 'RECAP_ACCURATE',
            confirmedAt: new Date('2026-02-11T10:00:00Z'),
          },
          {
            id: 'confirmation-2',
            followupId: TEST_FOLLOWUP_ID,
            sessionId: TEST_SESSION_ID_2,
            type: 'VALUE_PROP_CLEAR',
            confirmedAt: new Date('2026-02-11T11:00:00Z'),
          },
          {
            id: 'confirmation-3',
            followupId: TEST_FOLLOWUP_ID,
            sessionId: TEST_SESSION_ID_3,
            type: 'INTERESTED',
            confirmedAt: new Date('2026-02-11T12:00:00Z'),
          },
        ];

        vi.mocked(prisma.followupConfirmation.findMany).mockResolvedValue(allConfirmations as any);

        const result = await confirmationService.getConfirmations(TEST_FOLLOWUP_ID, TEST_USER_ID);

        expect(result).toHaveLength(3);
        expect(result.map((c) => c.sessionId)).toContain(TEST_SESSION_ID_1);
        expect(result.map((c) => c.sessionId)).toContain(TEST_SESSION_ID_2);
        expect(result.map((c) => c.sessionId)).toContain(TEST_SESSION_ID_3);
      });
    });

    describe('Same session cannot submit duplicate confirmations', () => {
      it('should store confirmation with sessionId for deduplication', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

        const confirmationData = {
          id: 'confirmation-dedup-1',
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_1,
          type: 'RECAP_ACCURATE' as ConfirmationType,
          confirmedAt: new Date(),
        };

        vi.mocked(prisma.followupConfirmation.create).mockResolvedValue(confirmationData as any);

        const result = await confirmationService.createConfirmation(TEST_FOLLOWUP_SLUG, {
          type: 'RECAP_ACCURATE' as ConfirmationType,
          sessionId: TEST_SESSION_ID_1,
        });

        // Verify sessionId is stored
        expect(result.sessionId).toBe(TEST_SESSION_ID_1);

        // Verify create was called with correct data including sessionId
        expect(prisma.followupConfirmation.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            sessionId: TEST_SESSION_ID_1,
            type: 'RECAP_ACCURATE',
          }),
        });
      });

      it('should handle database constraint violation for duplicate confirmation', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

        // Simulate Prisma unique constraint error (P2002)
        const prismaError = {
          code: 'P2002',
          message: 'Unique constraint violation',
        };

        vi.mocked(prisma.followupConfirmation.create).mockRejectedValue(prismaError);

        await expect(
          confirmationService.createConfirmation(TEST_FOLLOWUP_SLUG, {
            type: 'RECAP_ACCURATE' as ConfirmationType,
            sessionId: TEST_SESSION_ID_1,
          })
        ).rejects.toThrow();
      });
    });

    describe('Confirmations are correctly stored with sessionId', () => {
      it('should store confirmation without sessionId when not provided', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

        const confirmationData = {
          id: 'confirmation-no-session',
          followupId: TEST_FOLLOWUP_ID,
          sessionId: null,
          type: 'RECAP_ACCURATE' as ConfirmationType,
          confirmedAt: new Date(),
        };

        vi.mocked(prisma.followupConfirmation.create).mockResolvedValue(confirmationData as any);

        const result = await confirmationService.createConfirmation(TEST_FOLLOWUP_SLUG, {
          type: 'RECAP_ACCURATE' as ConfirmationType,
          // No sessionId provided
        });

        expect(result.sessionId).toBeNull();
      });

      it('should store confirmation with optional comment', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

        const confirmationData = {
          id: 'confirmation-with-comment',
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_1,
          type: 'RECAP_INACCURATE' as ConfirmationType,
          comment: 'The timeline mentioned was incorrect',
          confirmedAt: new Date(),
        };

        vi.mocked(prisma.followupConfirmation.create).mockResolvedValue(confirmationData as any);

        const result = await confirmationService.createConfirmation(TEST_FOLLOWUP_SLUG, {
          type: 'RECAP_INACCURATE' as ConfirmationType,
          sessionId: TEST_SESSION_ID_1,
          comment: 'The timeline mentioned was incorrect',
        });

        expect(result.comment).toBe('The timeline mentioned was incorrect');
      });

      it('should reject confirmation for unpublished followup', async () => {
        // Return null to simulate followup not found (due to status filter)
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(null);

        await expect(
          confirmationService.createConfirmation(TEST_FOLLOWUP_SLUG, {
            type: 'RECAP_ACCURATE' as ConfirmationType,
            sessionId: TEST_SESSION_ID_1,
          })
        ).rejects.toThrow(NotFoundError);
      });

      it('should reject confirmation for non-existent followup', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(null);

        await expect(
          confirmationService.createConfirmation('non-existent-slug', {
            type: 'RECAP_ACCURATE' as ConfirmationType,
            sessionId: TEST_SESSION_ID_1,
          })
        ).rejects.toThrow(NotFoundError);
      });
    });
  });

  // ============================================
  // ANALYTICS AGGREGATION TESTS
  // ============================================

  describe('Analytics Aggregation', () => {
    describe('Analytics summary returns correct totals', () => {
      it('should return correct total followups count', async () => {
        vi.mocked(prisma.followup.groupBy).mockResolvedValue([
          { status: 'DRAFT', _count: 3 },
          { status: 'PUBLISHED', _count: 5 },
        ] as any);

        vi.mocked(prisma.analyticsEvent.groupBy).mockResolvedValue([
          { followupId: TEST_FOLLOWUP_ID, _count: { _all: 100 } },
        ] as any);

        vi.mocked(prisma.analyticsEvent.count).mockResolvedValue(25);

        vi.mocked(prisma.followup.findMany).mockResolvedValue([
          {
            ...MOCK_PUBLISHED_FOLLOWUP,
            _count: { analyticsEvents: 50 },
          },
        ] as any);

        const summary = await analyticsService.getSummary(TEST_USER_ID, '30d');

        expect(summary.totalFollowups).toBe(8);
        expect(summary.publishedFollowups).toBe(5);
      });

      it('should calculate correct total views', async () => {
        vi.mocked(prisma.followup.groupBy).mockResolvedValue([
          { status: 'PUBLISHED', _count: 5 },
        ] as any);

        vi.mocked(prisma.analyticsEvent.groupBy).mockResolvedValue([
          { followupId: 'followup-1', _count: { _all: 50 } },
          { followupId: 'followup-2', _count: { _all: 75 } },
          { followupId: 'followup-3', _count: { _all: 25 } },
        ] as any);

        vi.mocked(prisma.analyticsEvent.count).mockResolvedValue(30);
        vi.mocked(prisma.followup.findMany).mockResolvedValue([] as any);

        const summary = await analyticsService.getSummary(TEST_USER_ID, '30d');

        expect(summary.totalViews).toBe(150); // 50 + 75 + 25
      });

      it('should calculate correct engagement rate', async () => {
        vi.mocked(prisma.followup.groupBy).mockResolvedValue([
          { status: 'PUBLISHED', _count: 2 },
        ] as any);

        vi.mocked(prisma.analyticsEvent.groupBy).mockResolvedValue([
          { followupId: TEST_FOLLOWUP_ID, _count: { _all: 100 } },
        ] as any);

        // 20 engagements out of 100 views = 20%
        vi.mocked(prisma.analyticsEvent.count).mockResolvedValue(20);
        vi.mocked(prisma.followup.findMany).mockResolvedValue([] as any);

        const summary = await analyticsService.getSummary(TEST_USER_ID, '30d');

        expect(summary.totalEngagements).toBe(20);
        expect(summary.averageEngagementRate).toBe(20);
      });
    });

    describe('Feedback counts are correctly aggregated', () => {
      it('should aggregate confirmation counts by type', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue({
          ...MOCK_PUBLISHED_FOLLOWUP,
          userId: TEST_USER_ID,
        } as any);

        const typeCounts = [
          { type: 'RECAP_ACCURATE', _count: 8 },
          { type: 'RECAP_INACCURATE', _count: 2 },
          { type: 'VALUE_PROP_CLEAR', _count: 6 },
          { type: 'VALUE_PROP_UNCLEAR', _count: 1 },
          { type: 'INTERESTED', _count: 4 },
          { type: 'SCHEDULE_CALL', _count: 1 },
        ];

        vi.mocked(prisma.followupConfirmation.findMany).mockResolvedValue([]);
        vi.mocked(prisma.followupConfirmation.groupBy).mockResolvedValue(typeCounts as any);

        const metrics = await confirmationService.getConfirmationMetrics(
          TEST_FOLLOWUP_ID,
          TEST_USER_ID
        );

        expect(metrics.total).toBe(22); // Sum of all counts
        expect(metrics.byType['RECAP_ACCURATE']).toBe(8);
        expect(metrics.byType['VALUE_PROP_CLEAR']).toBe(6);
        expect(metrics.byType['INTERESTED']).toBe(4);
      });

      it('should calculate recap accuracy rate correctly', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue({
          ...MOCK_PUBLISHED_FOLLOWUP,
          userId: TEST_USER_ID,
        } as any);

        // 8 accurate, 2 inaccurate = 80% accuracy rate
        const typeCounts = [
          { type: 'RECAP_ACCURATE', _count: 8 },
          { type: 'RECAP_INACCURATE', _count: 2 },
        ];

        vi.mocked(prisma.followupConfirmation.findMany).mockResolvedValue([]);
        vi.mocked(prisma.followupConfirmation.groupBy).mockResolvedValue(typeCounts as any);

        const metrics = await confirmationService.getConfirmationMetrics(
          TEST_FOLLOWUP_ID,
          TEST_USER_ID
        );

        expect(metrics.recapAccuracyRate).toBe(80);
      });

      it('should calculate value prop resonance rate correctly', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue({
          ...MOCK_PUBLISHED_FOLLOWUP,
          userId: TEST_USER_ID,
        } as any);

        // 6 clear, 4 unclear = 60% resonance rate
        const typeCounts = [
          { type: 'VALUE_PROP_CLEAR', _count: 6 },
          { type: 'VALUE_PROP_UNCLEAR', _count: 4 },
        ];

        vi.mocked(prisma.followupConfirmation.findMany).mockResolvedValue([]);
        vi.mocked(prisma.followupConfirmation.groupBy).mockResolvedValue(typeCounts as any);

        const metrics = await confirmationService.getConfirmationMetrics(
          TEST_FOLLOWUP_ID,
          TEST_USER_ID
        );

        expect(metrics.valuePropResonanceRate).toBe(60);
      });

      it('should return null rates when no responses exist', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue({
          ...MOCK_PUBLISHED_FOLLOWUP,
          userId: TEST_USER_ID,
        } as any);

        vi.mocked(prisma.followupConfirmation.findMany).mockResolvedValue([]);
        vi.mocked(prisma.followupConfirmation.groupBy).mockResolvedValue([]);

        const metrics = await confirmationService.getConfirmationMetrics(
          TEST_FOLLOWUP_ID,
          TEST_USER_ID
        );

        expect(metrics.recapAccuracyRate).toBeNull();
        expect(metrics.valuePropResonanceRate).toBeNull();
        expect(metrics.interestRate).toBeNull();
      });
    });

    describe('Section engagement times are tracked', () => {
      it('should track SECTION_TIME events for meeting recap', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

        const eventData = {
          id: 'event-section-time-1',
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_1,
          eventType: 'SECTION_TIME' as EventType,
          eventData: {
            sectionId: 'meeting-recap',
            timeSpentMs: 45000, // 45 seconds
          },
          deviceType: 'DESKTOP' as DeviceType,
          timestamp: new Date(),
        };

        vi.mocked(prisma.analyticsEvent.create).mockResolvedValue(eventData as any);

        const result = await analyticsService.trackEvent({
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_1,
          eventType: 'SECTION_TIME' as EventType,
          eventData: {
            sectionId: 'meeting-recap',
            timeSpentMs: 45000,
          },
          deviceType: 'DESKTOP' as DeviceType,
        });

        expect(result.eventType).toBe('SECTION_TIME');
        expect((result.eventData as any).sectionId).toBe('meeting-recap');
        expect((result.eventData as any).timeSpentMs).toBe(45000);
      });

      it('should track SECTION_VIEW events', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

        const eventData = {
          id: 'event-section-view-1',
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_1,
          eventType: 'SECTION_VIEW' as EventType,
          eventData: {
            sectionId: 'value-proposition',
            sectionType: 'valueProp',
            sectionTitle: 'Value Proposition',
          },
          deviceType: 'MOBILE' as DeviceType,
          timestamp: new Date(),
        };

        vi.mocked(prisma.analyticsEvent.create).mockResolvedValue(eventData as any);

        const result = await analyticsService.trackEvent({
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_1,
          eventType: 'SECTION_VIEW' as EventType,
          eventData: {
            sectionId: 'value-proposition',
            sectionType: 'valueProp',
            sectionTitle: 'Value Proposition',
          },
          deviceType: 'MOBILE' as DeviceType,
        });

        expect(result.eventType).toBe('SECTION_VIEW');
        expect((result.eventData as any).sectionId).toBe('value-proposition');
      });

      it('should track scroll depth events', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

        const eventData = {
          id: 'event-scroll-depth-1',
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_1,
          eventType: 'SCROLL_DEPTH' as EventType,
          eventData: {
            scrollDepthPercent: 75,
            maxScrollDepthPercent: 75,
          },
          deviceType: 'DESKTOP' as DeviceType,
          timestamp: new Date(),
        };

        vi.mocked(prisma.analyticsEvent.create).mockResolvedValue(eventData as any);

        const result = await analyticsService.trackEvent({
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_1,
          eventType: 'SCROLL_DEPTH' as EventType,
          eventData: {
            scrollDepthPercent: 75,
            maxScrollDepthPercent: 75,
          },
          deviceType: 'DESKTOP' as DeviceType,
        });

        expect(result.eventType).toBe('SCROLL_DEPTH');
        expect((result.eventData as any).scrollDepthPercent).toBe(75);
      });
    });
  });

  // ============================================
  // API ENDPOINT TESTS
  // ============================================

  describe('API Endpoints', () => {
    describe('GET /api/analytics/followups/:id returns correct data', () => {
      it('should return analytics for owned followup', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue({
          ...MOCK_PUBLISHED_FOLLOWUP,
          userId: TEST_USER_ID,
        } as any);

        // Mock analytics queries
        vi.mocked(prisma.analyticsEvent.count).mockResolvedValue(150);
        vi.mocked(prisma.analyticsEvent.findMany).mockResolvedValue([
          { sessionId: TEST_SESSION_ID_1 },
          { sessionId: TEST_SESSION_ID_2 },
          { sessionId: TEST_SESSION_ID_3 },
        ] as any);
        vi.mocked(prisma.analyticsSession.findMany).mockResolvedValue([
          {
            id: TEST_SESSION_ID_1,
            sessionStart: new Date('2026-02-11T10:00:00Z'),
            pageDuration: 120,
            deviceType: 'DESKTOP',
          },
          {
            id: TEST_SESSION_ID_2,
            sessionStart: new Date('2026-02-11T11:00:00Z'),
            pageDuration: 90,
            deviceType: 'MOBILE',
          },
        ] as any);
        vi.mocked(prisma.analyticsEvent.groupBy).mockResolvedValue([
          { eventType: 'PAGE_VIEW', _count: 150 },
          { eventType: 'FILE_DOWNLOAD', _count: 10 },
          { eventType: 'LINK_CLICK', _count: 25 },
        ] as any);

        const analytics = await analyticsService.getFollowupAnalytics(
          TEST_FOLLOWUP_ID,
          TEST_USER_ID,
          '30d'
        );

        expect(analytics.followupId).toBe(TEST_FOLLOWUP_ID);
        expect(analytics.totalViews).toBe(150);
        expect(analytics.uniqueVisitors).toBe(3);
        expect(analytics.fileDownloads).toBe(10);
        expect(analytics.linkClicks).toBe(25);
      });

      it('should return device breakdown', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue({
          ...MOCK_PUBLISHED_FOLLOWUP,
          userId: TEST_USER_ID,
        } as any);

        vi.mocked(prisma.analyticsEvent.count).mockResolvedValue(100);
        vi.mocked(prisma.analyticsEvent.findMany).mockResolvedValue([]);
        vi.mocked(prisma.analyticsSession.findMany).mockResolvedValue([]);

        // Mock device groupBy calls
        vi.mocked(prisma.analyticsEvent.groupBy)
          .mockResolvedValueOnce([]) // eventCounts
          .mockResolvedValueOnce([]) // topLocations
          .mockResolvedValueOnce([
            { deviceType: 'DESKTOP', _count: 60 },
            { deviceType: 'MOBILE', _count: 35 },
            { deviceType: 'TABLET', _count: 5 },
          ] as any); // deviceCounts

        const analytics = await analyticsService.getFollowupAnalytics(
          TEST_FOLLOWUP_ID,
          TEST_USER_ID,
          '30d'
        );

        expect(analytics.deviceBreakdown.desktop).toBe(60);
        expect(analytics.deviceBreakdown.mobile).toBe(35);
        expect(analytics.deviceBreakdown.tablet).toBe(5);
      });

      it('should return top locations', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue({
          ...MOCK_PUBLISHED_FOLLOWUP,
          userId: TEST_USER_ID,
        } as any);

        vi.mocked(prisma.analyticsEvent.count).mockResolvedValue(100);
        vi.mocked(prisma.analyticsEvent.findMany).mockResolvedValue([]);
        vi.mocked(prisma.analyticsSession.findMany).mockResolvedValue([]);
        vi.mocked(prisma.analyticsEvent.groupBy)
          .mockResolvedValueOnce([]) // eventCounts
          .mockResolvedValueOnce([
            { locationCity: 'New York', locationCountry: 'USA', _count: 25 },
            { locationCity: 'London', locationCountry: 'UK', _count: 15 },
            { locationCity: 'San Francisco', locationCountry: 'USA', _count: 10 },
          ] as any) // topLocations
          .mockResolvedValueOnce([]); // deviceCounts

        const analytics = await analyticsService.getFollowupAnalytics(
          TEST_FOLLOWUP_ID,
          TEST_USER_ID,
          '30d'
        );

        expect(analytics.topLocations).toHaveLength(3);
        expect(analytics.topLocations[0].city).toBe('New York');
        expect(analytics.topLocations[0].country).toBe('USA');
      });
    });

    describe('GET /api/analytics/summary returns correct summary', () => {
      it('should return summary with top performing followups', async () => {
        vi.mocked(prisma.followup.groupBy).mockResolvedValue([
          { status: 'PUBLISHED', _count: 5 },
          { status: 'DRAFT', _count: 3 },
        ] as any);

        vi.mocked(prisma.analyticsEvent.groupBy).mockResolvedValue([
          { followupId: 'followup-1', _count: { _all: 100 } },
          { followupId: 'followup-2', _count: { _all: 75 } },
        ] as any);

        vi.mocked(prisma.analyticsEvent.count).mockResolvedValue(35);

        vi.mocked(prisma.followup.findMany).mockResolvedValue([
          {
            id: 'followup-1',
            title: 'Top Performer',
            company: { name: 'Acme Corp' },
            _count: { analyticsEvents: 100 },
          },
          {
            id: 'followup-2',
            title: 'Second Best',
            company: { name: 'Beta Inc' },
            _count: { analyticsEvents: 75 },
          },
        ] as any);

        const summary = await analyticsService.getSummary(TEST_USER_ID, '30d');

        expect(summary.topPerformingFollowups).toHaveLength(2);
        expect(summary.topPerformingFollowups[0].title).toBe('Top Performer');
        expect(summary.topPerformingFollowups[0].views).toBe(100);
      });

      it('should filter by time range correctly', async () => {
        vi.mocked(prisma.followup.groupBy).mockResolvedValue([]);
        vi.mocked(prisma.analyticsEvent.groupBy).mockResolvedValue([]);
        vi.mocked(prisma.analyticsEvent.count).mockResolvedValue(0);
        vi.mocked(prisma.followup.findMany).mockResolvedValue([]);

        // Test 24h time range
        await analyticsService.getSummary(TEST_USER_ID, '24h');

        // Verify the groupBy was called (we can't easily verify the date filter without more setup)
        expect(prisma.analyticsEvent.groupBy).toHaveBeenCalled();
      });
    });

    describe('Unauthorized access is blocked', () => {
      it('should reject analytics request for non-owned followup', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue({
          ...MOCK_PUBLISHED_FOLLOWUP,
          userId: 'different-user-id',
        } as any);

        await expect(
          analyticsService.getFollowupAnalytics(TEST_FOLLOWUP_ID, TEST_USER_ID, '30d')
        ).rejects.toThrow(NotFoundError);
      });

      it('should reject confirmation metrics request for non-owned followup', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue({
          ...MOCK_PUBLISHED_FOLLOWUP,
          userId: 'different-user-id',
        } as any);

        await expect(
          confirmationService.getConfirmationMetrics(TEST_FOLLOWUP_ID, TEST_USER_ID)
        ).rejects.toThrow(NotFoundError);
      });

      it('should reject confirmations list request for non-owned followup', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue({
          ...MOCK_PUBLISHED_FOLLOWUP,
          userId: 'different-user-id',
        } as any);

        await expect(
          confirmationService.getConfirmations(TEST_FOLLOWUP_ID, TEST_USER_ID)
        ).rejects.toThrow(NotFoundError);
      });

      it('should return not found for non-existent followup', async () => {
        vi.mocked(prisma.followup.findUnique).mockResolvedValue(null);

        await expect(
          analyticsService.getFollowupAnalytics('non-existent-id', TEST_USER_ID, '30d')
        ).rejects.toThrow(NotFoundError);
      });
    });
  });

  // ============================================
  // SESSION TRACKING TESTS
  // ============================================

  describe('Session Tracking', () => {
    it('should start a new analytics session', async () => {
      vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

      const sessionData = {
        id: 'new-session-id',
        followupId: TEST_FOLLOWUP_ID,
        sessionStart: new Date(),
        deviceType: 'DESKTOP',
        browser: 'Chrome',
        locationCity: 'New York',
        locationCountry: 'USA',
      };

      vi.mocked(prisma.analyticsSession.create).mockResolvedValue(sessionData as any);

      const session = await analyticsService.startSession({
        followupId: TEST_FOLLOWUP_ID,
        deviceType: 'DESKTOP' as DeviceType,
        browser: 'Chrome',
        locationCity: 'New York',
        locationCountry: 'USA',
      });

      expect(session.followupId).toBe(TEST_FOLLOWUP_ID);
      expect(session.deviceType).toBe('DESKTOP');
      expect(session.browser).toBe('Chrome');
    });

    it('should end a session with calculated duration', async () => {
      const sessionStart = new Date('2026-02-11T10:00:00Z');
      const sessionEnd = new Date('2026-02-11T10:05:00Z'); // 5 minutes later

      vi.mocked(prisma.analyticsSession.findUnique).mockResolvedValue({
        id: TEST_SESSION_ID_1,
        followupId: TEST_FOLLOWUP_ID,
        sessionStart,
      } as any);

      vi.mocked(prisma.analyticsSession.update).mockResolvedValue({
        id: TEST_SESSION_ID_1,
        followupId: TEST_FOLLOWUP_ID,
        sessionStart,
        sessionEnd,
        pageDuration: 300, // 5 minutes in seconds
      } as any);

      const session = await analyticsService.endSession({
        sessionId: TEST_SESSION_ID_1,
      });

      expect(session.pageDuration).toBe(300);
      expect(session.sessionEnd).toBeDefined();
    });

    it('should reject session end for non-existent session', async () => {
      vi.mocked(prisma.analyticsSession.findUnique).mockResolvedValue(null);

      await expect(
        analyticsService.endSession({ sessionId: 'non-existent-session' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  // ============================================
  // EVENT TRACKING TESTS
  // ============================================

  describe('Event Tracking', () => {
    it('should track PAGE_VIEW event', async () => {
      vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

      const eventData = {
        id: 'event-page-view-1',
        followupId: TEST_FOLLOWUP_ID,
        sessionId: TEST_SESSION_ID_1,
        eventType: 'PAGE_VIEW',
        deviceType: 'DESKTOP',
        browser: 'Chrome',
        locationCity: 'San Francisco',
        locationCountry: 'USA',
        timestamp: new Date(),
      };

      vi.mocked(prisma.analyticsEvent.create).mockResolvedValue(eventData as any);

      const event = await analyticsService.trackEvent({
        followupId: TEST_FOLLOWUP_ID,
        sessionId: TEST_SESSION_ID_1,
        eventType: 'PAGE_VIEW' as EventType,
        deviceType: 'DESKTOP' as DeviceType,
        browser: 'Chrome',
        locationCity: 'San Francisco',
        locationCountry: 'USA',
      });

      expect(event.eventType).toBe('PAGE_VIEW');
      expect(event.followupId).toBe(TEST_FOLLOWUP_ID);
    });

    it('should track FILE_DOWNLOAD event with file data', async () => {
      vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

      const eventData = {
        id: 'event-download-1',
        followupId: TEST_FOLLOWUP_ID,
        sessionId: TEST_SESSION_ID_1,
        eventType: 'FILE_DOWNLOAD',
        eventData: {
          fileId: 'file-123',
          filename: 'proposal.pdf',
        },
        deviceType: 'DESKTOP',
        timestamp: new Date(),
      };

      vi.mocked(prisma.analyticsEvent.create).mockResolvedValue(eventData as any);

      const event = await analyticsService.trackEvent({
        followupId: TEST_FOLLOWUP_ID,
        sessionId: TEST_SESSION_ID_1,
        eventType: 'FILE_DOWNLOAD' as EventType,
        eventData: {
          fileId: 'file-123',
          filename: 'proposal.pdf',
        },
        deviceType: 'DESKTOP' as DeviceType,
      });

      expect(event.eventType).toBe('FILE_DOWNLOAD');
      expect((event.eventData as any).filename).toBe('proposal.pdf');
    });

    it('should track LINK_CLICK event', async () => {
      vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

      const eventData = {
        id: 'event-link-click-1',
        followupId: TEST_FOLLOWUP_ID,
        sessionId: TEST_SESSION_ID_1,
        eventType: 'LINK_CLICK',
        eventData: {
          url: 'https://example.com/resource',
          linkText: 'View Resource',
          sectionId: 'recap',
        },
        deviceType: 'MOBILE',
        timestamp: new Date(),
      };

      vi.mocked(prisma.analyticsEvent.create).mockResolvedValue(eventData as any);

      const event = await analyticsService.trackEvent({
        followupId: TEST_FOLLOWUP_ID,
        sessionId: TEST_SESSION_ID_1,
        eventType: 'LINK_CLICK' as EventType,
        eventData: {
          url: 'https://example.com/resource',
          linkText: 'View Resource',
          sectionId: 'recap',
        },
        deviceType: 'MOBILE' as DeviceType,
      });

      expect(event.eventType).toBe('LINK_CLICK');
      expect((event.eventData as any).url).toBe('https://example.com/resource');
    });

    it('should track COPY_EMAIL event', async () => {
      vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

      const eventData = {
        id: 'event-copy-email-1',
        followupId: TEST_FOLLOWUP_ID,
        sessionId: TEST_SESSION_ID_1,
        eventType: 'COPY_EMAIL',
        eventData: {
          value: 'john@acme.com',
          contactId: 'contact-123',
        },
        deviceType: 'DESKTOP',
        timestamp: new Date(),
      };

      vi.mocked(prisma.analyticsEvent.create).mockResolvedValue(eventData as any);

      const event = await analyticsService.trackEvent({
        followupId: TEST_FOLLOWUP_ID,
        sessionId: TEST_SESSION_ID_1,
        eventType: 'COPY_EMAIL' as EventType,
        eventData: {
          value: 'john@acme.com',
          contactId: 'contact-123',
        },
        deviceType: 'DESKTOP' as DeviceType,
      });

      expect(event.eventType).toBe('COPY_EMAIL');
    });

    it('should reject event tracking for unpublished followup', async () => {
      vi.mocked(prisma.followup.findUnique).mockResolvedValue(null);

      await expect(
        analyticsService.trackEvent({
          followupId: TEST_FOLLOWUP_ID,
          sessionId: TEST_SESSION_ID_1,
          eventType: 'PAGE_VIEW' as EventType,
          deviceType: 'DESKTOP' as DeviceType,
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  // ============================================
  // COMPLETE WORKFLOW INTEGRATION TEST
  // ============================================

  describe('Complete Analytics and Feedback Workflow', () => {
    it('should execute full visitor journey with analytics and feedback', async () => {
      // Setup: Followup exists
      vi.mocked(prisma.followup.findUnique).mockResolvedValue(MOCK_PUBLISHED_FOLLOWUP as any);

      // Step 1: Visitor starts session
      const sessionData = {
        id: 'workflow-session-1',
        followupId: TEST_FOLLOWUP_ID,
        sessionStart: new Date(),
        deviceType: 'DESKTOP',
        browser: 'Chrome',
      };
      vi.mocked(prisma.analyticsSession.create).mockResolvedValue(sessionData as any);

      const session = await analyticsService.startSession({
        followupId: TEST_FOLLOWUP_ID,
        deviceType: 'DESKTOP' as DeviceType,
        browser: 'Chrome',
      });
      expect(session.id).toBe('workflow-session-1');

      // Step 2: Track page view
      vi.mocked(prisma.analyticsEvent.create).mockResolvedValue({
        id: 'event-1',
        followupId: TEST_FOLLOWUP_ID,
        sessionId: session.id,
        eventType: 'PAGE_VIEW',
        timestamp: new Date(),
      } as any);

      const pageView = await analyticsService.trackEvent({
        followupId: TEST_FOLLOWUP_ID,
        sessionId: session.id,
        eventType: 'PAGE_VIEW' as EventType,
        deviceType: 'DESKTOP' as DeviceType,
      });
      expect(pageView.eventType).toBe('PAGE_VIEW');

      // Step 3: Track section view
      vi.mocked(prisma.analyticsEvent.create).mockResolvedValue({
        id: 'event-2',
        followupId: TEST_FOLLOWUP_ID,
        sessionId: session.id,
        eventType: 'SECTION_VIEW',
        eventData: { sectionId: 'meeting-recap' },
        timestamp: new Date(),
      } as any);

      const sectionView = await analyticsService.trackEvent({
        followupId: TEST_FOLLOWUP_ID,
        sessionId: session.id,
        eventType: 'SECTION_VIEW' as EventType,
        eventData: { sectionId: 'meeting-recap', sectionType: 'recap', sectionTitle: 'Meeting Recap' },
        deviceType: 'DESKTOP' as DeviceType,
      });
      expect(sectionView.eventType).toBe('SECTION_VIEW');

      // Step 4: Submit recap confirmation
      vi.mocked(prisma.followupConfirmation.create).mockResolvedValue({
        id: 'confirmation-workflow-1',
        followupId: TEST_FOLLOWUP_ID,
        sessionId: session.id,
        type: 'RECAP_ACCURATE',
        confirmedAt: new Date(),
      } as any);

      const recapConfirmation = await confirmationService.createConfirmation(TEST_FOLLOWUP_SLUG, {
        type: 'RECAP_ACCURATE' as ConfirmationType,
        sessionId: session.id,
      });
      expect(recapConfirmation.type).toBe('RECAP_ACCURATE');

      // Step 5: Track section time
      vi.mocked(prisma.analyticsEvent.create).mockResolvedValue({
        id: 'event-3',
        followupId: TEST_FOLLOWUP_ID,
        sessionId: session.id,
        eventType: 'SECTION_TIME',
        eventData: { sectionId: 'meeting-recap', timeSpentMs: 30000 },
        timestamp: new Date(),
      } as any);

      const sectionTime = await analyticsService.trackEvent({
        followupId: TEST_FOLLOWUP_ID,
        sessionId: session.id,
        eventType: 'SECTION_TIME' as EventType,
        eventData: { sectionId: 'meeting-recap', timeSpentMs: 30000 },
        deviceType: 'DESKTOP' as DeviceType,
      });
      expect(sectionTime.eventType).toBe('SECTION_TIME');

      // Step 6: Submit interest confirmation
      vi.mocked(prisma.followupConfirmation.create).mockResolvedValue({
        id: 'confirmation-workflow-2',
        followupId: TEST_FOLLOWUP_ID,
        sessionId: session.id,
        type: 'INTERESTED',
        confirmedAt: new Date(),
      } as any);

      const interestConfirmation = await confirmationService.createConfirmation(TEST_FOLLOWUP_SLUG, {
        type: 'INTERESTED' as ConfirmationType,
        sessionId: session.id,
      });
      expect(interestConfirmation.type).toBe('INTERESTED');

      // Step 7: End session
      vi.mocked(prisma.analyticsSession.findUnique).mockResolvedValue({
        id: session.id,
        sessionStart: sessionData.sessionStart,
      } as any);
      vi.mocked(prisma.analyticsSession.update).mockResolvedValue({
        ...sessionData,
        sessionEnd: new Date(),
        pageDuration: 180,
      } as any);

      const endedSession = await analyticsService.endSession({
        sessionId: session.id,
      });
      expect(endedSession.pageDuration).toBe(180);

      // Step 8: Owner views analytics (requires re-mocking userId check)
      vi.mocked(prisma.followup.findUnique).mockResolvedValue({
        ...MOCK_PUBLISHED_FOLLOWUP,
        userId: TEST_USER_ID,
      } as any);
      vi.mocked(prisma.analyticsEvent.count).mockResolvedValue(3);
      vi.mocked(prisma.analyticsEvent.findMany).mockResolvedValue([{ sessionId: session.id }] as any);
      vi.mocked(prisma.analyticsSession.findMany).mockResolvedValue([endedSession] as any);
      vi.mocked(prisma.analyticsEvent.groupBy).mockResolvedValue([]);

      const analytics = await analyticsService.getFollowupAnalytics(
        TEST_FOLLOWUP_ID,
        TEST_USER_ID,
        '30d'
      );
      expect(analytics.totalViews).toBe(3);
      expect(analytics.uniqueVisitors).toBe(1);

      // Step 9: Owner views confirmation metrics
      vi.mocked(prisma.followupConfirmation.findMany).mockResolvedValue([
        recapConfirmation,
        interestConfirmation,
      ] as any);
      vi.mocked(prisma.followupConfirmation.groupBy).mockResolvedValue([
        { type: 'RECAP_ACCURATE', _count: 1 },
        { type: 'INTERESTED', _count: 1 },
      ] as any);

      const metrics = await confirmationService.getConfirmationMetrics(
        TEST_FOLLOWUP_ID,
        TEST_USER_ID
      );
      expect(metrics.total).toBe(2);
      expect(metrics.recapAccuracyRate).toBe(100); // 1 accurate, 0 inaccurate
    });
  });
});
