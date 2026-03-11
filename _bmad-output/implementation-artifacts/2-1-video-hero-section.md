# Story 2.1: Video Hero Section

Status: ready-for-dev

## Story

As a visitor on the homepage,
I want a full-screen video of Lac de Saint-Ferréol playing behind a headline,
so that I immediately feel "I want to be there" before reading any further content.

## Acceptance Criteria

1. A full-viewport video element plays muted, looping, autoplay on page load showing Lac de Saint-Ferréol footage
2. On devices or browsers where `prefers-reduced-motion: reduce` is active, a static image is displayed instead of the video
3. The hero section occupies a minimum height of 50vh on mobile and 70vh on desktop (100vh is acceptable if design warrants it)
4. A text alternative (`aria-label` on the section or visually hidden text) describes the video content for screen readers
5. The video element uses `fetchpriority="high"` and `loading="eager"` since it is above the fold
6. A dark gradient overlay ensures any overlaid text (title, subtitle, CTAs) remains readable against the video
7. The component replaces the current `SectionHero` usage at the top of `src/pages/index.astro`

## Tasks / Subtasks

- [ ] Task 1: Create `src/components/homepage/VideoHero.astro` (AC: #1, #3, #5, #6)
  - [ ] Add `<video>` element with attributes: `muted`, `autoplay`, `loop`, `playsinline`, `fetchpriority="high"`
  - [ ] Source video from `public/videos/hero-lac.mp4` (create directory if needed; placeholder file until real footage is available)
  - [ ] Consider adding a `<source>` for WebM format for better compression: `public/videos/hero-lac.webm`
  - [ ] Set responsive min-height: `min-h-[50vh] lg:min-h-[70vh]` via Tailwind classes
  - [ ] Position video with `absolute inset-0 w-full h-full object-cover` to fill the section
  - [ ] Add `<div>` dark gradient overlay: `bg-gradient-to-t from-black/60 via-black/20 to-transparent`
- [ ] Task 2: Add text overlay content (AC: #6)
  - [ ] Title: main headline using `t('home.hero.tagline')` from i18n
  - [ ] Subtitle: `t('home.hero.subtitle')`
  - [ ] CTA buttons slot (same as current SectionHero pattern) for pole navigation links
  - [ ] Text positioned via `relative z-10` to sit above the gradient overlay
  - [ ] Typography: H1 `text-4xl lg:text-6xl font-bold text-white`, subtitle `text-lg lg:text-xl text-white/80`
- [ ] Task 3: Implement `prefers-reduced-motion` fallback (AC: #2)
  - [ ] Use `<picture>` or `<img>` element for static fallback image: `public/images/hero-lac-fallback.webp`
  - [ ] Use CSS media query `@media (prefers-reduced-motion: reduce)` to hide video and show image
  - [ ] Alternatively, show fallback image as `poster` attribute on the video element AND hide video via CSS for reduced-motion users
  - [ ] Ensure the fallback image is a representative still frame from the video
- [ ] Task 4: Accessibility (AC: #4)
  - [ ] Add `aria-label` on the `<section>` describing the visual content: "Vue aérienne du lac de Saint-Ferréol"
  - [ ] Add `role="img"` on the video container or use a visually hidden `<p>` with descriptive text
  - [ ] Ensure video has no audio track or is permanently muted (no unmute control needed)
- [ ] Task 5: Integrate into homepage (AC: #7)
  - [ ] Replace the `<SectionHero>` block in `src/pages/index.astro` with `<VideoHero>`
  - [ ] Pass i18n translations and CTA links as props or slots
  - [ ] Verify the component renders correctly at all breakpoints (mobile, tablet, desktop)
- [ ] Task 6: Create placeholder assets
  - [ ] Create `public/videos/` directory
  - [ ] Add a placeholder `hero-lac.mp4` (can be a short 5-10s clip or a note that real footage is pending)
  - [ ] Add a placeholder `public/images/hero-lac-fallback.webp` static image

## Dev Notes

### Architecture Decisions

- **Pure Astro component** — no Svelte island needed. There is no client-side interactivity; the video autoplays natively via HTML attributes. Zero JS shipped for this component.
- **Video attributes:** `muted autoplay loop playsinline` are all required. Without `muted`, autoplay is blocked on all modern browsers. `playsinline` prevents iOS from going fullscreen.
- **Poster attribute:** Set `poster="/images/hero-lac-fallback.webp"` on the `<video>` so there is a visible frame before the video loads/plays.
- **Above-fold loading:** This is the first visual element on the homepage. Use `fetchpriority="high"` on the video and `loading="eager"` on the fallback image. Do NOT lazy-load.
- **Aspect ratio handling:** The video should be shot/cropped for both 4:3 (mobile) and 16:9 (desktop). Using `object-cover` on the `<video>` handles this automatically by cropping to fill the container.
- **File size:** Target video under 5MB for acceptable load time. Consider serving different qualities via media queries or JS-based source switching in a future iteration.

### Project Structure Notes

- `src/components/homepage/VideoHero.astro` — NEW file (new `homepage/` subdirectory under components)
- `public/videos/hero-lac.mp4` — NEW directory and file
- `public/videos/hero-lac.webm` — OPTIONAL, WebM version for smaller file size
- `public/images/hero-lac-fallback.webp` — NEW file, static fallback image
- `src/pages/index.astro` — MODIFY, replace SectionHero with VideoHero

### CSS Pattern for Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .video-hero video {
    display: none;
  }
  .video-hero .fallback-image {
    display: block;
  }
}
```

Or via Tailwind:
```html
<video class="motion-safe:block motion-reduce:hidden ...">
<img class="motion-safe:hidden motion-reduce:block ..." />
```

### References

- [Source: ux-design-specification.md — Homepage Structure: VideoHero is section 2 after LogoMaskReveal]
- [Source: architecture.md — Rendering Boundary: pure Astro for non-interactive components]
- [Source: prd.md — "I want to be there" emotional hook as primary homepage goal]
- [Source: CLAUDE.md — Tailwind CSS v4 configuration via @theme directive]
- [Source: global.css — Design tokens for colors, spacing, typography]
- Existing pattern: `src/components/common/SectionHero.astro` for overlay/gradient approach

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
