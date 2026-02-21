// File Service - File attachment management
import { prisma } from '../lib/prisma';
import { NotFoundError, ValidationError, ForbiddenError, handlePrismaError } from '../utils/errors';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@meeting-followup/shared';
import type { File, CreateFileDTO, UpdateFileDTO } from '@meeting-followup/shared';

export class FileService {
  /**
   * Create file record (after upload to Supabase Storage)
   */
  async create(data: CreateFileDTO, userId: string): Promise<File> {
    try {
      // Verify user owns the followup
      const followup = await prisma.followup.findUnique({
        where: { id: data.followupId },
        select: { userId: true },
      });

      if (!followup) {
        throw new NotFoundError('Follow-up', data.followupId);
      }

      if (followup.userId !== userId) {
        throw new ForbiddenError('Cannot add files to follow-ups you do not own');
      }

      // Validate file type
      if (!ALLOWED_MIME_TYPES.includes(data.mimeType as any)) {
        throw new ValidationError(`File type '${data.mimeType}' is not allowed`);
      }

      // Validate file size
      if (data.fileSize > MAX_FILE_SIZE) {
        throw new ValidationError(
          `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        );
      }

      const file = await prisma.file.create({
        data,
      });

      return file;
    } catch (error) {
      if (
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof ForbiddenError
      )
        throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get file by ID
   */
  async getById(id: string, userId: string): Promise<File> {
    try {
      const file = await prisma.file.findUnique({
        where: { id },
        include: {
          followup: {
            select: { userId: true },
          },
        },
      });

      if (!file) {
        throw new NotFoundError('File', id);
      }

      // Verify user owns the followup
      if (file.followup.userId !== userId) {
        throw new NotFoundError('File', id);
      }

      return file;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * List files for a follow-up
   */
  async listByFollowup(followupId: string, userId: string): Promise<File[]> {
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
        throw new ForbiddenError('Cannot access files for follow-ups you do not own');
      }

      return await prisma.file.findMany({
        where: { followupId },
        orderBy: { uploadedAt: 'desc' },
      });
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * List files for a published follow-up (public access via slug)
   */
  async listBySlug(slug: string): Promise<File[]> {
    try {
      const followup = await prisma.followup.findUnique({
        where: { slug, status: 'PUBLISHED' },
        select: { id: true },
      });

      if (!followup) {
        throw new NotFoundError('Follow-up');
      }

      return await prisma.file.findMany({
        where: { followupId: followup.id },
        orderBy: { uploadedAt: 'asc' },
      });
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Update file metadata
   */
  async update(id: string, data: UpdateFileDTO, userId: string): Promise<File> {
    try {
      await this.getById(id, userId);

      const file = await prisma.file.update({
        where: { id },
        data,
      });

      return file;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Delete file (and from storage)
   */
  async delete(id: string, userId: string): Promise<File> {
    try {
      const file = await this.getById(id, userId);

      await prisma.file.delete({
        where: { id },
      });

      // Return file info so storage path can be deleted
      return file;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }
}

export const fileService = new FileService();
