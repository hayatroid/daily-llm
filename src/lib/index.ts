/**
 * Main exports for the Daily LLM Conversations library
 * Provides unified access to all utilities and types
 */

// Filesystem exports
export {
  VirtualFS,
  isConversationFile,
  extractDateFromPath,
} from './filesystem';
export type { FileSystem, TreeNode, Content } from './filesystem';

// Content processing exports
export {
  processConversation,
  extractFrontmatter,
  parseMarkdown,
  extractPreview,
  countExchanges,
  detectCodeBlocks,
} from './content';

// Navigation exports
export { generateNavigationContext, extractUniqueDates } from './navigation';

// Slug generation exports
export { generateSlug, generateUniqueSlug, processHeadingSlugs } from './slug';

// Type exports
export type {
  FrontmatterData,
  ProcessedContent,
  NavigationContext,
  SlugMap,
} from './types';
