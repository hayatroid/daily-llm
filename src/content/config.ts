import { defineCollection, z } from 'astro:content';

const daily = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    gem: z.boolean().default(false),
    description: z.string(),
  }),
});

export const collections = {
  daily,
};
