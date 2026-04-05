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

const events = defineCollection({
  loader: glob({ pattern: '*.mdx', base: 'src/content/events' }),
});

const seminars = defineCollection({
  loader: glob({ pattern: '*.mdx', base: 'src/content/seminars' }),
});

const producers = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/producers' }),
});

const nearby = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/nearby' }),
});

const legal = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/legal' }),
});

const restaurant = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/restaurant' }),
});

const venue = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/venue' }),
});

const settings = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/settings' }),
});

const seminarsPricing = defineCollection({
  loader: glob({ pattern: '*.yaml', base: 'src/content/seminars-pricing' }),
});

export const collections = {
  activities,
  events,
  seminars,
  producers,
  nearby,
  legal,
  restaurant,
  venue,
  settings,
  'seminars-pricing': seminarsPricing,
};
