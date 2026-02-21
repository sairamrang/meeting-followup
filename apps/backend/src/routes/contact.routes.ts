// Contact Routes - Contact management endpoints
import { Router } from 'express';
import { z } from 'zod';
import { contactService } from '../services/contact.service';
import { requireAuth, getUserId } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import { asyncHandler } from '../middleware/error-handler';
import { successResponse } from '@meeting-followup/shared';

const router = Router();

// Validation schemas
const createContactSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(1).max(255),
  role: z.string().max(255).optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
});

const updateContactSchema = createContactSchema.omit({ companyId: true }).partial();

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const companyIdParamSchema = z.object({
  companyId: z.string().uuid(),
});

/**
 * POST /api/contacts
 * Create a new contact
 */
router.post(
  '/',
  requireAuth,
  validateBody(createContactSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const contact = await contactService.create(req.body, userId);
    res.status(201).json(successResponse(contact));
  })
);

/**
 * GET /api/contacts/:id
 * Get contact by ID
 */
router.get(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const contact = await contactService.getById(req.params.id, userId);
    res.json(successResponse(contact));
  })
);

/**
 * GET /api/companies/:companyId/contacts
 * List contacts for a company
 */
router.get(
  '/company/:companyId',
  requireAuth,
  validateParams(companyIdParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const contacts = await contactService.listByCompany(req.params.companyId, userId);
    res.json(successResponse(contacts));
  })
);

/**
 * PUT /api/contacts/:id
 * Update contact
 */
router.put(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  validateBody(updateContactSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const contact = await contactService.update(req.params.id, req.body, userId);
    res.json(successResponse(contact));
  })
);

/**
 * DELETE /api/contacts/:id
 * Delete contact
 */
router.delete(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    await contactService.delete(req.params.id, userId);
    res.status(204).send();
  })
);

export default router;
