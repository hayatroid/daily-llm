import { getCollection, type CollectionEntry } from 'astro:content';
import { Entry } from './utils';

// Static path generation utilities
export const StaticPaths = {
  // Generate date-based paths
  async getDates() {
    const allEntries = await getCollection('daily');
    const dates = Entry.getDates(allEntries);

    return dates.map((date) => ({
      params: { date },
    }));
  },

  // Generate conversation paths
  async getConversations() {
    const allEntries = await getCollection('daily');
    const conversations = allEntries.filter(Entry.isConversation);

    return conversations.map((entry: CollectionEntry<'daily'>) => {
      const { date, filename } = Entry.parse(entry);
      return {
        params: {
          date,
          conversation: filename,
        },
      };
    });
  },

  // Generate tag paths
  async getTags() {
    const allEntries = await getCollection('daily');

    // Extract unique tags
    const allTags = new Set<string>();
    allEntries
      .filter(Entry.isConversation)
      .forEach((entry: CollectionEntry<'daily'>) => {
        if (entry.data.tags && Array.isArray(entry.data.tags)) {
          entry.data.tags.forEach((tag: string) => allTags.add(tag));
        }
      });

    return Array.from(allTags).map((tag) => ({
      params: { tag },
    }));
  },
};
