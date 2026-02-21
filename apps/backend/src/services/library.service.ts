// Library Service - Your company's reusable content management
import { prisma } from '../lib/prisma';
import { NotFoundError, handlePrismaError } from '../utils/errors';
import type {
  Library,
  GroupedLibrary,
  CreateLibraryDTO,
  UpdateLibraryDTO,
  LibraryType,
} from '@meeting-followup/shared';

export class LibraryService {
  /**
   * Create library content
   */
  async create(data: CreateLibraryDTO, userId: string): Promise<Library> {
    try {
      const library = await prisma.library.create({
        data: {
          ...data,
          createdBy: userId,
        },
      });
      return library as Library;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  /**
   * Get library item by ID
   */
  async getById(id: string, userId: string): Promise<Library> {
    try {
      const library = await prisma.library.findUnique({
        where: { id },
      });

      if (!library) {
        throw new NotFoundError('Library item', id);
      }

      // Verify ownership
      if (library.createdBy !== userId) {
        throw new NotFoundError('Library item', id);
      }

      return library as Library;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * List all library items (grouped by type)
   */
  async listGrouped(userId: string): Promise<GroupedLibrary> {
    try {
      const items = await prisma.library.findMany({
        where: { createdBy: userId },
        orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
      });

      const grouped: GroupedLibrary = {
        ABOUT_US: [],
        VALUE_PROP: [],
        CASE_STUDY: [],
        TEAM_BIO: [],
        PRODUCT: [],
        PRICING: [],
      };

      items.forEach((item) => {
        grouped[item.type].push(item as Library);
      });

      return grouped;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  /**
   * List library items by type
   */
  async listByType(type: LibraryType, userId: string): Promise<Library[]> {
    try {
      const items = await prisma.library.findMany({
        where: { type, createdBy: userId },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      });
      return items as Library[];
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  /**
   * Update library item
   */
  async update(id: string, data: UpdateLibraryDTO, userId: string): Promise<Library> {
    try {
      // Verify exists and user owns it
      await this.getById(id, userId);

      const library = await prisma.library.update({
        where: { id },
        data,
      });

      return library as Library;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Delete library item
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      await this.getById(id, userId);

      await prisma.library.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Reorder library items within a type
   */
  async reorder(type: LibraryType, orderedIds: string[], userId: string): Promise<void> {
    try {
      // Update sort order for each item
      const updates = orderedIds.map((id, index) =>
        prisma.library.updateMany({
          where: { id, type, createdBy: userId },
          data: { sortOrder: index + 1 },
        })
      );

      await prisma.$transaction(updates);
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

export const libraryService = new LibraryService();
