# Story 3.3: Lateral Navigation & Alternative Suggestions

Status: ready-for-dev

## Story

As a visitor browsing activity detail pages,
I want to see alternative activities and navigate between them,
so that I can discover options that might better fit my group's ages or interests without returning to the hub.

## Acceptance Criteria

1. Each activity detail page displays 2–3 alternative suggestions under a "Vous pourriez aussi aimer" heading below the main content
2. Alternative suggestions use the same `ActivityCard` component from Story 3.1 for visual consistency
3. At least one alternative has a different `age_min` than the current activity to maximize group coverage (e.g., if current is 10+, suggest one that's 4+)
4. The current activity is excluded from the alternatives list
5. Prev/next lateral navigation links appear between the main content and alternatives, allowing sequential browsing through all activities
6. Clicking an alternative card navigates to that activity's detail page
7. Alternatives section is responsive: 3 cards in a row on desktop, 2 on tablet, stacked on mobile
8. All navigation links use `getLocalizedPath()` for i18n correctness

## Tasks / Subtasks

- [ ] Task 1: Create `src/components/aventure/AlternativeSuggestions.astro` (AC: #1, #2, #3, #4, #6, #7)
  - [ ] Define props: `currentSlug: string`, `activities: Activity[]`, `lang: Lang`
  - [ ] Filter out the current activity by slug
  - [ ] Implement selection logic: pick 2–3 activities prioritizing age diversity
    - [ ] Sort remaining activities by `age_min` difference from current (descending)
    - [ ] Pick the one with the most different `age_min` first
    - [ ] Fill remaining slots randomly or by variety (different duration ranges)
  - [ ] Render section with H3 "Vous pourriez aussi aimer"
  - [ ] Render selected activities using `ActivityCard` component in a responsive grid
  - [ ] Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- [ ] Task 2: Create `src/components/aventure/ActivityPrevNext.astro` (AC: #5, #8)
  - [ ] Define props: `currentSlug: string`, `activities: Activity[]`, `lang: Lang`
  - [ ] Determine activity order (same order as CMS collection / hub grid)
  - [ ] Find current activity index in the ordered list
  - [ ] Compute prev (index - 1, wrap to last if at start) and next (index + 1, wrap to first if at end)
  - [ ] Render two navigation links: "← {Prev Activity Name}" and "{Next Activity Name} →"
  - [ ] Style: flexbox with space-between, prev left-aligned, next right-aligned
  - [ ] Links use `getLocalizedPath('/aventure/' + slug, lang)`
  - [ ] Hover: underline + accent color transition
- [ ] Task 3: Integrate into `src/pages/aventure/[slug].astro` (AC: #1, #5)
  - [ ] Pass full activities array from `getStaticPaths()` to the page props
  - [ ] After main content and before footer: render `ActivityPrevNext`
  - [ ] After prev/next: render `AlternativeSuggestions`
  - [ ] Add a subtle horizontal divider (`<hr>`) between main content and lateral nav section
  - [ ] Ensure section spacing matches design tokens (96px desktop / 48px mobile)
- [ ] Task 4: i18n for section headings (AC: #8)
  - [ ] Add translation keys: `aventure.alternatives.title` → "Vous pourriez aussi aimer" / "You might also like" / "También te puede gustar"
  - [ ] Add translation keys for prev/next labels if needed
  - [ ] Use `useTranslations(lang)` for section heading

## Dev Notes

### Architecture Patterns (MUST follow)

- **Component reuse:** `ActivityCard` from Story 3.1 MUST be reused here. Do not create a duplicate card component. [Source: architecture.md#Component Organization]
- **Pole-aware pattern:** These components inherit the aventure pole context from the parent page. Cards use vert végétal accent via inline styles. [Source: architecture.md#Pole-Aware Component Pattern]
- **Rendering boundary:** Both components are Astro (zero JS). No Svelte island needed — all data is available at build time. [Source: architecture.md#Rendering Boundary]
- **Import aliases:** Always use `@/` prefix. [Source: architecture.md#Import Patterns]
- **i18n:** All links via `getLocalizedPath()`. Headings via `useTranslations()`. [Source: architecture.md#i18n Patterns]

### Project Structure Notes

- `src/components/aventure/AlternativeSuggestions.astro` — NEW file
- `src/components/aventure/ActivityPrevNext.astro` — NEW file
- `src/pages/aventure/[slug].astro` — EXISTS from Story 3.2, needs integration of new components
- `src/components/aventure/ActivityCard.astro` — EXISTS from Story 3.1, reused here

### Alternative Selection Algorithm

```
Input: currentSlug, allActivities[]
1. filtered = allActivities.filter(a => a.slug !== currentSlug)
2. currentAgeMin = current activity's age_min
3. Sort filtered by |a.age_min - currentAgeMin| descending
4. Pick first (most different age) as slot 1
5. From remaining, pick one with different duration range as slot 2
6. If 3 slots desired, pick one more at random from remaining
7. Return selected 2-3 activities
```

### Prev/Next Order

Activities follow the same order as returned by the Keystatic collection query (which matches the hub grid order). This ensures consistent navigation. If a visitor browses prev/next through all activities, they see them in the same sequence as the hub grid.

### Design Tokens Reference

- Section spacing before alternatives: 96px desktop / 48px mobile
- Divider: 1px border-gray-200
- Prev/next link text: 16px, accent color on hover
- Prev/next container: max-width 768px, centered (matching prose width)
- Alternatives grid: full content width (max 1280px)

### References

- [Source: architecture.md#Component Organization]
- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: architecture.md#Rendering Boundary]
- [Source: architecture.md#i18n Patterns]
- [Source: ux-design-specification.md#Lateral Navigation Pattern]
- [Source: prd.md#Aventure Pole — Activity Discovery]
- [Source: CLAUDE.md#Tailwind CSS v4]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
