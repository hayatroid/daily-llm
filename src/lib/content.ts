import { getCollection } from 'astro:content';
import * as R from 'remeda';
import {
  parseSlug,
  isDateRoute,
  isConversationRoute,
  hasDateField,
} from './routes';

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

  getTags: async () => {
    const entries = await getCollection('daily');
    return R.pipe(
      entries,
      R.filter((entry) => hasDateField(parseSlug(entry.slug))),
      R.flatMap((entry) => entry.data.tags),
      R.unique(),
      R.map((tag) => ({ params: { tag } }))
    );
  },
};
