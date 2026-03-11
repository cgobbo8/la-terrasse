# Story 8.2: Multilingual Content & SEO

Status: ready-for-dev

## Story

As a search engine crawler,
I want hreflang tags and localized URLs on every page,
so that I can index and serve the correct language version to users in each locale.

## Acceptance Criteria

1. Every page includes `<link rel="alternate" hreflang="...">` tags for all 3 locales (FR, EN, ES) plus an `x-default` pointing to FR
2. CMS content uses `getLocalizedField(entry, fieldName, lang)` to render translated fields, falling back to FR when a translation is missing
3. The XML sitemap (`/sitemap-index.xml`) includes all language versions of every page
4. SEO meta tags (`<title>`, `<meta name="description">`, `og:title`, `og:description`) use localized translations appropriate to the current page language
5. All pages build successfully for all 3 locales (`pnpm build` completes without errors)
6. Canonical URLs are correct for each locale version (no duplicate content signals)
7. Open Graph `og:locale` and `og:locale:alternate` tags reflect available languages

## Tasks / Subtasks

- [ ] Verify and complete hreflang implementation in `SEOHead.astro` (AC: #1, #6)
  - [ ] Confirm `SEOHead.astro` generates `<link rel="alternate" hreflang="fr" href="...">` for each locale
  - [ ] Confirm `<link rel="alternate" hreflang="x-default" href="...">` points to the FR version
  - [ ] Ensure href values are absolute URLs (full domain, not relative paths)
  - [ ] Ensure `<link rel="canonical">` points to the current locale's URL
  - [ ] Verify hreflang URLs are generated correctly for all page types (static pages, dynamic collection pages)

- [ ] Verify and configure Astro sitemap integration (AC: #3)
  - [ ] Confirm `@astrojs/sitemap` is installed and configured in `astro.config.mjs`
  - [ ] Ensure sitemap config includes i18n settings so all locale variants appear
  - [ ] Verify `site` property is set in `astro.config.mjs` (required for absolute sitemap URLs)
  - [ ] After build, inspect `dist/sitemap-index.xml` and child sitemaps to confirm all `/`, `/en/`, `/es/` URLs are present
  - [ ] Verify each URL group has correct `<xhtml:link rel="alternate" hreflang="...">` entries in the sitemap

- [ ] Ensure localized SEO meta tags on all pages (AC: #4, #7)
  - [ ] Verify every page passes `title` and `description` props to `BaseLayout` / `SEOHead`
  - [ ] Ensure title and description values are translated using `useTranslations(lang)` or `getLocalizedField()` as appropriate
  - [ ] Add `og:locale` tag (e.g., `fr_FR`, `en_GB`, `es_ES`) based on current language
  - [ ] Add `og:locale:alternate` tags for the other two locales
  - [ ] Verify `og:url` matches the canonical URL for the current locale

- [ ] Verify CMS content localization with `getLocalizedField()` (AC: #2)
  - [ ] Audit all pages that render CMS content (activities, seminars, events, restaurant, venue)
  - [ ] Ensure each uses `getLocalizedField(entry, 'title', lang)` instead of directly accessing `entry.data.title`
  - [ ] Ensure `getLocalizedField(entry, 'description', lang)` is used for description fields
  - [ ] Test fallback: when `title_en` is empty/missing, `getLocalizedField()` should return the FR `title`
  - [ ] Review `getLocalizedField()` implementation in `src/i18n/utils.ts` to confirm fallback logic

- [ ] Verify Astro i18n routing configuration (AC: #5, #6)
  - [ ] Confirm `astro.config.mjs` has correct i18n block:
    ```
    i18n: {
      defaultLocale: 'fr',
      locales: ['fr', 'en', 'es'],
      fallback: { en: 'fr', es: 'fr' },
      routing: { prefixDefaultLocale: false }
    }
    ```
  - [ ] Verify `prefixDefaultLocale: false` so FR pages live at `/` (not `/fr/`)
  - [ ] Verify EN pages generate at `/en/...` and ES pages at `/es/...`
  - [ ] Run `pnpm build` and confirm all locale pages are generated in `dist/`

- [ ] End-to-end build and validation (AC: #5)
  - [ ] Run `pnpm build` — zero errors
  - [ ] Spot-check `dist/index.html` for FR hreflang tags
  - [ ] Spot-check `dist/en/index.html` for EN hreflang tags and EN content
  - [ ] Spot-check `dist/es/index.html` for ES hreflang tags and ES content
  - [ ] Verify sitemap XML files in `dist/`
  - [ ] Validate JSON-LD on localized pages (if any) uses correct language content

## Dev Notes

### Project Structure Notes

- SEO head component: `src/components/SEOHead.astro` — renders `<title>`, meta, OG, hreflang, JSON-LD
- Astro config: `astro.config.mjs` — i18n routing, sitemap integration, site URL
- i18n utils: `src/i18n/utils.ts` — `getLangFromUrl()`, `useTranslations()`, `getLocalizedField()`, `getLocalizedPath()`
- Translations: `src/i18n/translations.ts` — UI string dictionary
- CMS content: `src/content/` — Keystatic-managed content files with i18n fields

### Key Implementation Details

- **hreflang tags:** Must use absolute URLs including the domain. The `site` property in `astro.config.mjs` provides the base. Example:
  ```html
  <link rel="alternate" hreflang="fr" href="https://laterrasse-saintferreol.fr/contact" />
  <link rel="alternate" hreflang="en" href="https://laterrasse-saintferreol.fr/en/contact" />
  <link rel="alternate" hreflang="es" href="https://laterrasse-saintferreol.fr/es/contact" />
  <link rel="alternate" hreflang="x-default" href="https://laterrasse-saintferreol.fr/contact" />
  ```

- **`getLocalizedField()` pattern:** For a CMS entry with fields `title`, `title_en`, `title_es`:
  ```typescript
  // Returns entry.data.title_en if lang is 'en' and the field exists and is non-empty
  // Otherwise falls back to entry.data.title (the FR default)
  getLocalizedField(entry, 'title', lang)
  ```

- **Sitemap i18n:** The `@astrojs/sitemap` integration can be configured with i18n to automatically add hreflang annotations to the sitemap XML. This requires setting `i18n.locales` and `i18n.defaultLocale` in the sitemap config.

- **OG locale format:** Open Graph uses underscore format with region: `fr_FR`, `en_GB`, `es_ES`. This differs from hreflang which uses just the language code.

### Relationship to Other Stories

- **Depends on Story 8.1:** The UI translations and language switcher must be in place for pages to render correctly in all locales
- **Depends on Story 9.1:** CMS content must have i18n fields defined for `getLocalizedField()` to work with real content
- **Validates Story 1.1:** The SEOHead component created in Story 1.1 is verified and completed here

### Testing Checklist

After implementation, manually verify:
1. `curl -s https://localhost:4321/ | grep hreflang` — shows 4 hreflang links
2. `curl -s https://localhost:4321/en/ | grep hreflang` — same 4 links
3. `curl -s https://localhost:4321/sitemap-index.xml` — exists and references child sitemaps
4. Build output `dist/en/` directory contains all expected page files
5. Build output `dist/es/` directory contains all expected page files

### References

- Google hreflang spec: https://developers.google.com/search/docs/specialty/international/localized-versions
- Astro i18n guide: https://docs.astro.build/en/guides/internationalization/
- @astrojs/sitemap docs: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- Open Graph locale tags: https://ogp.me/#optional_metadata

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
