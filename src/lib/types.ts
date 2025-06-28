/**
 * Shared type definitions for the Daily LLM Conversations application
 */

// Frontmatter data structure for content files
export interface FrontmatterData {
  title: string;
  tags: string[];
  description: string;
  date?: string;
  time?: string;
  [key: string]: any;
}

// Processed conversation content with metadata
export interface ProcessedContent {
  title: string;
  date?: string;
  time?: string;
  tags: string[];
  preview: string;
  exchangeCount: number;
  hasCode: boolean;
  fullContent: string;
}

// Navigation context for date-based navigation
export interface NavigationContext {
  availableDates: string[];
  previousDate: string | null;
  nextDate: string | null;
  totalDates: number;
  currentPosition: number;
  isFirstDate: boolean;
  isLastDate: boolean;
}

// Slug mapping for heading anchors
export interface SlugMap extends Map<Element, string> {}
