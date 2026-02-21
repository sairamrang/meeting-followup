// Template Routes - Template management endpoints
import { Router } from 'express';
import { z } from 'zod';
import { templateService } from '../services/template.service';
import { requireAuth } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import { asyncHandler } from '../middleware/error-handler';
import { successResponse } from '@meeting-followup/shared';

const router = Router();

// Validation schemas
const createTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
  template: z.record(z.unknown()), // JSON structure for template
});

const updateTemplateSchema = createTemplateSchema.partial();

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const slugParamSchema = z.object({
  slug: z.string().min(3),
});

/**
 * POST /api/templates
 * Create a new template (admin only in production)
 */
router.post(
  '/',
  requireAuth,
  validateBody(createTemplateSchema),
  asyncHandler(async (req, res) => {
    const template = await templateService.create(req.body);
    res.status(201).json(successResponse(template));
  })
);

/**
 * GET /api/templates/:id
 * Get template by ID
 */
router.get(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const template = await templateService.getById(req.params.id);
    res.json(successResponse(template));
  })
);

/**
 * GET /api/templates/slug/:slug
 * Get template by slug
 */
router.get(
  '/slug/:slug',
  requireAuth,
  validateParams(slugParamSchema),
  asyncHandler(async (req, res) => {
    const template = await templateService.getBySlug(req.params.slug);
    res.json(successResponse(template));
  })
);

/**
 * GET /api/templates
 * List all templates
 */
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const templates = await templateService.list();
    res.json(successResponse(templates));
  })
);

/**
 * PUT /api/templates/:id
 * Update template (admin only in production)
 */
router.put(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  validateBody(updateTemplateSchema),
  asyncHandler(async (req, res) => {
    const template = await templateService.update(req.params.id, req.body);
    res.json(successResponse(template));
  })
);

/**
 * DELETE /api/templates/:id
 * Delete template (admin only in production)
 */
router.delete(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    await templateService.delete(req.params.id);
    res.status(204).send();
  })
);

export default router;
