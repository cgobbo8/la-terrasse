# Story 2.3: Pole Discovery Section

Status: ready-for-dev

## Story

As a visitor on the homepage,
I want to see three poles (Restaurant, Aventure, Événements) presented as interconnected experiences with distinct visual identities,
so that I understand what La Terrasse offers and can navigate to what interests me most.

## Acceptance Criteria

1. Three pole cards are displayed below the video hero section, each representing one pole: Restaurant, Aventure, Événements
2. Each card uses its pole accent color (restaurant=#2D2B1B, aventure=#537b47, evenements=#3d4969) applied via inline `style` attributes on the card border and CTA element, sourced from `pole-config.ts`
3. Each card displays: a landscape image (3:2 aspect ratio), the pole name as an H3 heading, a short description paragraph, and a ghost-style CTA link
4. CTA text is localized: "Découvrir le restaurant" / "Découvrir les aventures" / "Découvrir nos séminaires" (FR), with EN/ES equivalents
5. Clicking any CTA navigates to the corresponding pole hub page (`/restaurant`, `/aventure`, `/evenements`) with proper i18n path
6. On mobile: cards stack vertically in a single column. On desktop: three cards side by side in a 3-column grid
7. The section has an off-white (#fafaf8) background to create visual rhythm with the preceding hero section

## Tasks / Subtasks

- [ ] Task 1: Create `src/lib/pole-config.ts` if it does not yet exist (AC: #2)
  - [ ] Export `Pole` type: `'restaurant' | 'aventure' | 'evenements'`
  - [ ] Export `PoleConfig` interface: `{ accent: string; light: string; name: string; ctaLabel: string; ctaHref: string; description: string }`
  - [ ] Export `poleConfigs` record with all 3 pole configurations
  - [ ] Colors: restaurant=#2D2B1B/#f5f0e8, aventure=#537b47/#eef5ec, evenements=#3d4969/#edf0f5
  - [ ] Note: if Story 1.1 has already created this file, skip this task and import from it
- [ ] Task 2: Create `src/components/homepage/PoleDiscovery.astro` (AC: #1, #2, #3, #6, #7)
  - [ ] Accept props: `lang: Lang` for i18n
  - [ ] Import `poleConfigs` from `@/lib/pole-config`
  - [ ] Import i18n utilities: `useTranslations`, `getLocalizedPath`
  - [ ] Wrap in `<section>` with `bg-offwhite` background and consistent section spacing (`py-(--spacing-section-mobile) lg:py-(--spacing-section)`)
  - [ ] Add section heading H2: "Trois façons de profiter" / localized equivalent
  - [ ] Render 3 cards in a responsive grid: `grid grid-cols-1 md:grid-cols-3 gap-8`
  - [ ] Max content width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- [ ] Task 3: Implement individual pole card markup (AC: #2, #3)
  - [ ] Card container: `rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all`
  - [ ] Image area: `<div class="aspect-[3/2] overflow-hidden">` with `<img>` using `object-cover w-full h-full`
  - [ ] Images sourced from `src/assets/images/` via astro:assets `<Image>` component, or from `public/images/` as `<img>` tags
  - [ ] Use placeholder images until real photography is available
  - [ ] Card body: `p-6` padding
  - [ ] H3 heading with pole name, styled with inline `style="color: {accent}"` for the pole color
  - [ ] Description `<p>` in `text-gray-600 text-sm leading-relaxed`
  - [ ] Ghost-style CTA: text link with inline `style="color: {accent}; border-color: {accent}"`, border-bottom or underline on hover
- [ ] Task 4: Implement CTA links with i18n (AC: #4, #5)
  - [ ] Each CTA uses `getLocalizedPath()` to generate the correct URL for the current language
  - [ ] CTA text uses i18n translations: add keys `home.poles.cta.restaurant`, `home.poles.cta.aventure`, `home.poles.cta.evenements` to translation files
  - [ ] If translation keys do not exist yet, use inline French text with a `TODO` comment for i18n
  - [ ] CTA element is an `<a>` tag (not a button) since it navigates to another page
- [ ] Task 5: Replace existing pole section in `src/pages/index.astro` (AC: #1)
  - [ ] Remove the current inline pole cards section (lines ~61-92 of current index.astro)
  - [ ] Import and render `<PoleDiscovery lang={lang} />`
  - [ ] Ensure placement is after VideoHero and before the history section
- [ ] Task 6: Add placeholder images (AC: #3)
  - [ ] Create `public/images/poles/` directory
  - [ ] Add placeholder images: `restaurant.webp`, `aventure.webp`, `evenements.webp`
  - [ ] Images should be 3:2 aspect ratio, minimum 800x533px for quality at desktop sizes
  - [ ] Until real photos are available, use colored placeholder divs with pole light background colors

## Dev Notes

### Architecture Decisions

- **Pure Astro component** — no Svelte island needed. This section has no client-side interactivity (hover effects are CSS-only). Zero JavaScript shipped.
- **Pole colors via inline `style`** — per CLAUDE.md, dynamic Tailwind classes are unreliable with Tailwind v4 JIT. All pole-specific colors MUST use inline `style` attributes, NOT dynamic class names like `text-[${color}]`.
- **SectionWrapper pattern** — use consistent section spacing from the design tokens: `py-(--spacing-section-mobile) lg:py-(--spacing-section)`. This matches the pattern used throughout the existing homepage.
- **Image handling:** For V1, use standard `<img>` tags from `public/images/`. For V2, migrate to Astro's `<Image>` component from `astro:assets` for automatic WebP/AVIF conversion and responsive srcset. The migration is straightforward since the markup is the same.

### Color Application Pattern

```astro
{poles.map((pole) => (
  <div class="rounded-2xl overflow-hidden bg-white shadow-sm">
    <div class="aspect-[3/2] overflow-hidden">
      <img src={pole.image} alt={pole.name} class="w-full h-full object-cover" />
    </div>
    <div class="p-6">
      <h3 class="font-heading text-xl font-bold mb-2" style={`color: ${pole.accent}`}>
        {pole.name}
      </h3>
      <p class="text-gray-600 text-sm">{pole.description}</p>
      <a
        href={pole.href}
        class="inline-block mt-4 text-sm font-medium hover:underline"
        style={`color: ${pole.accent}`}
      >
        {pole.ctaLabel} →
      </a>
    </div>
  </div>
))}
```

### Project Structure Notes

- `src/components/homepage/PoleDiscovery.astro` — NEW file
- `src/lib/pole-config.ts` — NEW file (or already created by Story 1.1)
- `src/pages/index.astro` — MODIFY, replace inline pole section with PoleDiscovery component
- `public/images/poles/` — NEW directory for pole card images

### Design Tokens Reference

- Section background: off-white `#fafaf8` (alternating rhythm)
- Card background: white `#ffffff`
- Card border radius: `rounded-2xl` (1rem)
- Card spacing: `gap-8` between cards
- Section spacing: `--spacing-section` (6rem desktop) / `--spacing-section-mobile` (3rem mobile)
- Typography: H2 `text-3xl lg:text-4xl`, H3 `text-xl`, body `text-sm`
- Content max-width: `max-w-7xl` (1280px)

### References

- [Source: ux-design-specification.md — PoleDiscovery is section 3 in homepage flow]
- [Source: architecture.md — Pole-Aware Component Pattern: colors via inline style, not dynamic Tailwind]
- [Source: architecture.md — Key File: src/lib/pole-config.ts]
- [Source: CLAUDE.md — Avoid dynamic Tailwind classes in string interpolation]
- [Source: global.css — Pole color tokens: --color-restaurant, --color-aventure, --color-evenements]
- [Source: index.astro — Current inline pole section to be replaced (lines ~61-92)]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
