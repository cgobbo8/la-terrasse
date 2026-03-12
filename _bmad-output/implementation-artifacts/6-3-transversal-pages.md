# Story 6.3: Transversal Pages (En Famille, En Groupe, En Entreprise)

Status: review

## Story

As a cross-pole visitor (family, group organizer, or corporate planner),
I want dedicated pages combining offerings across all three poles tailored to my profile,
so that I can plan my visit in one place without navigating between separate pole pages.

## Acceptance Criteria

1. **En Famille** page: showcases family-friendly activities (filtered from aventure), family dining options (from restaurant), and a curated "journée type" (morning activity → lunch → afternoon activity) tailored for families
2. **En Groupe** page: presents group activities, group meal options, a day program template with pricing indication, and the phone number displayed very prominently (group organizers prefer calling)
3. **En Entreprise** page: combines seminar packages (from événements), team building activities (from aventure), and corporate dining options (from restaurant) in a professional tone matching the événements pole
4. Each page has in-section CTAs linking to the relevant pole pages (e.g., "Voir les activités" → /aventure, "Découvrir le restaurant" → /restaurant, "Voir les formules" → /evenements)
5. Each page includes a "journée type" section showing a curated day program specific to the visitor profile, rendered via a shared JourneeTypeSection.astro component
6. Pages use brand-mother neutral styling (brun terre #2D2B1B for headings, neutral backgrounds) — NOT a single pole's accent color throughout
7. No CrossLinkBlock on these pages — they already span all poles by nature

## Tasks / Subtasks

- [x] Task 1: Create `src/components/common/JourneeTypeSection.astro` (AC: #5)
  - [x] Accept props: `title` (string), `steps` (array of { time: string, title: string, description: string, pole?: Pole }), `accentColor?` (string)
  - [x] Render timeline layout: time on left, title + description on right, with subtle connecting line or spacing
  - [x] Optional pole coloring per step: time badge color matches the pole of that step's activity (aventure green for outdoor, restaurant brown for meals, evenements blue for work sessions)
  - [x] Responsive: clean single-column layout on all screen sizes
  - [x] Extract pattern from existing en-famille.astro (lines 33-48) which already has a working timeline

- [x] Task 2: Update `src/pages/en-famille.astro` (AC: #1, #4, #5, #6, #7)
  - [x] Replace inline journée type markup with JourneeTypeSection component
  - [x] Add family activity highlights section: 3-4 cards of family-friendly activities (mini-golf, pédalo, paddle, balade) with CTAs to /aventure
  - [x] Add family restaurant section: brief mention of family-friendly dining, kids-friendly atmosphere, terrace with view — CTA to /restaurant
  - [x] Ensure hero uses brand-mother neutral tone (no single pole accent in hero)
  - [x] Journée type steps with pole colors: aventure green for activities, restaurant brown for lunch
  - [x] Verify NO CrossLinkBlock import or render
  - [x] Content can use placeholder text for V1; structure and components must be final

- [x] Task 3: Update `src/pages/en-groupe.astro` (AC: #2, #4, #5, #6, #7)
  - [x] Replace inline journée type markup with JourneeTypeSection component
  - [x] Add prominent phone number section: large phone number, "Appelez Karine pour organiser votre sortie", styled as a highlight callout box
  - [x] Phone number display: `<a href="tel:+33XXXXXXXXX">` with large font, centered, high visual weight
  - [x] Add group offerings section: group activities (10-50 people), group dining (menu convivial adapté), combined day programs
  - [x] Add pricing indication section: "À partir de XX€/personne" for combined day programs (placeholder pricing OK)
  - [x] Ensure hero uses brand-mother neutral styling
  - [x] Journée type steps with pole colors per step
  - [x] Verify NO CrossLinkBlock import or render
  - [x] CTA pattern: "Organiser ma sortie" → tel: link (groups prefer phone)

- [x] Task 4: Update `src/pages/en-entreprise.astro` (AC: #3, #4, #5, #6, #7)
  - [x] Replace inline journée type markup with JourneeTypeSection component
  - [x] Add seminar packages summary section: brief overview of 3 packages (Simple/Gourmet/Aventure) with CTA "Voir les formules" → /evenements
  - [x] Add team building section: highlight of outdoor activities available for corporate groups, CTA → /aventure
  - [x] Add corporate dining section: mention of local cuisine, custom menus for groups, CTA → /restaurant
  - [x] Professional tone throughout — matching événements pole register but brand-mother neutral colors
  - [x] Journée type steps with pole colors: bleu ardoise for work sessions, aventure green for team building, restaurant brown for lunch
  - [x] CTA: "Demander un devis" → mailto: link (from Story 5.3's buildQuoteMailto)
  - [x] Verify NO CrossLinkBlock import or render

- [x] Task 5: Content structure and section ordering (AC: #1, #2, #3)
  - [x] En Famille page order: Hero → Journée Type → Activités famille → Restaurant famille → CTA final
  - [x] En Groupe page order: Hero → Phone callout → Journée Type → Offres groupe (activities + dining) → Pricing indication → CTA final
  - [x] En Entreprise page order: Hero → Journée Type → Formules séminaire → Team building → Restauration → CTA final
  - [x] Each section has its own heading (H2) and brief intro paragraph
  - [x] In-section CTAs as ghost buttons or outlined buttons linking to pole pages

## Dev Notes

### These Pages Break the Pole Silo

Transversal pages are the architectural bridge between poles. They don't belong to any single pole — they pull from all 3. This has visual and structural implications:

- **No pole accent domination:** Use brun terre (#2D2B1B) as the primary heading color (brand-mother neutral). Individual sections can hint at their pole with subtle accent touches (e.g., an aventure-green border on activity cards).
- **No CrossLinkBlock:** These pages already show all poles. A "La Terrasse c'est aussi..." block would be redundant.
- **CTAs point TO pole pages:** The transversal page is a curated overview — detailed content lives on the pole pages. Every section should have a clear "Go deeper" CTA.

### Persona Notes

- **En Famille (Marie):** Families want simplicity, safety, fun. Warm, reassuring tone. Emphasis on "easy to plan" and "something for everyone."
- **En Groupe (Karine):** Group organizers need logistics: capacity, pricing, phone contact. Karine calls before she books. Phone number must be impossible to miss.
- **En Entreprise (Laurent):** Corporate planners want professionalism, ROI, efficiency. Sober tone, structured information, clear pricing.

### JourneeTypeSection Component Design

```
┌────────────────────────────────────────────┐
│  Une journée en famille type               │  ← H2, brun terre
│                                            │
│  10h00  ●──  Mini-golf en famille          │  ← time in aventure green
│              Une activité ludique pour      │
│              commencer ensemble.            │
│         │                                  │
│  12h30  ●──  Déjeuner au restaurant        │  ← time in restaurant brown
│              Cuisine locale, terrasse      │
│              avec vue sur le lac.           │
│         │                                  │
│  14h30  ●──  Pédalo sur le lac             │  ← time in aventure green
│              Activité rafraîchissante      │
│              pour l'après-midi.             │
│         │                                  │
│  16h30  ●──  Balade autour du lac          │  ← time in aventure green
│              Profitez du cadre avant       │
│              de repartir.                  │
└────────────────────────────────────────────┘
```

The vertical line and dots are optional decorative elements. The key is: time on the left (in pole accent color), content on the right.

### Karine's Phone Number (En Groupe)

This is a critical UX detail. Group organizers (associations, clubs, schools) prefer phone over email. The phone callout should be:

```
┌──────────────────────────────────────┐
│                                      │
│  📞 Organisez votre sortie           │
│                                      │
│     05 XX XX XX XX                   │  ← text-3xl, font-bold, clickable
│                                      │
│  Appelez Karine, elle organise       │
│  votre journée sur mesure.           │
│                                      │
└──────────────────────────────────────┘
```

Use `<a href="tel:+33XXXXXXXXX">` so mobile visitors can tap to call. Placeholder number OK for V1.

### Architecture Patterns

- **Brand-mother neutral:** No `pole` prop on BaseLayout for these pages. Default styling with brun terre headings.
- **Pole hints per section:** Individual cards or sections can use subtle pole color accents (borders, time badges) to hint at which pole they belong to. Applied via inline `style` attributes.
- **JourneeTypeSection is Astro-only:** Pure server-rendered component, zero JS. The timeline is static content.
- **Content placeholders:** V1 can use placeholder text and pricing. Structure, components, and layout must be production-ready.
- **i18n:** Use translation keys where possible. Journée type step content can be hardcoded FR for V1 with TODO comments for i18n.

### Project Structure Notes

- `src/components/common/JourneeTypeSection.astro` — NEW file (reusable across all 3 transversal pages)
- `src/pages/en-famille.astro` — EXISTS, update with component + enhanced content sections
- `src/pages/en-groupe.astro` — EXISTS, update with component + phone callout + offerings
- `src/pages/en-entreprise.astro` — EXISTS, update with component + corporate content sections
- All 3 pages currently have inline journée type markup — extract into JourneeTypeSection

### Dependencies

- Story 5.2 (seminar packages — en-entreprise references them)
- Story 5.3 (mailto: utility — en-entreprise uses buildQuoteMailto)
- Story 3.1 (aventure hub — en-famille and en-groupe link to it)
- Story 4.1 (restaurant hub — all transversal pages link to it)
- Stories are not strictly blocked — placeholder links and CTAs can be used

### References

- [Source: architecture.md#Transversal Pages — Cross-Pole Architecture]
- [Source: ux-design-specification.md#Transversal Page Patterns]
- [Source: prd.md#Visitor Profiles — Marie (famille), Karine (groupe), Laurent (entreprise)]
- Current en-famille.astro has working journée type at lines 27-49 — extract into component
- Current en-groupe.astro has working journée type at lines 17-39 — extract into component
- Current en-entreprise.astro has working journée type at lines 17-39 — extract into component

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- Build passed successfully with no errors related to transversal pages

### Completion Notes List
- Created JourneeTypeSection.astro: reusable timeline component with pole-colored time badges, vertical connecting line, and dot indicators. Pure Astro, zero JS.
- Updated en-famille.astro: replaced inline timeline with JourneeTypeSection, added 4 family activity cards (mini-golf, pédalo, paddle, balade) with placeholder images, added restaurant family section with image, brand-mother neutral styling throughout.
- Updated en-groupe.astro: replaced inline timeline with JourneeTypeSection, added prominent phone callout (large clickable number + Karine subtitle), 3 group offering cards with pole-colored accents, pricing indication section (35€/personne placeholder), all CTAs point to tel: for group organizers.
- Updated en-entreprise.astro: replaced inline timeline with JourneeTypeSection (bleu ardoise for work sessions, aventure green for team building, restaurant brown for lunch), 3 seminar packages (Simple/Gourmet/Aventure) with recommended badge, team building section with image, corporate dining section with image, buildQuoteMailto CTA.
- Added ~60 translation keys across FR/EN/ES for all 3 transversal pages.
- All images use existing placeholders from /images/placeholders/*.webp.
- No CrossLinkBlock on any transversal page.

### File List
- src/components/common/JourneeTypeSection.astro (NEW)
- src/pages/en-famille.astro (MODIFIED)
- src/pages/en-groupe.astro (MODIFIED)
- src/pages/en-entreprise.astro (MODIFIED)
- src/i18n/translations.ts (MODIFIED)
- _bmad-output/implementation-artifacts/sprint-status.yaml (MODIFIED)
- _bmad-output/implementation-artifacts/6-3-transversal-pages.md (MODIFIED)
