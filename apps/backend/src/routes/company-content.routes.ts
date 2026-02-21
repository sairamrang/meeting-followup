// Company Content Routes - Prospect company-specific content endpoints
import { Router } from 'express';
import { z } from 'zod';
import { companyContentService } from '../services/company-content.service';
import { requireAuth, getUserId } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { asyncHandler } from '../middleware/error-handler';
import { successResponse, CompanyContentType } from '@meeting-followup/shared';

const router = Router();

// Validation schemas
const createCompanyContentSchema = z.object({
  companyId: z.string().uuid(),
  title: z.string().min(1).max(255),
  type: z.nativeEnum(CompanyContentType),
  content: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

const updateCompanyContentSchema = createCompanyContentSchema
  .omit({ companyId: true })
  .partial();

const listByTypeSchema = z.object({
  type: z.nativeEnum(CompanyContentType),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const companyIdParamSchema = z.object({
  companyId: z.string().uuid(),
});

/**
 * POST /api/company-content
 * Create company content
 */
router.post(
  '/',
  requireAuth,
  validateBody(createCompanyContentSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const content = await companyContentService.create(req.body, userId);
    res.status(201).json(successResponse(content));
  })
);

/**
 * GET /api/company-content/:id
 * Get company content by ID
 */
router.get(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const content = await companyContentService.getById(req.params.id, userId);
    res.json(successResponse(content));
  })
);

/**
 * GET /api/companies/:companyId/content
 * List company content (grouped by type)
 */
router.get(
  '/company/:companyId',
  requireAuth,
  validateParams(companyIdParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const grouped = await companyContentService.listByCompanyGrouped(req.params.companyId, userId);
    res.json(successResponse(grouped));
  })
);

/**
 * GET /api/companies/:companyId/content/type
 * List company content by type
 */
router.get(
  '/company/:companyId/type',
  requireAuth,
  validateParams(companyIdParamSchema),
  validateQuery(listByTypeSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const items = await companyContentService.listByType(
      req.query.type as CompanyContentType,
      req.params.companyId,
      userId
    );
    res.json(successResponse(items));
  })
);

/**
 * PUT /api/company-content/:id
 * Update company content
 */
router.put(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  validateBody(updateCompanyContentSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const content = await companyContentService.update(req.params.id, req.body, userId);
    res.json(successResponse(content));
  })
);

/**
 * DELETE /api/company-content/:id
 * Delete company content
 */
router.delete(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    await companyContentService.delete(req.params.id, userId);
    res.status(204).send();
  })
);

export default router;
