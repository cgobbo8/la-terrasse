# Story 2.2: Logo Mask Reveal Animation

Status: ready-for-dev

## Story

As a first-time visitor,
I want a logo-mask reveal animation on a brun-terre background that zooms open to unveil the homepage,
so that my first impression of La Terrasse feels immersive and memorable.

## Acceptance Criteria

1. On first visit (no session marker present), a GSAP-powered animation plays: brun-terre (#2D2B1B) fullscreen background with the La Terrasse logo as a clip-path mask that scales up to reveal the video hero behind it
2. On return visits within the same session (session cookie or sessionStorage flag present), the animation is skipped entirely and the homepage loads directly with the video hero visible
3. When `prefers-reduced-motion: reduce` is active, the animation is skipped — the logo is shown statically for 1 second then fades out to reveal the hero
4. After the animation completes (or is skipped), the video hero section is revealed smoothly with no layout shift or flash
5. A session marker (sessionStorage key or session cookie) is set after the animation completes so it does not replay during the browsing session
6. GSAP is loaded only on the homepage via the Svelte island's `client:load` directive — it is NOT included in the global bundle

## Tasks / Subtasks

- [ ] Task 1: Install GSAP (AC: #1, #6)
  - [ ] Run `pnpm add gsap`
  - [ ] Verify GSAP is available in the project's node_modules
  - [ ] GSAP will be tree-shaken to only include what this component imports
- [ ] Task 2: Create `src/components/homepage/LogoMaskReveal.svelte` (AC: #1, #3, #4)
  - [ ] On mount (`onMount`), check sessionStorage for `'la-terrasse-intro-seen'` key
  - [ ] If key exists → set `visible = false` immediately, dispatch `'reveal-complete'` custom event or set a prop callback
  - [ ] If key does not exist → run the GSAP animation sequence:
    1. Start: fullscreen div with `background: #2D2B1B`, `z-index: 50`, `position: fixed`, covering viewport
    2. Logo SVG centered, white, at natural size
    3. Animate: scale the logo mask from 1 to ~20 over 2.5s with `ease: "power2.inOut"`
    4. Use CSS `clip-path` with the logo SVG shape as the mask, or use a `mask-image` approach
    5. As the mask scales up, the video hero behind becomes visible through the logo shape
    6. End: remove the overlay div from the DOM
  - [ ] After animation completes, set `sessionStorage.setItem('la-terrasse-intro-seen', 'true')`
  - [ ] Total animation duration: under 3 seconds
- [ ] Task 3: Implement `prefers-reduced-motion` check (AC: #3)
  - [ ] On mount, check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
  - [ ] If true: show static logo on brun-terre background for 1s, then `opacity: 0` fade over 0.5s, then remove overlay
  - [ ] Do not import or initialize GSAP ScrollTrigger or other heavy plugins for this simple fade
- [ ] Task 4: Copy logo SVG into component (AC: #1)
  - [ ] Source the logo from `ressources/assets/la-terasse-logo.svg`
  - [ ] Inline the SVG path data directly into the Svelte component for use as a clip-path or mask
  - [ ] Alternatively, reference the SVG file via a `mask-image: url(...)` CSS property
  - [ ] Ensure the SVG viewBox is correctly centered for the scaling animation
- [ ] Task 5: Integrate into homepage `index.astro` (AC: #6)
  - [ ] Import `LogoMaskReveal` in `src/pages/index.astro`
  - [ ] Place it before the VideoHero component (or as a sibling overlay)
  - [ ] Use `client:load` directive — this is critical, it must execute immediately on page load
  - [ ] The overlay must sit above the VideoHero in z-index stacking: `z-50` for overlay, hero at default z-index
  - [ ] After reveal completes, the overlay element should be removed from DOM or set to `display: none` / `pointer-events: none`
- [ ] Task 6: Prevent flash of unstyled content (AC: #4)
  - [ ] Add an inline `<style>` or critical CSS in BaseLayout that sets the overlay to visible by default (for first-time visitors)
  - [ ] This prevents a flash of the video hero before the Svelte island hydrates
  - [ ] Alternative: use a CSS-only initial state (brun-terre fullscreen div) that the Svelte component enhances
  - [ ] Consider adding a `<noscript>` fallback that hides the overlay for users without JS

## Dev Notes

### Architecture Decisions

- **Svelte island with `client:load`** — This component needs client-side JavaScript (GSAP + sessionStorage + matchMedia). It is a Svelte component, not Astro, because it has runtime behavior.
- **`client:load` not `client:visible`** — The intro overlay covers the entire viewport on page load. It must hydrate immediately, not when scrolled into view (it is always in view).
- **GSAP import strategy:** Import only what is needed: `import { gsap } from 'gsap'`. Do NOT import ScrollTrigger or other plugins here. GSAP core is ~30KB gzipped.
- **Props restriction:** Per CLAUDE.md, Svelte islands cannot receive function props. Pass only data (e.g., `logoSvgPath: string`, `backgroundColor: string`) as serializable props if needed. However, this component likely needs no props — it is self-contained.
- **Portal consideration:** The overlay uses `position: fixed` and covers the full viewport. Per CLAUDE.md, if the parent has `backdrop-filter`, `position: fixed` won't work correctly. The homepage currently does NOT use backdrop-filter on the main content area, so a portal is likely unnecessary. However, if the Header component uses `backdrop-blur`, the overlay should be appended to `document.body` via portal to escape it.
- **The "10% immersive" moment:** This is Corentin's signature creative piece for first impressions. Keep it polished but under 3 seconds. Quality of easing and timing matters more than complexity.

### Technical Approach: Mask Animation

Two viable approaches for the logo-as-mask reveal:

**Approach A: CSS `mask-image` (recommended)**
```css
.reveal-overlay {
  mask-image: url('/assets/la-terasse-logo.svg');
  mask-size: 200px; /* initial */
  mask-position: center;
  mask-repeat: no-repeat;
  /* GSAP animates mask-size from 200px to 5000px */
}
```
Note: With mask-image, the logo shape is transparent (reveals content behind), and the rest is opaque (shows the brun-terre). This is the INVERSE of what we want. So the overlay div should be the brun-terre color, and we use `mask-composite` or invert the mask.

**Approach B: CSS `clip-path` with SVG**
```html
<svg width="0" height="0">
  <defs>
    <clipPath id="logo-clip" clipPathUnits="objectBoundingBox">
      <!-- logo path data normalized to 0-1 range -->
    </clipPath>
  </defs>
</svg>
```
GSAP animates the container that uses this clip-path.

**Approach C: Canvas / WebGL**
Overkill for this. Avoid.

Recommend starting with Approach A (CSS mask-image) as it is the most straightforward and performant.

### Project Structure Notes

- `src/components/homepage/LogoMaskReveal.svelte` — NEW file
- `src/pages/index.astro` — MODIFY, add LogoMaskReveal island with `client:load`
- `ressources/assets/la-terasse-logo.svg` — EXISTS, source for logo SVG data
- `package.json` — MODIFY, add `gsap` dependency

### Logo SVG Reference

The logo file is at `ressources/assets/la-terasse-logo.svg`. The logo features "LA TERRASSE" text with a stylized A shaped like a mountain. The SVG path data needs to be extracted and potentially normalized for use as a clip-path or mask.

### References

- [Source: ux-design-specification.md — Homepage flow: LogoMaskReveal is the first thing visitors see]
- [Source: architecture.md — Rendering Boundary: Svelte for interactive components, client:load for critical above-fold]
- [Source: prd.md — "10% creative immersion budget" for signature moments]
- [Source: CLAUDE.md — Svelte islands cannot pass functions as props; use data objects]
- [Source: CLAUDE.md — position: fixed + backdrop-filter conflict, use portal if needed]
- [Source: global.css — --color-brun-terre: #2D2B1B]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
