// Analytics Routes - Analytics tracking and reporting endpoints
import { Router } from 'express';
import { z } from 'zod';
import { analyticsService } from '../services/analytics.service';
import { requireAuth, getUserId } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { asyncHandler } from '../middleware/error-handler';
import { successResponse, EventType, DeviceType } from '@meeting-followup/shared';

export { analyticsService } from '../services/analytics.service';

const router = Router();

// Validation schemas
const trackEventSchema = z.object({
  followupId: z.string().uuid(),
  sessionId: z.string().uuid(),
  eventType: z.nativeEnum(EventType),
  eventData: z.record(z.unknown()).optional().nullable(),
  deviceType: z.nativeEnum(DeviceType).optional().nullable(),
  browser: z.string().max(50).optional().nullable(),
  locationCity: z.string().max(100).optional().nullable(),
  locationCountry: z.string().max(100).optional().nullable(),
});

const startSessionSchema = z.object({
  followupId: z.string().uuid(),
  deviceType: z.nativeEnum(DeviceType).optional().nullable(),
  browser: z.string().max(50).optional().nullable(),
  locationCity: z.string().max(100).optional().nullable(),
  locationCountry: z.string().max(100).optional().nullable(),
});

const endSessionSchema = z.object({
  sessionId: z.string().uuid(),
});

const followupAnalyticsSchema = z.object({
  timeRange: z.enum(['24h', '7d', '30d', '90d', 'all']).default('30d'),
});

const summarySchema = z.object({
  timeRange: z.enum(['24h', '7d', '30d', '90d', 'all']).default('30d'),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * POST /api/analytics/events
 * Track an analytics event (public)
 */
router.post(
  '/events',
  validateBody(trackEventSchema),
  asyncHandler(async (req, res) => {
    const event = await analyticsService.trackEvent(req.body);
    res.status(201).json(successResponse(event));
  })
);

/**
 * POST /api/analytics/sessions/start
 * Start a new session (public)
 */
router.post(
  '/sessions/start',
  validateBody(startSessionSchema),
  asyncHandler(async (req, res) => {
    const session = await analyticsService.startSession(req.body);
    res.status(201).json(successResponse(session));
  })
);

/**
 * POST /api/analytics/sessions/end
 * End a session (public)
 */
router.post(
  '/sessions/end',
  validateBody(endSessionSchema),
  asyncHandler(async (req, res) => {
    const session = await analyticsService.endSession(req.body);
    res.json(successResponse(session));
  })
);

/**
 * GET /api/analytics/followups/:id
 * Get analytics for a specific follow-up (authenticated)
 */
router.get(
  '/followups/:id',
  requireAuth,
  validateParams(idParamSchema),
  validateQuery(followupAnalyticsSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const analytics = await analyticsService.getFollowupAnalytics(
      req.params.id,
      userId,
      req.query.timeRange as any
    );
    res.json(successResponse(analytics));
  })
);

/**
 * GET /api/analytics/summary
 * Get summary stats for all user's followups (total count, most recent date)
 * This returns a simplified summary without time range filtering
 */
router.get(
  '/summary',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const summary = await analyticsService.getAnalyticsSummary(userId);
    res.json(successResponse(summary));
  })
);

/**
 * GET /api/analytics/summary/detailed
 * Get detailed analytics summary with time range filtering (authenticated)
 */
router.get(
  '/summary/detailed',
  requireAuth,
  validateQuery(summarySchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const summary = await analyticsService.getSummary(userId, req.query.timeRange as any);
    res.json(successResponse(summary));
  })
);

/**
 * GET /api/analytics/followups/:id/detailed
 * Get detailed aggregated analytics for a specific followup including:
 * - Unique visitors, page views, average time on page
 * - Feedback breakdown (recap and value proposition)
 * - Section engagement (time spent per section)
 * - Link clicks
 * - Interest signals
 */
router.get(
  '/followups/:id/detailed',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const analytics = await analyticsService.getDetailedFollowupAnalytics(
      req.params.id,
      userId
    );
    res.json(successResponse(analytics));
  })
);

export default router;
