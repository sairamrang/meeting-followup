// Contact Service - Business logic for contact management
import { prisma } from '../lib/prisma';
import { NotFoundError, ConflictError, handlePrismaError, ForbiddenError } from '../utils/errors';
import type {
  Contact,
  ContactWithCompany,
  CreateContactDTO,
  UpdateContactDTO,
  PaginationParams,
} from '@meeting-followup/shared';

export class ContactService {
  /**
   * Create a new contact
   */
  async create(data: CreateContactDTO, userId: string): Promise<Contact> {
    try {
      // Verify company exists and user owns it
      const company = await prisma.company.findUnique({
        where: { id: data.companyId },
        select: { id: true, createdBy: true },
      });

      if (!company) {
        throw new NotFoundError('Company', data.companyId);
      }

      if (company.createdBy !== userId) {
        throw new ForbiddenError('Cannot add contacts to companies you do not own');
      }

      // Check for duplicate email within same company
      if (data.email) {
        const existing = await prisma.contact.findFirst({
          where: {
            companyId: data.companyId,
            email: {
              equals: data.email,
              mode: 'insensitive',
            },
          },
        });

        if (existing) {
          throw new ConflictError(
            `Contact with email '${data.email}' already exists for this company`
          );
        }
      }

      const contact = await prisma.contact.create({
        data,
      });

      return contact;
    } catch (error) {
      if (
        error instanceof NotFoundError ||
        error instanceof ConflictError ||
        error instanceof ForbiddenError
      )
        throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get contact by ID
   */
  async getById(id: string, userId: string, includeCompany: boolean = false): Promise<ContactWithCompany | Contact> {
    try {
      const contact = await prisma.contact.findUnique({
        where: { id },
        include: includeCompany ? { company: true } : undefined,
      });

      if (!contact) {
        throw new NotFoundError('Contact', id);
      }

      // Verify user owns the company
      const company = await prisma.company.findUnique({
        where: { id: contact.companyId },
        select: { createdBy: true },
      });

      if (company?.createdBy !== userId) {
        throw new NotFoundError('Contact', id);
      }

      return contact;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * List contacts for a company
   */
  async listByCompany(
    companyId: string,
    userId: string,
    params?: PaginationParams & { search?: string }
  ): Promise<{ contacts: Contact[]; total: number }> {
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
        throw new ForbiddenError('Cannot access contacts for companies you do not own');
      }

      const { page = 1, pageSize = 50, search, sortBy = 'name', sortOrder = 'asc' } = params || {};
      const skip = (page - 1) * pageSize;

      const where = {
        companyId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { role: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      };

      const [contacts, total] = await Promise.all([
        prisma.contact.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
        prisma.contact.count({ where }),
      ]);

      return { contacts, total };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Update contact
   */
  async update(id: string, data: UpdateContactDTO, userId: string): Promise<Contact> {
    try {
      // Get contact and verify ownership
      const existingContact = await this.getById(id, userId);

      // Check for duplicate email if email is being updated
      if (data.email && data.email !== existingContact.email) {
        const duplicate = await prisma.contact.findFirst({
          where: {
            companyId: existingContact.companyId,
            email: {
              equals: data.email,
              mode: 'insensitive',
            },
            id: { not: id },
          },
        });

        if (duplicate) {
          throw new ConflictError(
            `Contact with email '${data.email}' already exists for this company`
          );
        }
      }

      const contact = await prisma.contact.update({
        where: { id },
        data,
      });

      return contact;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Delete contact
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      // Verify contact exists and user owns it
      await this.getById(id, userId);

      await prisma.contact.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get contacts by IDs (for follow-up attendees)
   */
  async getByIds(ids: string[], userId: string): Promise<Contact[]> {
    try {
      const contacts = await prisma.contact.findMany({
        where: {
          id: { in: ids },
          company: {
            createdBy: userId,
          },
        },
      });

      // Check if all IDs were found
      if (contacts.length !== ids.length) {
        const foundIds = contacts.map((c) => c.id);
        const missingIds = ids.filter((id) => !foundIds.includes(id));
        throw new NotFoundError(`Contacts with IDs: ${missingIds.join(', ')}`);
      }

      return contacts;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }
}

export const contactService = new ContactService();
