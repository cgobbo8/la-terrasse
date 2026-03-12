# Story 6.2: Contextual Narrative Cross-Links

Status: review

## Story

As a visitor reading about a service,
I want natural narrative suggestions pointing to complementary services,
so that I discover the full experience without feeling sold to.

## Acceptance Criteria

1. Activity pages (Aventure pole) include a narrative cross-link to the Restaurant, e.g., "Après votre paddle, déjeunez au bord du lac →" linking to the restaurant page
2. Restaurant pages include a narrative cross-link to Aventure, e.g., "Prolongez le plaisir — balade ou pédalo après le déjeuner →" linking to the aventure page
3. Événements pages include narrative cross-links mentioning both team-building activities (→ Aventure) and restaurant catering (→ Restaurant)
4. All narrative text is custom per page — never generic boilerplate. Each sentence matches the emotional register of the page it appears on.
5. Cross-links use a ghost button style: text-only, accent color matching the TARGET pole, underline on hover, no background, no border
6. A reusable ContextualCrossLink.astro component is created accepting props: text, href, pole (target pole for accent color)
7. Cross-links are positioned after the main content sections but before the structural CrossLinkBlock and CTA sections

## Tasks / Subtasks

- [x] Task 1: Create `src/components/common/ContextualCrossLink.astro` (AC: #5, #6)
  - [x] Accept props: `text` (string — the narrative sentence), `href` (string — destination link), `pole` (target pole for accent color styling)
  - [x] Render as a `<div>` with `<a>` inside: the narrative text with an inline link or the entire block as a link
  - [x] Ghost button style: text rendered in the target pole's accent color, arrow (→) appended, underline on hover
  - [x] Accent colors applied via inline `style` attribute based on pole prop: restaurant=#2D2B1B, aventure=#537b47, evenements=#3d4969
  - [x] Typography: italic or regular text, slightly larger than body (text-lg), centered or left-aligned depending on page context
  - [x] Padding: generous vertical spacing (py-8 to py-12) to let the suggestion breathe
  - [x] Semantic: use `<aside>` or `<div role="complementary">` since this is supplementary navigation

- [x] Task 2: Add contextual cross-links to Aventure pole pages (AC: #1, #4, #7)
  - [x] Aventure hub (`src/pages/aventure/index.astro`): Add ContextualCrossLink after activity grid, before CrossLinkBlock
    - [x] Text: "Après l'effort, le réconfort — déjeunez au bord du lac avec des produits locaux →"
    - [x] Href: `/restaurant` (via getLocalizedPath)
    - [x] Pole: `restaurant` (target pole accent)
  - [x] Activity detail pages (if they exist): Add page-specific narrative cross-links
    - [x] Paddle page: "Après votre session paddle, prolongez au restaurant avec vue sur le lac →"
    - [x] Archery tag page: "Match terminé ? Célébrez autour d'un bon repas entre équipes →"
    - [x] Each activity page gets a UNIQUE narrative — no copy-paste

- [x] Task 3: Add contextual cross-links to Restaurant pole pages (AC: #2, #4, #7)
  - [x] Restaurant hub (`src/pages/restaurant/index.astro`): Add ContextualCrossLink after menu/ambiance section, before CrossLinkBlock
    - [x] Text: "Prolongez le plaisir — balade ou pédalo sur le lac après le déjeuner →"
    - [x] Href: `/aventure` (via getLocalizedPath)
    - [x] Pole: `aventure` (target pole accent)
  - [x] Menu page (if exists): "Envie de digérer en douceur ? Le lac vous attend pour une balade →"
  - [x] Group dining page (if exists): "Combinez repas de groupe et activités — la journée parfaite →"

- [x] Task 4: Add contextual cross-links to Événements pole pages (AC: #3, #4, #7)
  - [x] Événements hub (`src/pages/evenements/index.astro`): Add TWO ContextualCrossLinks after packages section, before CrossLinkBlock
    - [x] Cross-link 1 — to Aventure: "Renforcez la cohésion de votre équipe — archery tag, paddle ou course d'orientation en pleine nature →"
    - [x] Cross-link 1 href: `/aventure`, pole: `aventure`
    - [x] Cross-link 2 — to Restaurant: "Offrez un déjeuner fait maison à vos équipes — cuisine locale et terrasse au bord du lac →"
    - [x] Cross-link 2 href: `/restaurant`, pole: `restaurant`
  - [x] Position both after the packages section, before the CrossLinkBlock

- [x] Task 5: Write i18n translation keys for cross-link texts (AC: #4)
  - [x] Create translation keys for each narrative text in FR translation file
  - [x] Add placeholder EN/ES translations (can be refined later)
  - [x] Key naming convention: `crosslink.{sourcePage}.{targetPole}` (e.g., `crosslink.aventure.restaurant`, `crosslink.restaurant.aventure`)

## Dev Notes

### Layer 2 of the Cross-Linking System

This is the **narrative** layer — warm, contextual, page-specific. Contrasts with:
- Layer 1 (structural — Story 6.1): Same block on every page, neutral tone
- Layer 3 (organic mentions): Natural references within body copy, no dedicated component

Key principle: **Every narrative text is custom.** The visitor should feel like the suggestion flows naturally from what they just read. Generic text like "Découvrez aussi notre restaurant" is banned — it feels like an ad, not a recommendation.

### Emotional Register Examples

Each cross-link matches the page's emotional tone:
- After **paddle** (energetic, outdoor): "Après votre session..." → casual, continuation energy
- After **restaurant** (relaxed, indulgent): "Prolongez le plaisir..." → gentle, unhurried
- After **séminaire** (professional, structured): "Renforcez la cohésion..." → purposeful, ROI-oriented

### Ghost Button Style

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Après l'effort, le réconfort — déjeunez au      │
│  bord du lac avec des produits locaux →           │  ← text in #2D2B1B (restaurant accent)
│                                                  │  ← underline appears on hover
│                                                  │
└──────────────────────────────────────────────────┘
```

- No background, no border, no card — just text
- Color = TARGET pole accent (not source pole)
- Arrow (→) is part of the text, not a separate icon
- Underline appears on hover only
- Generous whitespace around it

### Architecture Patterns

- **ContextualCrossLink is Astro-only:** Zero JS. Just styled HTML with an `<a>` tag.
- **Pole colors via inline style:** The `pole` prop resolves to the target pole's accent color. Use a simple lookup: `const colors = { restaurant: '#2D2B1B', aventure: '#537b47', evenements: '#3d4969' }`.
- **i18n:** Narrative texts should ideally be translation keys, but for V1 can be hardcoded in French with a TODO for i18n.
- **Placement:** After main content, before structural CrossLinkBlock. The page flow is: Hero → Content → Contextual Cross-Links → Structural Cross-Link Block → Footer.

### Project Structure Notes

- `src/components/common/ContextualCrossLink.astro` — NEW file
- `src/pages/aventure/index.astro` — EXISTS (or should exist), add cross-link
- `src/pages/restaurant/index.astro` — EXISTS (or should exist), add cross-link
- `src/pages/evenements/index.astro` — EXISTS, add 2 cross-links before CrossLinkBlock (currently at line 143)
- Activity detail pages (under `src/pages/aventure/`) — may or may not exist yet; add cross-links when they do

### Dependencies

- Story 6.1 must be complete (structural CrossLinkBlock is the placement anchor — contextual links go BEFORE it)
- Pole pages must exist (Stories 3.1, 4.1, 5.1) for the links to have valid destinations

### References

- [Source: architecture.md#Cross-Linking System — 3 Layers]
- [Source: ux-design-specification.md#Narrative Cross-Link Pattern]
- [Source: prd.md#Cross-Pole Discovery Requirements]
- [Source: brainstorming-session-2026-03-08-1730.md#Cross-link ideas]

## Change Log

- 2026-03-12: Initial implementation of all 5 tasks — ContextualCrossLink component, integration on all pole pages, i18n keys for FR/EN/ES

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build passed with 0 new errors (pre-existing type errors in en-groupe.astro and readonly issues in carte/repas-groupe remain unchanged)

### Completion Notes List

- Created reusable `ContextualCrossLink.astro` component: zero-JS Astro component with `<aside>` semantic, ghost button style (text-only, target pole accent color via inline style, underline on hover), generous spacing (py-10/py-14)
- Replaced existing inline cross-sell sections on aventure hub, aventure detail [slug], restaurant hub, restaurant carte, restaurant repas-groupe with the new component
- Added 2 contextual cross-links to événements hub (→ aventure + → restaurant), positioned before CrossLinkBlock
- Activity detail pages use a slug-based mapping for unique narrative text per activity (paddle, archery-tag, pédalo, canoë, VTT, mini-golf) with a warm fallback for unlisted activities
- Added 13 new i18n translation keys in all 3 languages (FR, EN, ES) following `crosslink.{sourcePage}.{targetPole}` naming convention

### File List

- `src/components/common/ContextualCrossLink.astro` — NEW: reusable contextual cross-link component
- `src/pages/aventure/index.astro` — MODIFIED: replaced inline cross-sell with ContextualCrossLink
- `src/pages/aventure/[slug].astro` — MODIFIED: replaced inline cross-sell with slug-based ContextualCrossLink
- `src/pages/restaurant/index.astro` — MODIFIED: replaced inline cross-sell with ContextualCrossLink
- `src/pages/restaurant/carte.astro` — MODIFIED: replaced inline cross-sell with ContextualCrossLink
- `src/pages/restaurant/repas-groupe.astro` — MODIFIED: replaced inline cross-sell with ContextualCrossLink
- `src/pages/evenements/index.astro` — MODIFIED: added 2 ContextualCrossLinks before CrossLinkBlock
- `src/i18n/translations.ts` — MODIFIED: added 13 cross-link narrative translation keys in FR/EN/ES
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — MODIFIED: story status updated
- `_bmad-output/implementation-artifacts/6-2-contextual-narrative-cross-links.md` — MODIFIED: tasks marked complete
