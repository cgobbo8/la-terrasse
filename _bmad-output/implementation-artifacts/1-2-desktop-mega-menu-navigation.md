# Story 1.2: Desktop Mega-Menu Navigation

Status: review

## Story

As a visitor on desktop,
I want a mega-menu with 3 pole columns and transversal entries,
so that I can navigate to any page on the site in one click.

## Acceptance Criteria

1. Hovering a pole label in the header opens a multi-column dropdown panel with the pole's sub-pages (links + descriptions + icons) and a featured card
2. A "Transversal" / "Experiences" entry opens a dropdown listing En Famille, En Groupe, En Entreprise with descriptions
3. Each pole column applies its accent color (`restaurant=#2D2B1B`, `aventure=#537b47`, `evenements=#3d4969`) to icon backgrounds, featured card CTA, and cross-sell link via inline `style` attributes
4. Keyboard navigation works: Tab moves between top-level items, Enter/Space opens dropdown, Arrow Down/Up moves within sub-links, Escape closes the dropdown and returns focus to the trigger
5. All interactive trigger elements have visible focus indicators using the pole's accent color (or brun-terre for transversal)
6. Dropdown triggers include `aria-expanded`, `aria-haspopup="true"`, and dropdown panels have `role="menu"` with `role="menuitem"` on links
7. The current section (pole) is visually indicated in the top-level navigation via accent-colored text, resolved from the `currentPole` prop
8. Cross-sell link at the bottom of each pole dropdown points to a different pole with its accent color
9. Dropdown opens with a fade-in animation (`megaFadeIn` keyframes, 150ms ease-out) and closes with a 200ms hover-out delay to prevent flicker

## Tasks / Subtasks

- [x] Task 1: Add ARIA attributes to MegaMenu.svelte pole triggers (AC: #6)
  - [x] Add `aria-haspopup="true"` to each pole trigger `<a>` element
  - [x] Bind `aria-expanded={activeMenu === pole.id}` on each pole trigger
  - [x] Add `role="menu"` to each dropdown panel container
  - [x] Add `role="menuitem"` to each sub-link `<a>` inside the dropdown
  - [x] Add `aria-haspopup="true"` and `aria-expanded` to the transversal "Experiences" trigger button

- [x] Task 2: Implement keyboard navigation in MegaMenu.svelte (AC: #4)
  - [x] Add `onkeydown` handler to pole trigger elements: Enter/Space opens dropdown, Escape closes it
  - [x] When dropdown opens via keyboard, move focus to the first `role="menuitem"` link
  - [x] Arrow Down/Up cycles focus between `role="menuitem"` links within the open dropdown
  - [x] Escape closes the dropdown and returns focus to the trigger that opened it
  - [x] Tab from the last item in a dropdown moves focus to the next top-level trigger (natural tab order)
  - [x] Apply the same keyboard behavior to the transversal "Experiences" dropdown

- [x] Task 3: Add visible focus indicators (AC: #5)
  - [x] Add `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded` classes to all top-level trigger elements
  - [x] Set `focus-visible:outline-color` via inline style using the pole's accent color for pole triggers
  - [x] Set `focus-visible:outline-color` to `#2D2B1B` (brun-terre) for the transversal trigger and contact button
  - [x] Add focus-visible ring to all sub-link items inside dropdowns

- [x] Task 4: Verify current section indicator (AC: #7)
  - [x] Confirm that `currentPole` prop correctly highlights the active pole label in accent color
  - [x] Ensure non-active poles display in `#6b6b67` (gray-600) and active pole in its accent color
  - [x] Verify the color is applied via inline `style` attribute (already implemented, validate correctness)

- [x] Task 5: Verify complete navigation content (AC: #1, #2, #8)
  - [x] Confirm all restaurant sub-links render: La carte, Producteurs, Repas de groupe
  - [x] Confirm all aventure sub-links render: Pedalo, Paddle, Mini-golf, Toutes les activites
  - [x] Confirm all evenements sub-links render: La salle, Seminaire Simple, Seminaire Gourmet, Seminaire Aventure
  - [x] Confirm transversal items render: En Famille, En Groupe, En Entreprise with descriptions
  - [x] Confirm each pole has a featured card with title, description, CTA text
  - [x] Confirm cross-sell links at bottom of each pole panel point to a different pole
  - [x] Verify all links use `getLocalizedPath()` in Header.astro when building the data object

- [x] Task 6: Verify animation and hover delay (AC: #9)
  - [x] Confirm `megaFadeIn` keyframes exist in `src/styles/global.css` (already present)
  - [x] Confirm dropdown uses `animate-[megaFadeIn_0.15s_ease-out]` class
  - [x] Confirm 200ms `setTimeout` delay on `mouseleave` before closing (already implemented via `startClose()`)

## Dev Notes

### Architecture Patterns

- **Svelte island with `client:load`:** MegaMenu.svelte is mounted as `<MegaMenu client:load ... />` in Header.astro. All nav data is serialized as props (data objects only, no functions). [Source: CLAUDE.md#Svelte Islands in Astro]
- **Pole colors via inline style:** All accent colors are applied using `style="color: {accent[pole.accentColor]}"` pattern. Never use dynamic Tailwind class interpolation. [Source: CLAUDE.md#Tailwind CSS v4]
- **i18n:** All link hrefs are built in Header.astro frontmatter using `getLocalizedPath()`, then passed as data to MegaMenu.svelte. Translation strings resolved via `useTranslations()` in Header.astro. [Source: architecture.md#i18n Patterns]

### Project Structure Notes

- `src/components/common/MegaMenu.svelte` — EXISTS, primary file to modify. Contains pole dropdown panels, transversal dropdown, language switcher, and contact CTA.
- `src/components/common/Header.astro` — EXISTS, builds navigation data objects (`megaMenuPoles`, `transversalItems`) and passes them as serialized props to MegaMenu.
- `src/styles/global.css` — EXISTS, contains `megaFadeIn` keyframes and design tokens.
- `src/i18n/utils.ts` — EXISTS, provides `getLangFromUrl()`, `useTranslations()`, `getLocalizedPath()`.
- `src/i18n/translations.ts` — EXISTS, provides `languages` map and `Lang` type.

### Key Constraints

- MegaMenu.svelte already has a working hover-based open/close mechanism with 200ms delay. The primary work is adding keyboard navigation and ARIA attributes.
- The `activeMenu` state variable tracks which dropdown is open (pole id or `'transversal'`). Keyboard handlers should reuse this same state.
- Focus management requires `$effect` or `tick()` to wait for DOM updates before moving focus to newly rendered dropdown items.
- The component already suppresses `a11y_no_static_element_interactions` warnings on hover containers — keyboard support will make these genuinely interactive.

### References

- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: architecture.md#Accessibility Patterns]
- [Source: architecture.md#Implementation Patterns & Consistency Rules]
- [Source: CLAUDE.md#Svelte Islands in Astro]
- [Source: CLAUDE.md#Tailwind CSS v4]
- [Source: ux-design-specification.md#Navigation System]
- [Source: prd.md#FR1-FR5 Navigation Requirements]

## Dev Agent Record

### Agent Model Used
claude-opus-4-6

### Debug Log References
- No build errors encountered. All changes compiled successfully on first attempt.
- Used `tick()` from Svelte for focus management after dropdown opens via keyboard (waits for DOM update before querying menuitems).
- Added `onfocusout` handler on dropdown containers to close dropdown when focus leaves (handles Tab-out for keyboard users).

### Completion Notes List
- ✅ Task 1: Added ARIA attributes — `aria-haspopup="true"` and `aria-expanded` on pole triggers and transversal button, `role="menu"` on dropdown panels, `role="menuitem"` on all links (sub-links, featured cards, cross-sell)
- ✅ Task 2: Implemented keyboard navigation — `handleTriggerKeydown` (Enter/Space toggles dropdown, Escape closes), `handleMenuItemKeydown` (ArrowDown/Up cycles, Escape returns focus to trigger), `onfocusout` closes dropdown on Tab-out. Uses `tick()` + DOM query to focus first menuitem on open.
- ✅ Task 3: Added focus-visible indicators — `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded` on all interactive elements, `outline-color` via inline style using pole accent colors (brun-terre #2D2B1B for transversal/contact)
- ✅ Task 4: Verified current section indicator — `currentPole` prop correctly applies accent color via inline style, non-active poles show #6b6b67
- ✅ Task 5: Verified all navigation content in Header.astro — restaurant (3 sub-links), aventure (4 sub-links), evenements (4 sub-links), transversal (3 items), featured cards (3), cross-sell links (3), all hrefs via `getLocalizedPath()`
- ✅ Task 6: Verified animation — `megaFadeIn` keyframes in global.css, `animate-[megaFadeIn_0.15s_ease-out]` on dropdowns, 200ms setTimeout in `startClose()`
- Build passes successfully with all pages generated

### File List
- src/components/common/MegaMenu.svelte (MODIFIED)

## Change Log
- 2026-03-11: Story 1.2 implementation — added ARIA attributes, keyboard navigation (Enter/Space/Escape/ArrowDown/ArrowUp), focus-visible indicators with pole accent colors, focusout handler for Tab-out cleanup. Verified existing navigation content, current section indicator, and animation.
