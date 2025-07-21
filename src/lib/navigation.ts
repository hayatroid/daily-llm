import { type CollectionEntry } from 'astro:content';
import { match } from 'ts-pattern';
import {
  parseSlug,
  parseUrlPath,
  routeToUrl,
  isConversationRoute,
  hasDateField,
  createRoute,
  routeToTreeText,
} from './routes';

// ========== TYPES ==========
export interface Breadcrumb {
  text: string;
  href: string;
}

export interface TreeNode {
  level: number;
  text: string;
  href: string;
  gem?: boolean;
}

// ========== BREADCRUMBS ==========
export const Breadcrumbs = {
  create: (path: string): Breadcrumb[] => {
    const route = parseUrlPath(path);
    const homeBreadcrumb = {
      text: 'Home',
      href: routeToUrl(createRoute.root()),
    };

    return match(route)
      .with({ type: 'root' }, () => [homeBreadcrumb])
      .with({ type: 'date' }, ({ date }) => [
        homeBreadcrumb,
        {
          text: date,
          href: routeToUrl(createRoute.date(date)),
        },
      ])
      .with({ type: 'conversation' }, ({ date, conversation }) => [
        homeBreadcrumb,
        {
          text: date,
          href: routeToUrl(createRoute.date(date)),
        },
        {
          text: conversation,
          href: routeToUrl(createRoute.conversation(date, conversation)),
        },
      ])
      .exhaustive();
  },
};

// ========== TREE ==========
export const Tree = {
  build: (entries: CollectionEntry<'daily'>[], slug: string): TreeNode[] => {
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
      items: TreeNode[],
      conversations: CollectionEntry<'daily'>[],
      level: number
    ) => {
      // Display conversations in reverse order (newest first)
      conversations.reverse().forEach((conv) => {
        const convRoute = parseSlug(conv.slug);
        if (isConversationRoute(convRoute)) {
          items.push({
            level,
            text: conv.data.title,
            href: routeToUrl(convRoute),
            gem: conv.data.gem,
          });
        }
      });
    };

    return match(route)
      .with({ type: 'root' }, () => {
        const items: TreeNode[] = [
          {
            level: 0,
            text: routeToTreeText(createRoute.root()),
            href: routeToUrl(createRoute.root()),
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
              text: routeToTreeText(createRoute.date(date)),
              href: routeToUrl(createRoute.date(date)),
            });
            addConversations(items, conversations, 2);
          });
        return items;
      })
      .with({ type: 'date' }, ({ date }) => {
        const items: TreeNode[] = [
          {
            level: 0,
            text: routeToTreeText(createRoute.date(date)),
            href: routeToUrl(createRoute.date(date)),
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
        const items: TreeNode[] = [
          {
            level: 0,
            text: routeToTreeText(createRoute.date(date)),
            href: routeToUrl(createRoute.date(date)),
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
