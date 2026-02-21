// Notification Routes - Notification preferences and history endpoints
import { Router } from 'express';
import { z } from 'zod';
import { notificationService } from '../services/notification.service';
import { requireAuth, getUserId } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import { asyncHandler } from '../middleware/error-handler';
import { successResponse } from '@meeting-followup/shared';

const router = Router();

// Validation schemas
const updatePreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  notifyOnFirstView: z.boolean().optional(),
  notifyOnRevisit: z.boolean().optional(),
  notifyEmail: z.string().email().nullable().optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * GET /api/notifications/preferences
 * Get current user's notification preferences
 */
router.get(
  '/preferences',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const preferences = await notificationService.getPreferences(userId);
    res.json(successResponse(preferences));
  })
);

/**
 * PUT /api/notifications/preferences
 * Update current user's notification preferences
 */
router.put(
  '/preferences',
  requireAuth,
  validateBody(updatePreferencesSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const preferences = await notificationService.updatePreferences(userId, req.body);
    res.json(successResponse(preferences));
  })
);

/**
 * GET /api/notifications/followups/:id
 * Get notifications for a specific follow-up
 */
router.get(
  '/followups/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const notifications = await notificationService.getNotificationsByFollowup(
      req.params.id,
      userId
    );
    res.json(successResponse(notifications));
  })
);

/**
 * GET /api/notifications
 * Get all notifications for current user
 */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const limit = parseInt(req.query.limit as string) || 50;
    const notifications = await notificationService.getNotificationsByUser(userId, limit);
    res.json(successResponse(notifications));
  })
);

export default router;
