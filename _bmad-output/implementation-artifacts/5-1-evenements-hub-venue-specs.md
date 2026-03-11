# Story 5.1: Événements Hub & Venue Specs

Status: review

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

- [x] Task 1: Create `src/components/evenements/VenueSpecs.astro` (AC: #1, #2)
  - [x] Accept props: capacity (seated/standing), surface, equipment list, layout options — all typed from Keystatic venue schema
  - [x] Render scannable grid: each spec item as a card/row with icon + label + value
  - [x] Equipment rendered as pill badges (existing pattern from current evenements/index.astro)
  - [x] Layout options (théâtre, U-shape, table ronde, îlots) as distinct items with capacity per config
  - [x] Use bleu ardoise (#3d4969) accent color via inline `style` attributes
  - [x] Responsive: 2-column grid on desktop, single column stacked on mobile
  - [x] No Svelte island needed — pure Astro component

- [x] Task 2: Update `src/pages/evenements/index.astro` — hero + specs integration (AC: #1, #4, #6)
  - [x] Replace current hardcoded venue specs section with VenueSpecs.astro component
  - [x] Query Keystatic `venue` singleton in frontmatter: `const venue = await getEntry('venue', 'venue');`
  - [x] Pass venue data as props to VenueSpecs
  - [x] Keep specs section immediately after hero (specs-first layout pattern)
  - [x] Maintain existing packages section below specs
  - [x] Maintain existing CrossLinkBlock at page bottom

- [x] Task 3: Update SEO metadata for événements hub (AC: #3, #5)
  - [x] Set meta title: "Séminaire nature près de Toulouse — La Terrasse Saint-Ferréol"
  - [x] Set meta description targeting "salle de séminaire", "lac de Saint-Ferréol", "nature"
  - [x] Generate LocalBusiness JSON-LD with event venue properties via seo.ts
  - [x] Include amenity features (Wi-Fi, projector, etc.) in structured data

- [x] Task 4: Verify Keystatic venue singleton schema (AC: #4)
  - [x] Confirm venue singleton has fields: capacity_seated, capacity_standing, surface_m2, equipment (list), layout_options (list with name + capacity)
  - [x] If fields are missing, add them to `keystatic.config.tsx` venue singleton definition
  - [x] Verify venue singleton has sample data or seed with placeholder values

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
Claude Opus 4.6

### Debug Log References
- Keystatic venue singleton schema updated from simple text fields to structured typed fields (capacitySeated, capacityStanding, surfaceM2, layoutOptions with name+capacity)
- Added `format: { data: 'yaml' }` to venue singleton to match project pattern
- Fixed readonly array type compatibility between Keystatic reader output and component props
- Build error on `astro build` is pre-existing (Tailwind v4 + SSR module resolution), not introduced by this story
- Used `createReader` pattern (same as repas-groupe.astro) instead of `getEntry` from `astro:content` since no content config exists

### Completion Notes List
- Task 4: Updated keystatic.config.ts venue singleton with structured fields (capacitySeated, capacityStanding, surfaceM2, equipment array, layoutOptions array with name+capacity), added i18n fields for EN/ES. Created seed data in src/content/venue/info.yaml.
- Task 1: Created VenueSpecs.astro with scannable spec sheet layout — key figures row (3 cards: seated, standing, surface), equipment pills with checkmark icons, layout configuration grid. All bleu ardoise (#3d4969) via inline styles.
- Task 2: Rewrote evenements/index.astro to load venue data from Keystatic reader, pass to VenueSpecs component, specs-first layout immediately after hero, maintained packs section and CrossLinkBlock. Replaced hardcoded venue specs with dynamic Keystatic data. Applied bleu ardoise inline styles throughout (replacing Tailwind color classes).
- Task 3: Added generateEventVenueLD() function to seo.ts (EventVenue schema type with maximumAttendeeCapacity and amenityFeature). Set meta title targeting "séminaire nature Toulouse" and description with "salle de séminaire au lac de Saint-Ferréol".

### File List
- src/components/evenements/VenueSpecs.astro (NEW)
- src/pages/evenements/index.astro (MODIFIED)
- src/lib/seo.ts (MODIFIED)
- keystatic.config.ts (MODIFIED)
- src/content/venue/info.yaml (NEW)
- _bmad-output/implementation-artifacts/sprint-status.yaml (MODIFIED)

## Change Log
- 2026-03-11: Story 5.1 implemented — VenueSpecs component, Keystatic venue schema upgrade, EventVenue JSON-LD, SEO metadata targeting "séminaire nature Toulouse"
