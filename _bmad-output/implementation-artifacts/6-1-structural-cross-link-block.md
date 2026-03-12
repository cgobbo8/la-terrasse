# Story 6.1: Structural Cross-Link Block

Status: review

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

- [x] Task 1: Audit existing CrossLinkBlock.astro component (AC: #1, #2, #4, #6)
  - [x] Read current implementation at `src/components/common/CrossLinkBlock.astro`
  - [x] Confirm it accepts `currentPole` prop and correctly filters to show the 2 other poles
  - [x] Confirm it uses `getLocalizedPath()` for i18n-safe hrefs
  - [x] Confirm it uses `t('common.alsoAt')` for the section heading
  - [x] Verify the component renders correctly with all 3 possible `currentPole` values

- [x] Task 2: Enhance CrossLinkBlock with image + ghost CTA (AC: #3)
  - [x] Add pole image to each card (placeholder div with pole light background color for V1, replaceable with `<img>` when photos are available)
  - [x] Add ghost CTA text "Découvrir →" at the bottom of each card
  - [x] Ghost CTA style: text-only, pole accent color, underline on hover, no background, no border
  - [x] Ensure card layout: image area (aspect-[16/9] placeholder) → pole name → description → ghost CTA
  - [x] Each pole's description should be concise and neutral (current descriptions are good: "Une cuisine simple, locale et gourmande", etc.)

- [x] Task 3: Verify CrossLinkBlock placement on all pole pages (AC: #1, #5)
  - [x] Confirm included in `src/pages/evenements/index.astro` — YES (line 133: `<CrossLinkBlock currentPole="evenements" />`)
  - [x] Confirm included in `src/pages/restaurant/index.astro` with `currentPole="restaurant"` — YES (line 153)
  - [x] Confirm included in `src/pages/aventure/index.astro` with `currentPole="aventure"` — YES (line 167)
  - [x] Confirm included on activity detail pages (if they exist) with `currentPole="aventure"` — YES ([slug].astro line 249)
  - [x] Confirm NOT included on: en-famille.astro, en-groupe.astro, en-entreprise.astro — VERIFIED: none import CrossLinkBlock

- [x] Task 4: Add i18n translations for descriptions if missing (AC: #6, #7)
  - [x] Verify `common.alsoAt` translation key exists in FR/EN/ES translation files — YES, all 3
  - [x] Add pole description translation keys if descriptions should be translatable (e.g., `crosslink.restaurant.description`, `crosslink.aventure.description`, `crosslink.evenements.description`)
  - [x] Add "Découvrir →" CTA text as translation key: `common.discover` — already existed in FR/EN/ES

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

Claude Opus 4.6

### Debug Log References

No issues encountered.

### Completion Notes List

- Task 1: Audited existing CrossLinkBlock.astro — component was already functional with correct pole filtering, i18n hrefs, and heading translation. All 3 pole values work correctly.
- Task 2: Enhanced CrossLinkBlock with placeholder images per pole (using existing project placeholders), 16/9 aspect ratio image area with hover scale effect, and ghost CTA "Découvrir →" with pole accent color and underline on hover. Card layout follows the design spec exactly.
- Task 3: Verified CrossLinkBlock is included on all pole pages (restaurant, aventure, evenements hubs + activity detail pages + restaurant sub-pages) and NOT included on transversal pages (en-famille, en-groupe, en-entreprise).
- Task 4: Added `crosslink.restaurant.description`, `crosslink.aventure.description`, `crosslink.evenements.description` translation keys in FR/EN/ES. `common.alsoAt` and `common.discover` already existed in all 3 languages.

### Change Log

- 2026-03-12: Enhanced CrossLinkBlock with images, ghost CTA, and i18n description keys

### File List

- `src/components/common/CrossLinkBlock.astro` (modified) — added image placeholder, ghost CTA, translated descriptions
- `src/i18n/translations.ts` (modified) — added crosslink.*.description keys in FR/EN/ES
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified) — epic-6 and story status updates
