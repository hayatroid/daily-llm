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
    const isConversation = entry.slug.includes('/');

    let filteredEntries: CollectionEntry<'daily'>[];
    let parentUrl: string;
    let urlBuilder: (entry: CollectionEntry<'daily'>) => string;

    if (isConversation) {
      const { date } = Entry.parse(entry);
      filteredEntries = allEntries.filter((e: CollectionEntry<'daily'>) => {
        const { date: eDate } = Entry.parse(e);
        return eDate === date && e.slug.includes('/');
      });
      parentUrl = `/${date}/`;
      urlBuilder = (e: CollectionEntry<'daily'>) =>
        `/${date}/${Entry.parse(e).conversation}/`;
    } else {
      filteredEntries = allEntries.filter(
        (e: CollectionEntry<'daily'>) => !e.slug.includes('/')
      );
      parentUrl = '/';
      urlBuilder = (e: CollectionEntry<'daily'>) => `/${e.slug}/`;
    }

    const sorted = filteredEntries.sort((a, b) => a.slug.localeCompare(b.slug));
    const currentIndex = sorted.findIndex((e) => e.slug === entry.slug);

    const prevEntry = currentIndex > 0 ? sorted[currentIndex - 1] : undefined;
    const nextEntry =
      currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : undefined;

    return {
      prevUrl: prevEntry ? urlBuilder(prevEntry) : undefined,
      nextUrl: nextEntry ? urlBuilder(nextEntry) : undefined,
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
        if (date && !grouped.has(date)) grouped.set(date, []);
        if (date) grouped.get(date)!.push(entry);
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
        const { conversation } = Entry.parse(conv);
        if (conversation) {
          items.push({
            level,
            href: `/${date}/${conversation}/`,
            text: conv.data.title || conversation,
          });
        }
      });
    };

    const items: TreeItem[] = [];

    if (slug === '') {
      items.push({ level: 0, href: '/', text: 'Home/' });
      const entriesByDate = groupByDate(entries);

      Array.from(entriesByDate.keys())
        .sort((a, b) => b.localeCompare(a))
        .forEach((date) => {
          const conversations = entriesByDate
            .get(date)!
            .filter((entry) => entry.slug.includes('/'));
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
      entries
        .filter((entry) => entry.slug.includes('/'))
        .forEach((entry) => {
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
        (entry) => entry.slug.includes('/') && entry.data.tags?.includes(tag)
      );
      const entriesByDate = groupByDate(taggedEntries);

      Array.from(entriesByDate.keys())
        .sort((a, b) => b.localeCompare(a))
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
        return date === slug && entry.slug.includes('/');
      });
      addConversations(items, conversations, slug, 1);
    }

    return items;
  },
};
