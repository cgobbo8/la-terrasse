# Story 4.4: Group Dining Page

Status: review

## Story

As a group organizer,
I want to see group meal options with pricing, minimum sizes, and clear contact information,
so that I can quickly understand what's available for my group of 10+ people and know exactly how to book.

## Acceptance Criteria

1. Group meal formulas are displayed as distinct cards or sections, each showing: formula name, price per person, minimum group size, and what's included
2. At least 2–3 group formulas are presented (e.g., "Menu Terroir 35€/pers min 10", "Menu Découverte 25€/pers min 15")
3. A prominent contact CTA section displays both phone number (`tel:` link) and email (`mailto:` link) for group reservations
4. The phone number is visually prominent — large, clickable, above the fold on mobile or in the CTA section
5. Page follows the emotional funnel: atmospheric hero → formula options → practical info → contact CTA
6. Hero uses brun terre identity with a group dining/terrace atmosphere photo
7. All formula data comes from Keystatic CMS
8. Breadcrumb: "Restaurant > Repas de Groupe" with "Restaurant" linking to `/restaurant/`
9. SEO meta with unique title "Repas de Groupe — Restaurant | La Terrasse Saint-Ferréol"

## Tasks / Subtasks

- [x] Task 1: Create/update `src/pages/restaurant/repas-groupe.astro` (AC: #5, #6, #8, #9)
  - [x] Import `getLangFromUrl`, `useTranslations`, `getLocalizedField` from `@/i18n/utils`
  - [x] Import `poleConfigs` from `@/lib/pole-config`
  - [x] Query Keystatic for group dining formula data (from restaurant singleton)
  - [x] Build hero: group dining photo with brun terre overlay, "Repas de Groupe" H1
  - [x] Breadcrumb above title: "RESTAURANT" small-caps linked to `/restaurant/`
  - [x] Structure page following emotional funnel: hero → intro → formulas → practical → CTA
  - [x] Pass SEO props: title="Repas de Groupe — Restaurant | La Terrasse Saint-Ferréol"
- [x] Task 2: Intro section (AC: #5)
  - [x] Centered text block (max-width 768px) below hero
  - [x] Content: warm invitation for group celebrations — birthdays, team events, family reunions
  - [x] Mention: privatized terrace, lakeside setting, customizable menus
  - [x] Tone: welcoming, practical, reassuring — "Nous nous occupons de tout"
- [x] Task 3: Create `src/components/restaurant/GroupFormulaCard.astro` (AC: #1, #2, #7)
  - [x] Define props: `name: string`, `pricePerPerson: number`, `minGroupSize: number`, `inclusions: string[]`, `lang: Lang`
  - [x] Render formula name as H3 in Montserrat Bold
  - [x] Render price prominently: large text "{X} € / personne" with brun terre accent
  - [x] Render minimum: "À partir de {min} personnes" with group icon
  - [x] Render inclusions as a bulleted list (apéritif, entrée, plat, dessert, café, vin, etc.)
  - [x] Card styling: bordered, brun terre accent top border (4px), rounded-lg, padding comfortable
  - [x] Optional: highlight one formula as "recommended" with a subtle badge
- [x] Task 4: Formula grid (AC: #1, #2)
  - [x] Display formula cards in a responsive row: 3-col desktop (if 3 formulas), 2-col tablet, 1-col mobile
  - [x] Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
  - [x] Center grid with max-width 1280px
  - [x] Section padding: 96px desktop / 48px mobile
- [x] Task 5: Practical info section (AC: #1, #5)
  - [x] Section below formulas with practical details for group organizers:
    - [x] How far in advance to book (e.g., "Réservez au minimum 7 jours à l'avance")
    - [x] Customization options: dietary needs, special requests
    - [x] Terrace capacity and setup
    - [x] Payment modalities (deposit, group billing)
  - [x] Styled as an info grid or list with clear icons
  - [x] Content from Keystatic or static placeholder
- [x] Task 6: Contact CTA section (AC: #3, #4)
  - [x] Full-width section with brun terre background (#2D2B1B), white text
  - [x] Heading: "Organisez votre repas de groupe"
  - [x] Phone number: **very large** (24→32px), `<a href="tel:+33XXXXXXXXX">` with phone icon
  - [x] Phone must be the primary, most visible element — group organizers prefer phone
  - [x] Email: secondary, `<a href="mailto:contact@laterrasse-saintferreol.fr">` with email icon
  - [x] Brief reassurance: "Notre équipe vous accompagne dans l'organisation de votre événement"
  - [x] Both links: hover state with underline or color shift
- [x] Task 7: i18n support (AC: #1, #7)
  - [x] Use `getLocalizedField()` for formula names, inclusions, and practical info
  - [x] Section headings and CTA text via `useTranslations()`
  - [x] Breadcrumb text translated

## Dev Notes

### Architecture Patterns (MUST follow)

- **Pole-aware pattern:** Brun terre (#2D2B1B) accent via inline `style` attributes. [Source: architecture.md#Pole-Aware Component Pattern]
- **Phone-first CTA:** Group organizers (persona: "Karine") strongly prefer phone contact over forms. The phone number must be the most prominent CTA on the page, not buried in a footer. [Source: prd.md#Target Personas]
- **Rendering boundary:** Pure Astro components. No Svelte islands needed. [Source: architecture.md#Rendering Boundary]
- **Import aliases:** Always use `@/` prefix. [Source: architecture.md#Import Patterns]
- **i18n:** All links via `getLocalizedPath()`. Content via `getLocalizedField()`. [Source: architecture.md#i18n Patterns]

### Project Structure Notes

- `src/pages/restaurant/repas-groupe.astro` — NEW file
- `src/components/restaurant/GroupFormulaCard.astro` — NEW file
- `src/components/restaurant/MenuSection.astro` — EXISTS from Story 4.2 (not reused here, different format)
- `src/components/restaurant/ProducerCard.astro` — EXISTS from Story 4.3 (not reused here)

### Keystatic Group Dining Data (expected structure)

```
# In restaurant singleton:
group_dining:
  intro: "Privatisez notre terrasse face au lac..."
  formulas:
    - name: "Menu Découverte"
      price_per_person: 25
      min_group_size: 15
      inclusions:
        - "Apéritif de bienvenue"
        - "Entrée au choix"
        - "Plat au choix"
        - "Dessert"
        - "Café"
    - name: "Menu Terroir"
      price_per_person: 35
      min_group_size: 10
      inclusions:
        - "Apéritif de bienvenue"
        - "Entrée au choix"
        - "Plat au choix"
        - "Fromage du terroir"
        - "Dessert"
        - "1/2 bouteille de vin par personne"
        - "Café"
    - name: "Menu Prestige"
      price_per_person: 50
      min_group_size: 10
      inclusions:
        - "Cocktail de bienvenue"
        - "Mise en bouche"
        - "Entrée"
        - "Poisson ou viande"
        - "Fromage affiné"
        - "Dessert du chef"
        - "Vin sélectionné"
        - "Café & mignardises"
  practical_info:
    booking_notice: "Réservez au minimum 7 jours à l'avance"
    max_capacity: 60
    deposit_required: true
```

### Target Persona: "Karine"

From the PRD, the group organizer persona:
- Organizes team events, family reunions, birthday parties
- Wants to see options and prices quickly — no time to browse
- Strongly prefers phone contact — wants to talk to a person
- Needs reassurance: "Will you handle dietary needs?", "Can we customize?"
- Decision factors: price transparency, included items, ease of booking

The page must answer Karine's questions within 30 seconds of landing.

### Design Tokens Reference

- Hero: 50vh desktop / 40vh mobile
- Formula card: rounded-lg, 4px accent top border, generous padding (24px)
- Price text: 24→28px, bold, brun terre accent
- Phone number in CTA: 24→32px, bold, white on dark background
- Grid gap: 24px (gap-6)
- Practical info section: light background (#f5f0e8)
- CTA section: full-bleed brun terre (#2D2B1B) background
- Section spacing: 96px desktop / 48px mobile
- Breadcrumb: 14px, small-caps

### References

- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: architecture.md#Rendering Boundary]
- [Source: architecture.md#i18n Patterns]
- [Source: ux-design-specification.md#Emotional Funnel]
- [Source: ux-design-specification.md#Restaurant Pole Identity]
- [Source: prd.md#Restaurant Pole — Group Dining]
- [Source: prd.md#Target Personas — Karine]
- [Source: CLAUDE.md#Tailwind CSS v4]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Initial build failed due to TypeScript `as Record<string, unknown>` cast in Astro template expressions — moved logic to frontmatter

### Completion Notes List

- Rewrote `repas-groupe.astro` from a basic stub into a full emotional funnel page: hero → intro → formula cards → practical info → phone-first CTA → cross-sell
- Created `GroupFormulaCard.astro` component with brun terre accent, recommended badge, inclusions checklist, group size indicator
- Extended Keystatic restaurant singleton with `groupFormulas`, `groupDiningIntro`, `groupBookingNotice`, `groupMaxCapacity` fields (all with i18n variants)
- Added 3 group formulas to content YAML: Découverte (25€), Terroir (35€, recommended), Prestige (50€)
- Added 18 new i18n translation keys across FR/EN/ES for the group dining page
- Phone-first CTA design targeting persona "Karine" — phone at 32px, email secondary
- Practical info grid with 4 cards: booking notice, dietary needs, capacity, deposit
- Placeholder images used (same as other pages)

### File List

- `src/pages/restaurant/repas-groupe.astro` — MODIFIED (full rewrite)
- `src/components/restaurant/GroupFormulaCard.astro` — NEW
- `keystatic.config.ts` — MODIFIED (added group dining fields to restaurant singleton)
- `src/content/restaurant/info.yaml` — MODIFIED (added group dining data)
- `src/i18n/translations.ts` — MODIFIED (added group dining translations FR/EN/ES)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — MODIFIED (status update)
- `_bmad-output/implementation-artifacts/4-4-group-dining-page.md` — MODIFIED (story tracking)
