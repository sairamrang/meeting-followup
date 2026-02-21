// Slug generation utilities
import slugify from 'slugify';
import { prisma } from '../lib/prisma';

/**
 * Generate a URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true, // Remove special characters
    remove: /[*+~.()'"!:@]/g,
  });
}

/**
 * Generate a unique slug for a follow-up
 * If slug already exists, append a number suffix
 */
export async function generateUniqueFollowupSlug(baseText: string): Promise<string> {
  const baseSlug = generateSlug(baseText);
  let slug = baseSlug;
  let counter = 1;

  // Check if slug exists
  while (await followupSlugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Check if a follow-up slug already exists
 */
export async function followupSlugExists(slug: string): Promise<boolean> {
  const existing = await prisma.followup.findUnique({
    where: { slug },
    select: { id: true },
  });
  return !!existing;
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  // Only lowercase letters, numbers, and hyphens
  // Must start and end with alphanumeric
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
}
