/**
 * Content Collections entry utilities
 * Provides common functionality for processing daily entries
 */
import type { CollectionEntry } from 'astro:content';

/**
 * Check if entry is an index file (no slash in slug)
 */
export function isIndexEntry(entry: CollectionEntry<'daily'>): boolean {
  return !entry.slug.includes('/');
}

/**
 * Check if entry is a conversation file (has slash in slug)
 */
export function isConversationEntry(entry: CollectionEntry<'daily'>): boolean {
  return entry.slug.includes('/');
}

/**
 * Extract date from entry slug
 */
export function extractDate(entry: CollectionEntry<'daily'>): string {
  return entry.slug.split('/')[0];
}

/**
 * Extract filename from entry slug
 */
export function extractFilename(entry: CollectionEntry<'daily'>): string {
  const parts = entry.slug.split('/');
  return parts[1] || 'index';
}

/**
 * Create URL from entry
 */
export function createEntryUrl(entry: CollectionEntry<'daily'>): string {
  return `/${entry.slug}/`;
}

/**
 * Sort conversations by filename (001-, 002-, etc.)
 */
export function sortConversationsByFilename(
  conversations: CollectionEntry<'daily'>[]
): CollectionEntry<'daily'>[] {
  return conversations.sort((a, b) => {
    const aNum = parseInt(extractFilename(a).split('-')[0] || '0');
    const bNum = parseInt(extractFilename(b).split('-')[0] || '0');
    return aNum - bNum;
  });
}

/**
 * Get all conversation entries for a specific date
 */
export function getConversationsForDate(
  entries: CollectionEntry<'daily'>[],
  date: string
): CollectionEntry<'daily'>[] {
  return entries.filter(
    (entry) => isConversationEntry(entry) && extractDate(entry) === date
  );
}

/**
 * Extract all unique dates from entries
 */
export function extractUniqueDates(
  entries: CollectionEntry<'daily'>[]
): string[] {
  const dates = new Set<string>();
  entries.forEach((entry) => {
    dates.add(extractDate(entry));
  });
  return Array.from(dates).sort();
}
