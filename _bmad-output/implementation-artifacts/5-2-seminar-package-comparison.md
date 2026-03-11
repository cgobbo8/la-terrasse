# Story 5.2: Seminar Package Comparison

Status: ready-for-dev

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

- [ ] Task 1: Create `src/components/evenements/SeminarPackageCard.astro` (AC: #1, #2, #6)
  - [ ] Accept props: title, subtitle, description, inclusions (string[]), price (string), ctaHref (string), highlighted (boolean for featured/recommended)
  - [ ] Render card with: subtitle (uppercase small), title (heading), description, inclusion list with bullet markers, price display, CTA button
  - [ ] CTA button text: "Demander un devis" — href is a mailto: link (constructed by parent)
  - [ ] Use bleu ardoise (#3d4969) accent via inline `style` for headings and CTA
  - [ ] Optional `highlighted` prop adds a subtle border or "Recommandé" badge for Séminaire Gourmet (most popular)
  - [ ] Card style: white background, rounded-2xl, border, hover shadow — consistent with existing evenements card pattern

- [ ] Task 2: Create `src/components/evenements/PackComparator.astro` (AC: #3, #4, #5)
  - [ ] Accept props: packages (array of package objects from Keystatic seminars collection)
  - [ ] Desktop (md+): Render a comparison table with feature rows
    - [ ] Header row: package names
    - [ ] Feature rows: each feature with check (included) or cross/dash (not included) per package
    - [ ] Features to compare: Salle équipée, Vidéoprojecteur, Wi-Fi, Parking, Petit-déjeuner d'accueil, Déjeuner, Pauses café, Activités team building, Encadrement dédié
    - [ ] Price row at bottom
    - [ ] CTA row: "Demander un devis" per package
  - [ ] Mobile (<md): Render stacked SeminarPackageCard components instead of table
  - [ ] Use CSS `hidden md:block` / `md:hidden` for responsive switch (no JS needed)
  - [ ] Check marks: bleu ardoise checkmark icon or bullet. Cross: gray dash or empty
  - [ ] Clean, professional styling matching bleu ardoise pole identity

- [ ] Task 3: Update `src/pages/evenements/index.astro` packages section (AC: #5, #6)
  - [ ] Replace current hardcoded `packs` array (lines 16-38) with Keystatic seminars query
  - [ ] Query: `const seminars = await getCollection('seminars');`
  - [ ] Sort seminars by a sort_order field or fixed slug order: seminaire-simple, seminaire-gourmet, seminaire-aventure
  - [ ] Replace current packages grid with PackComparator component
  - [ ] Pass constructed mailto: hrefs per package (see Story 5.3 for format)

- [ ] Task 4: Verify Keystatic seminars collection schema (AC: #5)
  - [ ] Confirm seminars collection has fields: title, subtitle, description, inclusions (list of strings), price (string), features (map of feature_name → boolean for comparator)
  - [ ] If `features` field is missing, add it to keystatic.config.tsx seminars collection
  - [ ] Ensure 3 entries exist: seminaire-simple, seminaire-gourmet, seminaire-aventure
  - [ ] Seed with content from current hardcoded packs data if entries don't exist

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

### Debug Log References

### Completion Notes List

### File List
