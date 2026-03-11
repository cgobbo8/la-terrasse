# Story 3.1: Aventure Hub with Activity Grid

Status: review

## Story

As a family visitor,
I want to browse all outdoor activities from a single hub page with key info visible on each card,
so that I can quickly compare options and find the right activity for my group without clicking into every detail page.

## Acceptance Criteria

1. Hero section uses vert végétal identity (accent=#537b47, light=#eef5ec) with an atmospheric outdoor/lake photo, title "Aventure", and a short evocative tagline — 70vh desktop / 50vh mobile
2. A responsive grid displays all 10 activity cards from the Keystatic `activities` collection
3. Each activity card shows name, image (3:2 ratio), price, age badge ("Dès X ans"), and duration badge ("~Xh" or "~Xmin") — all visible without clicking
4. Grid layout: 3 columns on desktop (≥1024px), 2 columns on tablet (≥640px), 1 column on mobile
5. Each card links to its detail page at `/aventure/{slug}`
6. Page includes SEO meta optimized for "activités lac saint ferreol" with unique title and description
7. Page emits SportsActivityLocation JSON-LD for the hub via `src/lib/seo.ts`
8. All card touch targets are at least 44px

## Tasks / Subtasks

- [x] Task 1: Create `src/components/aventure/ActivityCard.astro` (AC: #3, #4, #5, #8)
  - [x] Define props interface: `activity` object (title, slug, price, age_min, duration, images, description)
  - [x] Render optimized image via `astro:assets` `<Image>` with 3:2 aspect ratio, `loading="lazy"`, alt from activity title
  - [x] Render activity name as `<h4>` with Montserrat Bold
  - [x] Render price prominently in accent color (vert végétal)
  - [x] Render age badge: "Dès {age_min} ans" — small rounded pill with icon
  - [x] Render duration badge: format as "~{X}h" if ≥60min, "~{X}min" otherwise — small rounded pill with icon
  - [x] Wrap entire card in `<a href="/aventure/{slug}">` for full-card clickability
  - [x] Card hover: `scale(1.02)` + elevated shadow, `transition: transform 200ms ease, box-shadow 200ms ease`
  - [x] Ensure minimum 44px touch target on the card link
- [x] Task 2: Update `src/pages/aventure/index.astro` (AC: #1, #2, #6, #7)
  - [x] Import `getLangFromUrl`, `useTranslations` from `@/i18n/utils`
  - [x] Import `poleConfigs` from `@/lib/pole-config` for aventure colors
  - [x] Import `generateSportsActivityLD` from `@/lib/seo`
  - [x] Query Keystatic `activities` collection for all entries
  - [x] Build hero section: atmospheric image with dark gradient overlay, "Aventure" H1, evocative tagline, pole accent via inline `style`
  - [x] Render activity grid below hero using `ActivityCard` for each activity
  - [x] Pass SEO props to BaseLayout: title="Aventure — Activités plein air | La Terrasse Saint-Ferréol", description targeting "activités lac saint ferreol"
  - [x] Generate and pass SportsActivityLocation JSON-LD
- [x] Task 3: Responsive grid layout (AC: #4)
  - [x] Use Tailwind grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
  - [x] Ensure cards have equal height within each row
  - [x] Add section padding consistent with design tokens (96px desktop / 48px mobile)
- [x] Task 4: i18n support (AC: #2, #3)
  - [x] Use `getLocalizedField(activity, 'title', lang)` for activity titles
  - [x] Use `getLocalizedField(activity, 'description', lang)` for descriptions
  - [x] Ensure card links use `getLocalizedPath('/aventure/' + slug, lang)`

## Dev Notes

### Architecture Patterns (MUST follow)

- **Pole-aware pattern:** Apply aventure colors via inline `style` attributes using values from `poleConfigs.aventure`. NEVER use dynamic Tailwind classes for pole colors. [Source: architecture.md#Pole-Aware Component Pattern]
- **Import aliases:** Always use `@/` prefix for imports from `src/`. [Source: architecture.md#Import Patterns]
- **Rendering boundary:** ActivityCard is an Astro component (zero JS shipped). No Svelte island needed — cards are static with CSS-only hover effects. [Source: architecture.md#Rendering Boundary]
- **Image optimization:** Use `astro:assets` `<Image>` component for CMS images from `public/images/`. Set explicit `width` and `height` for CLS prevention. [Source: architecture.md#Image Handling]
- **i18n:** Use `getLangFromUrl(Astro.url)` in page frontmatter. All links via `getLocalizedPath()`. Content fields via `getLocalizedField()`. [Source: architecture.md#i18n Patterns]

### Project Structure Notes

- `src/components/aventure/ActivityCard.astro` — NEW file, reusable card used here and in Story 3.3 (alternative suggestions)
- `src/pages/aventure/index.astro` — NEW or UPDATE, hub page for the aventure pole
- `src/components/aventure/` — NEW directory for aventure-specific components

### Design Tokens Reference

- Aventure accent: #537b47 (vert végétal)
- Aventure light bg: #eef5ec
- Card border-radius: 8px (rounded-lg)
- Card shadow: shadow-md on hover
- Typography: H1 32→48px, H4 18→20px, badges 14px
- Section spacing: 96px desktop / 48px mobile
- Grid gap: 24px (gap-6)
- Hero: 70vh desktop / 50vh mobile

### ActivityCard Component Contract

```
Props:
  activity: {
    title: string
    slug: string
    price: number
    age_min: number
    duration: number    // in minutes
    images: string[]
    description: string
  }
  lang: Lang
```

### References

- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: architecture.md#Rendering Boundary]
- [Source: architecture.md#Image Handling]
- [Source: architecture.md#i18n Patterns]
- [Source: ux-design-specification.md#Card Design Patterns]
- [Source: ux-design-specification.md#Emotional Funnel]
- [Source: prd.md#Aventure Pole]
- [Source: CLAUDE.md#Tailwind CSS v4]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No issues encountered during implementation.

### Completion Notes List

- Created `ActivityCard.astro` reusable component with age/duration badges, 3:2 image ratio, hover effects, and i18n support
- Updated `aventure/index.astro` to use Keystatic reader for dynamic activity data instead of static arrays
- Added `age_min` field to Keystatic activities schema for age badge rendering
- Created 8 missing activity content files (paddle, canoe, velo-electrique, velo-classique, archery-tag, course-orientation, jeu-de-poste, trampoline) to complete all 10 activities
- Hero section: 70vh desktop / 50vh mobile with gradient overlay and pole accent
- SEO: custom title/description targeting "activités lac saint ferreol", SportsActivityLocation JSON-LD
- Responsive grid: 1 col mobile, 2 col tablet (sm), 3 col desktop (lg) with gap-6
- Pole colors applied via inline `style` attributes (not dynamic Tailwind classes) per architecture rules
- All cards are full-link `<a>` tags with min-h-[44px] for touch accessibility
- Placeholder images cycled across cards as per project convention

### File List

- `src/components/aventure/ActivityCard.astro` — NEW: reusable activity card component
- `src/pages/aventure/index.astro` — MODIFIED: rewrote with Keystatic reader, ActivityCard, hero, SEO, JSON-LD
- `keystatic.config.ts` — MODIFIED: added `age_min` integer field to activities schema
- `src/content/activities/pedalo.mdx` — MODIFIED: added age_min field
- `src/content/activities/mini-golf.mdx` — MODIFIED: added age_min field
- `src/content/activities/paddle.mdx` — NEW: activity content
- `src/content/activities/canoe.mdx` — NEW: activity content
- `src/content/activities/velo-electrique.mdx` — NEW: activity content
- `src/content/activities/velo-classique.mdx` — NEW: activity content
- `src/content/activities/archery-tag.mdx` — NEW: activity content
- `src/content/activities/course-orientation.mdx` — NEW: activity content
- `src/content/activities/jeu-de-poste.mdx` — NEW: activity content
- `src/content/activities/trampoline.mdx` — NEW: activity content
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — MODIFIED: epic-3 and story status updated

## Change Log

- 2026-03-11: Initial implementation — all 4 tasks completed. Created ActivityCard component, updated hub page with Keystatic integration, responsive grid, SEO/JSON-LD, and 10 activity content files.
