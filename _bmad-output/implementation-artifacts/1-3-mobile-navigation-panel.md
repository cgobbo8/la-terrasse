# Story 1.3: Mobile Navigation Panel

Status: ready-for-dev

## Story

As a visitor on mobile,
I want a slide-out navigation panel with accordion sub-menus,
so that I can browse all sections of the site easily on a small screen.

## Acceptance Criteria

1. Tapping the hamburger icon opens a slide-out panel from the right edge of the screen with a 300ms ease-out animation
2. Each pole (Restaurant, Aventure, Evenements) has an accordion toggle that expands/collapses its sub-page links, with only one pole expanded at a time
3. The panel closes when tapping the close button, tapping the overlay backdrop, or navigating to a link
4. The panel is portaled to `document.body` using Svelte `$effect` to escape the header's `backdrop-filter` stacking context
5. Transversal pages (En Famille, En Groupe, En Entreprise) are listed in a visible section below the poles
6. All interactive elements have a minimum 44x44px touch target
7. When the panel is open, the page body scroll is locked (`document.body.style.overflow = 'hidden'`)
8. A focus trap keeps keyboard focus within the panel while it is open — Tab cycles through panel elements only
9. The hamburger button has `aria-expanded` bound to the panel open state and `aria-label="Menu"`
10. Pole names are colored with their accent color via inline `style` attribute (`restaurant=#2D2B1B`, `aventure=#537b47`, `evenements=#3d4969`)

## Tasks / Subtasks

- [ ] Task 1: Verify DOM portal to document.body (AC: #4)
  - [ ] Confirm `portalEl` is moved to `document.body` via `$effect` on mount (already implemented)
  - [ ] Confirm cleanup function removes `portalEl` on unmount (already implemented)
  - [ ] Test that the panel renders at viewport level even when header has `backdrop-blur-sm`
  - [ ] Verify z-index stacking: overlay at `z-[9998]`, panel at `z-[9999]`

- [ ] Task 2: Verify slide animation and close behavior (AC: #1, #3)
  - [ ] Confirm panel uses `transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]` (already implemented)
  - [ ] Confirm `translate-x-full` (closed) / `translate-x-0` (open) toggling via `class:` directives
  - [ ] Confirm overlay `<button>` triggers `close()` on click
  - [ ] Confirm close button in panel header triggers `close()`
  - [ ] Confirm all navigation `<a>` links have `onclick={close}` to close on navigation

- [ ] Task 3: Verify accordion behavior (AC: #2)
  - [ ] Confirm `togglePole(id)` sets `expandedPole` and collapses any previously expanded pole
  - [ ] Confirm sub-links render only when `expandedPole === pole.id`
  - [ ] Add `aria-expanded={expandedPole === pole.id}` to each accordion toggle button
  - [ ] Add `aria-controls` linking toggle button to the sub-links container (assign `id` to sub-links `<div>`)
  - [ ] Animate accordion expand/collapse with CSS transition on `max-height` or use Svelte `slide` transition

- [ ] Task 4: Implement focus trap (AC: #8)
  - [ ] When panel opens, move focus to the close button
  - [ ] Query all focusable elements within the panel (`a`, `button`, `input`, `[tabindex]`)
  - [ ] On Tab from last focusable element, wrap focus to the first focusable element
  - [ ] On Shift+Tab from first focusable element, wrap focus to the last focusable element
  - [ ] On Escape keypress, close the panel and return focus to the hamburger button
  - [ ] When panel closes, restore focus to the hamburger trigger button

- [ ] Task 5: Ensure body scroll lock (AC: #7)
  - [ ] Confirm `open()` sets `document.body.style.overflow = 'hidden'` (already implemented)
  - [ ] Confirm `close()` restores `document.body.style.overflow = ''` (already implemented)
  - [ ] Add safety cleanup in `$effect` return to restore scroll if component unmounts while open
  - [ ] Test on iOS Safari (may need `-webkit-overflow-scrolling` or `position: fixed` on body)

- [ ] Task 6: Enforce minimum touch targets (AC: #6)
  - [ ] Verify hamburger button is at least 44x44px (currently `p-2` on a 24px icon = 40px — increase to `p-2.5` or `min-w-11 min-h-11`)
  - [ ] Verify close button is at least 44x44px (currently `p-2` on a 20px icon = 36px — increase to `p-3` or `min-w-11 min-h-11`)
  - [ ] Verify accordion toggle buttons are at least 44x44px (currently `p-2` — increase to `p-3`)
  - [ ] Verify navigation links have `py-3` minimum for 44px height with text (currently `py-3` on pole links, `py-2.5` on transversal — adjust transversal to `py-3`)
  - [ ] Verify overlay close button covers full viewport area (already `fixed inset-0`)

- [ ] Task 7: Verify pole accent colors (AC: #10)
  - [ ] Confirm pole labels use `style="color: {poleColors[pole.id] ?? '#3a3a38'}"` (already implemented)
  - [ ] Confirm `poleColors` record maps `restaurant: '#2D2B1B'`, `aventure: '#537b47'`, `evenements: '#3d4969'`

- [ ] Task 8: Verify transversal section and CTA (AC: #5)
  - [ ] Confirm "Experiences" section header and 3 transversal links render below poles
  - [ ] Confirm contact CTA button renders with full width and brun-terre background
  - [ ] Confirm language switcher renders at bottom of panel

## Dev Notes

### Architecture Patterns

- **CRITICAL — DOM Portal:** The panel MUST be portaled to `document.body` to escape the header's `backdrop-filter: blur()` which creates a new stacking context. `position: fixed` inside a `backdrop-filter` parent computes relative to that parent, not the viewport. MobileMenu.svelte already implements this via `$effect(() => { document.body.appendChild(portalEl); })`. [Source: CLAUDE.md#Svelte Islands in Astro]
- **Svelte island with `client:load`:** MobileMenu.svelte receives serialized data props from Header.astro. No functions passed across the boundary. [Source: CLAUDE.md#Svelte Islands in Astro]
- **Pole colors via inline style:** Pole name colors use `style="color: {poleColors[pole.id]}"`, not dynamic Tailwind classes. [Source: CLAUDE.md#Tailwind CSS v4]

### Project Structure Notes

- `src/components/common/MobileMenu.svelte` — EXISTS, primary file to modify. Contains hamburger button, overlay, slide-out panel, accordion nav, transversal section, CTA, language switcher.
- `src/components/common/Header.astro` — EXISTS, builds `mobilePoles` and `mobileTransversal` data and passes as props to MobileMenu.
- `src/styles/global.css` — EXISTS, may need a slide transition keyframe if adding CSS animation for accordion.

### Key Constraints

- The panel width is `w-80 max-w-[85vw]` — good for most mobile screens.
- The `h-full h-dvh` classes use dynamic viewport height which is correct for mobile browsers with address bar.
- The `contents` class on `portalEl` wrapper means it does not create a box — children render as if portalEl doesn't exist in the layout. This is intentional for the portal pattern.
- Focus trap must be implemented manually (no library) since this is a Svelte island. Use `$effect` to set up keydown listener when `isOpen` becomes true.
- iOS Safari quirk: `overflow: hidden` on body may not prevent scrolling. Consider also setting `position: fixed; width: 100%` on body when panel is open, saving and restoring `scrollY`.

### References

- [Source: architecture.md#Accessibility Patterns]
- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: architecture.md#Implementation Patterns & Consistency Rules]
- [Source: CLAUDE.md#Svelte Islands in Astro — DOM portal rule]
- [Source: CLAUDE.md#Tailwind CSS v4 — no dynamic classes]
- [Source: ux-design-specification.md#Navigation System — Mobile]
- [Source: prd.md#FR3 Mobile Navigation]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
