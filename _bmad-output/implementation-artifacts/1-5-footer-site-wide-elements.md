# Story 1.5: Footer & Site-Wide Elements

Status: ready-for-dev

## Story

As a visitor,
I want a consistent footer with brand identity, contact information, and legal links on every page,
so that I can always find essential information and the site feels professional and trustworthy.

## Acceptance Criteria

1. Footer renders on every page via BaseLayout with La Terrasse branding: logo (SVG component with parameterizable color), tagline "Base de loisirs de Saint-Ferreol"
2. Footer displays the physical address (Base de loisirs de Saint-Ferreol, 31250 Revel), phone number as a clickable `tel:` link, and email as a clickable `mailto:` link
3. Footer contains navigation links to all 3 poles (Restaurant, Aventure, Evenements) and all 3 transversal pages (En Famille, En Groupe, En Entreprise)
4. Footer includes legal page links: "Mentions legales" and "Politique de confidentialite" pointing to `/mentions-legales` and `/confidentialite`
5. The La Terrasse logo in the footer accepts a `color` prop and defaults to white (`#ffffff`) on the dark footer background
6. Plausible Analytics script is loaded in the `<head>` of every page via BaseLayout, using the `PLAUSIBLE_DOMAIN` environment variable
7. All images across the site use `astro:assets` for optimization (WebP/AVIF, responsive srcset, lazy loading)

## Tasks / Subtasks

- [ ] Task 1: Create Logo SVG component `src/components/common/LogoTerrasse.astro` (AC: #1, #5)
  - [ ] Convert `ressources/assets/la-terasse-logo.svg` into an Astro component
  - [ ] Accept props: `color?: string` (default `#2D2B1B`), `width?: string` (default `'auto'`), `height?: string` (default `'2rem'`)
  - [ ] Apply `color` to SVG `fill` or `currentColor` pattern via inline `style`
  - [ ] Also create `LogoTerrasseFull.astro` from `la-terasse-logo-full.svg` with same color prop pattern
  - [ ] Export both for use in Header (accent/dark color) and Footer (white color)

- [ ] Task 2: Update Footer.astro with complete content (AC: #1, #2, #3, #4)
  - [ ] Import `LogoTerrasse` component and render with `color="#ffffff"`
  - [ ] Import `PHONE_NUMBER`, `EMAIL_ADDRESS` from `@/lib/pole-config.ts` (created in Story 1.4)
  - [ ] Replace hardcoded "LA TERRASSE" text span with `<LogoTerrasse color="#ffffff" />` component
  - [ ] Keep tagline "Base de loisirs de Saint-Ferreol" below the logo
  - [ ] Add phone number as `<a href="tel:{PHONE_NUMBER}">` in the contact column
  - [ ] Add email as `<a href="mailto:{EMAIL_ADDRESS}">` in the contact column
  - [ ] Verify physical address displays: "Base de loisirs de Saint-Ferreol" + "31250 Revel"
  - [ ] Add legal links section at the bottom: "Mentions legales" → `/mentions-legales`, "Politique de confidentialite" → `/confidentialite`
  - [ ] Ensure all navigation links use `getLocalizedPath()` for i18n support
  - [ ] Ensure legal links also use `getLocalizedPath()`

- [ ] Task 3: Structure Footer into semantic sections (AC: #3, #4)
  - [ ] Use `<footer>` with `role="contentinfo"` (implicit, just ensure semantic tag)
  - [ ] Organize into grid: Brand column | Poles column | Experiences column | Contact column
  - [ ] Add a bottom bar with copyright + legal links separated by a `border-t border-white/10`
  - [ ] Legal links in bottom bar: "Mentions legales" | "Confidentialite", styled as `text-white/40 hover:text-white/60`
  - [ ] Ensure heading hierarchy: use `<h3>` or visually styled `<p>` for column titles (no heading level skip)

- [ ] Task 4: Add Plausible Analytics to BaseLayout (AC: #6)
  - [ ] Add `PLAUSIBLE_DOMAIN` to `.env.example` (may already exist from Story 1.1)
  - [ ] In `src/layouts/BaseLayout.astro` `<head>`, add Plausible script:
    ```
    {import.meta.env.PLAUSIBLE_DOMAIN && (
      <script defer data-domain={import.meta.env.PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" />
    )}
    ```
  - [ ] Only load the script if `PLAUSIBLE_DOMAIN` is set (conditional rendering)
  - [ ] No cookie consent banner needed — Plausible is privacy-first, no cookies

- [ ] Task 5: Replace Header.astro logo text with LogoTerrasse component (AC: #1)
  - [ ] Import `LogoTerrasse` in Header.astro
  - [ ] Replace `<span class="font-heading text-xl font-bold tracking-tight text-brun-terre">LA TERRASSE</span>` with `<LogoTerrasse color="#2D2B1B" height="1.5rem" />`
  - [ ] Keep the pole sub-brand label next to the logo
  - [ ] Also update MobileMenu panel header — pass logo data or keep text fallback for simplicity in Svelte island

- [ ] Task 6: Establish astro:assets image pattern (AC: #7)
  - [ ] Create `src/assets/images/` directory as the standard location for optimizable images
  - [ ] Document the image import pattern in a code comment in BaseLayout or a shared component:
    - Above-fold: `<Image src={img} loading="eager" fetchpriority="high" />`
    - Below-fold: `<Image src={img} alt="..." />` (lazy by default)
  - [ ] Audit existing components for any `<img>` tags and note them for migration (no migration needed yet if only placeholder content exists)

## Dev Notes

### Architecture Patterns

- **Logo as component:** The SVG logos in `ressources/assets/` are source files. Convert them to Astro components in `src/components/common/` that accept a `color` prop. This allows the same logo to render in brun-terre (header), white (footer), or any pole color. Use `currentColor` in the SVG and set `color` via inline style on the wrapper, or directly replace `fill` values. [Source: architecture.md#Naming Patterns]
- **Plausible Analytics:** ~1KB script, no cookies, no consent banner. Conditionally loaded based on env var so dev environments don't pollute analytics. [Source: architecture.md#Analytics & Privacy]
- **astro:assets pattern:** All images through Astro's built-in `<Image>` component for automatic WebP/AVIF, responsive srcset, and lazy loading. Source images in `src/assets/images/`, CMS images from `public/images/`. [Source: architecture.md#Image Patterns]
- **i18n in footer:** All links use `getLocalizedPath()`. Column headings use `useTranslations()`. [Source: architecture.md#i18n Patterns]

### Project Structure Notes

- `ressources/assets/la-terasse-logo.svg` — EXISTS, source SVG for compact logo mark
- `ressources/assets/la-terasse-logo-full.svg` — EXISTS, source SVG for full logo with text
- `src/components/common/LogoTerrasse.astro` — NEW file, Astro component wrapping compact logo SVG
- `src/components/common/LogoTerrasseFull.astro` — NEW file, Astro component wrapping full logo SVG
- `src/components/common/Footer.astro` — EXISTS, needs content completion (logo, phone, email, legal links)
- `src/layouts/BaseLayout.astro` — EXISTS, add Plausible script to `<head>`
- `src/components/common/Header.astro` — EXISTS, replace text logo with LogoTerrasse component
- `src/assets/images/` — NEW directory for optimizable image assets
- `.env.example` — EXISTS or created in Story 1.1, add `PLAUSIBLE_DOMAIN`

### Key Constraints

- The footer background is `bg-brun-terre` (`#2D2B1B`) — all text and links must be white or white/opacity for contrast. Logo must render in white.
- `PHONE_NUMBER` and `EMAIL_ADDRESS` constants come from `src/lib/pole-config.ts` (created in Story 1.4). If Story 1.4 is not yet complete, define them locally in Footer.astro and refactor later.
- Legal pages (`/mentions-legales`, `/confidentialite`) do not need to exist yet — links should point to the correct paths. The actual page content is a separate story.
- Plausible script must be `defer` to avoid blocking render. The `data-domain` attribute must match the production domain exactly.
- The existing Footer.astro already has the grid structure and most content — this story completes it with logo component, real contact data, and legal links.

### References

- [Source: architecture.md#Analytics & Privacy — Plausible]
- [Source: architecture.md#Image Patterns — astro:assets]
- [Source: architecture.md#Implementation Patterns & Consistency Rules]
- [Source: architecture.md#i18n Patterns]
- [Source: CLAUDE.md#Tailwind CSS v4]
- [Source: ux-design-specification.md#Footer Design]
- [Source: prd.md#AR7 Plausible Analytics]
- [Source: prd.md#NFR — Accessibility, SEO]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
