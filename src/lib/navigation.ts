import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { Entry } from './content';

// ========== TYPES ==========
export interface NavigationContext {
  prevUrl?: string;
  nextUrl?: string;
  parentUrl: string;
}

export interface Breadcrumb {
  label: string;
  href: string;
  current: boolean;
}

export interface TreeItem {
  level: number;
  href: string;
  text: string;
  meta?: string;
}

// ========== NAVIGATION ==========
export const Navigation = {
  getContext: async (slug: string): Promise<NavigationContext> => {
    const entry = await getEntry('daily', slug);
    if (!entry) throw new Error(`Content not found for slug: ${slug}`);

    const allEntries = await getCollection('daily');
    const isConversation = Entry.isConversation(entry);

    let filteredEntries: CollectionEntry<'daily'>[];
    let parentUrl: string;
    let urlBuilder: (entry: CollectionEntry<'daily'>) => string;

    if (isConversation) {
      const { date } = Entry.parse(entry);
      filteredEntries = allEntries.filter((e: CollectionEntry<'daily'>) => {
        const { date: eDate } = Entry.parse(e);
        return eDate === date && Entry.isConversation(e);
      });
      parentUrl = `/${date}/`;
      urlBuilder = (e: CollectionEntry<'daily'>) =>
        `/${date}/${Entry.parse(e).filename}/`;
    } else {
      filteredEntries = allEntries.filter(
        (e: CollectionEntry<'daily'>) => !Entry.isConversation(e)
      );
      parentUrl = '/';
      urlBuilder = (e: CollectionEntry<'daily'>) => `/${Entry.parse(e).date}/`;
    }

    const sorted = Entry.sort(filteredEntries);
    const currentIndex = sorted.findIndex((e) => e.slug === entry.slug);

    return {
      prevUrl:
        currentIndex > 0 ? urlBuilder(sorted[currentIndex - 1]) : undefined,
      nextUrl:
        currentIndex < sorted.length - 1
          ? urlBuilder(sorted[currentIndex + 1])
          : undefined,
      parentUrl,
    };
  },
};

// ========== BREADCRUMBS ==========
export const Breadcrumbs = {
  create: (path: string): Breadcrumb[] => {
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Home', href: '/', current: path === '/' },
    ];

    if (path === '/') return breadcrumbs;

    const parts = path.split('/').filter(Boolean);
    let currentPath = '';

    parts.forEach((part, i) => {
      currentPath += '/' + part;
      const isLast = i === parts.length - 1;

      if (part === 'tags') {
        breadcrumbs.push({
          label: 'tags',
          href: '/tags/',
          current: isLast,
        });
      } else if (parts[0] === 'tags' && i === 1) {
        breadcrumbs.push({
          label: part,
          href: `/tags/${encodeURIComponent(part)}/`,
          current: isLast,
        });
      } else {
        breadcrumbs.push({
          label: part,
          href: currentPath + '/',
          current: isLast,
        });
      }
    });

    return breadcrumbs;
  },
};

// ========== TREE ==========
export const Tree = {
  build: (entries: CollectionEntry<'daily'>[], slug: string): TreeItem[] => {
    const groupByDate = (entries: CollectionEntry<'daily'>[]) => {
      const grouped = new Map<string, CollectionEntry<'daily'>[]>();
      entries.forEach((entry) => {
        const { date } = Entry.parse(entry);
        if (!grouped.has(date)) grouped.set(date, []);
        grouped.get(date)!.push(entry);
      });
      return grouped;
    };

    const addConversations = (
      items: TreeItem[],
      conversations: CollectionEntry<'daily'>[],
      date: string,
      level: number
    ) => {
      conversations.forEach((conv) => {
        const { filename } = Entry.parse(conv);
        items.push({
          level,
          href: `/${date}/${filename}/`,
          text: conv.data.title || filename,
        });
      });
    };

    const items: TreeItem[] = [];

    if (slug === '') {
      items.push({ level: 0, href: '/', text: 'Home/' });
      const entriesByDate = groupByDate(entries);

      Array.from(entriesByDate.keys())
        .sort()
        .reverse()
        .forEach((date) => {
          const conversations = entriesByDate
            .get(date)!
            .filter(Entry.isConversation);
          items.push({
            level: 1,
            href: `/${date}/`,
            text: `${date}/`,
            meta:
              conversations.length > 0
                ? `${conversations.length} conversations`
                : undefined,
          });
          addConversations(items, conversations, date, 2);
        });
    } else if (slug === 'tags') {
      items.push({ level: 0, href: '/tags/', text: 'tags/' });

      const tagCounts = new Map<string, number>();
      entries.filter(Entry.isConversation).forEach((entry) => {
        entry.data.tags?.forEach((tag: string) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

      Array.from(tagCounts.keys())
        .sort()
        .forEach((tag) => {
          items.push({
            level: 1,
            href: `/tags/${tag}/`,
            text: `${tag}/`,
            meta: `${tagCounts.get(tag)} conversations`,
          });
        });
    } else if (slug.startsWith('tags/')) {
      const tag = slug.slice(5);
      items.push({ level: 0, href: `/tags/${tag}/`, text: `tags/${tag}/` });

      const taggedEntries = entries.filter(
        (entry) => Entry.isConversation(entry) && entry.data.tags?.includes(tag)
      );
      const entriesByDate = groupByDate(taggedEntries);

      Array.from(entriesByDate.keys())
        .sort()
        .reverse()
        .forEach((date) => {
          const conversations = entriesByDate.get(date)!;
          items.push({
            level: 1,
            href: `/${date}/`,
            text: `${date}/`,
            meta: `${conversations.length} conversations`,
          });
          addConversations(items, conversations, date, 2);
        });
    } else {
      items.push({ level: 0, href: `/${slug}/`, text: `${slug}/` });

      const conversations = entries.filter((entry) => {
        const { date } = Entry.parse(entry);
        return date === slug && Entry.isConversation(entry);
      });
      addConversations(items, conversations, slug, 1);
    }

    return items;
  },
};
