// File Routes - File attachment management endpoints
import { Router } from 'express';
import { z } from 'zod';
import { fileService } from '../services/file.service';
import { requireAuth, getUserId } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import { asyncHandler } from '../middleware/error-handler';
import { successResponse } from '@meeting-followup/shared';

const router = Router();

// Validation schemas
const createFileSchema = z.object({
  followupId: z.string().uuid(),
  fileName: z.string().min(1).max(255),
  originalName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  fileSize: z.number().int().positive(),
  storagePath: z.string().min(1),
  displayName: z.string().max(255).optional().nullable(),
});

const updateFileSchema = z.object({
  displayName: z.string().max(255).optional().nullable(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const followupIdParamSchema = z.object({
  followupId: z.string().uuid(),
});

const slugParamSchema = z.object({
  slug: z.string().min(3),
});

/**
 * POST /api/files
 * Create file record (after upload to storage)
 */
router.post(
  '/',
  requireAuth,
  validateBody(createFileSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const file = await fileService.create(req.body, userId);
    res.status(201).json(successResponse(file));
  })
);

/**
 * GET /api/files/:id
 * Get file by ID
 */
router.get(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const file = await fileService.getById(req.params.id, userId);
    res.json(successResponse(file));
  })
);

/**
 * GET /api/followups/:followupId/files
 * List files for a follow-up (authenticated)
 */
router.get(
  '/followup/:followupId',
  requireAuth,
  validateParams(followupIdParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const files = await fileService.listByFollowup(req.params.followupId, userId);
    res.json(successResponse(files));
  })
);

/**
 * GET /f/:slug/files
 * List files for a published follow-up (public)
 */
router.get(
  '/public/:slug/files',
  validateParams(slugParamSchema),
  asyncHandler(async (req, res) => {
    const files = await fileService.listBySlug(req.params.slug);
    res.json(successResponse(files));
  })
);

/**
 * PUT /api/files/:id
 * Update file metadata
 */
router.put(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  validateBody(updateFileSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const file = await fileService.update(req.params.id, req.body, userId);
    res.json(successResponse(file));
  })
);

/**
 * DELETE /api/files/:id
 * Delete file (and from storage)
 */
router.delete(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    await fileService.delete(req.params.id, userId);
    res.status(204).send();
  })
);

export default router;
