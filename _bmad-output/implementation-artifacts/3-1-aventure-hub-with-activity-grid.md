# Story 3.1: Aventure Hub with Activity Grid

Status: ready-for-dev

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

- [ ] Task 1: Create `src/components/aventure/ActivityCard.astro` (AC: #3, #4, #5, #8)
  - [ ] Define props interface: `activity` object (title, slug, price, age_min, duration, images, description)
  - [ ] Render optimized image via `astro:assets` `<Image>` with 3:2 aspect ratio, `loading="lazy"`, alt from activity title
  - [ ] Render activity name as `<h4>` with Montserrat Bold
  - [ ] Render price prominently in accent color (vert végétal)
  - [ ] Render age badge: "Dès {age_min} ans" — small rounded pill with icon
  - [ ] Render duration badge: format as "~{X}h" if ≥60min, "~{X}min" otherwise — small rounded pill with icon
  - [ ] Wrap entire card in `<a href="/aventure/{slug}">` for full-card clickability
  - [ ] Card hover: `scale(1.02)` + elevated shadow, `transition: transform 200ms ease, box-shadow 200ms ease`
  - [ ] Ensure minimum 44px touch target on the card link
- [ ] Task 2: Update `src/pages/aventure/index.astro` (AC: #1, #2, #6, #7)
  - [ ] Import `getLangFromUrl`, `useTranslations` from `@/i18n/utils`
  - [ ] Import `poleConfigs` from `@/lib/pole-config` for aventure colors
  - [ ] Import `generateSportsActivityLD` from `@/lib/seo`
  - [ ] Query Keystatic `activities` collection for all entries
  - [ ] Build hero section: atmospheric image with dark gradient overlay, "Aventure" H1, evocative tagline, pole accent via inline `style`
  - [ ] Render activity grid below hero using `ActivityCard` for each activity
  - [ ] Pass SEO props to BaseLayout: title="Aventure — Activités plein air | La Terrasse Saint-Ferréol", description targeting "activités lac saint ferreol"
  - [ ] Generate and pass SportsActivityLocation JSON-LD
- [ ] Task 3: Responsive grid layout (AC: #4)
  - [ ] Use Tailwind grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
  - [ ] Ensure cards have equal height within each row
  - [ ] Add section padding consistent with design tokens (96px desktop / 48px mobile)
- [ ] Task 4: i18n support (AC: #2, #3)
  - [ ] Use `getLocalizedField(activity, 'title', lang)` for activity titles
  - [ ] Use `getLocalizedField(activity, 'description', lang)` for descriptions
  - [ ] Ensure card links use `getLocalizedPath('/aventure/' + slug, lang)`

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

### Debug Log References

### Completion Notes List

### File List
