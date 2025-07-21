import { getCollection } from 'astro:content';
import * as R from 'remeda';
import { parseSlug, isDateRoute, isConversationRoute } from './routes';

// ========== STATIC PATHS ==========
export const StaticPaths = {
  getDates: async () => {
    const entries = await getCollection('daily');
    return R.pipe(
      entries,
      R.map((entry) => parseSlug(entry.slug)),
      R.filter(isDateRoute),
      R.map(({ date }) => ({ params: { date } })),
      R.unique()
    );
  },

  getConversations: async () => {
    const entries = await getCollection('daily');
    return R.pipe(
      entries,
      R.map((entry) => parseSlug(entry.slug)),
      R.filter(isConversationRoute),
      R.map(({ date, conversation }) => ({ params: { date, conversation } })),
      R.unique()
    );
  },
};
