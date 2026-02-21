// Followup Service - Business logic for follow-up management
import { prisma } from '../lib/prisma';
import {
  NotFoundError,
  ConflictError,
  ValidationError,
  ForbiddenError,
  handlePrismaError,
} from '../utils/errors';
import { generateUniqueFollowupSlug, followupSlugExists, isValidSlug } from '../utils/slug';
import { companyService } from './company.service';
import { contactService } from './contact.service';
import type {
  Followup,
  FollowupWithRelations,
  FollowupSummary,
  CreateFollowupDTO,
  UpdateFollowupDTO,
  PublishFollowupDTO,
  PaginationParams,
  FollowupStatus,
} from '@meeting-followup/shared';

export class FollowupService {
  /**
   * Create a new follow-up (draft)
   */
  async create(data: CreateFollowupDTO, userId: string): Promise<Followup> {
    try {
      // Verify sender company exists and user owns it
      const senderCompany = await prisma.company.findUnique({
        where: { id: data.senderCompanyId },
        select: { createdBy: true },
      });

      if (!senderCompany) {
        throw new NotFoundError('Sender company', data.senderCompanyId);
      }

      if (senderCompany.createdBy !== userId) {
        throw new ForbiddenError('You can only send follow-ups from companies you own');
      }

      // Verify receiver company exists
      await companyService.getById(data.receiverCompanyId);

      // Verify sender contact exists and belongs to sender company (if provided)
      if (data.senderId) {
        const sender = await prisma.contact.findUnique({
          where: { id: data.senderId },
        });
        if (!sender || sender.companyId !== data.senderCompanyId) {
          throw new ValidationError('Sender contact must belong to sender company');
        }
      }

      // Verify receiver contact exists and belongs to receiver company (if provided)
      if (data.receiverId) {
        const receiver = await prisma.contact.findUnique({
          where: { id: data.receiverId },
        });
        if (!receiver || receiver.companyId !== data.receiverCompanyId) {
          throw new ValidationError('Receiver contact must belong to receiver company');
        }
      }

      // Verify attendee contacts exist and belong to the receiver company
      if (data.attendeeContactIds && data.attendeeContactIds.length > 0) {
        const contacts = await contactService.getByIds(data.attendeeContactIds, userId);
        const invalidContacts = contacts.filter((c) => c.companyId !== data.receiverCompanyId);
        if (invalidContacts.length > 0) {
          throw new ValidationError('All attendees must be contacts from the receiver company');
        }
      }

      // Create follow-up
      const followup = await prisma.followup.create({
        data: {
          userId,
          senderCompanyId: data.senderCompanyId,
          receiverCompanyId: data.receiverCompanyId,
          companyId: data.receiverCompanyId, // Legacy field for backward compatibility
          senderId: data.senderId,
          receiverId: data.receiverId,
          title: data.title,
          meetingDate: new Date(data.meetingDate),
          meetingType: data.meetingType,
          meetingLocation: data.meetingLocation,
          product: data.product,
          meetingRecap: data.meetingRecap,
          valueProposition: data.valueProposition,
          meetingNotesUrl: data.meetingNotesUrl,
          videoRecordingUrl: data.videoRecordingUrl,
          nextSteps: (data.nextSteps || null) as any,
          contentRefs: (data.contentRefs || null) as any,
          contentOverrides: (data.contentOverrides || null) as any,
          status: 'DRAFT',
          slug: null,
        },
      });

      // Link attendee contacts
      if (data.attendeeContactIds && data.attendeeContactIds.length > 0) {
        await prisma.followupContact.createMany({
          data: data.attendeeContactIds.map((contactId) => ({
            followupId: followup.id,
            contactId,
            attended: true,
          })),
        });
      }

      return followup as Followup;
    } catch (error) {
      if (
        error instanceof NotFoundError ||
        error instanceof ForbiddenError ||
        error instanceof ValidationError
      )
        throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get follow-up by ID
   */
  async getById(
    id: string,
    userId: string,
    includeRelations: boolean = false
  ): Promise<FollowupWithRelations | Followup> {
    try {
      const followup = await prisma.followup.findUnique({
        where: { id },
        include: includeRelations
          ? {
              company: true, // Legacy
              senderCompany: true,
              receiverCompany: true,
              sender: true,
              receiver: true,
              followupContacts: {
                include: { contact: true },
              },
              _count: {
                select: { files: true, analyticsEvents: true },
              },
            }
          : undefined,
      });

      if (!followup) {
        throw new NotFoundError('Follow-up', id);
      }

      // Verify user owns this follow-up
      if (followup.userId !== userId) {
        throw new NotFoundError('Follow-up', id);
      }

      if (includeRelations && 'followupContacts' in followup) {
        return {
          ...followup,
          followupContacts: (followup.followupContacts as any).map((fc: any) => ({
            contact: fc.contact,
            attended: fc.attended,
          })),
          filesCount: (followup as any)._count.files,
          viewsCount: (followup as any)._count.analyticsEvents,
        } as FollowupWithRelations;
      }

      return followup as Followup | FollowupWithRelations;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get follow-up by slug (public access)
   */
  async getBySlug(slug: string): Promise<FollowupWithRelations> {
    try {
      const followup = await prisma.followup.findUnique({
        where: { slug, status: 'PUBLISHED' },
        include: {
          company: true, // Legacy
          senderCompany: true,
          receiverCompany: true,
          sender: true,
          receiver: true,
          followupContacts: {
            include: { contact: true },
          },
          files: true,
        },
      });

      if (!followup) {
        throw new NotFoundError('Follow-up');
      }

      return {
        ...followup,
        followupContacts: followup.followupContacts.map((fc: any) => ({
          contact: fc.contact,
          attended: fc.attended,
        })),
        filesCount: followup.files.length,
      } as FollowupWithRelations;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * List follow-ups with pagination
   */
  async list(
    params: PaginationParams & { status?: FollowupStatus; companyId?: string; search?: string },
    userId: string
  ): Promise<{ followups: FollowupSummary[]; total: number }> {
    try {
      const {
        page = 1,
        pageSize = 20,
        status,
        companyId,
        search,
        sortBy = 'meetingDate',
        sortOrder = 'desc',
      } = params;
      const skip = (page - 1) * pageSize;

      const where = {
        userId,
        ...(status && { status }),
        ...(companyId && { companyId }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { company: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }),
      };

      const [followups, total] = await Promise.all([
        prisma.followup.findMany({
          where,
          include: {
            company: {
              select: { name: true },
            },
            _count: {
              select: { analyticsEvents: true },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
        prisma.followup.count({ where }),
      ]);

      // Get most recent view for each followup
      const followupIds = followups.map((f) => f.id);
      const recentViews = await prisma.analyticsEvent.groupBy({
        by: ['followupId'],
        where: {
          followupId: { in: followupIds },
          eventType: 'PAGE_VIEW',
        },
        _max: {
          timestamp: true,
        },
      });

      const viewsMap = new Map(recentViews.map((v) => [v.followupId, v._max.timestamp]));

      return {
        followups: followups.map((f) => ({
          id: f.id,
          title: f.title,
          companyName: f.company.name,
          meetingDate: f.meetingDate,
          status: f.status as any,
          slug: f.slug,
          viewsCount: f._count.analyticsEvents,
          lastViewedAt: viewsMap.get(f.id) || null,
        })),
        total,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  /**
   * Update follow-up (draft only)
   */
  async update(id: string, data: UpdateFollowupDTO, userId: string): Promise<Followup> {
    try {
      // Get existing followup and verify ownership
      const existingFollowup = await this.getById(id, userId);

      // Note: We allow editing published follow-ups so users can add meeting notes,
      // video links, or update next steps after publishing

      // Verify attendee contacts if provided
      if (data.attendeeContactIds) {
        const contacts = await contactService.getByIds(data.attendeeContactIds, userId);
        const invalidContacts = contacts.filter((c) => c.companyId !== existingFollowup.companyId);
        if (invalidContacts.length > 0) {
          throw new ValidationError('All attendees must be contacts from the same company');
        }

        // Update attendees
        await prisma.followupContact.deleteMany({
          where: { followupId: id },
        });

        await prisma.followupContact.createMany({
          data: data.attendeeContactIds.map((contactId) => ({
            followupId: id,
            contactId,
            attended: true,
          })),
        });
      }

      const followup = await prisma.followup.update({
        where: { id },
        data: {
          ...(data.senderId !== undefined && { senderId: data.senderId }),
          ...(data.receiverId !== undefined && { receiverId: data.receiverId }),
          ...(data.title && { title: data.title }),
          ...(data.meetingDate && { meetingDate: new Date(data.meetingDate) }),
          ...(data.meetingType && { meetingType: data.meetingType }),
          ...(data.meetingLocation !== undefined && { meetingLocation: data.meetingLocation }),
          ...(data.product !== undefined && { product: data.product }),
          ...(data.meetingRecap !== undefined && { meetingRecap: data.meetingRecap }),
          ...(data.valueProposition !== undefined && { valueProposition: data.valueProposition }),
          ...(data.meetingNotesUrl !== undefined && { meetingNotesUrl: data.meetingNotesUrl }),
          ...(data.videoRecordingUrl !== undefined && { videoRecordingUrl: data.videoRecordingUrl }),
          ...(data.nextSteps !== undefined && { nextSteps: data.nextSteps as any }),
          ...(data.contentRefs !== undefined && { contentRefs: data.contentRefs as any }),
          ...(data.contentOverrides !== undefined && { contentOverrides: data.contentOverrides as any }),
          ...(data.template !== undefined && { template: data.template as any }),
        },
      });

      return followup as Followup;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Publish follow-up
   */
  async publish(id: string, data: PublishFollowupDTO, userId: string): Promise<Followup> {
    try {
      // Get existing followup and verify ownership + status
      const existingFollowup = await this.getById(id, userId);

      if (existingFollowup.status === 'PUBLISHED') {
        throw new ConflictError('Follow-up is already published');
      }

      // Generate or validate slug
      let slug = data.slug;

      if (!slug) {
        // Auto-generate from title and company name
        const company = await prisma.company.findUnique({
          where: { id: existingFollowup.companyId },
          select: { name: true },
        });
        const baseText = `${company?.name} ${existingFollowup.title}`;
        slug = await generateUniqueFollowupSlug(baseText);
      } else {
        // Validate provided slug
        if (!isValidSlug(slug)) {
          throw new ValidationError(
            'Invalid slug format. Must be lowercase letters, numbers, and hyphens only',
            { code: 'INVALID_SLUG' }
          );
        }

        // Check if slug is already taken
        if (await followupSlugExists(slug)) {
          throw new ConflictError(`Slug '${slug}' is already taken`, { code: 'SLUG_ALREADY_TAKEN' });
        }
      }

      const followup = await prisma.followup.update({
        where: { id },
        data: {
          status: 'PUBLISHED',
          slug,
          template: data.template || 'MODERN', // Default to MODERN if not specified
          publishedAt: new Date(),
        },
      });

      return followup as Followup;
    } catch (error) {
      if (
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof ConflictError
      )
        throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Unpublish follow-up (revert to draft)
   */
  async unpublish(id: string, userId: string): Promise<Followup> {
    try {
      const existingFollowup = await this.getById(id, userId);

      if (existingFollowup.status === 'DRAFT') {
        throw new ValidationError('Follow-up is already a draft');
      }

      const followup = await prisma.followup.update({
        where: { id },
        data: {
          status: 'DRAFT',
          slug: null,
          publishedAt: null,
        },
      });

      return followup as Followup;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Delete follow-up
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      // Verify followup exists and user owns it
      await this.getById(id, userId);

      await prisma.followup.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }
}

export const followupService = new FollowupService();
