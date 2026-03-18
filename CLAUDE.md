# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**La Terrasse Saint-Ferréol** — Website for a multi-service leisure base at Lac de Saint-Ferréol (near Toulouse). Three distinct poles under one brand: **Restaurant**, **Aventure**, **La Salle**.

- V1 target: mid-April 2026 (static public site + CMS for operators)
- V2: dynamic features (availability calendar, booking forms)
- Design principle: **Clarity > Flexibility** — simple choices, no over-engineering

---

## Dev Commands

```bash
pnpm dev        # Astro dev server with hot reload
pnpm build      # Static + SSR build (Keystatic admin routes)
pnpm preview    # Serve production build locally
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Astro 5 (static-first, Node.js standalone adapter) |
| Reactivity | Svelte 5 (interactive islands), React 19 (Keystatic admin only) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| CMS | Keystatic 0.5 (local in dev, GitHub mode in prod) |
| i18n | Astro built-in — FR (default, no prefix) / EN (`/en/`) / ES (`/es/`) |
| Animations | GSAP 3 (logo mask reveal, journée type timeline) |
| Icons | Lucide via `astro-icon` + `lucide-svelte` |

Import alias: `@/` maps to `src/`.

---

## Architecture

### Static-first, SSR-minimal

All public pages are **pre-rendered static HTML**. Only Keystatic admin routes (`/keystatic`, `/api/keystatic/*`) use SSR. This means no server-side logic in page components — data is loaded at build time via `Astro.glob` or content collections.

### Color system — "L'Été au Lac" palette

The foundation color is **Soleil** (`#FFFF80`) — a warm, luminous yellow that carries the summer/guinguette identity of the brand. It is the transversal accent used across the site (CTAs on dark backgrounds, highlights, brand signature).

Each pole has its own accent color resolved via `src/lib/pole-config.ts`:

| Pole | Accent | Dark variant | Light bg |
|---|---|---|---|
| restaurant | `#E8603C` (terracotta) | `#C4452A` | `#FFF3ED` |
| aventure | `#7CB342` (vert végétal) | `#5A8A2E` | `#F0F7E6` |
| salle | `#5B8DEF` (bleu ardoise) | `#3D6FD1` | `#EDF4FF` |

**Brun Terre** (`#36342F`) is the primary text/neutral dark color, not a pole accent.

Pole-aware components accept a `pole` prop. Colors are applied via **inline `style` attributes**, never via dynamic Tailwind class interpolation. CTAs also change per pole (tel: for restaurant/aventure, mailto: for la salle).

### La Salle — Multi-purpose venue

"La Salle" replaces the former "Événements" pole. It represents the physical venue (a modular hall) and covers two use-case categories:
- **Séminaires & Pro** (`/la-salle/seminaires`) — corporate seminars, conferences, training
- **Événementiel** (`/la-salle/evenementiel`) — concerts, fairs, exhibitions, private parties

The hub page (`/la-salle`) showcases the venue specs and dispatches to both sub-pages.

### Double-layer cross-linking

Every page has two cross-link layers:
1. **Structural** — Permanent "La Terrasse c'est aussi…" block linking to other poles
2. **Contextual** — Narrative suggestions specific to the page (e.g. "Après votre pédalo, déjeunez au bord du lac")

### SEO infrastructure

- `src/lib/seo.ts` generates JSON-LD for: `LocalBusiness`, `Restaurant`, `SportsActivityLocation`, `EventVenue`
- `src/components/common/SEOHead.astro` injects all meta, OG, canonical, hreflang tags
- Every page receives a `pagePath` prop for canonical/hreflang generation

---

## i18n System

- Translations centralized in `src/i18n/translations.ts` with helper utilities in `src/i18n/utils.ts`
- CMS fields: each field has `_en` and `_es` suffixed variants (fallback to FR if empty)
- URL structure: FR `/restaurant`, EN `/en/restaurant`, ES `/es/restaurant`
- Routing strategy: `prefixDefaultLocale: false` with fallback rewrite

---

## CMS — Keystatic

Config in `keystatic.config.ts`. Collections and singletons:

| Type | Name | Path |
|---|---|---|
| collection | activities | `src/content/activities/*.mdx` |
| collection | seminars | `src/content/seminars/*.mdx` |
| collection | events | `src/content/events/*.mdx` |
| collection | producers | `src/content/producers/*.yaml` |
| singleton | restaurant | `src/content/restaurant/info.yaml` |
| singleton | venue | `src/content/venue/info.yaml` |
| singleton | settings | `src/content/settings/site.yaml` |

In production, Keystatic uses **GitHub mode** (content edits → GitHub commits → webhook → `git pull` + rebuild).

---

## Tailwind CSS v4

- Uses `@tailwindcss/vite` plugin — **NOT** `@astrojs/tailwind` (which is v3 only)
- Config via `@theme` directive in `src/styles/global.css` — no `tailwind.config.js`
- `.svelte` files require `@source "../components/**/*.svelte"` in `global.css` to be scanned
- Avoid dynamic class interpolation (`{cond ? 'class-a' : 'class-b'}`) — use `class:name={cond}` directive or inline `style`
- Per-pole colors → always inline `style` with hex values

---

## Icons — Lucide via astro-icon

- Use **Lucide** everywhere — no inline SVG for standard icons
- `.astro` files: `import { Icon } from 'astro-icon/components'` → `<Icon name="lucide:icon-name" class="w-4 h-4" />`
- `.svelte` files: `import { Phone, ArrowRight } from 'lucide-svelte'` → `<Phone class="w-4 h-4" />`
- Browse: [lucide.dev/icons](https://lucide.dev/icons)
- Brand logos (`LogoTerrasse`, `LogoTerrasseFull`, `LogoMaskReveal`) stay as custom inline SVGs
- Pass `stroke-width="1.5"` for a thinner stroke (default is 2)

---

## Svelte Islands in Astro

- Cannot pass **functions** as props to `client:*` islands (not serializable) — pass data objects instead
- `position: fixed` inside a parent with `backdrop-filter` (e.g. `backdrop-blur-sm`) won't work relative to viewport — use a DOM portal (`document.body.appendChild`) to escape
- Client directives: `client:load` (eager), `client:visible` (lazy / below-fold), `client:idle` (deferred)

---

## Commits

Conventional Commits format:

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `test`, `perf`, `ci`

Scopes: `menu`, `header`, `homepage`, `restaurant`, `aventure`, `salle`, `i18n`, `cms`, `layout`, `a11y`, `deploy`, `deps`, etc.

Short messages, English, lowercase after the colon.

---

## Deployment

- **Server:** VPS with Nginx reverse proxy + PM2 process manager
- **Static assets** served by Nginx directly from `dist/client/` (cache headers applied)
- **Node.js process** (`dist/server/entry.mjs`) runs on `127.0.0.1:4321`, handles only Keystatic admin routes
- **PM2 config:** `ecosystem.config.cjs` — app name `laterrasse`, port 4321
- **Deploy flow:** GitHub webhook → `git pull` + `pnpm install` + `pnpm build` + PM2 restart (~2 min content-to-live)
- **HTTPS:** Let's Encrypt / Certbot

Required env vars: see `.env.example` (GitHub OAuth for Keystatic, `SITE_URL`, `DEPLOY_WEBHOOK_SECRET`, `PLAUSIBLE_DOMAIN`).
