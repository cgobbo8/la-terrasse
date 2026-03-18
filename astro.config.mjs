import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';

import icon from 'astro-icon';

export default defineConfig({
  site: process.env.SITE_URL || 'https://baseloisirs-saintferreol.fr',
  adapter: node({ mode: 'standalone' }),
  server: {
    host: true,
    port: 4321,
  },
  integrations: [svelte(), react(), mdx(), keystatic(), sitemap({
    i18n: {
      defaultLocale: 'fr',
      locales: { fr: 'fr', en: 'en', es: 'es' },
    },
  }), icon()],
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