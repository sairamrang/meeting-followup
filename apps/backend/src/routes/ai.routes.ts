// AI Routes - AI-powered content generation endpoints
import { Router } from 'express';
import { z } from 'zod';
import { aiService } from '../services/ai.service';
import { requireAuth, getUserId } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../middleware/error-handler';
import { successResponse } from '@meeting-followup/shared';

const router = Router();

// Validation schema for AI generation
const generateContentSchema = z.object({
  type: z.enum(['recap', 'valueProposition', 'actionItems']),
  sourceContent: z.string().min(10, 'Source content must be at least 10 characters'),
  context: z.object({
    meetingType: z.string().optional(),
    companyName: z.string().optional(),
    productName: z.string().optional(),
  }).optional(),
});

/**
 * POST /api/ai/generate
 * Generate AI content (recap, value proposition, or action items)
 */
router.post(
  '/generate',
  requireAuth,
  validateBody(generateContentSchema),
  asyncHandler(async (req, res) => {
    const userId = getUserId(req);

    console.log(`🤖 AI generation requested by ${userId}: ${req.body.type}`);

    const result = await aiService.generateContent(req.body);

    res.json(successResponse(result));
  })
);

export default router;
