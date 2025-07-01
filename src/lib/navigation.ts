import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { match } from 'ts-pattern';
import {
  parseSlug,
  parseUrlPath,
  routeToUrl,
  getParentUrl,
  isConversationRoute,
  isDateRoute,
  hasDateField,
  createRoute,
  routeToTreeText,
} from './routes';

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
    const currentRoute = parseSlug(entry.slug);

    const { filteredEntries, parentUrl, urlBuilder } = match(currentRoute)
      .with({ type: 'conversation' }, (route) => ({
        filteredEntries: allEntries.filter((e) => {
          const entryRoute = parseSlug(e.slug);
          return (
            isConversationRoute(entryRoute) && entryRoute.date === route.date
          );
        }),
        parentUrl: getParentUrl(route),
        urlBuilder: (e: CollectionEntry<'daily'>) =>
          routeToUrl(parseSlug(e.slug)),
      }))
      .with({ type: 'date' }, (route) => ({
        filteredEntries: allEntries.filter((e) =>
          isDateRoute(parseSlug(e.slug))
        ),
        parentUrl: getParentUrl(route),
        urlBuilder: (e: CollectionEntry<'daily'>) =>
          routeToUrl(parseSlug(e.slug)),
      }))
      .otherwise((route) => ({
        filteredEntries: [] as CollectionEntry<'daily'>[],
        parentUrl: getParentUrl(route),
        urlBuilder: (e: CollectionEntry<'daily'>) =>
          routeToUrl(parseSlug(e.slug)),
      }));

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
    const route = parseUrlPath(path);
    const homeBreadcrumb = {
      label: 'Home',
      href: routeToUrl(createRoute.root()),
      current: route.type === 'root',
    };

    return match(route)
      .with({ type: 'root' }, () => [homeBreadcrumb])
      .with({ type: 'date' }, ({ date }) => [
        homeBreadcrumb,
        {
          label: date,
          href: routeToUrl(createRoute.date(date)),
          current: true,
        },
      ])
      .with({ type: 'conversation' }, ({ date, conversation }) => [
        homeBreadcrumb,
        {
          label: date,
          href: routeToUrl(createRoute.date(date)),
          current: false,
        },
        {
          label: conversation,
          href: routeToUrl(createRoute.conversation(date, conversation)),
          current: true,
        },
      ])
      .with({ type: 'tags' }, () => [
        homeBreadcrumb,
        { label: 'tags', href: routeToUrl(createRoute.tags()), current: true },
      ])
      .with({ type: 'tag' }, ({ tag }) => [
        homeBreadcrumb,
        { label: 'tags', href: routeToUrl(createRoute.tags()), current: false },
        {
          label: tag,
          href: routeToUrl(createRoute.tag(tag)),
          current: true,
        },
      ])
      .exhaustive();
  },
};

// ========== TREE ==========
export const Tree = {
  build: (entries: CollectionEntry<'daily'>[], slug: string): TreeItem[] => {
    const route = parseSlug(slug);

    const groupByDate = (entries: CollectionEntry<'daily'>[]) => {
      const grouped = new Map<string, CollectionEntry<'daily'>[]>();
      entries.forEach((entry) => {
        const entryRoute = parseSlug(entry.slug);
        if (hasDateField(entryRoute)) {
          if (!grouped.has(entryRoute.date)) grouped.set(entryRoute.date, []);
          grouped.get(entryRoute.date)!.push(entry);
        }
      });
      return grouped;
    };

    const addConversations = (
      items: TreeItem[],
      conversations: CollectionEntry<'daily'>[],
      level: number
    ) => {
      conversations.forEach((conv) => {
        const convRoute = parseSlug(conv.slug);
        if (isConversationRoute(convRoute)) {
          items.push({
            level,
            href: routeToUrl(convRoute),
            text: conv.data.title,
          });
        }
      });
    };

    return match(route)
      .with({ type: 'root' }, () => {
        const items: TreeItem[] = [
          {
            level: 0,
            href: routeToUrl(createRoute.root()),
            text: routeToTreeText(createRoute.root()),
          },
        ];
        const entriesByDate = groupByDate(entries);

        Array.from(entriesByDate.keys())
          .sort((a, b) => b.localeCompare(a))
          .forEach((date) => {
            const conversations = entriesByDate
              .get(date)!
              .filter((entry) => isConversationRoute(parseSlug(entry.slug)));
            items.push({
              level: 1,
              href: routeToUrl(createRoute.date(date)),
              text: routeToTreeText(createRoute.date(date)),
              meta:
                conversations.length > 0
                  ? `${conversations.length} conversations`
                  : undefined,
            });
            addConversations(items, conversations, 2);
          });
        return items;
      })
      .with({ type: 'tags' }, () => {
        const items: TreeItem[] = [
          {
            level: 0,
            href: routeToUrl(createRoute.tags()),
            text: routeToTreeText(createRoute.tags()),
          },
        ];
        const tagCounts = new Map<string, number>();

        entries
          .filter((entry) => isConversationRoute(parseSlug(entry.slug)))
          .forEach((entry) => {
            entry.data.tags.forEach((tag: string) => {
              tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
          });

        Array.from(tagCounts.keys())
          .sort()
          .forEach((tag) => {
            items.push({
              level: 1,
              href: routeToUrl(createRoute.tag(tag)),
              text: routeToTreeText(createRoute.tag(tag)),
              meta: `${tagCounts.get(tag)} conversations`,
            });
          });
        return items;
      })
      .with({ type: 'tag' }, ({ tag }) => {
        const items: TreeItem[] = [
          {
            level: 0,
            href: routeToUrl(createRoute.tag(tag)),
            text: routeToTreeText(createRoute.tag(tag)),
          },
        ];
        const taggedEntries = entries.filter((entry) => {
          const entryRoute = parseSlug(entry.slug);
          return (
            isConversationRoute(entryRoute) && entry.data.tags.includes(tag)
          );
        });
        const taggedEntriesByDate = groupByDate(taggedEntries);

        Array.from(taggedEntriesByDate.keys())
          .sort((a, b) => b.localeCompare(a))
          .forEach((date) => {
            const conversations = taggedEntriesByDate.get(date)!;
            items.push({
              level: 1,
              href: routeToUrl(createRoute.date(date)),
              text: routeToTreeText(createRoute.date(date)),
              meta: `${conversations.length} conversations`,
            });
            addConversations(items, conversations, 2);
          });
        return items;
      })
      .with({ type: 'date' }, ({ date }) => {
        const items: TreeItem[] = [
          {
            level: 0,
            href: routeToUrl(createRoute.date(date)),
            text: routeToTreeText(createRoute.date(date)),
          },
        ];
        const conversations = entries.filter((entry) => {
          const entryRoute = parseSlug(entry.slug);
          return isConversationRoute(entryRoute) && entryRoute.date === date;
        });
        addConversations(items, conversations, 1);
        return items;
      })
      .with({ type: 'conversation' }, ({ date }) => {
        const items: TreeItem[] = [
          {
            level: 0,
            href: routeToUrl(createRoute.date(date)),
            text: routeToTreeText(createRoute.date(date)),
          },
        ];
        const conversations = entries.filter((entry) => {
          const entryRoute = parseSlug(entry.slug);
          return isConversationRoute(entryRoute) && entryRoute.date === date;
        });
        addConversations(items, conversations, 1);
        return items;
      })
      .exhaustive();
  },
};
