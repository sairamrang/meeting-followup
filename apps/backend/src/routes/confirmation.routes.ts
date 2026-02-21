// Confirmation Routes - Micro-commitment confirmation endpoints
import { Router } from 'express';
import { z } from 'zod';
import { confirmationService } from '../services/confirmation.service';
import { requireAuth, getUserId } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import { asyncHandler } from '../middleware/error-handler';
import { successResponse, ConfirmationType } from '@meeting-followup/shared';

const router = Router();

// Validation schemas
const createConfirmationSchema = z.object({
  type: z.nativeEnum(ConfirmationType),
  sessionId: z.string().uuid().optional(),
  comment: z.string().max(1000).optional(),
});

const slugParamSchema = z.object({
  slug: z.string().min(1).max(100),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * POST /api/confirmations/:slug
 * Record a confirmation (public - no auth required)
 * This is the main endpoint for prospects to confirm interest/accuracy
 */
router.post(
  '/:slug',
  validateParams(slugParamSchema),
  validateBody(createConfirmationSchema),
  asyncHandler(async (req, res) => {
    const confirmation = await confirmationService.createConfirmation(
      req.params.slug,
      req.body
    );
    res.status(201).json(successResponse(confirmation));
  })
);

/**
 * GET /api/confirmations/followup/:id
 * Get all confirmations for a followup (authenticated - owner only)
 */
router.get(
  '/followup/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const confirmations = await confirmationService.getConfirmations(
      req.params.id,
      userId
    );
    res.json(successResponse(confirmations));
  })
);

/**
 * GET /api/confirmations/followup/:id/metrics
 * Get confirmation metrics for a followup (authenticated - owner only)
 */
router.get(
  '/followup/:id/metrics',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const metrics = await confirmationService.getConfirmationMetrics(
      req.params.id,
      userId
    );
    res.json(successResponse(metrics));
  })
);

export default router;
