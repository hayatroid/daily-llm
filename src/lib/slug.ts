/**
 * URL slug generation utilities for heading anchors
 * Handles Japanese/English text, removes special characters, ensures uniqueness
 */
import type { SlugMap } from './types';

/**
 * Convert text to URL-safe slug
 */
export function generateSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return 'heading';
  }

  return (
    text
      .toLowerCase()
      .trim()
      // Remove markdown syntax (##, ###, etc.)
      .replace(/^#+\s*/, '')
      // Remove special characters except alphanumeric, spaces, hyphens, and Japanese characters
      .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF-]/g, '')
      // Replace multiple spaces with single hyphen
      .replace(/\s+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Limit length for practical URLs
      .substring(0, 50) ||
    // Fallback if empty after processing
    'heading'
  );
}

/**
 * Generate unique slug by appending number if duplicate exists
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: Set<string>
): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Process all headings in content and generate unique slugs
 */
export function processHeadingSlugs(headings: NodeListOf<Element>): SlugMap {
  const slugMap = new Map<Element, string>();
  const usedSlugs = new Set<string>();

  headings.forEach((heading) => {
    const baseSlug = generateSlug(heading.textContent || '');
    const uniqueSlug = generateUniqueSlug(baseSlug, usedSlugs);

    slugMap.set(heading, uniqueSlug);
    usedSlugs.add(uniqueSlug);
  });

  return slugMap;
}
