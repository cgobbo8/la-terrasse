import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  integrations: [
    svelte(),
    react(),
    mdx(),
    keystatic(),
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
    },
  },
});
