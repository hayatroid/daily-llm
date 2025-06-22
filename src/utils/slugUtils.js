/**
 * Extract slug from a file path
 * @param {string} filePath - The file path (e.g., "/content/2024-01-01/001-conversation.md")
 * @returns {string} The slug (e.g., "001-conversation")
 */
export function extractSlugFromFile(filePath) {
  return filePath.split('/').pop()?.replace('.md', '') || '';
}

/**
 * Extract date from a file path
 * @param {string} filePath - The file path (e.g., "/content/2024-01-01/001-conversation.md")
 * @returns {string} The date (e.g., "2024-01-01")
 */
export function extractDateFromFile(filePath) {
  const pathParts = filePath.split('/');
  return pathParts[pathParts.length - 2] || '';
}

/**
 * Create conversation URL
 * @param {string} date - The date (e.g., "2024-01-01")
 * @param {string} slug - The conversation slug (e.g., "001-conversation")
 * @returns {string} The URL (e.g., "/2024-01-01/001-conversation/")
 */
export function createConversationUrl(date, slug) {
  return `/${date}/${slug}/`;
}

/**
 * Create date page URL
 * @param {string} date - The date (e.g., "2024-01-01")
 * @returns {string} The URL (e.g., "/2024-01-01/")
 */
export function createDateUrl(date) {
  return `/${date}/`;
}

/**
 * Check if a file is a summary file
 * @param {string} filePath - The file path
 * @returns {boolean} True if it's a summary file
 */
export function isSummaryFile(filePath) {
  return filePath.endsWith('summary.md');
}

/**
 * Check if a file is a conversation file (not a summary)
 * @param {string} filePath - The file path
 * @returns {boolean} True if it's a conversation file
 */
export function isConversationFile(filePath) {
  return filePath.endsWith('.md') && !isSummaryFile(filePath);
}

/**
 * Extract conversation number from filename
 * @param {string} filename - The filename (e.g., "001-conversation.md")
 * @returns {number} The conversation number (e.g., 1)
 */
export function extractConversationNumber(filename) {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 0;
}
