import type { CollectionEntry } from 'astro:content';
import { Entry } from './utils';

export interface TreeItem {
  level: number;
  href: string;
  text: string;
  meta?: string;
}

export interface TreeBuilderOptions {
  entries: CollectionEntry<'daily'>[];
  path: string;
}

// Pure data processing utilities
export const TreeData = {
  // Group entries by date
  groupByDate(
    entries: CollectionEntry<'daily'>[]
  ): Map<string, CollectionEntry<'daily'>[]> {
    const entriesByDate = new Map<string, CollectionEntry<'daily'>[]>();
    entries.forEach((entry) => {
      const { date } = Entry.parse(entry);
      if (!entriesByDate.has(date)) {
        entriesByDate.set(date, []);
      }
      entriesByDate.get(date)!.push(entry);
    });
    return entriesByDate;
  },

  // Count tags across conversation entries
  countTags(entries: CollectionEntry<'daily'>[]): Map<string, number> {
    const tagCounts = new Map<string, number>();
    entries.filter(Entry.isConversation).forEach((entry) => {
      if (entry.data.tags && Array.isArray(entry.data.tags)) {
        entry.data.tags.forEach((tag: string) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
    });
    return tagCounts;
  },

  // Filter entries by specific tag
  filterByTag(
    entries: CollectionEntry<'daily'>[],
    tag: string
  ): CollectionEntry<'daily'>[] {
    return entries.filter((entry) => {
      if (!Entry.isConversation(entry)) return false;
      return (
        entry.data.tags &&
        Array.isArray(entry.data.tags) &&
        entry.data.tags.includes(tag)
      );
    });
  },

  // Get conversations for a specific date
  getConversationsForDate(
    entries: CollectionEntry<'daily'>[],
    date: string
  ): CollectionEntry<'daily'>[] {
    return entries.filter((entry) => {
      const { date: entryDate } = Entry.parse(entry);
      return entryDate === date && Entry.isConversation(entry);
    });
  },
};

// Tree building strategies
export const TreeBuilder = {
  // Build home tree (all dates with conversations)
  buildHomeTree(entries: CollectionEntry<'daily'>[]): TreeItem[] {
    const items: TreeItem[] = [];
    const entriesByDate = TreeData.groupByDate(entries);
    const sortedDates = Array.from(entriesByDate.keys()).sort().reverse();

    items.push({
      level: 0,
      href: '/',
      text: 'Home/',
    });

    sortedDates.forEach((date) => {
      const dateEntries = entriesByDate.get(date)!;
      const conversations = dateEntries.filter(Entry.isConversation);

      items.push({
        level: 1,
        href: `/${date}/`,
        text: `${date}/`,
        meta:
          conversations.length > 0
            ? `${conversations.length} conversations`
            : undefined,
      });

      conversations.forEach((conversation) => {
        const { filename } = Entry.parse(conversation);
        items.push({
          level: 2,
          href: `/${date}/${filename}/`,
          text: conversation.data.title || filename,
        });
      });
    });

    return items;
  },

  // Build date-specific tree (conversations within a date)
  buildDateTree(entries: CollectionEntry<'daily'>[], date: string): TreeItem[] {
    const items: TreeItem[] = [];
    const conversations = TreeData.getConversationsForDate(entries, date);

    items.push({
      level: 0,
      href: `/${date}/`,
      text: `${date}/`,
    });

    conversations.forEach((conversation) => {
      const { filename } = Entry.parse(conversation);
      items.push({
        level: 1,
        href: `/${date}/${filename}/`,
        text: conversation.data.title || filename,
      });
    });

    return items;
  },

  // Build tags index tree (all tags with counts)
  buildTagsTree(entries: CollectionEntry<'daily'>[]): TreeItem[] {
    const items: TreeItem[] = [];
    const tagCounts = TreeData.countTags(entries);
    const sortedTags = Array.from(tagCounts.keys()).sort();

    items.push({
      level: 0,
      href: '/tags/',
      text: 'tags/',
    });

    sortedTags.forEach((tag) => {
      const count = tagCounts.get(tag)!;
      items.push({
        level: 1,
        href: `/tags/${tag}/`,
        text: `${tag}/`,
        meta: `${count} conversations`,
      });
    });

    return items;
  },

  // Build tag-specific tree (conversations for a tag, grouped by date)
  buildTagTree(entries: CollectionEntry<'daily'>[], tag: string): TreeItem[] {
    const items: TreeItem[] = [];
    const taggedEntries = TreeData.filterByTag(entries, tag);
    const entriesByDate = TreeData.groupByDate(taggedEntries);
    const sortedDates = Array.from(entriesByDate.keys()).sort().reverse();

    items.push({
      level: 0,
      href: `/tags/${tag}/`,
      text: `tags/${tag}/`,
    });

    sortedDates.forEach((date) => {
      const conversations = entriesByDate.get(date)!;

      items.push({
        level: 1,
        href: `/${date}/`,
        text: `${date}/`,
        meta: `${conversations.length} conversations`,
      });

      conversations.forEach((conversation) => {
        const { filename } = Entry.parse(conversation);
        items.push({
          level: 2,
          href: `/${date}/${filename}/`,
          text: conversation.data.title || filename,
        });
      });
    });

    return items;
  },
};

// Main tree factory function
export function buildTree(options: TreeBuilderOptions): TreeItem[] {
  const { entries, path } = options;

  if (path === '/') {
    return TreeBuilder.buildHomeTree(entries);
  } else if (path === '/tags') {
    return TreeBuilder.buildTagsTree(entries);
  } else if (path.startsWith('/tags/')) {
    const tag = path.replace(/^\/tags\/|\/$/g, '');
    return TreeBuilder.buildTagTree(entries, tag);
  } else {
    // Date-specific path like "/2024-01-15"
    const date = path.replace(/^\/|\/$/g, '');
    return TreeBuilder.buildDateTree(entries, date);
  }
}
