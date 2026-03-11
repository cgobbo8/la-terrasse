# Story 3.2: Activity Detail Pages

Status: ready-for-dev

## Story

As a visitor interested in a specific activity,
I want a dedicated detail page with full information, photos, and practical details,
so that I can decide if this activity suits my group and know everything needed before booking.

## Acceptance Criteria

1. Dynamic `[slug].astro` page renders for each activity in the Keystatic `activities` collection via `getStaticPaths()`
2. Hero section displays the activity's primary image, activity name as H1, and the aventure pole identity (vert végétal)
3. Full MDX description body from Keystatic is rendered below the hero
4. Practical info grid displays: price, age minimum, duration, group size — clearly formatted with icons or labels
5. Breadcrumb navigation shows "Aventure > {Activity Name}" with "Aventure" linking back to `/aventure/`
6. Sticky CTA button "Réserver mon aventure" follows scroll on desktop (fixed sidebar or sticky bottom bar on mobile)
7. Each page emits unique SportsActivityLocation JSON-LD with activity-specific data (name, price, description)
8. Each page has unique SEO title ("{Activity Name} — Aventure | La Terrasse") and meta description derived from the activity's description field
9. All content is sourced from Keystatic — no hardcoded activity data

## Tasks / Subtasks

- [ ] Task 1: Create `src/pages/aventure/[slug].astro` (AC: #1, #2, #8, #9)
  - [ ] Implement `getStaticPaths()` querying all entries from Keystatic `activities` collection
  - [ ] Return `params: { slug }` and `props: { activity }` for each entry
  - [ ] Import `getLangFromUrl`, `useTranslations`, `getLocalizedField` from `@/i18n/utils`
  - [ ] Import `poleConfigs` from `@/lib/pole-config`
  - [ ] Pass to BaseLayout: pole="aventure", unique title/description per activity, JSON-LD
- [ ] Task 2: Hero section (AC: #2, #5)
  - [ ] Full-width hero with activity's primary image (first from `images` array)
  - [ ] Dark gradient overlay (from bottom) for text readability
  - [ ] Breadcrumb above title: small caps "AVENTURE" in off-white, linked to `/aventure/`
  - [ ] Activity name as H1 in white, overlaid on hero image
  - [ ] Hero height: 50vh desktop, 40vh mobile
  - [ ] Apply vert végétal accent line or border detail below hero
- [ ] Task 3: Practical info grid (AC: #4)
  - [ ] Create info section below hero with 4 data points in a horizontal row (desktop) or 2x2 grid (mobile)
  - [ ] Price: formatted as "{X} €" with currency symbol, prominent size
  - [ ] Age: "Dès {age_min} ans" with person/child icon
  - [ ] Duration: formatted "~{X}h" or "~{X}min" with clock icon
  - [ ] Group size: "{min}–{max} personnes" with group icon
  - [ ] Each data point: icon + label + value, centered in a bordered card
- [ ] Task 4: MDX body rendering (AC: #3, #9)
  - [ ] Render the activity's MDX body content using Astro's content rendering
  - [ ] Apply prose typography styles: max-width 768px, centered, comfortable line-height
  - [ ] Ensure MDX components (headings, lists, images, links) are styled consistently
  - [ ] Use `getLocalizedField()` for translated content when available
- [ ] Task 5: Practical details section (AC: #4)
  - [ ] "Bon à savoir" section with practical tips: what to bring, location within site, accessibility notes
  - [ ] Content sourced from CMS if available, or static defaults
  - [ ] Styled as a light-background callout box with vert végétal left border
- [ ] Task 6: Sticky CTA (AC: #6)
  - [ ] Desktop: sticky CTA in right sidebar or floating button that stays visible during scroll
  - [ ] Mobile: sticky bottom bar with "Réserver mon aventure" button, full-width
  - [ ] CTA links to the booking action defined in `poleConfigs.aventure.ctaHref`
  - [ ] Button styled with vert végétal background, white text, rounded
  - [ ] Ensure CTA does not overlap content — add bottom padding on mobile to account for sticky bar
- [ ] Task 7: SEO & JSON-LD (AC: #7, #8)
  - [ ] Generate SportsActivityLocation JSON-LD per activity using `generateSportsActivityLD(activity)`
  - [ ] Pass activity-specific fields: name, description, price, image URL
  - [ ] SEO title: "{Activity Name} — Aventure | La Terrasse Saint-Ferréol"
  - [ ] Meta description: first 155 chars of activity description

## Dev Notes

### Architecture Patterns (MUST follow)

- **Pole-aware pattern:** Apply aventure colors via inline `style` attributes. The entire page uses vert végétal (#537b47) as accent. [Source: architecture.md#Pole-Aware Component Pattern]
- **Content collections:** Use Astro's content collections API with `getStaticPaths()` for static generation of all activity pages at build time. [Source: architecture.md#Content Collections]
- **Import aliases:** Always use `@/` prefix for imports from `src/`. [Source: architecture.md#Import Patterns]
- **Rendering boundary:** This is a static Astro page. The sticky CTA can be CSS-only (`position: sticky`) — no Svelte island needed unless scroll-based behavior requires JS. [Source: architecture.md#Rendering Boundary]
- **i18n:** All text content via `getLocalizedField()`. All links via `getLocalizedPath()`. [Source: architecture.md#i18n Patterns]

### Project Structure Notes

- `src/pages/aventure/[slug].astro` — NEW file, dynamic route for activity detail pages
- `src/components/aventure/ActivityCard.astro` — EXISTS from Story 3.1, not used directly here but same data model
- `src/lib/seo.ts` — EXISTS from Story 1.1, contains `generateSportsActivityLD()`
- `src/lib/pole-config.ts` — EXISTS from Story 1.1, provides aventure pole config

### Content Model Reference

Keystatic `activities` collection fields:
```
title: string
slug: string
description: string (short, for cards and meta)
price: number
age_min: number
duration: number (minutes)
group_size: { min: number, max: number }
images: string[] (paths relative to public/)
body: MDX (rich content)
// i18n fields:
title_en, title_es
description_en, description_es
body_en, body_es
```

### Design Tokens Reference

- Hero height: 50vh desktop / 40vh mobile (shorter than hub since content follows)
- Prose max-width: 768px, centered
- Info grid gap: 16px
- Section spacing: 96px desktop / 48px mobile
- Sticky CTA bottom bar height: ~64px on mobile
- Breadcrumb text: 14px, small-caps, off-white on hero

### References

- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: architecture.md#Content Collections]
- [Source: architecture.md#Rendering Boundary]
- [Source: architecture.md#i18n Patterns]
- [Source: architecture.md#SEO Patterns]
- [Source: ux-design-specification.md#Emotional Funnel]
- [Source: ux-design-specification.md#Activity Detail Page]
- [Source: prd.md#Aventure Pole]
- [Source: CLAUDE.md#Tailwind CSS v4]
- [Source: CLAUDE.md#Svelte Islands in Astro]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
