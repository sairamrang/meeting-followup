// CompanyContent Service - Prospect company-specific content management
import { prisma } from '../lib/prisma';
import { NotFoundError, ForbiddenError, handlePrismaError } from '../utils/errors';
import type {
  CompanyContent,
  GroupedCompanyContent,
  CreateCompanyContentDTO,
  UpdateCompanyContentDTO,
  CompanyContentType,
} from '@meeting-followup/shared';

export class CompanyContentService {
  /**
   * Create company content
   */
  async create(data: CreateCompanyContentDTO, userId: string): Promise<CompanyContent> {
    try {
      // If companyId provided, verify user owns the company
      if (data.companyId) {
        const company = await prisma.company.findUnique({
          where: { id: data.companyId },
          select: { createdBy: true },
        });

        if (!company) {
          throw new NotFoundError('Company', data.companyId);
        }

        if (company.createdBy !== userId) {
          throw new ForbiddenError('Cannot add content to companies you do not own');
        }
      }

      const content = await prisma.companyContent.create({
        data: {
          ...data,
          createdBy: userId,
        },
      });

      return content as CompanyContent;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get company content by ID
   */
  async getById(id: string, userId: string): Promise<CompanyContent> {
    try {
      const content = await prisma.companyContent.findUnique({
        where: { id },
      });

      if (!content) {
        throw new NotFoundError('Company content', id);
      }

      // Verify ownership
      if (content.createdBy !== userId) {
        throw new NotFoundError('Company content', id);
      }

      return content as CompanyContent;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * List company content for a specific company (grouped by type)
   */
  async listByCompanyGrouped(companyId: string, userId: string): Promise<GroupedCompanyContent> {
    try {
      // Verify user owns the company
      const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: { createdBy: true },
      });

      if (!company) {
        throw new NotFoundError('Company', companyId);
      }

      if (company.createdBy !== userId) {
        throw new ForbiddenError('Cannot access content for companies you do not own');
      }

      const items = await prisma.companyContent.findMany({
        where: { companyId },
        orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
      });

      const grouped: GroupedCompanyContent = {
        HISTORY: [],
        LEADERSHIP: [],
        PRODUCTS: [],
        NEWS: [],
        NOTES: [],
      };

      items.forEach((item) => {
        grouped[item.type].push(item as CompanyContent);
      });

      return grouped;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * List company content by type
   */
  async listByType(
    type: CompanyContentType,
    companyId: string,
    userId: string
  ): Promise<CompanyContent[]> {
    try {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: { createdBy: true },
      });

      if (company?.createdBy !== userId) {
        throw new ForbiddenError('Cannot access content for companies you do not own');
      }

      const items = await prisma.companyContent.findMany({
        where: { companyId, type },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });
      return items as CompanyContent[];
    } catch (error) {
      if (error instanceof ForbiddenError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Update company content
   */
  async update(id: string, data: UpdateCompanyContentDTO, userId: string): Promise<CompanyContent> {
    try {
      await this.getById(id, userId);

      const content = await prisma.companyContent.update({
        where: { id },
        data,
      });

      return content as CompanyContent;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Delete company content
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      await this.getById(id, userId);

      await prisma.companyContent.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }
}

export const companyContentService = new CompanyContentService();
