import { match, P } from 'ts-pattern';

// ========== ROUTE TYPES ==========
export type Route =
  | { type: 'root' }
  | { type: 'date'; date: string }
  | { type: 'conversation'; date: string; conversation: string }
  | { type: 'tags' }
  | { type: 'tag'; tag: string };

// ========== ROUTE CONSTRUCTORS ==========
export const createRoute = {
  root: (): Route => ({ type: 'root' }),
  date: (date: string): Route => ({ type: 'date', date }),
  conversation: (date: string, conversation: string): Route => ({
    type: 'conversation',
    date,
    conversation,
  }),
  tags: (): Route => ({ type: 'tags' }),
  tag: (tag: string): Route => ({ type: 'tag', tag }),
};

// ========== ROUTE OPERATIONS ==========
export const parseSlug = (slug: string): Route =>
  match(slug)
    .with('', () => createRoute.root())
    .with('tags', () => createRoute.tags())
    .with(P.string.startsWith('tags/'), (s) => createRoute.tag(s.slice(5)))
    .with(P.string.includes('/'), (s) => {
      const parts = s.split('/');
      const date = parts[0] || '';
      const conversation = parts[1] || '';
      return createRoute.conversation(date, conversation);
    })
    .otherwise((s) => createRoute.date(s));

export const parseUrlPath = (path: string): Route => {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  return parseSlug(cleanPath);
};

export const routeToUrl = (route: Route): string =>
  match(route)
    .with({ type: 'root' }, () => '/')
    .with({ type: 'date' }, ({ date }) => `/${date}/`)
    .with(
      { type: 'conversation' },
      ({ date, conversation }) => `/${date}/${conversation}/`
    )
    .with({ type: 'tags' }, () => '/tags/')
    .with({ type: 'tag' }, ({ tag }) => `/tags/${tag}/`)
    .exhaustive();

export const routeToSlug = (route: Route): string =>
  match(route)
    .with({ type: 'root' }, () => '')
    .with({ type: 'date' }, ({ date }) => date)
    .with(
      { type: 'conversation' },
      ({ date, conversation }) => `${date}/${conversation}`
    )
    .with({ type: 'tags' }, () => 'tags')
    .with({ type: 'tag' }, ({ tag }) => `tags/${tag}`)
    .exhaustive();

export const getParentUrl = (route: Route): string =>
  match(route)
    .with({ type: 'root' }, () => '/')
    .with({ type: 'date' }, () => '/')
    .with({ type: 'conversation' }, ({ date }) => `/${date}/`)
    .with({ type: 'tags' }, () => '/')
    .with({ type: 'tag' }, () => '/tags/')
    .exhaustive();

// ========== TYPE GUARDS ==========
export const isConversationRoute = (
  route: Route
): route is { type: 'conversation'; date: string; conversation: string } =>
  match(route)
    .with({ type: 'conversation' }, () => true)
    .otherwise(() => false);

export const isDateRoute = (
  route: Route
): route is { type: 'date'; date: string } =>
  match(route)
    .with({ type: 'date' }, () => true)
    .otherwise(() => false);

export const hasDateField = (
  route: Route
): route is
  | { type: 'date'; date: string }
  | { type: 'conversation'; date: string; conversation: string } =>
  match(route)
    .with({ type: 'date' }, () => true)
    .with({ type: 'conversation' }, () => true)
    .otherwise(() => false);
