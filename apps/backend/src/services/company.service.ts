// Company Service - Business logic for company management
import { prisma } from '../lib/prisma';
import { NotFoundError, ConflictError, handlePrismaError } from '../utils/errors';
import type {
  Company,
  CompanyWithRelations,
  CreateCompanyDTO,
  UpdateCompanyDTO,
  PaginationParams,
} from '@meeting-followup/shared';

export class CompanyService {
  /**
   * Create a new company
   */
  async create(data: CreateCompanyDTO, userId: string): Promise<Company> {
    try {
      // Check if company with same name already exists
      const existing = await prisma.company.findFirst({
        where: {
          name: {
            equals: data.name,
            mode: 'insensitive', // Case-insensitive
          },
        },
      });

      if (existing) {
        throw new ConflictError(`Company with name '${data.name}' already exists`);
      }

      const company = await prisma.company.create({
        data: {
          ...data,
          createdBy: userId,
        },
      });

      return company;
    } catch (error) {
      if (error instanceof ConflictError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get company by ID
   */
  async getById(id: string, includeRelations: boolean = false): Promise<CompanyWithRelations> {
    try {
      const company = await prisma.company.findUnique({
        where: { id },
        include: includeRelations
          ? {
              contacts: {
                orderBy: { createdAt: 'asc' },
              },
              _count: {
                select: { followups: true },
              },
            }
          : undefined,
      });

      if (!company) {
        throw new NotFoundError('Company', id);
      }

      if (includeRelations && 'contacts' in company && '_count' in company) {
        return {
          ...company,
          contacts: company.contacts as any,
          followupsCount: (company._count as any)?.followups,
        };
      }

      return company as CompanyWithRelations;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * List companies with pagination
   */
  async list(
    params: PaginationParams & { search?: string },
    userId: string
  ): Promise<{ companies: CompanyWithRelations[]; total: number }> {
    try {
      const { page = 1, pageSize = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
      const skip = (page - 1) * pageSize;

      const where = {
        createdBy: userId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { industry: { contains: search, mode: 'insensitive' as const } },
            { website: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      };

      const [companies, total] = await Promise.all([
        prisma.company.findMany({
          where,
          include: {
            _count: {
              select: { followups: true, contacts: true },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
        prisma.company.count({ where }),
      ]);

      return {
        companies: companies.map((c) => ({
          ...c,
          followupsCount: c._count.followups,
        })),
        total,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  /**
   * Update company
   */
  async update(id: string, data: UpdateCompanyDTO, userId: string): Promise<Company> {
    try {
      // Verify company exists and user owns it
      await this.verifyOwnership(id, userId);

      // If name is being updated, check for conflicts
      if (data.name) {
        const existing = await prisma.company.findFirst({
          where: {
            name: {
              equals: data.name,
              mode: 'insensitive',
            },
            id: { not: id }, // Exclude current company
          },
        });

        if (existing) {
          throw new ConflictError(`Company with name '${data.name}' already exists`);
        }
      }

      const company = await prisma.company.update({
        where: { id },
        data,
      });

      return company;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Delete company (and all related data via CASCADE)
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      // Verify company exists and user owns it
      await this.verifyOwnership(id, userId);

      await prisma.company.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Verify user owns the company
   */
  private async verifyOwnership(companyId: string, userId: string): Promise<void> {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, createdBy: true },
    });

    if (!company) {
      throw new NotFoundError('Company', companyId);
    }

    if (company.createdBy !== userId) {
      throw new NotFoundError('Company', companyId); // Don't reveal existence
    }
  }

  /**
   * Get company statistics
   */
  async getStats(companyId: string, userId: string): Promise<{
    totalFollowups: number;
    publishedFollowups: number;
    draftFollowups: number;
    totalContacts: number;
    totalViews: number;
  }> {
    try {
      await this.verifyOwnership(companyId, userId);

      const [followupStats, contactCount, viewStats] = await Promise.all([
        prisma.followup.groupBy({
          by: ['status'],
          where: { companyId },
          _count: true,
        }),
        prisma.contact.count({
          where: { companyId },
        }),
        prisma.analyticsEvent.count({
          where: {
            followup: { companyId },
            eventType: 'PAGE_VIEW',
          },
        }),
      ]);

      const publishedCount = followupStats.find((s) => s.status === 'PUBLISHED')?._count || 0;
      const draftCount = followupStats.find((s) => s.status === 'DRAFT')?._count || 0;

      return {
        totalFollowups: publishedCount + draftCount,
        publishedFollowups: publishedCount,
        draftFollowups: draftCount,
        totalContacts: contactCount,
        totalViews: viewStats,
      };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }
}

export const companyService = new CompanyService();
