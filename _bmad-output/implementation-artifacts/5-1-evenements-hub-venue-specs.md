# Story 5.1: Événements Hub & Venue Specs

Status: ready-for-dev

## Story

As a corporate planner,
I want venue specs (capacity, equipment, layout options) immediately visible on the événements page,
so that I can assess whether the space fits my seminar needs within seconds.

## Acceptance Criteria

1. Hero section uses bleu ardoise (#3d4969) theming with venue specs visible in or immediately below the hero (capacity seated/standing, surface area, configuration options)
2. Equipment list is displayed in a scannable grid format (vidéoprojecteur, Wi-Fi, flipchart/paperboard, sound system, parking) via a dedicated VenueSpecs.astro component — each item as icon + label + value, never paragraph format
3. Page emits LocalBusiness JSON-LD enriched with event venue properties (capacity, amenities) via seo.ts
4. All venue data (capacity, surface, equipment list, layout options) is sourced from the Keystatic `venue` singleton — no hardcoded venue specs in the component
5. Page meta title and description target "séminaire nature Toulouse" and related long-tail keywords (e.g., "salle de séminaire au lac de Saint-Ferréol")
6. Professional sober tone throughout — corporate planner (Laurent persona) must find specs within 5 seconds of page load

## Tasks / Subtasks

- [ ] Task 1: Create `src/components/evenements/VenueSpecs.astro` (AC: #1, #2)
  - [ ] Accept props: capacity (seated/standing), surface, equipment list, layout options — all typed from Keystatic venue schema
  - [ ] Render scannable grid: each spec item as a card/row with icon + label + value
  - [ ] Equipment rendered as pill badges (existing pattern from current evenements/index.astro)
  - [ ] Layout options (théâtre, U-shape, table ronde, îlots) as distinct items with capacity per config
  - [ ] Use bleu ardoise (#3d4969) accent color via inline `style` attributes
  - [ ] Responsive: 2-column grid on desktop, single column stacked on mobile
  - [ ] No Svelte island needed — pure Astro component

- [ ] Task 2: Update `src/pages/evenements/index.astro` — hero + specs integration (AC: #1, #4, #6)
  - [ ] Replace current hardcoded venue specs section with VenueSpecs.astro component
  - [ ] Query Keystatic `venue` singleton in frontmatter: `const venue = await getEntry('venue', 'venue');`
  - [ ] Pass venue data as props to VenueSpecs
  - [ ] Keep specs section immediately after hero (specs-first layout pattern)
  - [ ] Maintain existing packages section below specs
  - [ ] Maintain existing CrossLinkBlock at page bottom

- [ ] Task 3: Update SEO metadata for événements hub (AC: #3, #5)
  - [ ] Set meta title: "Séminaire nature près de Toulouse — La Terrasse Saint-Ferréol"
  - [ ] Set meta description targeting "salle de séminaire", "lac de Saint-Ferréol", "nature"
  - [ ] Generate LocalBusiness JSON-LD with event venue properties via seo.ts
  - [ ] Include amenity features (Wi-Fi, projector, etc.) in structured data

- [ ] Task 4: Verify Keystatic venue singleton schema (AC: #4)
  - [ ] Confirm venue singleton has fields: capacity_seated, capacity_standing, surface_m2, equipment (list), layout_options (list with name + capacity)
  - [ ] If fields are missing, add them to `keystatic.config.tsx` venue singleton definition
  - [ ] Verify venue singleton has sample data or seed with placeholder values

## Dev Notes

### Persona Context

Laurent (corporate planner) is the primary persona for this page. He's comparing venues in 15-minute research sessions. He needs:
- Specs visible within 5 seconds (no scrolling past decorative content)
- Scannable format (not prose paragraphs)
- Professional, sober tone (bleu ardoise = trust, competence)

### Architecture Patterns

- **Pole-aware theming:** `pole="evenements"` on BaseLayout. Bleu ardoise (#3d4969) for accents, #edf0f5 for light backgrounds. Applied via inline `style` attributes, never dynamic Tailwind classes.
- **Keystatic query pattern:** Use `import { getEntry } from 'astro:content'` in frontmatter to query venue singleton.
- **Import aliases:** Always use `@/` prefix (e.g., `@/components/evenements/VenueSpecs.astro`).
- **i18n:** Use `getLangFromUrl(Astro.url)` and `useTranslations(lang)` in frontmatter. All user-facing strings via translation keys.

### Component Design: VenueSpecs.astro

The component should follow a "spec sheet" pattern — clean, scannable, no fluff:

```
┌────────────────────────────────────────┐
│  Capacité          │  Équipements      │
│  ┌──────┐ ┌──────┐ │  [pill] [pill]    │
│  │ 80   │ │ 120  │ │  [pill] [pill]    │
│  │assis │ │debout│ │  [pill]           │
│  └──────┘ └──────┘ │                   │
│                    │                   │
│  Surface           │  Configurations   │
│  ┌──────────────┐  │  Théâtre: 80 pers │
│  │    — m²      │  │  U-shape: 30 pers │
│  └──────────────┘  │  Îlots: 40 pers   │
└────────────────────────────────────────┘
```

### Project Structure Notes

- `src/components/evenements/VenueSpecs.astro` — NEW file (directory `src/components/evenements/` does not exist yet, must create)
- `src/pages/evenements/index.astro` — EXISTS, needs update (replace hardcoded specs with component + Keystatic query)
- `src/lib/seo.ts` — May not exist yet (Story 1.1 dependency). If not, add JSON-LD inline or defer to when seo.ts is available.
- `keystatic.config.tsx` — EXISTS, venue singleton schema to verify

### References

- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: ux-design-specification.md#Événements Pole Pages]
- [Source: prd.md#Corporate Planner Persona (Laurent)]
- [Source: CLAUDE.md#Tailwind CSS v4]
- Current evenements/index.astro has hardcoded specs at lines 54-89 — replace with VenueSpecs component

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
