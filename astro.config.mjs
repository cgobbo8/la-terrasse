import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://laterrasse-saintferreol.fr',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    svelte(),
    react(),
    mdx(),
    keystatic(),
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr', en: 'en', es: 'es' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: ['fr', 'en', 'es'],
    defaultLocale: 'fr',
    fallback: {
      en: 'fr',
      es: 'fr',
    },
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'rewrite',
    },
  },
});
