import { match, P } from 'ts-pattern';

// ========== ROUTE TYPES ==========
export type Route =
  | { type: 'root' }
  | { type: 'date'; date: string }
  | { type: 'conversation'; date: string; conversation: string };

// ========== ROUTE CONSTRUCTORS ==========
export const createRoute = {
  root: (): Route => ({ type: 'root' }),
  date: (date: string): Route => ({ type: 'date', date }),
  conversation: (date: string, conversation: string): Route => ({
    type: 'conversation',
    date,
    conversation,
  }),
};

// ========== ROUTE OPERATIONS ==========
export const parseSlug = (slug: string): Route =>
  match(slug)
    .with('', () => createRoute.root())
    .with(P.string.includes('/'), (s) => {
      const parts = s.split('/');
      return createRoute.conversation(parts[0]!, parts[1]!);
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
    .exhaustive();

export const routeToSlug = (route: Route): string =>
  match(route)
    .with({ type: 'root' }, () => '')
    .with({ type: 'date' }, ({ date }) => date)
    .with(
      { type: 'conversation' },
      ({ date, conversation }) => `${date}/${conversation}`
    )
    .exhaustive();

export const routeToTreeText = (route: Route): string =>
  match(route)
    .with({ type: 'root' }, () => 'Home/')
    .with({ type: 'date' }, ({ date }) => `${date}/`)
    .with({ type: 'conversation' }, ({ conversation }) => conversation)
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
