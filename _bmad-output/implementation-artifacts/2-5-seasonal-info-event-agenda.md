# Story 2.5: Seasonal Info & Event Agenda

Status: review

## Story

As a visitor,
I want to see seasonal information (opening hours, weather notes, promotions) and upcoming events on the homepage,
so that I can plan my visit with current and practical information.

## Acceptance Criteria

1. A bento-style grid displays seasonal information pulled from the Keystatic `settings` singleton, with cells for opening hours, seasonal announcements, and practical info
2. The bento grid is responsive: 2-column on mobile, 3-column on tablet, full layout on desktop
3. An agenda section displays upcoming events pulled from the Keystatic `events` collection, ordered chronologically with the nearest future event first
4. Each event entry shows: date (formatted for locale), title, and short description
5. If no events are published or all events are in the past, the agenda section either hides gracefully or displays a generic "stay tuned" message
6. All content is pulled from Keystatic at build time via the `astro:content` API, with i18n field resolution for FR/EN/ES

## Tasks / Subtasks

- [x] Task 1: Extend Keystatic `settings` singleton schema for seasonal data (AC: #1)
  - [x] Add fields to `keystatic.config.ts` → `singletons.settings.schema`:
    - `openingHours`: fields.text (already exists — verify it is multiline)
    - `seasonalMessage`: fields.text({ label: 'Message saisonnier', multiline: true }) — NEW
    - `seasonalMessage_en`: fields.text({ label: 'Seasonal message (EN)', multiline: true }) — NEW
    - `seasonalMessage_es`: fields.text({ label: 'Mensaje estacional (ES)', multiline: true }) — NEW
    - `currentSeason`: fields.select({ options: printemps/ete/automne/hiver }) — NEW
    - `promotionText`: fields.text({ label: 'Promotion en cours' }) — NEW
    - `promotionText_en` / `promotionText_es` — NEW
  - [x] If modifying the singleton schema is out of scope, use hardcoded placeholder data in the component with a `TODO: wire to CMS` comment
- [x] Task 2: Create `src/components/homepage/BentoMeteo.astro` (AC: #1, #2)
  - [x] Accept props: `settings` object (from Keystatic query) and `lang: Lang`
  - [x] Use i18n utilities: `getLocalizedField()` to resolve translated fields
  - [x] Build bento grid layout with CSS Grid:
    ```
    Mobile (2-col):    Tablet (3-col):       Desktop (full):
    [Hours] [Season]   [Hours] [Season] [Promo]   [Hours  ] [Season] [Promo]
    [Promo] [Info  ]   [Info ] [Map   ] [CTA  ]   [Map/Img] [Info  ] [CTA  ]
    ```
  - [x] Grid implementation: `grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6`
  - [x] Allow some cells to span 2 columns on desktop for visual variety: `md:col-span-2`
- [x] Task 3: Implement bento grid cells (AC: #1)
  - [x] **Hours cell:** icon + "Horaires" heading + formatted opening hours text, brun-terre accent
  - [x] **Season cell:** current season indicator + seasonal message, with seasonal color/icon
  - [x] **Promotion cell:** if `promotionText` is non-empty, display it prominently; if empty, hide cell or show generic info
  - [x] **Info cell:** practical info (address, phone from settings), link to contact page
  - [x] **CTA cell:** "Planifier ma visite" or "Nous contacter" call-to-action, styled with brun-terre accent
  - [x] Each cell: `bg-white rounded-2xl p-6 shadow-sm` card styling
  - [x] Optional: one cell with a decorative lake/nature image as visual break
- [x] Task 4: Create `src/components/homepage/AgendaSection.astro` (AC: #3, #4, #5)
  - [x] Accept props: `events` array (from Keystatic query, already filtered and sorted) and `lang: Lang`
  - [x] Section heading: H2, "Agenda" / "Les rendez-vous" — localized
  - [x] Event list: display each event as a card or row with date, title, description
  - [x] Date formatting: use `Intl.DateTimeFormat` with the current locale for proper formatting
    ```js
    new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(event.date))
    ```
  - [x] Show maximum 3-4 upcoming events to keep the section concise
  - [x] If no events: render either nothing (section hidden) or a `<p>` with "Prochainement..." / "Stay tuned..." message
  - [x] Optional: "Voir tous les événements →" link to a dedicated events page (if it exists)
- [x] Task 5: Query Keystatic data in `src/pages/index.astro` (AC: #6)
  - [x] Import content reader: `import { getEntry, getCollection } from 'astro:content'` (or Keystatic reader API)
  - [x] Query settings singleton:
    ```js
    const settings = await getEntry('settings', 'site');
    ```
  - [x] Query events collection, filter and sort:
    ```js
    const allEvents = await getCollection('events');
    const now = new Date();
    const upcomingEvents = allEvents
      .filter(e => e.data.visible && new Date(e.data.date) >= now)
      .sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime())
      .slice(0, 4);
    ```
  - [x] Pass `settings.data` and `upcomingEvents` as props to the respective components
- [x] Task 6: Integrate into `src/pages/index.astro` (AC: #1, #3)
  - [x] Import `BentoMeteo` and `AgendaSection` from `@/components/homepage/`
  - [x] Replace the current placeholder "Agenda" section (lines ~148-155 of current index.astro)
  - [x] Place BentoMeteo between the history section and the agenda
  - [x] Place AgendaSection after BentoMeteo
  - [x] Alternate section backgrounds: BentoMeteo on white, AgendaSection on off-white (or vice versa)
- [x] Task 7: Handle content API integration (AC: #6)
  - [x] Verify Keystatic content collections are properly configured in `src/content/config.ts` if using Astro content collections
  - [x] If using Keystatic reader directly: `import { createReader } from '@keystatic/core/reader'` and `import keystaticConfig from '../../keystatic.config'`
  - [x] Test with empty/missing data — components must not crash if settings or events are undefined
  - [x] Add TypeScript types for the settings and event data shapes

## Dev Notes

### Architecture Decisions

- **Pure Astro components** — Both BentoMeteo and AgendaSection display static CMS content with no client-side interactivity. Zero JavaScript shipped. Content is resolved at build time.
- **Keystatic data loading:** Keystatic stores content as local files (YAML for singletons, MDX for collections). At build time, use the Keystatic reader API or Astro content collections to load data. The current `keystatic.config.ts` defines storage as `{ kind: 'local' }`, so all content is read from the filesystem.
- **V1 vs V2:** V1 uses static CMS data for seasonal info. V2 will integrate a real weather API (e.g., Open-Meteo for Lac de Saint-Ferréol coordinates). The BentoMeteo component should be designed with a slot or prop for a future weather widget.
- **Empty state handling:** The agenda section MUST handle gracefully: (a) no events collection entries, (b) all events in the past, (c) events without dates. Never show an empty section with just a heading — either hide it or show a meaningful fallback.

### Keystatic Reader Pattern

```javascript
// Option A: Keystatic reader API (works in all contexts)
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);
const settings = await reader.singletons.settings.read();
const events = await reader.collections.events.all();

// Option B: Astro content collections (if configured)
import { getEntry, getCollection } from 'astro:content';
const settings = await getEntry('settings', 'site');
const events = await getCollection('events');
```

Check which approach the project is using. The `keystatic.config.ts` suggests local storage mode, so the reader API is likely the correct approach.

### Bento Grid Visual Reference

```
Desktop layout:
┌──────────┬──────────┬──────────┐
│ Horaires │ Saison   │ Promo    │
│ (tall)   │          │          │
│          ├──────────┼──────────┤
│          │ Contact  │ CTA      │
└──────────┴──────────┴──────────┘

Mobile layout:
┌──────┬──────┐
│Hours │Season│
├──────┼──────┤
│Promo │Info  │
├──────┴──────┤
│    CTA      │
└─────────────┘
```

### Event Card Pattern

```html
<article class="flex gap-4 items-start p-4 rounded-xl bg-white shadow-sm">
  <div class="flex-shrink-0 text-center bg-offwhite rounded-lg p-3 w-16">
    <span class="block text-2xl font-bold text-brun-terre">15</span>
    <span class="block text-xs text-gray-600 uppercase">Mars</span>
  </div>
  <div>
    <h3 class="font-heading font-bold text-lg">{event.title}</h3>
    <p class="text-sm text-gray-600 mt-1">{event.description}</p>
  </div>
</article>
```

### Project Structure Notes

- `src/components/homepage/BentoMeteo.astro` — NEW file
- `src/components/homepage/AgendaSection.astro` — NEW file
- `src/pages/index.astro` — MODIFY, replace placeholder agenda section, add BentoMeteo
- `keystatic.config.ts` — MODIFY (optional), add seasonal fields to settings singleton
- `src/content/settings/site.yaml` — content file that stores settings data (managed by Keystatic)
- `src/content/events/` — directory where event content files live

### Design Tokens Reference

- Bento cell background: white `#ffffff`
- Bento cell border radius: `rounded-2xl`
- Section background alternation: white / off-white `#fafaf8`
- Section spacing: `--spacing-section` (6rem desktop) / `--spacing-section-mobile` (3rem mobile)
- Event date accent: brun-terre `#2D2B1B`
- Content max-width: `max-w-7xl` (1280px)
- Grid gaps: `gap-4 lg:gap-6`

### i18n Considerations

- Date formatting must use the correct locale: `fr`, `en`, `es`
- Event titles and descriptions use `getLocalizedField()` for i18n resolution
- Seasonal messages use the same pattern: `seasonalMessage` (FR) / `seasonalMessage_en` / `seasonalMessage_es`
- Section headings ("Agenda", "Infos pratiques") should use translation keys

### References

- [Source: ux-design-specification.md — BentoMeteo and AgendaSection are the final content sections before the CTA]
- [Source: architecture.md — CMS: Keystatic singletons for settings, collections for events]
- [Source: keystatic.config.ts — Settings singleton schema (lines 160-173), Events collection schema (lines 93-117)]
- [Source: architecture.md — Rendering Boundary: pure Astro for static CMS-driven content]
- [Source: i18n/utils.ts — getLocalizedField() for CMS content i18n resolution]
- [Source: index.astro — Current placeholder agenda section (lines ~148-155)]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- `astro check` passed with 0 errors (only pre-existing warnings in Header.astro, BaseLayout.astro)
- `astro build` completed successfully, all FR/EN/ES pages built

### Completion Notes List

- Extended Keystatic `settings` singleton with seasonal fields: `openingHours`, `seasonalMessage` (+ _en/_es), `currentSeason` (select), `promotionText` (+ _en/_es)
- Created placeholder content: `src/content/settings/site.yaml` with realistic seasonal data
- Created 3 placeholder events: soiree-tapas (2026-04-12), journee-portes-ouvertes (2026-04-26), fete-du-lac (2026-06-21)
- Created `BentoMeteo.astro` — responsive bento grid (2-col mobile, 3-col tablet+) with 5 cells: Hours (with clock icon, row-span-2 on md+), Season (emoji + color-coded by season), Promotion (conditional display), Info (address + phone), CTA (brun-terre background, link to /contact)
- Created `AgendaSection.astro` — event cards with date badge (day + month), localized title/description via `getLocalizedField()`, empty state with "Prochainement..." message, max 4 events shown
- Used Keystatic reader API (not Astro content collections) since project has no `src/content/config.ts`
- Added i18n translations for `home.bento.*` and `home.agenda.empty` in FR/EN/ES
- Updated `index.astro` to query Keystatic data and render BentoMeteo + AgendaSection after JourneeTypeTimeline
- BentoMeteo on off-white background, AgendaSection on white for visual alternation
- All components handle empty/null data gracefully (null-safe with `??` operators)
- Zero client-side JavaScript — pure Astro server-rendered components

### Change Log

- 2026-03-11: Implemented Story 2.5 — Seasonal Info bento grid (BentoMeteo) and Event Agenda (AgendaSection) for homepage. Extended Keystatic schema with seasonal fields. Created placeholder CMS content. Full i18n support FR/EN/ES.

### File List

- `keystatic.config.ts` — MODIFIED (added seasonal fields to settings singleton)
- `src/components/homepage/BentoMeteo.astro` — NEW
- `src/components/homepage/AgendaSection.astro` — NEW
- `src/pages/index.astro` — MODIFIED (added Keystatic queries + BentoMeteo + AgendaSection, replaced placeholder agenda)
- `src/i18n/translations.ts` — MODIFIED (added home.bento.* and home.agenda.empty keys for FR/EN/ES)
- `src/content/settings/site.yaml` — NEW (placeholder settings content)
- `src/content/events/soiree-tapas/index.mdx` — NEW (placeholder event)
- `src/content/events/journee-portes-ouvertes/index.mdx` — NEW (placeholder event)
- `src/content/events/fete-du-lac/index.mdx` — NEW (placeholder event)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — MODIFIED (story status: ready-for-dev → review)
