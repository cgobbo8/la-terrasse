# Story 4.3: Local Producers Page

Status: ready-for-dev

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

- [ ] Task 1: Create `src/components/restaurant/ProducerCard.astro` (AC: #1, #2)
  - [ ] Define props: `name: string`, `photo: string`, `product: string`, `story: string`, `lang: Lang`
  - [ ] Render portrait photo with circular crop (`rounded-full`, `object-cover`, 160x160px desktop / 120x120px mobile)
  - [ ] Use `astro:assets` `<Image>` for optimization, `loading="lazy"`, alt="{name}, {product}"
  - [ ] Render producer name as H3 in Montserrat Bold
  - [ ] Render product/specialty below name in brun terre accent color, 14px uppercase tracking-wide
  - [ ] Render story as body text, 16px, generous line-height (1.7)
  - [ ] Card layout: photo on left, text on right (desktop) / photo centered above text (mobile)
  - [ ] Subtle warm background (#f5f0e8) or white with brun terre left border for warmth
- [ ] Task 2: Create/update `src/pages/restaurant/producteurs.astro` (AC: #4, #5, #7, #8)
  - [ ] Import `getLangFromUrl`, `useTranslations`, `getLocalizedField` from `@/i18n/utils`
  - [ ] Import `poleConfigs` from `@/lib/pole-config`
  - [ ] Query Keystatic for producer data (from restaurant singleton or dedicated producers collection)
  - [ ] Build hero: terroir/farm photo with brun terre overlay, "Nos Producteurs" H1
  - [ ] Breadcrumb above title: "RESTAURANT" small-caps linked to `/restaurant/`
  - [ ] Introductory paragraph: warm copy about the restaurant's sourcing philosophy
  - [ ] Render producer grid below intro
  - [ ] Pass SEO props: title="Nos Producteurs — Restaurant | La Terrasse Saint-Ferréol"
- [ ] Task 3: Intro section (AC: #6)
  - [ ] Centered text block (max-width 768px) below hero
  - [ ] Content: explain the restaurant's terroir commitment — local sourcing, short supply chains, seasonal menus
  - [ ] Tone: warm, authentic, proud — "Nous travaillons main dans la main avec les artisans de notre terroir"
  - [ ] Content from Keystatic if available, else static placeholder ready for CMS update
- [ ] Task 4: Producer grid (AC: #3)
  - [ ] Grid: `grid grid-cols-1 md:grid-cols-2 gap-8` (larger gap for breathing room)
  - [ ] Each card occupies generous vertical space to let the story breathe
  - [ ] Center the grid content with max-width 1080px (slightly narrower than 1280px for intimacy)
  - [ ] Section padding: 96px desktop / 48px mobile
- [ ] Task 5: i18n support (AC: #1, #4)
  - [ ] Use `getLocalizedField()` for producer names, products, and stories
  - [ ] Intro text translated via CMS or `useTranslations()`
  - [ ] Breadcrumb text translated
- [ ] Task 6: CTA section (AC: #6)
  - [ ] Closing section: tie back to the restaurant — "Venez goûter le terroir" or similar
  - [ ] CTA "Réserver ma table" linking to `poleConfigs.restaurant.ctaHref`
  - [ ] Subtle, not as prominent as the hub CTA — this page is about storytelling

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

### Debug Log References

### Completion Notes List

### File List
