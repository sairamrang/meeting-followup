// Template Service - Follow-up template management
import { prisma } from '../lib/prisma';
import { NotFoundError, ConflictError, handlePrismaError } from '../utils/errors';
import type { Template, CreateTemplateDTO, UpdateTemplateDTO } from '@meeting-followup/shared';

export class TemplateService {
  /**
   * Create template
   */
  async create(data: CreateTemplateDTO): Promise<Template> {
    try {
      // Check for duplicate slug
      const existing = await prisma.template.findUnique({
        where: { slug: data.slug },
      });

      if (existing) {
        throw new ConflictError(`Template with slug '${data.slug}' already exists`);
      }

      const template = await prisma.template.create({
        data: data as any,
      });

      return template as unknown as Template;
    } catch (error) {
      if (error instanceof ConflictError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get template by ID
   */
  async getById(id: string): Promise<Template> {
    try {
      const template = await prisma.template.findUnique({
        where: { id },
      });

      if (!template) {
        throw new NotFoundError('Template', id);
      }

      return template as unknown as Template;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get template by slug
   */
  async getBySlug(slug: string): Promise<Template> {
    try {
      const template = await prisma.template.findUnique({
        where: { slug },
      });

      if (!template) {
        throw new NotFoundError('Template');
      }

      return template as unknown as Template;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * List all templates
   */
  async list(): Promise<Template[]> {
    try {
      const templates = await prisma.template.findMany({
        orderBy: { name: 'asc' },
      });
      return templates as unknown as Template[];
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  /**
   * Update template
   */
  async update(id: string, data: UpdateTemplateDTO): Promise<Template> {
    try {
      await this.getById(id);

      // Check slug conflict if slug is being updated
      if (data.slug) {
        const existing = await prisma.template.findUnique({
          where: { slug: data.slug },
        });

        if (existing && existing.id !== id) {
          throw new ConflictError(`Template with slug '${data.slug}' already exists`);
        }
      }

      const template = await prisma.template.update({
        where: { id },
        data: data as any,
      });

      return template as unknown as Template;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Delete template
   */
  async delete(id: string): Promise<void> {
    try {
      await this.getById(id);

      await prisma.template.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }
}

export const templateService = new TemplateService();
