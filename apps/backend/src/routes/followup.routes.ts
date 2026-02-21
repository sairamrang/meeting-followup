// Followup Routes - Follow-up management endpoints
import { Router } from 'express';
import { z } from 'zod';
import { followupService } from '../services/followup.service';
import { analyticsService } from '../services/analytics.service';
import { requireAuth, getUserId, optionalAuth } from '../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../middleware/validate';
import { asyncHandler } from '../middleware/error-handler';
import { successResponse, FollowupStatus, MeetingType, TemplateStyle } from '@meeting-followup/shared';

const router = Router();

// Validation schemas
const nextStepSchema = z.object({
  action: z.string().min(1),
  owner: z.string().optional(),
  deadline: z.string().optional(),
  completed: z.boolean().default(false),
});

const contentRefsSchema = z.object({
  libraryIds: z.array(z.string().uuid()).optional(),
  companyContentIds: z.array(z.string().uuid()).optional(),
});

const contentOverridesSchema = z.record(
  z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    sortOrder: z.number().optional(),
  })
);

const createFollowupSchema = z.object({
  senderCompanyId: z.string().uuid(),
  receiverCompanyId: z.string().uuid(),
  senderId: z.string().uuid().optional().nullable(),
  receiverId: z.string().uuid().optional().nullable(),
  title: z.string().min(1).max(255),
  meetingDate: z.string().datetime(),
  meetingType: z.nativeEnum(MeetingType),
  meetingLocation: z.string().optional().nullable(),
  product: z.string().optional().nullable(),
  meetingRecap: z.string().optional().nullable(),
  valueProposition: z.string().optional().nullable(),
  meetingNotesUrl: z.union([z.string().url(), z.literal(''), z.null(), z.undefined()]).optional().transform(val => val === '' ? undefined : val),
  videoRecordingUrl: z.union([z.string().url(), z.literal(''), z.null(), z.undefined()]).optional().transform(val => val === '' ? undefined : val),
  nextSteps: z.array(nextStepSchema).optional().nullable(),
  attendeeIds: z.array(z.string().uuid()).optional(),
  contentRefs: contentRefsSchema.optional().nullable(),
  contentOverrides: contentOverridesSchema.optional().nullable(),
});

const updateFollowupSchema = createFollowupSchema
  .omit({ senderCompanyId: true, receiverCompanyId: true, attendeeIds: true })
  .partial()
  .extend({
    template: z.enum(['MODERN', 'CONSERVATIVE', 'HYBRID']).optional(),
  });

const publishFollowupSchema = z.object({
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/).optional(),
  template: z.enum(['MODERN', 'CONSERVATIVE', 'HYBRID']).optional(),
  attendeeIds: z.array(z.string().uuid()).optional(),
});

const listFollowupsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  companyId: z.string().uuid().optional(),
  status: z.nativeEnum(FollowupStatus).optional(),
  sortBy: z.enum(['meetingDate', 'createdAt', 'updatedAt']).default('meetingDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const slugParamSchema = z.object({
  slug: z.string().min(3),
});

/**
 * POST /api/followups
 * Create a new follow-up (draft)
 */
router.post(
  '/',
  requireAuth,
  validateBody(createFollowupSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const followup = await followupService.create(req.body, userId);
    res.status(201).json(successResponse(followup));
  })
);

/**
 * GET /api/followups/:id
 * Get follow-up by ID (authenticated)
 */
router.get(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const includeRelations = req.query.include === 'true';
    const followup = await followupService.getById(req.params.id, userId, includeRelations);
    res.json(successResponse(followup));
  })
);

/**
 * GET /f/:slug
 * Get published follow-up by slug (public)
 */
router.get(
  '/public/:slug',
  validateParams(slugParamSchema),
  asyncHandler(async (req, res) => {
    const followup = await followupService.getBySlug(req.params.slug);
    res.json(successResponse(followup));
  })
);

/**
 * GET /api/followups
 * List follow-ups with pagination and filters
 */
router.get(
  '/',
  requireAuth,
  validateQuery(listFollowupsSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const result = await followupService.list(req.query as any, userId);
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    res.json(
      successResponse(result.followups, {
        page,
        pageSize,
        totalCount: result.total,
        totalPages: Math.ceil(result.total / pageSize),
      })
    );
  })
);

/**
 * PUT /api/followups/:id
 * Update follow-up (draft only)
 */
router.put(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  validateBody(updateFollowupSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const followup = await followupService.update(req.params.id, req.body, userId);
    res.json(successResponse(followup));
  })
);

/**
 * POST /api/followups/:id/publish
 * Publish a draft follow-up
 */
router.post(
  '/:id/publish',
  requireAuth,
  validateParams(idParamSchema),
  validateBody(publishFollowupSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const followup = await followupService.publish(req.params.id, req.body, userId);
    res.json(successResponse(followup));
  })
);

/**
 * POST /api/followups/:id/unpublish
 * Unpublish a follow-up (back to draft)
 */
router.post(
  '/:id/unpublish',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const followup = await followupService.unpublish(req.params.id, userId);
    res.json(successResponse(followup));
  })
);

/**
 * DELETE /api/followups/:id
 * Delete follow-up
 */
router.delete(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    await followupService.delete(req.params.id, userId);
    res.status(204).send();
  })
);

/**
 * GET /api/followups/:id/analytics
 * Get detailed aggregated analytics for a followup including:
 * - Total unique visitors (count of unique sessionIds)
 * - Total page views
 * - Average time on page
 * - Feedback breakdown (positive vs negative for recap and value prop)
 * - Section engagement (time spent per section from SECTION_TIME events)
 * - Link clicks
 * - Interest signals (INTERESTED confirmations)
 */
router.get(
  '/:id/analytics',
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
