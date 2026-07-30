import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Explicit collection definitions — suppresses Astro's deprecated
 * auto-generation warning. Content is read via Keystatic's reader API,
 * so no Zod schemas are needed here.
 */

const activities = defineCollection({
  loader: glob({ pattern: '*.mdx', base: 'src/content/activities' }),
});

const legal = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/legal' }),
});

const settings = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/settings' }),
});

export const collections = {
  activities,
  legal,
  settings,
};
