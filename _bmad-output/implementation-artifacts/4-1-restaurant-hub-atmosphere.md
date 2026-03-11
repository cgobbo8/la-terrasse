# Story 4.1: Restaurant Hub & Atmosphere

Status: ready-for-dev

## Story

As a visitor,
I want an emotional introduction to the restaurant that conveys the lakeside dining atmosphere,
so that I feel drawn to the experience before seeing menus or prices and want to reserve a table.

## Acceptance Criteria

1. Hero section uses brun terre identity (accent=#2D2B1B, light=#f5f0e8) with an atmospheric terrace/lake photo — 70vh desktop / 50vh mobile
2. Evocative description section below hero conveys the sensory dining experience (lake view, local ingredients, golden hour ambiance)
3. Navigation to sub-pages displayed as 3 visually distinct cards or links: "La Carte" (menu), "Nos Producteurs" (local sourcing), "Repas de Groupe" (group dining)
4. A prominent "Réserver ma table" CTA section at the bottom with phone number and/or booking link
5. Page emits Restaurant JSON-LD via `src/lib/seo.ts`
6. Page follows the emotional funnel pattern: atmosphere → offering → details → CTA
7. SEO meta optimized for "restaurant lac saint ferreol" with unique title and description
8. Page is fully responsive with all sections stacking cleanly on mobile

## Tasks / Subtasks

- [ ] Task 1: Update `src/pages/restaurant/index.astro` (AC: #1, #5, #6, #7)
  - [ ] Import `getLangFromUrl`, `useTranslations` from `@/i18n/utils`
  - [ ] Import `poleConfigs` from `@/lib/pole-config` for restaurant colors
  - [ ] Import `generateRestaurantLD` from `@/lib/seo`
  - [ ] Pass to BaseLayout: pole="restaurant", title="Restaurant — La Terrasse Saint-Ferréol", description targeting "restaurant lac saint ferreol"
  - [ ] Generate and pass Restaurant JSON-LD
  - [ ] Structure page sections following emotional funnel: hero → atmosphere text → sub-nav cards → CTA
- [ ] Task 2: Hero section (AC: #1)
  - [ ] Full-width hero with atmospheric terrace/lake photo (golden hour suggested)
  - [ ] Dark gradient overlay from bottom for text readability
  - [ ] "Restaurant" as H1 in white, Montserrat Bold
  - [ ] Short tagline below: evocative phrase about lakeside dining
  - [ ] Hero height: 70vh desktop / 50vh mobile
  - [ ] Apply brun terre accent via inline `style` for any accent elements
- [ ] Task 3: Atmosphere description section (AC: #2, #6)
  - [ ] Centered text block (max-width 768px) with evocative copy
  - [ ] Content tone: warm, sensory, contemplative — describe the view, the flavors, the moment
  - [ ] Typography: larger body text (18→20px), generous line-height
  - [ ] Off-white or light brun terre background (#f5f0e8) to differentiate from hero
  - [ ] Content from Keystatic restaurant singleton if available, else static placeholder
- [ ] Task 4: Sub-page navigation cards (AC: #3)
  - [ ] Create 3 navigation cards in a responsive row: 3-col desktop, stacked mobile
  - [ ] Card 1: "La Carte" — link to `/restaurant/carte`, icon or small photo, brief description ("Découvrez nos plats et nos vins")
  - [ ] Card 2: "Nos Producteurs" — link to `/restaurant/producteurs`, brief description ("Les artisans derrière nos assiettes")
  - [ ] Card 3: "Repas de Groupe" — link to `/restaurant/repas-groupe`, brief description ("Privatisez notre terrasse dès 10 personnes")
  - [ ] Cards styled with brun terre accent borders or subtle backgrounds
  - [ ] Hover: subtle lift + shadow transition (200ms)
  - [ ] All links via `getLocalizedPath()` for i18n
- [ ] Task 5: CTA section (AC: #4)
  - [ ] Full-width section with brun terre background (#2D2B1B) and white text
  - [ ] Heading: "Réservez votre table"
  - [ ] Prominent phone number as a `tel:` link — large, clickable, with phone icon
  - [ ] Secondary: booking link or hours information
  - [ ] CTA button styled with white background, brun terre text (inverted)
  - [ ] CTA href from `poleConfigs.restaurant.ctaHref`
- [ ] Task 6: Responsive layout (AC: #8)
  - [ ] Hero stacks text vertically on mobile
  - [ ] Sub-page cards: `grid grid-cols-1 md:grid-cols-3 gap-6`
  - [ ] CTA section centers content on all breakpoints
  - [ ] Section padding: 96px desktop / 48px mobile

## Dev Notes

### Architecture Patterns (MUST follow)

- **Pole-aware pattern:** All restaurant pages use brun terre (#2D2B1B) accent and warm off-white (#f5f0e8) light background. Applied via inline `style` attributes. [Source: architecture.md#Pole-Aware Component Pattern]
- **Emotional funnel:** This page is the entry point for the restaurant pole. It MUST prioritize atmosphere and emotion before practical info. The funnel: hero (atmosphere) → description (offering) → sub-nav (details) → CTA (action). [Source: ux-design-specification.md#Emotional Funnel]
- **Import aliases:** Always use `@/` prefix. [Source: architecture.md#Import Patterns]
- **Rendering boundary:** This is a static Astro page. No Svelte islands needed. [Source: architecture.md#Rendering Boundary]
- **i18n:** Use `getLangFromUrl(Astro.url)` in page frontmatter. All links via `getLocalizedPath()`. [Source: architecture.md#i18n Patterns]

### Project Structure Notes

- `src/pages/restaurant/index.astro` — NEW or UPDATE, hub page for restaurant pole
- `src/pages/restaurant/carte.astro` — will be created in Story 4.2
- `src/pages/restaurant/producteurs.astro` — will be created in Story 4.3
- `src/pages/restaurant/repas-groupe.astro` — will be created in Story 4.4
- `src/lib/seo.ts` — EXISTS from Story 1.1, contains `generateRestaurantLD()`
- `src/lib/pole-config.ts` — EXISTS from Story 1.1, provides restaurant pole config

### Tone & Content Direction

The restaurant pole personality is **warm, sensory, contemplative**. Unlike the aventure pole (energetic, active), restaurant copy should evoke:
- The view of the lake from the terrace at sunset
- The sourcing of local, seasonal ingredients
- The slow dining experience — "prendre le temps"
- Family and group celebrations by the water

### Design Tokens Reference

- Brun terre accent: #2D2B1B
- Brun terre light bg: #f5f0e8
- Hero: 70vh desktop / 50vh mobile
- Prose max-width: 768px
- Sub-nav cards: rounded-lg, shadow on hover
- CTA section: full-bleed dark background
- Section spacing: 96px desktop / 48px mobile
- Card gap: 24px (gap-6)

### References

- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: architecture.md#Rendering Boundary]
- [Source: architecture.md#SEO Patterns]
- [Source: architecture.md#i18n Patterns]
- [Source: ux-design-specification.md#Emotional Funnel]
- [Source: ux-design-specification.md#Restaurant Pole Identity]
- [Source: prd.md#Restaurant Pole]
- [Source: CLAUDE.md#Tailwind CSS v4]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
