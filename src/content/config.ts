import { defineCollection, z } from 'astro:content';

const daily = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    time: z.string().optional(), // Used in Tree/TagTree for metadata
    date: z.string().optional(), // Optional date field for future use
  }),
});

export const collections = {
  daily,
};
