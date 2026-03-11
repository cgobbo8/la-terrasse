# Story 4.3: Local Producers Page

Status: review

## Story

As a visitor,
I want to discover the local producers who supply the restaurant and learn their stories,
so that I understand the restaurant's commitment to terroir and feel a connection to the people behind my meal.

## Acceptance Criteria

1. Each producer is displayed as a card with: portrait photo, name, product/specialty, and a 2–3 sentence story
2. Producer photos use a square or circular crop for a personal, portrait feel
3. Producer grid layout: 2 columns on desktop, 1 column on mobile — each card generous in size for storytelling
4. All producer data comes from Keystatic CMS — no hardcoded content
5. Hero section uses brun terre identity with a "farm-to-table" or terroir-themed photo
6. The page conveys the restaurant's "terroir commitment" through warm, authentic copy
7. SEO meta with unique title "Nos Producteurs — Restaurant | La Terrasse Saint-Ferréol"
8. Breadcrumb: "Restaurant > Nos Producteurs" with "Restaurant" linking to `/restaurant/`

## Tasks / Subtasks

- [x] Task 1: Create `src/components/restaurant/ProducerCard.astro` (AC: #1, #2)
  - [x] Define props: `name: string`, `photo: string`, `product: string`, `story: string`, `lang: Lang`
  - [x] Render portrait photo with circular crop (`rounded-full`, `object-cover`, 160x160px desktop / 120x120px mobile)
  - [x] Use `astro:assets` `<Image>` for optimization, `loading="lazy"`, alt="{name}, {product}"
  - [x] Render producer name as H3 in Montserrat Bold
  - [x] Render product/specialty below name in brun terre accent color, 14px uppercase tracking-wide
  - [x] Render story as body text, 16px, generous line-height (1.7)
  - [x] Card layout: photo on left, text on right (desktop) / photo centered above text (mobile)
  - [x] Subtle warm background (#f5f0e8) or white with brun terre left border for warmth
- [x] Task 2: Create/update `src/pages/restaurant/producteurs.astro` (AC: #4, #5, #7, #8)
  - [x] Import `getLangFromUrl`, `useTranslations`, `getLocalizedField` from `@/i18n/utils`
  - [x] Import `poleConfigs` from `@/lib/pole-config`
  - [x] Query Keystatic for producer data (from restaurant singleton or dedicated producers collection)
  - [x] Build hero: terroir/farm photo with brun terre overlay, "Nos Producteurs" H1
  - [x] Breadcrumb above title: "RESTAURANT" small-caps linked to `/restaurant/`
  - [x] Introductory paragraph: warm copy about the restaurant's sourcing philosophy
  - [x] Render producer grid below intro
  - [x] Pass SEO props: title="Nos Producteurs — Restaurant | La Terrasse Saint-Ferréol"
- [x] Task 3: Intro section (AC: #6)
  - [x] Centered text block (max-width 768px) below hero
  - [x] Content: explain the restaurant's terroir commitment — local sourcing, short supply chains, seasonal menus
  - [x] Tone: warm, authentic, proud — "Nous travaillons main dans la main avec les artisans de notre terroir"
  - [x] Content from Keystatic if available, else static placeholder ready for CMS update
- [x] Task 4: Producer grid (AC: #3)
  - [x] Grid: `grid grid-cols-1 md:grid-cols-2 gap-8` (larger gap for breathing room)
  - [x] Each card occupies generous vertical space to let the story breathe
  - [x] Center the grid content with max-width 1080px (slightly narrower than 1280px for intimacy)
  - [x] Section padding: 96px desktop / 48px mobile
- [x] Task 5: i18n support (AC: #1, #4)
  - [x] Use `getLocalizedField()` for producer names, products, and stories
  - [x] Intro text translated via CMS or `useTranslations()`
  - [x] Breadcrumb text translated
- [x] Task 6: CTA section (AC: #6)
  - [x] Closing section: tie back to the restaurant — "Venez goûter le terroir" or similar
  - [x] CTA "Réserver ma table" linking to `poleConfigs.restaurant.ctaHref`
  - [x] Subtle, not as prominent as the hub CTA — this page is about storytelling

## Dev Notes

### Architecture Patterns (MUST follow)

- **Pole-aware pattern:** Brun terre (#2D2B1B) accent via inline `style` attributes. Light backgrounds in #f5f0e8. [Source: architecture.md#Pole-Aware Component Pattern]
- **Image optimization:** Producer photos from `public/images/producers/`. Use `astro:assets` `<Image>` with explicit dimensions. [Source: architecture.md#Image Handling]
- **Rendering boundary:** Pure Astro components. No Svelte islands needed. [Source: architecture.md#Rendering Boundary]
- **Import aliases:** Always use `@/` prefix. [Source: architecture.md#Import Patterns]
- **i18n:** All links via `getLocalizedPath()`. Content via `getLocalizedField()`. [Source: architecture.md#i18n Patterns]

### Project Structure Notes

- `src/components/restaurant/ProducerCard.astro` — NEW file
- `src/pages/restaurant/producteurs.astro` — NEW file
- `public/images/producers/` — NEW directory for producer portrait photos
- `src/components/restaurant/MenuSection.astro` — EXISTS from Story 4.2

### Keystatic Producer Data (expected structure)

```
# Either in restaurant singleton or as a producers collection:
producers:
  - name: "Jean-Pierre Dubois"
    photo: "/images/producers/jean-pierre.jpg"
    product: "Miel & Pollen"
    story: "Installé à Sorèze depuis 1998, Jean-Pierre..."
    story_en: "Based in Sorèze since 1998, Jean-Pierre..."
    story_es: "Instalado en Sorèze desde 1998, Jean-Pierre..."
  - name: "Marie Blanc"
    photo: "/images/producers/marie.jpg"
    product: "Fromages de chèvre"
    story: "Marie élève ses chèvres sur les pentes de la Montagne Noire..."
```

### Tone & Content Direction

This page is a **storytelling component** — it builds trust and emotional connection. Each producer story should:
- Feel personal (first name basis, specific location)
- Connect to the landscape (Montagne Noire, lac de Saint-Ferréol, Tarn)
- Mention what makes their product special
- Be concise: 2–3 sentences maximum per producer

The page is NOT a directory — it's a narrative that says "we care about where our food comes from."

### Design Tokens Reference

- Producer photo: 160px diameter desktop, 120px mobile, `rounded-full`
- Card layout: horizontal (photo left, text right) on desktop, vertical (photo centered above) on mobile
- Card gap: 32px (gap-8) for generous spacing
- Grid max-width: 1080px (narrower for intimacy)
- Intro text: 18→20px, max-width 768px
- Section spacing: 96px desktop / 48px mobile
- Hero: 50vh desktop / 40vh mobile
- Breadcrumb: 14px, small-caps

### References

- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: architecture.md#Rendering Boundary]
- [Source: architecture.md#Image Handling]
- [Source: architecture.md#i18n Patterns]
- [Source: ux-design-specification.md#Storytelling Patterns]
- [Source: ux-design-specification.md#Restaurant Pole Identity]
- [Source: prd.md#Restaurant Pole — Local Sourcing]
- [Source: CLAUDE.md#Tailwind CSS v4]

## Dev Agent Record

### Agent Model Used

claude-opus-4-6

### Debug Log References

No issues encountered during implementation.

### Completion Notes List

- Created ProducerCard.astro component with circular portrait photo, horizontal desktop / vertical mobile layout, brun terre left border
- Rewrote producteurs.astro page with SectionHero, breadcrumb, intro section, Keystatic-powered producer grid, and subtle CTA
- Added `producers` Keystatic collection with i18n fields (product_en/es, story_en/es), order, visibility
- Created 4 placeholder producer entries: Jean-Pierre Dubois (miel), Marie Blanc (fromages), Pierre Labarthe (vins), Sophie Martin (maraîchage)
- Added i18n translations for producers page (heroSubtitle, breadcrumb, intro, ctaTitle, ctaSubtitle) in FR/EN/ES
- Used placeholder images from existing `/images/placeholders/` directory
- Build passes with 0 errors across all 3 locales (fr, en, es)

### File List

- `src/components/restaurant/ProducerCard.astro` — NEW: Producer card component
- `src/pages/restaurant/producteurs.astro` — MODIFIED: Full page rewrite with hero, breadcrumb, grid, CTA
- `keystatic.config.ts` — MODIFIED: Added `producers` collection
- `src/i18n/translations.ts` — MODIFIED: Added producer page translations (FR/EN/ES)
- `src/content/producers/jean-pierre-dubois/index.yaml` — NEW: Placeholder producer data
- `src/content/producers/marie-blanc/index.yaml` — NEW: Placeholder producer data
- `src/content/producers/pierre-labarthe/index.yaml` — NEW: Placeholder producer data
- `src/content/producers/sophie-martin/index.yaml` — NEW: Placeholder producer data

## Change Log

- 2026-03-11: Implemented story 4-3 — local producers page with Keystatic collection, ProducerCard component, full page with hero/breadcrumb/intro/grid/CTA, i18n support (FR/EN/ES), 4 placeholder producers
