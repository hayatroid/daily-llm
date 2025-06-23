/**
 * Generate URL-safe slug from heading text
 * Handles Japanese/English text, removes special characters, ensures uniqueness
 */

/**
 * Convert text to URL-safe slug
 * @param {string} text - Raw heading text
 * @returns {string} URL-safe slug
 */
export function generateSlug(text) {
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
 * @param {string} baseSlug - Base slug to check
 * @param {Set<string>} existingSlugs - Set of already used slugs
 * @returns {string} Unique slug
 */
export function generateUniqueSlug(baseSlug, existingSlugs) {
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
 * @param {NodeList} headings - List of heading elements
 * @returns {Map<Element, string>} Map of heading element to unique slug
 */
export function processHeadingSlugs(headings) {
  const slugMap = new Map();
  const usedSlugs = new Set();

  headings.forEach((heading) => {
    const baseSlug = generateSlug(heading.textContent);
    const uniqueSlug = generateUniqueSlug(baseSlug, usedSlugs);

    slugMap.set(heading, uniqueSlug);
    usedSlugs.add(uniqueSlug);
  });

  return slugMap;
}
