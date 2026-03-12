# Story 5.2: Seminar Package Comparison

Status: review

## Story

As a corporate planner,
I want to compare three seminar packages side by side,
so that I can quickly identify which formula matches my budget and needs.

## Acceptance Criteria

1. Three seminar packages are displayed: Séminaire Simple (location sèche — venue only), Séminaire Gourmet (avec repas terroir — venue + catering), Séminaire Aventure (avec team building — venue + catering + activities)
2. Each package clearly shows its name, subtitle, short description, list of inclusions, pricing, and a CTA button
3. Desktop layout renders a side-by-side 3-column comparison table via PackComparator.astro with feature rows showing check/cross inclusion marks per package
4. Mobile layout renders stacked SeminarPackageCard.astro components (one per package, vertically stacked)
5. All package data (title, description, inclusions, price, features) is sourced from the Keystatic `seminars` collection — not hardcoded in components
6. Each package CTA reads "Demander un devis" and links to a mailto: with the package name pre-filled in the subject line (see Story 5.3)

## Tasks / Subtasks

- [x] Task 1: Create `src/components/evenements/SeminarPackageCard.astro` (AC: #1, #2, #6)
  - [x] Accept props: title, subtitle, description, inclusions (string[]), price (string), ctaHref (string), highlighted (boolean for featured/recommended)
  - [x] Render card with: subtitle (uppercase small), title (heading), description, inclusion list with bullet markers, price display, CTA button
  - [x] CTA button text: "Demander un devis" — href is a mailto: link (constructed by parent)
  - [x] Use bleu ardoise (#3d4969) accent via inline `style` for headings and CTA
  - [x] Optional `highlighted` prop adds a subtle border or "Recommandé" badge for Séminaire Gourmet (most popular)
  - [x] Card style: white background, rounded-2xl, border, hover shadow — consistent with existing evenements card pattern

- [x] Task 2: Create `src/components/evenements/PackComparator.astro` (AC: #3, #4, #5)
  - [x] Accept props: packages (array of package objects from Keystatic seminars collection)
  - [x] Desktop (md+): Render a comparison table with feature rows
    - [x] Header row: package names
    - [x] Feature rows: each feature with check (included) or cross/dash (not included) per package
    - [x] Features to compare: Salle équipée, Vidéoprojecteur, Wi-Fi, Parking, Petit-déjeuner d'accueil, Déjeuner, Pauses café, Activités team building, Encadrement dédié
    - [x] Price row at bottom
    - [x] CTA row: "Demander un devis" per package
  - [x] Mobile (<md): Render stacked SeminarPackageCard components instead of table
  - [x] Use CSS `hidden md:block` / `md:hidden` for responsive switch (no JS needed)
  - [x] Check marks: bleu ardoise checkmark icon or bullet. Cross: gray dash or empty
  - [x] Clean, professional styling matching bleu ardoise pole identity

- [x] Task 3: Update `src/pages/evenements/index.astro` packages section (AC: #5, #6)
  - [x] Replace current hardcoded `packs` array (lines 16-38) with Keystatic seminars query
  - [x] Query: `const seminars = await reader.collections.seminars.all();`
  - [x] Sort seminars by a sort_order field or fixed slug order: seminaire-simple, seminaire-gourmet, seminaire-aventure
  - [x] Replace current packages grid with PackComparator component
  - [x] Pass constructed mailto: hrefs per package (see Story 5.3 for format)

- [x] Task 4: Verify Keystatic seminars collection schema (AC: #5)
  - [x] Confirm seminars collection has fields: title, subtitle, description, inclusions (list of strings), price (string), features (map of feature_name → boolean for comparator)
  - [x] If `features` field is missing, add it to keystatic.config.tsx seminars collection
  - [x] Ensure 3 entries exist: seminaire-simple, seminaire-gourmet, seminaire-aventure
  - [x] Seed with content from current hardcoded packs data if entries don't exist

## Dev Notes

### Package Names Are Self-Explanatory

The naming convention is intentional — each name immediately communicates the experience level:
- **Simple** = venue only (location sèche). Corporate planner knows: "I bring everything else."
- **Gourmet** = venue + catering. "My team is fed with local products."
- **Aventure** = venue + catering + team building. "The complete cohesion day."

No need for lengthy descriptions — the name does the selling.

### Comparison Table Design

```
Desktop PackComparator:
┌──────────────────┬─────────┬─────────┬──────────┐
│                  │ Simple  │ Gourmet │ Aventure │
├──────────────────┼─────────┼─────────┼──────────┤
│ Salle équipée    │   ✓     │   ✓     │    ✓     │
│ Vidéoprojecteur  │   ✓     │   ✓     │    ✓     │
│ Wi-Fi            │   ✓     │   ✓     │    ✓     │
│ Parking          │   ✓     │   ✓     │    ✓     │
│ Petit-déjeuner   │   —     │   ✓     │    ✓     │
│ Déjeuner         │   —     │   ✓     │    ✓     │
│ Pauses café      │   —     │   ✓     │    ✓     │
│ Team building    │   —     │   —     │    ✓     │
│ Encadrement      │   —     │   —     │    ✓     │
├──────────────────┼─────────┼─────────┼──────────┤
│ À partir de      │  XX€/j  │  XX€/j  │  XX€/j   │
├──────────────────┼─────────┼─────────┼──────────┤
│                  │ [Devis] │ [Devis] │ [Devis]  │
└──────────────────┴─────────┴─────────┴──────────┘

Mobile: 3 stacked SeminarPackageCard components
```

### Architecture Patterns

- **Rendering boundary:** Both components are Astro-only (zero JS shipped). No Svelte island needed — comparison table is static content.
- **Pole theming:** Bleu ardoise (#3d4969) for all accents. Applied via inline `style` attributes.
- **Keystatic query:** Use `getCollection('seminars')` to fetch all 3 packages. Sort by slug or dedicated sort_order field.
- **Responsive strategy:** Use Tailwind `hidden md:block` / `md:hidden` to swap between table (desktop) and stacked cards (mobile). No JavaScript.

### Project Structure Notes

- `src/components/evenements/SeminarPackageCard.astro` — NEW file
- `src/components/evenements/PackComparator.astro` — NEW file
- `src/pages/evenements/index.astro` — EXISTS, update packages section (currently hardcoded at lines 16-38 and 91-123)
- `keystatic.config.tsx` — EXISTS, verify/update seminars collection schema

### Dependencies

- Story 5.1 should be completed first (it creates the `src/components/evenements/` directory and updates the page structure)
- Story 5.3 defines the mailto: CTA href format — can be implemented inline here or coordinated

### References

- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: architecture.md#Rendering Boundary — Astro vs Svelte]
- [Source: prd.md#Événements Pole — Seminar Packages]
- [Source: ux-design-specification.md#Package Comparison Pattern]
- Current hardcoded packs in evenements/index.astro lines 16-38

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — clean implementation with no blockers.

### Completion Notes List

- Created SeminarPackageCard.astro: mobile card component with bleu ardoise accent, highlighted/recommended badge, CTA mailto button, checkmark inclusion list. Follows GroupFormulaCard pattern.
- Created PackComparator.astro: responsive comparator — desktop renders a comparison table with 9 feature rows (check/dash), price row, CTA row; mobile renders stacked SeminarPackageCard components. Uses `hidden md:block` / `md:hidden` for responsive switch (zero JS).
- Updated evenements/index.astro: replaced hardcoded packs array with Keystatic `reader.collections.seminars.all()` query, sorted by order field, integrated PackComparator component.
- Added `features` object field to Keystatic seminars collection schema (9 boolean checkboxes for comparator features).
- Seeded 3 seminar content files (seminaire-simple, seminaire-gourmet, seminaire-aventure) with appropriate feature flags, inclusions, and i18n placeholders.
- Fixed pre-existing bug in `buildQuoteMailto()` that doubled "Séminaire" prefix in mailto subject lines.

### File List

- src/components/evenements/SeminarPackageCard.astro (NEW)
- src/components/evenements/PackComparator.astro (NEW)
- src/content/seminars/seminaire-simple.mdx (NEW)
- src/content/seminars/seminaire-gourmet.mdx (NEW)
- src/content/seminars/seminaire-aventure.mdx (NEW)
- src/pages/evenements/index.astro (MODIFIED)
- keystatic.config.ts (MODIFIED)
- src/lib/pole-config.ts (MODIFIED)
- _bmad-output/implementation-artifacts/sprint-status.yaml (MODIFIED)

### Change Log

- 2026-03-12: Implemented story 5-2 — seminar package comparison with desktop table and mobile cards, Keystatic-driven data, mailto CTAs
