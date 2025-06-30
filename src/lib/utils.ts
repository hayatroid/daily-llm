import type { CollectionEntry } from 'astro:content';

interface EntryPath {
  date: string;
  filename?: string;
}

function parseSlug(slug: string): EntryPath {
  const [date, filename] = slug.split('/');
  return { date, filename };
}

export const Entry = {
  parse: (entry: CollectionEntry<'daily'>): EntryPath => parseSlug(entry.slug),
  isConversation: (entry: CollectionEntry<'daily'>): boolean =>
    entry.slug.includes('/'),
  getDates: (entries: CollectionEntry<'daily'>[]): string[] =>
    [...new Set(entries.map((e) => parseSlug(e.slug).date))].sort(),
  sort: (entries: CollectionEntry<'daily'>[]): CollectionEntry<'daily'>[] =>
    entries.sort((a, b) => a.slug.localeCompare(b.slug)),
};
