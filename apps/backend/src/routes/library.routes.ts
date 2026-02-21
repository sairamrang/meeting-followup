// Library Routes - Global reusable content endpoints
import { Router } from 'express';
import { z } from 'zod';
import { libraryService } from '../services/library.service';
import { requireAuth, getUserId } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { asyncHandler } from '../middleware/error-handler';
import { successResponse, LibraryType } from '@meeting-followup/shared';

const router = Router();

// Validation schemas
const createLibrarySchema = z.object({
  title: z.string().min(1).max(255),
  type: z.nativeEnum(LibraryType),
  content: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

const updateLibrarySchema = createLibrarySchema.partial();

const listLibrarySchema = z.object({
  type: z.nativeEnum(LibraryType).optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * POST /api/library
 * Create library content
 */
router.post(
  '/',
  requireAuth,
  validateBody(createLibrarySchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const item = await libraryService.create(req.body, userId);
    res.status(201).json(successResponse(item));
  })
);

/**
 * GET /api/library/:id
 * Get library item by ID
 */
router.get(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const item = await libraryService.getById(req.params.id, userId);
    res.json(successResponse(item));
  })
);

/**
 * GET /api/library
 * List library items (grouped by type or filtered)
 */
router.get(
  '/',
  requireAuth,
  validateQuery(listLibrarySchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    if (req.query.type) {
      const items = await libraryService.listByType(req.query.type as LibraryType, userId);
      res.json(successResponse(items));
    } else {
      const grouped = await libraryService.listGrouped(userId);
      res.json(successResponse(grouped));
    }
  })
);

/**
 * PUT /api/library/:id
 * Update library item
 */
router.put(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  validateBody(updateLibrarySchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const item = await libraryService.update(req.params.id, req.body, userId);
    res.json(successResponse(item));
  })
);

/**
 * DELETE /api/library/:id
 * Delete library item
 */
router.delete(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    await libraryService.delete(req.params.id, userId);
    res.status(204).send();
  })
);

export default router;
