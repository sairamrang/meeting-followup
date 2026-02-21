// Confirmation Service - Micro-commitment confirmation tracking
import { prisma } from '../lib/prisma';
import { NotFoundError, handlePrismaError } from '../utils/errors';
import type {
  FollowupConfirmation,
  CreateConfirmationDTO,
  ConfirmationMetrics,
  ConfirmationType,
} from '@meeting-followup/shared';

export class ConfirmationService {
  /**
   * Create a confirmation (public - no auth required)
   * @param slug - The followup's public slug
   * @param data - Confirmation data
   */
  async createConfirmation(
    slug: string,
    data: CreateConfirmationDTO
  ): Promise<FollowupConfirmation> {
    try {
      // Verify followup exists and is published
      const followup = await prisma.followup.findUnique({
        where: { slug, status: 'PUBLISHED' },
        select: { id: true },
      });

      if (!followup) {
        throw new NotFoundError('Follow-up');
      }

      const confirmation = await prisma.followupConfirmation.create({
        data: {
          followupId: followup.id,
          sessionId: data.sessionId,
          type: data.type,
          comment: data.comment,
        },
      });

      return confirmation as FollowupConfirmation;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get confirmations for a followup (authenticated - owner only)
   * @param followupId - The followup ID
   * @param userId - The authenticated user ID
   */
  async getConfirmations(
    followupId: string,
    userId: string
  ): Promise<FollowupConfirmation[]> {
    try {
      // Verify user owns the followup
      const followup = await prisma.followup.findUnique({
        where: { id: followupId },
        select: { userId: true },
      });

      if (!followup) {
        throw new NotFoundError('Follow-up', followupId);
      }

      if (followup.userId !== userId) {
        throw new NotFoundError('Follow-up', followupId);
      }

      const confirmations = await prisma.followupConfirmation.findMany({
        where: { followupId },
        orderBy: { confirmedAt: 'desc' },
      });

      return confirmations as FollowupConfirmation[];
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get confirmation metrics for a followup (authenticated - owner only)
   * @param followupId - The followup ID
   * @param userId - The authenticated user ID
   */
  async getConfirmationMetrics(
    followupId: string,
    userId: string
  ): Promise<ConfirmationMetrics> {
    try {
      // Verify user owns the followup
      const followup = await prisma.followup.findUnique({
        where: { id: followupId },
        select: { userId: true },
      });

      if (!followup) {
        throw new NotFoundError('Follow-up', followupId);
      }

      if (followup.userId !== userId) {
        throw new NotFoundError('Follow-up', followupId);
      }

      // Get all confirmations with counts by type
      const [confirmations, typeCounts] = await Promise.all([
        prisma.followupConfirmation.findMany({
          where: { followupId },
          orderBy: { confirmedAt: 'desc' },
          take: 10, // Recent 10 for detail view
        }),
        prisma.followupConfirmation.groupBy({
          by: ['type'],
          where: { followupId },
          _count: true,
        }),
      ]);

      // Build byType map
      const byType: { [key: string]: number } = {};
      typeCounts.forEach((tc) => {
        byType[tc.type] = tc._count;
      });

      const total = typeCounts.reduce((sum, tc) => sum + tc._count, 0);

      // Calculate rates
      const recapResponses =
        (byType['RECAP_ACCURATE'] || 0) + (byType['RECAP_INACCURATE'] || 0);
      const valuePropResponses =
        (byType['VALUE_PROP_CLEAR'] || 0) + (byType['VALUE_PROP_UNCLEAR'] || 0);
      const interestResponses =
        (byType['INTERESTED'] || 0) + (byType['SCHEDULE_CALL'] || 0);

      const recapAccuracyRate =
        recapResponses > 0
          ? Math.round(((byType['RECAP_ACCURATE'] || 0) / recapResponses) * 100)
          : null;

      const valuePropResonanceRate =
        valuePropResponses > 0
          ? Math.round(
              ((byType['VALUE_PROP_CLEAR'] || 0) / valuePropResponses) * 100
            )
          : null;

      // Interest rate based on any positive response (INTERESTED or SCHEDULE_CALL)
      const interestRate =
        interestResponses > 0
          ? Math.round((interestResponses / total) * 100)
          : null;

      return {
        followupId,
        total,
        byType: byType as { [key in ConfirmationType]?: number },
        recapAccuracyRate,
        valuePropResonanceRate,
        interestRate,
        recentConfirmations: confirmations as FollowupConfirmation[],
      };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }
}

export const confirmationService = new ConfirmationService();
