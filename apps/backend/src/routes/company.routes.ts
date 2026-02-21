// Company Routes - Company management endpoints
import { Router } from 'express';
import { z } from 'zod';
import { companyService } from '../services/company.service';
import { requireAuth, getUserId } from '../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../middleware/validate';
import { asyncHandler } from '../middleware/error-handler';
import { successResponse } from '@meeting-followup/shared';

const router = Router();

// Validation schemas
const createCompanySchema = z.object({
  name: z.string().min(1).max(255),
  website: z.string().url().optional().nullable(),
  industry: z.string().max(100).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  mainContactId: z.string().uuid().optional().nullable(),
});

const updateCompanySchema = createCompanySchema.partial();

const listCompaniesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * POST /api/companies
 * Create a new company
 */
router.post(
  '/',
  requireAuth,
  validateBody(createCompanySchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const company = await companyService.create(req.body, userId);
    res.status(201).json(successResponse(company));
  })
);

/**
 * GET /api/companies/:id
 * Get company by ID
 */
router.get(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const includeRelations = req.query.include === 'true';
    const company = await companyService.getById(req.params.id, includeRelations);
    res.json(successResponse(company));
  })
);

/**
 * GET /api/companies
 * List companies with pagination and search
 */
router.get(
  '/',
  requireAuth,
  validateQuery(listCompaniesSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const result = await companyService.list(req.query as any, userId);
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    res.json(
      successResponse(result.companies, {
        page,
        pageSize,
        totalCount: result.total,
        totalPages: Math.ceil(result.total / pageSize),
      })
    );
  })
);

/**
 * PUT /api/companies/:id
 * Update company
 */
router.put(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  validateBody(updateCompanySchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const company = await companyService.update(req.params.id, req.body, userId);
    res.json(successResponse(company));
  })
);

/**
 * DELETE /api/companies/:id
 * Delete company
 */
router.delete(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    await companyService.delete(req.params.id, userId);
    res.status(204).send();
  })
);

/**
 * GET /api/companies/:id/stats
 * Get company statistics
 */
router.get(
  '/:id/stats',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const stats = await companyService.getStats(req.params.id, userId);
    res.json(successResponse(stats));
  })
);

export default router;
