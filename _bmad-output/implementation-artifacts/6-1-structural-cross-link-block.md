# Story 6.1: Structural Cross-Link Block

Status: ready-for-dev

## Story

As a visitor on any pole page,
I want to discover the other poles via a "La Terrasse c'est aussi..." section near the page bottom,
so that I'm aware of the full range of offerings without leaving the current page's context.

## Acceptance Criteria

1. A permanent cross-link block appears near the bottom of every pole page (restaurant, aventure, evenements) showing the 2 other poles as cards
2. On the Restaurant page, the block shows Aventure + Événements cards; on Aventure, it shows Restaurant + Événements; on Événements, it shows Restaurant + Aventure
3. Each card displays: pole image (placeholder-ready), pole name ("La Terrasse {Pole}"), short description, and a ghost CTA "Découvrir →"
4. Clicking a card navigates to the corresponding pole hub page (e.g., /aventure, /restaurant, /evenements) with proper i18n path
5. The block is NOT rendered on transversal pages (en-famille, en-groupe, en-entreprise) — those pages already span all poles
6. The section title is translated via i18n key `common.alsoAt` (already exists: "La Terrasse, c'est aussi...")
7. Neutral, educational tone — not promotional. The block informs, it doesn't sell.

## Tasks / Subtasks

- [ ] Task 1: Audit existing CrossLinkBlock.astro component (AC: #1, #2, #4, #6)
  - [ ] Read current implementation at `src/components/common/CrossLinkBlock.astro`
  - [ ] Confirm it accepts `currentPole` prop and correctly filters to show the 2 other poles
  - [ ] Confirm it uses `getLocalizedPath()` for i18n-safe hrefs
  - [ ] Confirm it uses `t('common.alsoAt')` for the section heading
  - [ ] Verify the component renders correctly with all 3 possible `currentPole` values

- [ ] Task 2: Enhance CrossLinkBlock with image + ghost CTA (AC: #3)
  - [ ] Add pole image to each card (placeholder div with pole light background color for V1, replaceable with `<img>` when photos are available)
  - [ ] Add ghost CTA text "Découvrir →" at the bottom of each card
  - [ ] Ghost CTA style: text-only, pole accent color, underline on hover, no background, no border
  - [ ] Ensure card layout: image area (aspect-[16/9] placeholder) → pole name → description → ghost CTA
  - [ ] Each pole's description should be concise and neutral (current descriptions are good: "Une cuisine simple, locale et gourmande", etc.)

- [ ] Task 3: Verify CrossLinkBlock placement on all pole pages (AC: #1, #5)
  - [ ] Confirm included in `src/pages/evenements/index.astro` — YES (line 143: `<CrossLinkBlock currentPole="evenements" />`)
  - [ ] Confirm included in `src/pages/restaurant/index.astro` with `currentPole="restaurant"` — check and add if missing
  - [ ] Confirm included in `src/pages/aventure/index.astro` with `currentPole="aventure"` — check and add if missing
  - [ ] Confirm included on activity detail pages (if they exist) with `currentPole="aventure"`
  - [ ] Confirm NOT included on: en-famille.astro, en-groupe.astro, en-entreprise.astro — verify none of these import or render CrossLinkBlock

- [ ] Task 4: Add i18n translations for descriptions if missing (AC: #6, #7)
  - [ ] Verify `common.alsoAt` translation key exists in FR/EN/ES translation files
  - [ ] Add pole description translation keys if descriptions should be translatable (e.g., `crosslink.restaurant.description`, `crosslink.aventure.description`, `crosslink.evenements.description`)
  - [ ] Add "Découvrir →" CTA text as translation key: `common.discover`

## Dev Notes

### Layer 1 of the Cross-Linking System

The cross-linking architecture has 3 layers:
1. **Structural (this story):** "La Terrasse c'est aussi..." block on every pole page. Permanent, consistent, predictable.
2. **Contextual narrative (Story 6.2):** Custom narrative sentences embedded in page content. Variable per page.
3. **Organic group mentions (in content):** Natural references within page copy.

This story handles Layer 1 only. It must be:
- Visually consistent across all pole pages
- Positioned identically (above footer, below main content)
- Neutral in tone (informational, not promotional)

### Existing Component State

CrossLinkBlock.astro already exists and is functional. Current state:
- Accepts `currentPole` prop, filters correctly
- Uses `t('common.alsoAt')` for heading
- Uses `getLocalizedPath()` for links
- Cards have: pole name, description, colored background + border
- Missing: pole image, ghost CTA text

This story is primarily about **enhancement and verification**, not creation from scratch.

### Card Design Target

```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │  [Image / Placeholder]│  │
│  │  aspect-[16/9]        │  │
│  └───────────────────────┘  │
│                             │
│  La Terrasse Restaurant     │  ← font-heading, bold, pole accent color
│  Une cuisine simple, locale │  ← text-gray-600, text-sm
│  et gourmande               │
│                             │
│  Découvrir →                │  ← ghost CTA, pole accent, underline on hover
└─────────────────────────────┘
```

### Architecture Patterns

- **No pole theming on the block itself:** The block sits on a neutral gray-100 background. Individual cards use pole-specific light backgrounds and accent text colors.
- **i18n:** All user-facing strings through translation utility. Pole descriptions may be hardcoded in FR for V1 if translation keys are not yet set up for EN/ES.
- **Responsive:** 2-column grid on md+, single column on mobile. Already implemented.
- **Placement:** Always above `<Footer>`, after all main content sections. Consistent spacing.

### Project Structure Notes

- `src/components/common/CrossLinkBlock.astro` — EXISTS, enhance with image + ghost CTA
- `src/pages/evenements/index.astro` — EXISTS, already includes CrossLinkBlock (line 143)
- `src/pages/restaurant/index.astro` — CHECK if exists and includes CrossLinkBlock
- `src/pages/aventure/index.astro` — CHECK if exists and includes CrossLinkBlock
- `src/pages/en-famille.astro` — EXISTS, must NOT include CrossLinkBlock
- `src/pages/en-groupe.astro` — EXISTS, must NOT include CrossLinkBlock
- `src/pages/en-entreprise.astro` — EXISTS, must NOT include CrossLinkBlock

### References

- [Source: architecture.md#Cross-Linking System — 3 Layers]
- [Source: ux-design-specification.md#Cross-Pole Discovery Pattern]
- [Source: prd.md#Cross-Linking Requirements]
- Current CrossLinkBlock.astro implementation at `src/components/common/CrossLinkBlock.astro`

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
