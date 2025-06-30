import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { Entry } from './utils';

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

  if (!Entry.isConversation(entry)) {
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
  const indexEntries = allEntries.filter(
    (entry) => !Entry.isConversation(entry)
  );
  const sorted = Entry.sort(indexEntries);

  const currentIndex = sorted.findIndex(
    (entry) => entry.slug === currentEntry.slug
  );

  return {
    prevUrl:
      currentIndex > 0
        ? `/${Entry.parse(sorted[currentIndex - 1]).date}/`
        : undefined,
    nextUrl:
      currentIndex < sorted.length - 1
        ? `/${Entry.parse(sorted[currentIndex + 1]).date}/`
        : undefined,
    parentUrl: '/',
  };
}

function getWithinDirectoryNavigation(
  currentEntry: CollectionEntry<'daily'>,
  allEntries: CollectionEntry<'daily'>[]
): NavigationContext {
  const { date: parentDirectory } = Entry.parse(currentEntry);

  const siblings = allEntries.filter((entry) => {
    const { date } = Entry.parse(entry);
    return date === parentDirectory && Entry.isConversation(entry);
  });

  const sorted = Entry.sort(siblings);
  const currentIndex = sorted.findIndex(
    (entry) => entry.slug === currentEntry.slug
  );

  return {
    prevUrl:
      currentIndex > 0
        ? `/${parentDirectory}/${Entry.parse(sorted[currentIndex - 1]).filename}/`
        : undefined,
    nextUrl:
      currentIndex < sorted.length - 1
        ? `/${parentDirectory}/${Entry.parse(sorted[currentIndex + 1]).filename}/`
        : undefined,
    parentUrl: `/${parentDirectory}/`,
  };
}
