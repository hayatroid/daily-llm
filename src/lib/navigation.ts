import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import {
  isIndexEntry,
  isConversationEntry,
  extractDate,
  extractFilename,
  sortConversationsByFilename,
} from './entry-utils';

export interface NavigationContext {
  prevUrl?: string;
  nextUrl?: string;
  parentUrl: string;
}

// Convert path to slug for Content Collections
function pathToSlug(path: string): string {
  const cleanPath = path.replace(/^\/|\/$/g, '');
  return cleanPath || 'index';
}

// Royal road navigation: automatically determine navigation based on directory structure
export async function getNavigationForPath(
  path: string
): Promise<NavigationContext> {
  const slug = pathToSlug(path);
  const entry = await getEntry('daily', slug);

  if (!entry) {
    throw new Error(`Content not found for path: ${path} (slug: ${slug})`);
  }

  const allEntries = await getCollection('daily');

  if (isIndexEntry(entry)) {
    // For index.md: navigate between directories
    return getDirectoryNavigation(entry, allEntries);
  } else {
    // For content files: navigate within directory siblings
    return getWithinDirectoryNavigation(entry, allEntries);
  }
}

function getDirectoryNavigation(
  currentEntry: CollectionEntry<'daily'>,
  allEntries: CollectionEntry<'daily'>[]
): NavigationContext {
  // Get all directory representatives (index.md files)
  const indexEntries = allEntries.filter(isIndexEntry);
  const sortedByDate = indexEntries.sort((a, b) =>
    extractDate(a).localeCompare(extractDate(b))
  );

  const currentIndex = sortedByDate.findIndex(
    (entry) => entry.slug === currentEntry.slug
  );

  return {
    prevUrl:
      currentIndex > 0
        ? `/${extractDate(sortedByDate[currentIndex - 1])}/`
        : undefined,
    nextUrl:
      currentIndex < sortedByDate.length - 1
        ? `/${extractDate(sortedByDate[currentIndex + 1])}/`
        : undefined,
    parentUrl: '/',
  };
}

function getWithinDirectoryNavigation(
  currentEntry: CollectionEntry<'daily'>,
  allEntries: CollectionEntry<'daily'>[]
): NavigationContext {
  const parentDirectory = extractDate(currentEntry);

  // Get all content files in same directory (excluding index.md)
  const siblings = allEntries.filter(
    (entry) =>
      extractDate(entry) === parentDirectory && isConversationEntry(entry)
  );

  const sortedSiblings = sortConversationsByFilename(siblings);
  const currentIndex = sortedSiblings.findIndex(
    (entry) => entry.slug === currentEntry.slug
  );

  return {
    prevUrl:
      currentIndex > 0
        ? `/${parentDirectory}/${extractFilename(sortedSiblings[currentIndex - 1])}/`
        : undefined,
    nextUrl:
      currentIndex < sortedSiblings.length - 1
        ? `/${parentDirectory}/${extractFilename(sortedSiblings[currentIndex + 1])}/`
        : undefined,
    parentUrl: `/${parentDirectory}/`,
  };
}
