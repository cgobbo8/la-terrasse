# Story 2.4: "Journee Type" Immersive Timeline

Status: review

## Story

As a visitor,
I want an immersive scroll-driven timeline showing a typical day at La Terrasse (morning activity, lunch, afternoon, evening),
so that I can visualize a full day at the site and feel inspired to plan my visit.

## Acceptance Criteria

1. A scroll-driven GSAP timeline animates through a typical day at La Terrasse, with horizontal movement triggered by vertical scroll (scroll-jacking a pinned section)
2. The timeline contains 4-5 time blocks, each with: a time label, a title, a short description, an image, and a link to the relevant pole page
3. When `prefers-reduced-motion: reduce` is active, the entire timeline is displayed as a static vertical layout with all moments visible — no scroll animation
4. On mobile (< 768px), the timeline renders as a simplified vertical layout (no horizontal scroll-jacking), with each moment stacked and visible
5. The component uses `client:visible` to defer GSAP loading until the section scrolls into the viewport
6. Each time block links to its relevant pole page (e.g., morning activity → `/aventure`, lunch → `/restaurant`)

## Tasks / Subtasks

- [x] Task 1: Create `src/components/homepage/JourneeTypeTimeline.svelte` (AC: #1, #2, #5)
  - [x] Accept props: `timeBlocks` array (serializable data, not functions) and `lang` string
  - [x] Each timeBlock object: `{ time: string, title: string, description: string, image: string, href: string, poleAccent: string }`
  - [x] On mount, check viewport width and `prefers-reduced-motion` to decide rendering mode
  - [x] Import GSAP and ScrollTrigger: `import { gsap } from 'gsap'` and `import { ScrollTrigger } from 'gsap/ScrollTrigger'`
  - [x] Register plugin: `gsap.registerPlugin(ScrollTrigger)`
- [x] Task 2: Define time blocks data in `src/pages/index.astro` (AC: #2, #6)
  - [x] Block 1: `{ time: '9h30', title: 'Activité nature', description: 'Départ en kayak sur le lac...', image: '/images/journee/kayak.webp', href: '/aventure', poleAccent: '#537b47' }`
  - [x] Block 2: `{ time: '12h30', title: 'Déjeuner au bord du lac', description: 'Cuisine locale et gourmande en terrasse...', image: '/images/journee/dejeuner.webp', href: '/restaurant', poleAccent: '#2D2B1B' }`
  - [x] Block 3: `{ time: '14h30', title: 'Baignade et paddle', description: 'Profitez du lac et de ses activités aquatiques...', image: '/images/journee/paddle.webp', href: '/aventure', poleAccent: '#537b47' }`
  - [x] Block 4: `{ time: '17h00', title: 'Détente et farniente', description: 'Pause à l\'ombre des arbres, vue sur le lac...', image: '/images/journee/detente.webp', href: '#', poleAccent: '#2D2B1B' }`
  - [x] Block 5: `{ time: '19h30', title: 'Apéro en terrasse', description: 'Cocktails et planches à partager au coucher du soleil...', image: '/images/journee/apero.webp', href: '/restaurant', poleAccent: '#2D2B1B' }`
  - [x] Localize titles and descriptions via i18n translations (or hardcode FR for V1 with TODO)
  - [x] Use `getLocalizedPath()` for all href values
- [x] Task 3: Implement GSAP horizontal scroll animation (AC: #1)
  - [x] Create a container that holds all time blocks side-by-side: `display: flex; flex-wrap: nowrap;`
  - [x] Each time block card width: `min-w-[80vw] md:min-w-[50vw] lg:min-w-[33vw]`
  - [x] Use ScrollTrigger to pin the section and translate the inner container horizontally:
    ```js
    gsap.to(container, {
      x: () => -(container.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionEl,
        pin: true,
        scrub: 1,
        end: () => `+=${container.scrollWidth - window.innerWidth}`,
      },
    });
    ```
  - [x] Ensure the pinned section height accounts for the horizontal scroll distance
  - [x] Add subtle entrance animations for each card as it enters the viewport (opacity + translateY)
- [x] Task 4: Implement time block card markup (AC: #2)
  - [x] Card layout: image on top (aspect 4:3, `object-cover`), content below
  - [x] Time label: bold, styled with pole accent color via inline `style`
  - [x] Title: H3, font-heading, font-bold
  - [x] Description: text-sm, text-gray-600, 2-3 lines max
  - [x] CTA link: "En savoir plus →" with pole accent color, links to relevant pole page
  - [x] Card container: `bg-white rounded-2xl shadow-sm overflow-hidden p-0`
  - [x] Vertical connector line or dot between cards to reinforce the timeline metaphor
- [x] Task 5: Implement `prefers-reduced-motion` fallback (AC: #3)
  - [x] Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` on mount
  - [x] If reduced motion: do NOT initialize ScrollTrigger. Render all blocks in a vertical grid layout
  - [x] Vertical layout: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
  - [x] All content visible at once, no animation, no pinning
- [x] Task 6: Implement mobile fallback (AC: #4)
  - [x] Check viewport width on mount: if `window.innerWidth < 768`, skip ScrollTrigger
  - [x] Mobile layout: vertical stack, each block as a full-width card
  - [x] Optionally add a CSS scroll-snap horizontal carousel as an intermediate option:
    ```css
    .timeline-mobile { overflow-x: auto; scroll-snap-type: x mandatory; }
    .timeline-card { scroll-snap-align: start; }
    ```
  - [x] Listen for window resize and handle breakpoint changes (or use a simpler approach: check once on mount)
- [x] Task 7: Integrate into `src/pages/index.astro` (AC: #5)
  - [x] Import `JourneeTypeTimeline` from `@/components/homepage/JourneeTypeTimeline.svelte`
  - [x] Replace the current placeholder "Une journée à La Terrasse" section (lines ~124-145 of current index.astro)
  - [x] Pass `timeBlocks` as a serializable data prop and `lang` as a string
  - [x] Use `client:visible` directive for deferred loading
  - [x] Wrap in a section with `bg-offwhite` background
- [x] Task 8: Create placeholder images
  - [x] Create `public/images/journee/` directory
  - [x] Add 5 placeholder images: `kayak.webp`, `dejeuner.webp`, `paddle.webp`, `detente.webp`, `apero.webp`
  - [x] Minimum 800x600px, 4:3 aspect ratio, WebP format
- [x] Task 9: Cleanup GSAP on destroy (AC: #1)
  - [x] In Svelte's `onDestroy`, kill the ScrollTrigger instance and any GSAP tweens
  - [x] `ScrollTrigger.getAll().forEach(st => st.kill())` or store the specific instance and kill it
  - [x] This prevents memory leaks if the component is unmounted (e.g., client-side navigation)

## Dev Notes

### Architecture Decisions

- **Svelte island with `client:visible`** — GSAP requires client-side JavaScript. Using `client:visible` defers the ~30KB GSAP + ~10KB ScrollTrigger bundle until the user scrolls near this section. This is below-fold content, so deferred loading is appropriate.
- **Data-only props** — per CLAUDE.md, Svelte islands cannot receive function props. The `timeBlocks` array contains only serializable data (strings). All i18n resolution happens in the Astro frontmatter before passing to the Svelte component.
- **Progressive enhancement strategy:** The PRD explicitly states "Simplified 'journee type' animation if GSAP timeline proves too complex for deadline." Build the simplified version FIRST (vertical layout with cards), then layer on the GSAP horizontal scroll. The simplified version is also the reduced-motion and mobile fallback, so it must work well on its own.
- **ScrollTrigger pinning:** This technique "hijacks" vertical scroll to drive horizontal motion. It can feel jarring if not done well. Key tuning parameters: `scrub` value (0.5-1.5 for smoothness), total scroll distance, and card spacing.

### Build Order (Recommended)

1. First: Build the static vertical card layout (works everywhere, is the mobile + reduced-motion fallback)
2. Second: Add GSAP ScrollTrigger horizontal scroll for desktop with motion enabled
3. Third: Polish timing, easing, card entrance animations
4. Fourth: Test across browsers and devices

### GSAP ScrollTrigger Pattern

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// In onMount:
const section = document.querySelector('.journee-section');
const track = document.querySelector('.journee-track');

const scrollTween = gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    pin: true,
    scrub: 1,
    end: () => `+=${track.scrollWidth - window.innerWidth}`,
    invalidateOnRefresh: true, // recalculate on resize
  },
});

// In onDestroy:
scrollTween.scrollTrigger?.kill();
scrollTween.kill();
```

### Project Structure Notes

- `src/components/homepage/JourneeTypeTimeline.svelte` — NEW file
- `src/pages/index.astro` — MODIFY, replace placeholder timeline section with Svelte island
- `public/images/journee/` — NEW directory for timeline images
- `package.json` — MODIFY (if gsap not already added by Story 2.2)

### Design Tokens Reference

- Section background: off-white `#fafaf8` (matches existing placeholder section)
- Card background: white `#ffffff`
- Time label: font-bold, pole accent color via inline style
- Section heading: H2, `text-3xl lg:text-4xl font-bold text-brun-terre text-center`
- Card border radius: `rounded-2xl`
- Content max-width: `max-w-7xl` for the non-pinned wrapper

### Accessibility Considerations

- The horizontal scroll area should have `role="region"` and `aria-label="Timeline d'une journée type"`
- Each time block card should be a semantic `<article>` or use appropriate ARIA landmarks
- Keyboard users should be able to navigate through the timeline blocks (tab through the CTA links)
- The pinned scroll section should not trap keyboard focus

### References

- [Source: ux-design-specification.md — JourneeType is the signature creative section of the homepage]
- [Source: prd.md — "Simplified 'journee type' animation if GSAP timeline proves too complex for deadline"]
- [Source: architecture.md — Rendering Boundary: Svelte + client:visible for below-fold interactive components]
- [Source: CLAUDE.md — Svelte islands: pass data objects, not functions]
- [Source: CLAUDE.md — All animations must respect prefers-reduced-motion]
- [Source: index.astro — Current placeholder timeline section (lines ~124-145)]
- [Source: global.css — Section spacing: --spacing-section, --spacing-section-mobile]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

No issues encountered. Build passed on first attempt.

### Completion Notes List

- Created JourneeTypeTimeline.svelte component with full GSAP ScrollTrigger horizontal scroll animation on desktop
- Implemented progressive enhancement: static vertical grid fallback for mobile (<768px) and prefers-reduced-motion
- GSAP and ScrollTrigger are dynamically imported (not in initial bundle) to keep page load fast
- All 5 time blocks are fully i18n-ized (FR/EN/ES) with localized paths via getLocalizedPath()
- Card entrance animations (opacity + translateY) triggered by containerAnimation for smooth reveal during horizontal scroll
- GSAP cleanup handled in onMount return function (Svelte 5 pattern) — kills ScrollTrigger and all tweens on unmount
- Placeholder images generated as solid-color WebP files (800x600, 4:3 aspect) — to be replaced with real photography
- Section uses role="region" with aria-label for accessibility; cards use semantic <article> elements
- Timeline dot (colored circle) on each card reinforces timeline metaphor per Task 4 spec

### File List

- `src/components/homepage/JourneeTypeTimeline.svelte` — NEW: main timeline component
- `src/pages/index.astro` — MODIFIED: replaced placeholder section with Svelte island, added timeBlocks data
- `src/i18n/translations.ts` — MODIFIED: added dayTrip block translations (FR/EN/ES) + CTA label
- `public/images/journee/kayak.webp` — NEW: placeholder image
- `public/images/journee/dejeuner.webp` — NEW: placeholder image
- `public/images/journee/paddle.webp` — NEW: placeholder image
- `public/images/journee/detente.webp` — NEW: placeholder image
- `public/images/journee/apero.webp` — NEW: placeholder image
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — MODIFIED: story status updated to review
- `_bmad-output/implementation-artifacts/2-4-journee-type-immersive-timeline.md` — MODIFIED: tasks checked, status → review

### Change Log

- 2026-03-11: Implemented "Journée Type" immersive timeline with GSAP horizontal scroll, i18n support (FR/EN/ES), mobile/reduced-motion fallbacks, and placeholder images
