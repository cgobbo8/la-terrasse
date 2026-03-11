# Story 1.6: 404 Error Page

Status: ready-for-dev

## Story

As a visitor who hits a broken or non-existent link,
I want a branded 404 error page with clear navigation options,
so that I can find my way back to the site content without confusion.

## Acceptance Criteria

1. A `src/pages/404.astro` page exists and Astro automatically serves it for all unmatched routes
2. The page uses BaseLayout with brand-mother styling (brun-terre `#2D2B1B` accent, no pole prop)
3. A clear, friendly error message is displayed: a large "404" heading, a human-readable explanation (e.g., "Cette page n'existe pas"), and a brief reassuring sentence
4. A prominent CTA button links to the homepage using `getLocalizedPath('/', lang)` with brun-terre styling
5. The full header and footer render normally, giving visitors access to the main navigation
6. The page includes proper SEO metadata: `<title>` set to "Page introuvable — La Terrasse", `noindex` meta tag to prevent search engine indexing of the 404 page

## Tasks / Subtasks

- [ ] Task 1: Create `src/pages/404.astro` (AC: #1, #2, #5)
  - [ ] Import `BaseLayout` from `@/layouts/BaseLayout.astro`
  - [ ] Import `getLangFromUrl`, `useTranslations`, `getLocalizedPath` from `@/i18n/utils`
  - [ ] Wrap content in `<BaseLayout title="Page introuvable" description="La page que vous recherchez n'existe pas.">`
  - [ ] Do NOT pass a `pole` prop — use brand-mother neutral styling
  - [ ] BaseLayout renders Header and Footer automatically

- [ ] Task 2: Build the 404 content section (AC: #3, #4)
  - [ ] Create a centered content block with generous vertical padding (`py-24 md:py-32`)
  - [ ] Large "404" display text: `text-8xl md:text-9xl font-bold` in a muted color (`text-gray-200`)
  - [ ] Heading: `<h1>` with "Cette page n'existe pas" in `text-2xl md:text-3xl font-bold text-gray-800`
  - [ ] Body text: "Pas d'inquietude, vous pouvez retrouver votre chemin depuis la page d'accueil ou utiliser le menu de navigation." in `text-gray-600`
  - [ ] CTA link to homepage: `<a href={getLocalizedPath('/', lang)}>` styled as primary button with brun-terre background
  - [ ] Button text: "Retour a l'accueil"
  - [ ] Button styling: `inline-flex items-center gap-2 bg-brun-terre text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors min-h-11`
  - [ ] Optional: add a small decorative element (compass or map icon from the existing iconPaths set) for visual interest

- [ ] Task 3: Add SEO metadata for 404 page (AC: #6)
  - [ ] Set title to "Page introuvable" (BaseLayout appends " — La Terrasse")
  - [ ] Add `<meta name="robots" content="noindex, nofollow">` to prevent indexing
  - [ ] This requires either:
    - Option A: Add a `noindex` prop to BaseLayout that conditionally renders the robots meta tag
    - Option B: Use Astro's `<slot name="head">` pattern if supported, or add the meta tag via SEOHead.astro (from Story 1.1)
  - [ ] If SEOHead.astro is not yet created (Story 1.1), add the `<meta name="robots">` tag directly in a `<Fragment slot="head">` or accept that it will be added when SEOHead is implemented

- [ ] Task 4: Add i18n support for 404 content (AC: #3, #4)
  - [ ] Add translation keys to `src/i18n/translations.ts`:
    - `error.404.title`: "Cette page n'existe pas" / "This page does not exist" / "Esta pagina no existe"
    - `error.404.description`: "Pas d'inquietude..." / "Don't worry..." / "No se preocupe..."
    - `error.404.cta`: "Retour a l'accueil" / "Back to homepage" / "Volver al inicio"
    - `error.404.pageTitle`: "Page introuvable" / "Page not found" / "Pagina no encontrada"
  - [ ] Use `const t = useTranslations(lang)` and `t('error.404.title')` etc. in the template
  - [ ] Note: Astro serves the same 404.astro for all locales. Use `getLangFromUrl(Astro.url)` — for 404s this may default to FR since the URL doesn't match a locale prefix. Accept this limitation for V1.

- [ ] Task 5: Verify layout integration (AC: #5)
  - [ ] Confirm BaseLayout renders Header (with full navigation — MegaMenu + MobileMenu)
  - [ ] Confirm BaseLayout renders Footer (with all links and contact info)
  - [ ] Confirm the page does not pass `pole` prop, so header shows neutral brun-terre styling and CTA shows "Nous contacter"
  - [ ] Test that navigating to a non-existent URL (e.g., `/this-does-not-exist`) renders the 404 page

## Dev Notes

### Architecture Patterns

- **Brand-mother styling:** The 404 page uses no pole, so it defaults to the brand-mother identity: brun-terre accent `#2D2B1B`, neutral backgrounds, "Nous contacter" CTA in header. This is the natural fallback when `pole` is `null` or undefined. [Source: architecture.md#Pole-Aware Component Pattern]
- **Astro 404 routing:** Astro automatically serves `src/pages/404.astro` for any unmatched route. No additional configuration needed. Works in both static and SSR modes. [Source: Astro docs]
- **i18n limitation:** Astro's built-in 404 handling serves a single 404.astro page. There is no `/en/404` or `/es/404` route. The `getLangFromUrl()` function may not detect the correct locale from the URL since the path doesn't match any known pattern. For V1, defaulting to FR is acceptable. A future enhancement could use browser `Accept-Language` header for SSR-rendered 404s.

### Project Structure Notes

- `src/pages/404.astro` — NEW file, the 404 error page
- `src/layouts/BaseLayout.astro` — EXISTS, used as the page wrapper (renders Header + Footer)
- `src/i18n/translations.ts` — EXISTS, add `error.404.*` translation keys
- `src/i18n/utils.ts` — EXISTS, provides `getLangFromUrl()`, `useTranslations()`, `getLocalizedPath()`

### Key Constraints

- Keep the page minimal and lightweight — no heavy components, no Svelte islands, no images that need loading.
- The page is purely an Astro component (zero JS shipped to client).
- The `noindex` meta tag is important to prevent search engines from indexing error pages, which would dilute SEO quality.
- Max content width should match the site standard: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- The 404 content should be vertically centered in the viewport or at least have substantial padding to avoid looking sparse.
- This is one of the simplest stories in the sprint — a good first task for warming up or testing the dev pipeline.

### References

- [Source: architecture.md#Pole-Aware Component Pattern — null pole fallback]
- [Source: architecture.md#i18n Patterns]
- [Source: architecture.md#Implementation Patterns & Consistency Rules]
- [Source: CLAUDE.md#Tailwind CSS v4]
- [Source: ux-design-specification.md#Error States]
- [Source: prd.md#FR-MISC Error Handling]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
