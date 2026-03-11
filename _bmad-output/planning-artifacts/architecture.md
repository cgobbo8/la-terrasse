---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-11'
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-base-de-loisir-saint-ferreol-2026-03-09.md'
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/brainstorming/brainstorming-session-2026-03-08-1730.md'
workflowType: 'architecture'
project_name: 'base-de-loisir-saint-ferreol'
user_name: 'Corentin'
date: '2026-03-11'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
39 functional requirements across 9 domains. The architecture is driven by three orthogonal concerns: (1) multi-pole visual identity requiring a consistent theming mechanism, (2) a double-layer cross-linking system creating relationships between all content pages, and (3) CMS-managed content that must map cleanly to the component architecture.

Navigation is the most architecturally complex functional domain: a mega-menu with 3 pole columns + 3 transversal entries on desktop, a slide-out panel with accordion sub-menus on mobile (requiring DOM portal to escape backdrop-blur stacking context), and a sticky context-aware CTA that changes label and destination per pole.

The homepage is the most component-dense page: logo-mask reveal animation, video hero, three-pole discovery section, immersive "journée type" GSAP timeline, seasonal info bento grid, and event agenda.

**Non-Functional Requirements:**
26 NFRs across 6 categories. Performance (< 2s on 4G, CWV green, Lighthouse 90+), Accessibility (WCAG 2.1 AA, 44px touch targets, prefers-reduced-motion), Security (form validation, honeypot spam protection, HTTPS, GDPR cookie consent), Scalability (CDN-served static site), SEO (Lighthouse 100, structured data, hreflang), Maintainability (CMS autonomy, < 2min rebuild, component-based architecture).

The static-site architecture inherently satisfies most scalability and reliability NFRs. Performance NFRs are achievable through Astro's zero-JS-by-default approach. The primary architectural risk for NFRs is the GSAP island weight impacting performance budgets.

**Scale & Complexity:**

- Primary domain: Web frontend (static MPA with interactive islands)
- Complexity level: Low (infrastructure) · Medium-high (design system coherence, UX craft)
- Estimated architectural components: ~30 components (11 foundation + 13 content + 7 interactive islands)
- No backend services, no database, no API layer, no authentication
- Content managed via Keystatic (file-based CMS, Git-backed)

### Technical Constraints & Dependencies

**Stack constraints (already decided in PRD):**
- Astro static MPA — no SPA routing, no client-side navigation
- Svelte islands via `client:*` directives — cannot pass functions as props (serialization boundary)
- Tailwind CSS v4 via `@tailwindcss/vite` — config in `@theme` directive, no `tailwind.config.js`
- Per-pole colors via inline `style` attributes (not dynamic Tailwind classes)
- `position: fixed` inside `backdrop-filter` parent requires DOM portal to body

**External dependencies:**
- Keystatic CMS — defines content schema, rebuild trigger mechanism
- GSAP — animation library for signature sections (LogoMaskReveal, JournéeTypeTimeline, HistoireDuLieu)
- Google Analytics — GDPR-compliant integration with cookie consent
- Hosting/CDN — static site deployment (platform TBD)

**Content dependencies:**
- Photography from operator (placeholder-ready architecture)
- Menu, prices, activity details from operator (CMS-editable)
- Translations for EN/ES (structure-ready, content fillable iteratively)

### Cross-Cutting Concerns Identified

1. **Per-pole theming:** Every pole-aware component must accept a `pole` prop and resolve accent colors, light backgrounds, CTA labels, and emotional tone. This is the most pervasive architectural concern — ~20 of 30 components are pole-aware.

2. **Cross-linking system:** Structural ("La Terrasse c'est aussi...") + contextual narrative + organic group mentions create a 3-layer relationship system between pages. Requires consistent data model for inter-page references.

3. **i18n:** All user-facing text, CMS content, URL structure, meta tags, alt text, and ARIA labels must support FR/EN/ES. Translation utilities centralized in `src/i18n/utils.ts`.

4. **SEO per page:** Every page is an autonomous landing page with unique meta title/description, structured data (LocalBusiness, Restaurant, SportsActivityLocation), Open Graph tags, and hreflang tags.

5. **Accessibility (WCAG AA):** Focus management in Svelte islands, keyboard navigation in mega-menu and accordion, prefers-reduced-motion for all animations, semantic HTML with proper landmarks and heading hierarchy.

6. **V1→V2 upgrade path:** Architecture must accommodate future features (booking system, real-time availability, photo galleries, testimonials) without structural changes. Placeholder components and swappable patterns.

## Starter Template Evaluation

### Primary Technology Domain

Web frontend (static MPA) — Astro + Svelte islands. No starter template needed: the project is already initialized and operational.

### Existing Stack Audit

**Core framework (in place):**
- Astro 5.18 — static MPA with `@astrojs/node` adapter (standalone mode)
- Svelte 5.53 — interactive islands via `@astrojs/svelte`
- React 19 — required by Keystatic admin UI via `@astrojs/react`
- Tailwind CSS 4.2 — via `@tailwindcss/vite` plugin
- TypeScript 5.9
- pnpm — package manager

**CMS (in place):**
- Keystatic 0.5.48 — local storage mode, Git-backed
- 3 collections: activities (10 activity pages), seminars (3 seminar packages), events (agenda)
- 3 singletons: restaurant (info), venue (room specs), settings (site-wide config)
- i18n fields per collection: `title_en`, `title_es`, `description_en`, `description_es`
- MDX content field for rich descriptions

**i18n (in place):**
- Astro built-in i18n: FR (default, no prefix) / EN / ES
- Fallback: EN→FR, ES→FR with rewrite strategy
- Translation utilities in `src/i18n/utils.ts`

**Pages (in place):**
- Homepage, 3 pole hubs, restaurant sub-pages (carte, producteurs, repas-groupe), 3 transversal pages, contact
- Activity detail pages via content collection

**Components (in place):**
- Header, Footer, MegaMenu (Svelte), MobileMenu (Svelte), SectionHero, CrossLinkBlock, BaseLayout

### Dependencies to Add

**Required for V1:**
- `gsap` — signature animations (LogoMaskReveal, JournéeTypeTimeline, HistoireDuLieu)
- SEO utilities — structured data generation (JSON-LD for LocalBusiness, Restaurant, SportsActivityLocation)

**Recommended for DX:**
- `eslint` + `prettier` — code quality and formatting consistency
- `vitest` — unit testing for utility functions and component logic
- `playwright` — E2E testing for critical user journeys

**Not needed for V1:**
- No additional CSS libraries (Tailwind v4 is sufficient)
- No state management library (Svelte islands are self-contained)
- No API framework (static site, contact forms via external service)

### Architectural Decisions Already Established

| Decision | Choice | Status |
|----------|--------|--------|
| Framework | Astro 5 (static MPA) | ✅ In place |
| UI reactivity | Svelte 5 islands | ✅ In place |
| Styling | Tailwind CSS v4 via Vite plugin | ✅ In place |
| CMS | Keystatic (local, Git-backed) | ✅ In place |
| i18n | Astro built-in, 3 locales | ✅ In place |
| Package manager | pnpm | ✅ In place |
| TypeScript | Enabled | ✅ In place |
| Node adapter | Standalone mode | ✅ In place |
| Animation | GSAP | ⬜ To install |
| Testing | Vitest + Playwright | ⬜ To install |
| Linting | ESLint + Prettier | ⬜ To install |
| SEO structured data | JSON-LD generation | ⬜ To implement |

**Note:** No project initialization story needed — the codebase is operational. Remaining tooling (GSAP, testing, linting) will be added as part of feature implementation.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Hosting & deployment strategy
2. Contact/booking mechanism
3. Image optimization pipeline

**Important Decisions (Shape Architecture):**
4. Analytics & privacy
5. Form spam protection

**Deferred Decisions (Post-MVP):**
- Real-time availability system (V2)
- Online booking integration (V2)
- Customer accounts (V3)

### Infrastructure & Deployment

**Hosting: Self-managed VPS**
- Rationale: Full control, Node standalone adapter already configured, cost-efficient for a static site
- Astro runs in `node` standalone mode on the VPS
- Static pages served directly, Keystatic admin route (`/keystatic`) served via SSR
- Deployment: Git push → rebuild → serve updated static files

**CMS deployment: Keystatic `github` mode**
- Rationale: Allows the operator (Corentin's brother) to edit content via the web admin UI without local dev setup
- Content changes commit to GitHub via GitHub API → trigger rebuild on VPS
- Migration required: change `storage: { kind: 'local' }` to `storage: { kind: 'github' }` in `keystatic.config.ts`
- The `/keystatic` admin route requires SSR (Node adapter already supports this)

**Build & serve pipeline:**
- pnpm build → static output + SSR routes (Keystatic admin)
- Reverse proxy (Nginx) in front of Node process
- HTTPS via Let's Encrypt / Certbot
- Automatic rebuild triggered by GitHub webhook on content changes

### Contact & Booking (V1)

**Approach: `mailto:` + `tel:` links**
- Rationale: Simplest viable approach for V1. No backend, no form service dependency, no spam protection needed
- `mailto:` link with pre-filled subject line based on pole context
- `tel:` link prominently displayed on every page (sticky CTA)
- Contact page: `mailto:` + `tel:` + embedded map/directions
- V2 upgrade path: Replace `mailto:` with real contact form + Turnstile captcha + email delivery service

**CTA adaptation per pole (V1):**
- Homepage: "Nous contacter" → `tel:`
- Restaurant: "Réserver ma table" → `tel:`
- Aventure: "Réserver mon aventure" → `tel:`
- Événements: "Demander un devis" → `mailto:` with pre-filled subject

### Image Optimization

**Approach: `astro:assets` (built-in)**
- Rationale: Native Astro integration, uses Sharp (already in dependencies), covers all NFRs
- Automatic format conversion: WebP/AVIF with fallback
- Responsive `srcset` generation: 480w, 768w, 1280w, 1920w
- Lazy loading via `loading="lazy"` for below-fold images
- Above-fold hero images: `loading="eager"` + `fetchpriority="high"`
- CMS images from `public/images/` processed at build time

### Analytics & Privacy

**Approach: Plausible Analytics**
- Rationale: Privacy-first, no cookies, GDPR-compliant without consent banner
- Lightweight script (~1KB), no performance impact
- No cookie consent banner needed — zero UX friction
- Self-hosted on VPS or Plausible Cloud
- Provides: page views, referrers, device stats, goal conversions (contact clicks)

### Form Spam Protection

**Approach: Cloudflare Turnstile (deferred to V2)**
- Rationale: No forms in V1 (mailto/tel only). Turnstile will protect contact forms when added
- Privacy-friendly alternative to reCAPTCHA
- Invisible challenge — no UX friction
- Will be implemented alongside real contact form in V2

### Decision Impact Analysis

**Implementation Sequence:**
1. Image optimization (`astro:assets`) — immediate, affects all pages
2. Plausible Analytics — add script to BaseLayout, configure goals
3. Keystatic `github` mode migration — before operator handoff
4. VPS deployment pipeline — Nginx + Node + GitHub webhook
5. Contact form + Turnstile — V2

**Cross-Component Dependencies:**
- Keystatic `github` mode → requires GitHub repo access token configuration
- VPS deployment → requires Nginx reverse proxy config for Node SSR (Keystatic admin)
- `astro:assets` → requires updating existing `<img>` tags to use Astro `<Image>` component
- Plausible → minimal dependency, script tag in BaseLayout head

## Implementation Patterns & Consistency Rules

### Critical Conflict Points Identified

12 areas where AI agents could make different choices if not specified. All patterns below are derived from existing codebase conventions.

### Naming Patterns

**Component Files:**
- Astro components: `PascalCase.astro` — e.g., `Header.astro`, `SectionHero.astro`, `CrossLinkBlock.astro`
- Svelte islands: `PascalCase.svelte` — e.g., `MegaMenu.svelte`, `MobileMenu.svelte`
- Organized by domain: `src/components/common/` for shared, `src/components/{pole}/` for pole-specific

**Page Files:**
- Astro pages: `kebab-case.astro` — e.g., `repas-groupe.astro`, `en-famille.astro`
- Hub pages: `index.astro` inside pole folder — e.g., `src/pages/restaurant/index.astro`
- URL structure mirrors file structure: `/restaurant/carte`, `/aventure/pedalo`

**TypeScript Files:**
- Utility files: `camelCase.ts` — e.g., `utils.ts`, `translations.ts`
- Functions: `camelCase` — e.g., `getLangFromUrl()`, `useTranslations()`, `getLocalizedField()`
- Types: `PascalCase` — e.g., `Lang`, `Props`
- Constants: `camelCase` — e.g., `defaultLang`, `languages`

**CSS/Tailwind:**
- Design tokens in `@theme` directive: `--color-{name}`, `--font-{role}`, `--spacing-{name}`
- Pole color tokens: `--color-{pole}` and `--color-{pole}-light`
- No dynamic Tailwind classes in string interpolation — use `class:name={cond}` in Svelte or static classes in Astro

### Structure Patterns

**Project Organization:**
```
src/
├── components/
│   ├── common/          # Shared across all pages (Header, Footer, CrossLinkBlock...)
│   ├── restaurant/      # Restaurant-specific components
│   ├── aventure/        # Aventure-specific components
│   ├── evenements/      # Événements-specific components
│   └── homepage/        # Homepage-specific components (LogoMaskReveal, JournéeType...)
├── content/             # Keystatic content (MDX + YAML)
│   ├── activities/      # Activity MDX files
│   ├── seminars/        # Seminar package MDX files
│   ├── events/          # Event MDX files
│   ├── restaurant/      # Restaurant singleton YAML
│   ├── venue/           # Venue singleton YAML
│   └── settings/        # Site settings singleton YAML
├── i18n/
│   ├── translations.ts  # All translation strings
│   └── utils.ts         # i18n utility functions
├── layouts/
│   └── BaseLayout.astro # Single layout, accepts pole prop
├── pages/               # File-based routing (kebab-case)
└── styles/
    └── global.css       # Tailwind config + design tokens
```

**Component file structure:**
- Astro components: frontmatter (imports, Props interface, logic) → HTML template
- Svelte islands: `<script>` → template → `<style>` (if needed, prefer Tailwind)
- Every component that accepts a `pole` prop must type it as `'restaurant' | 'aventure' | 'evenements' | null`

### Pole-Aware Component Pattern

**The canonical pattern for pole-aware components:**

```astro
---
// Every pole-aware Astro component follows this structure
interface Props {
  pole?: 'restaurant' | 'aventure' | 'evenements' | null;
  // ... other props
}

const { pole = null } = Astro.props;

// Pole color resolution — ALWAYS via data object, NEVER dynamic Tailwind
const poleConfig: Record<string, { accent: string; light: string; ctaLabel: string }> = {
  restaurant: { accent: '#2D2B1B', light: '#f5f0e8', ctaLabel: 'Réserver ma table' },
  aventure:   { accent: '#537b47', light: '#eef5ec', ctaLabel: 'Réserver mon aventure' },
  evenements: { accent: '#3d4969', light: '#edf0f5', ctaLabel: 'Demander un devis' },
};

const config = pole ? poleConfig[pole] : null;
---

<!-- Apply via inline style, NOT dynamic Tailwind classes -->
<div style={config ? `border-color: ${config.accent}` : ''}>
  ...
</div>
```

**For Svelte islands:** Receive pole config as a data object prop (not functions). Resolve colors inside the component from the pole identifier.

**Anti-patterns:**
- ❌ `class={pole === 'restaurant' ? 'bg-restaurant' : 'bg-aventure'}` — dynamic Tailwind, won't be scanned
- ❌ Passing a callback `onClick` to a `client:*` island — not serializable
- ✅ `style:border-color={config.accent}` — inline style, always works
- ✅ Static Tailwind for non-pole-dependent styles: `class="text-lg font-bold"`

### i18n Patterns

**UI strings (translations.ts):**
- Keys use dot-notation namespaced by section: `{section}.{subsection}.{key}`
- Pattern: `nav.restaurant`, `home.hero.tagline`, `common.contact`
- Access: `const t = useTranslations(lang); t('common.contact')`
- Every page must call `getLangFromUrl(Astro.url)` in frontmatter

**CMS content (Keystatic):**
- French content in base fields: `title`, `description`
- Translations in suffixed fields: `title_en`, `title_es`, `description_en`, `description_es`
- Access: `getLocalizedField(entry, 'title', lang)` — falls back to FR if translation missing

**URL structure:**
- FR (default): `/restaurant/carte` (no prefix)
- EN: `/en/restaurant/carte`
- ES: `/es/restaurant/carte`
- Always use `getLocalizedPath(path, lang)` to generate links — never hardcode locale prefix

### SEO Patterns

**Every page must include:**
- Unique `<title>` via BaseLayout: `{title} — La Terrasse`
- `<meta name="description">` via BaseLayout prop
- Canonical URL
- Open Graph tags (og:title, og:description, og:image, og:url)
- `hreflang` tags for all 3 locales
- JSON-LD structured data appropriate to page type

**Structured data by page type:**
- Homepage: `LocalBusiness`
- Restaurant pages: `Restaurant`
- Activity pages: `SportsActivityLocation`
- Événements pages: `LocalBusiness` with event venue properties

### Accessibility Patterns

**Every interactive Svelte island MUST:**
- Manage focus on mount/unmount (especially modals, slide-out panels)
- Support keyboard navigation (Escape to close, Tab order, arrow keys where appropriate)
- Include `aria-label` on icon-only buttons
- Check `prefers-reduced-motion` before running animations

**Every Astro component MUST:**
- Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`)
- Maintain heading hierarchy (h1 → h2 → h3, no skips)
- Include `alt` text on all `<img>` (descriptive or empty for decorative)
- Use `<button>` or `<a>` for interactive elements, never `<div onclick>`

### Image Patterns

**All images via `astro:assets`:**
```astro
---
import { Image } from 'astro:assets';
import heroImg from '@/assets/images/hero.jpg';
---
<!-- Above fold: eager + high priority -->
<Image src={heroImg} alt="Vue du lac de Saint-Ferréol" loading="eager" fetchpriority="high" />

<!-- Below fold: lazy (default) -->
<Image src={heroImg} alt="Terrasse du restaurant" />
```

**CMS images from `public/`:** Use standard `<img>` with manual `loading="lazy"` and descriptive `alt`.

### Import Patterns

**Path alias:** Always use `@/` prefix for absolute imports from `src/`:
- ✅ `import Header from '@/components/common/Header.astro'`
- ❌ `import Header from '../../components/common/Header.astro'`

**Import order:**
1. Astro/framework imports (`astro:assets`, `astro:content`)
2. External libraries (`gsap`)
3. Internal utilities (`@/i18n/utils`)
4. Components (`@/components/...`)
5. Styles (`@/styles/...`)

### Enforcement Guidelines

**All AI Agents MUST:**
- Read `CLAUDE.md` before any implementation
- Use the pole-aware pattern with inline styles for per-pole colors
- Use `getLocalizedPath()` for all internal links
- Use `useTranslations()` for all UI strings
- Use `getLocalizedField()` for all CMS content display
- Never create components with dynamic Tailwind class names
- Never pass functions as props to `client:*` Svelte islands
- Always portal `position: fixed` elements to `document.body` when inside `backdrop-filter` parents

## Project Structure & Boundaries

### Complete Project Directory Structure

```
la-terrasse-saint-ferreol/
├── .github/
│   └── workflows/
│       └── deploy.yml                    # GitHub webhook → VPS rebuild
├── astro.config.mjs                      # Astro config (adapters, integrations, i18n)
├── keystatic.config.ts                   # CMS schema (collections, singletons)
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── CLAUDE.md                             # AI agent rules
│
├── public/
│   ├── favicon.svg
│   ├── images/
│   │   ├── activities/                   # CMS-managed activity photos
│   │   ├── seminars/                     # CMS-managed seminar photos
│   │   ├── events/                       # CMS-managed event photos
│   │   ├── restaurant/                   # Restaurant atmosphere photos
│   │   ├── producers/                    # Producer portraits
│   │   ├── hero/                         # Hero images per pole
│   │   └── site/                         # General site photos (lake, venue)
│   ├── videos/
│   │   └── hero-lac.mp4                  # Homepage video hero
│   └── fonts/                            # Self-hosted Montserrat (if migrated from Google Fonts)
│
├── src/
│   ├── assets/                           # Optimized via astro:assets (import-based)
│   │   └── images/                       # Static images needing build-time optimization
│   │
│   ├── components/
│   │   ├── common/                       # Shared across all pages
│   │   │   ├── Header.astro              # ✅ exists — sticky topbar, pole-aware
│   │   │   ├── Footer.astro              # ✅ exists — brand info, contact, legal
│   │   │   ├── MegaMenu.svelte           # ✅ exists — desktop multi-column dropdown
│   │   │   ├── MobileMenu.svelte         # ✅ exists — slide-out panel, portaled to body
│   │   │   ├── SectionHero.astro         # ✅ exists — full-bleed hero with image/video
│   │   │   ├── CrossLinkBlock.astro      # ✅ exists — "La Terrasse c'est aussi..."
│   │   │   ├── ContextualCrossLink.astro # ⬜ to create — narrative bridge per page
│   │   │   ├── CTAButton.astro           # ⬜ to create — pole-aware primary/secondary/ghost
│   │   │   ├── CTASection.astro          # ⬜ to create — full-width CTA band + group mention
│   │   │   ├── SectionWrapper.astro      # ⬜ to create — consistent spacing, alternating bg
│   │   │   ├── Breadcrumb.astro          # ⬜ to create — pole name in hero, clickable
│   │   │   ├── GroupMention.astro        # ⬜ to create — organic inline group link
│   │   │   ├── SeasonalBanner.astro      # ⬜ to create — thin announcement bar, CMS-managed
│   │   │   ├── ContactLinks.astro        # ⬜ to create — mailto: + tel: with pole context
│   │   │   └── SEOHead.astro             # ⬜ to create — meta tags, OG, hreflang, JSON-LD
│   │   │
│   │   ├── homepage/                     # Homepage-specific components
│   │   │   ├── LogoMaskReveal.svelte     # ⬜ to create — GSAP intro animation
│   │   │   ├── VideoHero.astro           # ⬜ to create — full-screen lake video
│   │   │   ├── PoleDiscovery.astro       # ⬜ to create — 3 poles card section
│   │   │   ├── JourneeTypeTimeline.svelte# ⬜ to create — GSAP horizontal scroll timeline
│   │   │   ├── HistoireDuLieu.svelte     # ⬜ to create — GSAP horizontal scroll storytelling
│   │   │   ├── BentoMeteo.astro          # ⬜ to create — weather/info dashboard grid
│   │   │   └── AgendaSection.astro       # ⬜ to create — upcoming events from CMS
│   │   │
│   │   ├── aventure/                     # Aventure pole components
│   │   │   ├── ActivityCard.astro        # ⬜ to create — card with price/age/duration
│   │   │   ├── ActivityBrowser.svelte    # ⬜ to create — lateral swipe/scroll navigation
│   │   │   └── AlternativeSuggestions.astro # ⬜ to create — "Vous pourriez aussi aimer"
│   │   │
│   │   ├── restaurant/                   # Restaurant pole components
│   │   │   ├── MenuSection.astro         # ⬜ to create — carte display
│   │   │   └── ProducerCard.astro        # ⬜ to create — producer photo + story
│   │   │
│   │   ├── evenements/                   # Événements pole components
│   │   │   ├── SeminarPackageCard.astro  # ⬜ to create — package with inclusions
│   │   │   ├── PackComparator.astro      # ⬜ to create — side-by-side comparison
│   │   │   └── VenueSpecs.astro          # ⬜ to create — room capacity/equipment
│   │   │
│   │   └── ui/                           # Generic reusable UI primitives
│   │       ├── PriceTable.astro          # ⬜ to create — structured price display
│   │       ├── FAQAccordion.astro        # ⬜ to create — expandable Q&A
│   │       ├── InteractiveMap.astro      # ⬜ to create — SVG map of leisure base
│   │       └── TriptychHero.svelte       # ⬜ to create — vertical-slice image motif
│   │
│   ├── content/                          # Keystatic content (Git-backed)
│   │   ├── activities/                   # ✅ exists — mini-golf.mdx, pedalo.mdx (+ 8 more)
│   │   ├── seminars/                     # ⬜ to populate — seminaire-simple.mdx, etc.
│   │   ├── events/                       # ⬜ to populate — upcoming events
│   │   ├── restaurant/                   # ⬜ to populate — singleton YAML
│   │   ├── venue/                        # ⬜ to populate — singleton YAML
│   │   └── settings/                     # ⬜ to populate — singleton YAML
│   │
│   ├── i18n/
│   │   ├── translations.ts              # ✅ exists — FR/EN/ES strings
│   │   └── utils.ts                     # ✅ exists — getLangFromUrl, useTranslations, etc.
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro             # ✅ exists — accepts pole prop, sets theme
│   │
│   ├── lib/                              # Utility modules
│   │   ├── pole-config.ts               # ⬜ to create — centralized pole colors/labels/CTAs
│   │   ├── seo.ts                       # ⬜ to create — JSON-LD generators per page type
│   │   └── content.ts                   # ⬜ to create — Keystatic content helpers
│   │
│   ├── pages/
│   │   ├── index.astro                  # ✅ exists — homepage
│   │   ├── contact.astro                # ✅ exists — contact page
│   │   ├── en-famille.astro             # ✅ exists — transversal
│   │   ├── en-groupe.astro              # ✅ exists — transversal
│   │   ├── en-entreprise.astro          # ✅ exists — transversal
│   │   ├── restaurant/
│   │   │   ├── index.astro              # ✅ exists — Restaurant hub
│   │   │   ├── carte.astro              # ✅ exists — menu page
│   │   │   ├── producteurs.astro        # ✅ exists — producers page
│   │   │   └── repas-groupe.astro       # ✅ exists — group dining page
│   │   ├── aventure/
│   │   │   ├── index.astro              # ✅ exists — Aventure hub
│   │   │   └── [slug].astro             # ⬜ to create — dynamic activity detail pages
│   │   ├── evenements/
│   │   │   ├── index.astro              # ✅ exists — Événements hub
│   │   │   └── [slug].astro             # ⬜ to create — dynamic seminar detail pages
│   │   ├── en/                          # ⬜ handled by Astro i18n routing
│   │   └── es/                          # ⬜ handled by Astro i18n routing
│   │
│   └── styles/
│       └── global.css                   # ✅ exists — Tailwind config + design tokens
│
├── da/                                   # Design assets (brand guidelines, logos)
├── ressources/                           # Source assets (SVGs, raw files)
│   └── assets/
│       ├── la-terasse-logo-full.svg     # ✅ exists
│       └── la-terasse-logo.svg          # ✅ exists
│
├── _bmad/                                # BMAD workflow tooling
└── _bmad-output/                         # Planning artifacts
    └── planning-artifacts/
        ├── product-brief-*.md
        ├── prd.md
        ├── ux-design-specification.md
        └── architecture.md              # This document
```

### Architectural Boundaries

**Rendering Boundary (Astro vs Svelte):**
- **Astro components (.astro):** All static content, layouts, page structure. Zero client-side JS.
- **Svelte islands (.svelte + `client:*`):** Only for interactive behavior — mega-menu, mobile menu, GSAP animations, lateral card browsing. Each island is self-contained.
- **Rule:** If it doesn't need client-side interactivity, it's an Astro component. If it does, it's a Svelte island with `client:load` (critical UI) or `client:visible` (below-fold animations).

**Data Flow Boundary:**
```
Keystatic CMS (content authoring)
    ↓ Git commit (github mode)
    ↓
GitHub Repository
    ↓ Webhook → VPS
    ↓
Astro Build (pnpm build)
    ↓ reads src/content/ via astro:content
    ↓ generates static HTML + island JS
    ↓
Nginx (reverse proxy)
    ├── Static files → served directly
    └── /keystatic/* → Node SSR process
```

**Component Communication:**
- **Page → Layout:** `pole` prop flows down from page to BaseLayout to Header
- **Page → Component:** Props only (data objects). No shared state, no event bus.
- **Svelte island → DOM:** Portals for fixed-position elements (MobileMenu → `document.body`)
- **CMS → Page:** Content loaded at build time via `astro:content` API. No runtime fetching in V1.

### Requirements to Structure Mapping

**Navigation (FR1-FR5):**
- `src/components/common/Header.astro` — sticky topbar, pole indicator
- `src/components/common/MegaMenu.svelte` — desktop multi-column
- `src/components/common/MobileMenu.svelte` — slide-out panel
- `src/components/common/Breadcrumb.astro` — sub-page context

**Cross-Linking (FR6-FR8):**
- `src/components/common/CrossLinkBlock.astro` — structural layer
- `src/components/common/ContextualCrossLink.astro` — narrative layer
- `src/components/common/GroupMention.astro` — organic group layer
- `src/components/aventure/AlternativeSuggestions.astro` — activity alternatives

**Aventure (FR9-FR12):**
- `src/pages/aventure/index.astro` — hub with activity grid
- `src/pages/aventure/[slug].astro` — dynamic detail pages
- `src/components/aventure/ActivityCard.astro` — card component
- `src/components/aventure/ActivityBrowser.svelte` — lateral navigation

**Restaurant (FR13-FR15):**
- `src/pages/restaurant/index.astro` — hub
- `src/pages/restaurant/carte.astro` — menu page
- `src/pages/restaurant/producteurs.astro` — producers
- `src/components/restaurant/ProducerCard.astro`
- `src/components/restaurant/MenuSection.astro`

**Événements (FR16-FR18):**
- `src/pages/evenements/index.astro` — hub with specs + packages
- `src/pages/evenements/[slug].astro` — package detail pages
- `src/components/evenements/VenueSpecs.astro`
- `src/components/evenements/SeminarPackageCard.astro`
- `src/components/evenements/PackComparator.astro`

**Transversal (FR19-FR20):**
- `src/pages/en-famille.astro`
- `src/pages/en-groupe.astro`
- `src/pages/en-entreprise.astro`

**Contact (FR21-FR24):**
- `src/pages/contact.astro`
- `src/components/common/ContactLinks.astro` — mailto: + tel: per pole
- `src/components/common/CTAButton.astro` — sticky CTA
- `src/components/common/CTASection.astro` — page CTA bands

**Homepage (FR25-FR29):**
- `src/pages/index.astro`
- `src/components/homepage/LogoMaskReveal.svelte` — GSAP, `client:load`
- `src/components/homepage/VideoHero.astro` — video + overlay
- `src/components/homepage/PoleDiscovery.astro` — 3 poles section
- `src/components/homepage/JourneeTypeTimeline.svelte` — GSAP, `client:visible`
- `src/components/homepage/HistoireDuLieu.svelte` — GSAP, `client:visible`
- `src/components/homepage/BentoMeteo.astro` — info dashboard
- `src/components/homepage/AgendaSection.astro` — events from CMS

**i18n (FR30-FR31):**
- `src/i18n/translations.ts` — all UI strings
- `src/i18n/utils.ts` — utility functions
- `astro.config.mjs` — locale routing config

**CMS (FR32-FR36):**
- `keystatic.config.ts` — schema definitions
- `src/content/` — all content files

**SEO (FR37-FR39):**
- `src/components/common/SEOHead.astro` — meta, OG, hreflang
- `src/lib/seo.ts` — JSON-LD generators

### Cross-Cutting Concern Locations

| Concern | Primary location | Used by |
|---------|-----------------|---------|
| Pole theming | `src/lib/pole-config.ts` | Every pole-aware component |
| i18n | `src/i18n/` | Every page and component |
| SEO | `src/lib/seo.ts` + `SEOHead.astro` | BaseLayout, every page |
| Accessibility | Per-component | All components |
| Image optimization | `astro:assets` import | All image-using components |
| Cross-linking | `CrossLinkBlock` + `ContextualCrossLink` | Every page |

### Key File: `src/lib/pole-config.ts`

Centralized source of truth for pole-specific data, eliminating duplication across components:

```typescript
export type Pole = 'restaurant' | 'aventure' | 'evenements';

export interface PoleConfig {
  accent: string;
  light: string;
  ctaLabel: string;
  ctaHref: string;
  name: string;
  icon: string;
}

export const poleConfigs: Record<Pole, PoleConfig> = {
  restaurant: {
    accent: '#2D2B1B',
    light: '#f5f0e8',
    ctaLabel: 'Réserver ma table',
    ctaHref: 'tel:+33...',
    name: 'Restaurant',
    icon: 'utensils',
  },
  aventure: {
    accent: '#537b47',
    light: '#eef5ec',
    ctaLabel: 'Réserver mon aventure',
    ctaHref: 'tel:+33...',
    name: 'Aventure',
    icon: 'compass',
  },
  evenements: {
    accent: '#3d4969',
    light: '#edf0f5',
    ctaLabel: 'Demander un devis',
    ctaHref: 'mailto:...',
    name: 'Événements',
    icon: 'calendar',
  },
};
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** All technology choices confirmed compatible. Stack already operational (Astro 5.18 + Svelte 5.53 + Tailwind 4.2 + Keystatic 0.5.48). No version conflicts detected.

**Pattern Consistency:** Implementation patterns (pole-aware inline styles, i18n utilities, import aliases) align with existing code conventions. No contradictions between CLAUDE.md rules and architecture patterns.

**Structure Alignment:** Project structure supports all architectural decisions. Component boundaries (Astro static vs Svelte interactive) clearly defined. Data flow (Keystatic → build → static HTML) coherent.

### Requirements Coverage Validation ✅

**Functional Requirements:** 39/39 FRs covered by architectural components. All FR categories mapped to specific files and directories.

**Non-Functional Requirements:** 26/26 NFRs addressed. Performance (astro:assets, zero-JS static pages, Svelte islands only for interactivity). Accessibility (patterns defined per component type). Security (no forms in V1, HTTPS, Plausible instead of GA). Maintainability (Keystatic CMS, component architecture).

### Implementation Readiness Validation ✅

**Decision Completeness:** All critical decisions documented. Technology stack fully specified with versions. Integration patterns (CMS → build → deploy) defined.

**Structure Completeness:** 100% of pages defined. 30 components identified (6 existing, 24 to create). 3 utility modules specified.

**Pattern Completeness:** Naming conventions cover all file types. Pole-aware pattern with canonical code example. i18n pattern with 3 utility functions. SEO pattern per page type. Accessibility rules per component type.

### Gap Analysis Results

| # | Gap | Priority | Resolution |
|---|-----|----------|------------|
| 1 | Contact page needs Google Maps embed (FR24) | Minor | Use `googleMapsUrl` from Keystatic `settings` singleton as iframe src |
| 2 | Fonts loaded from Google CDN instead of self-hosted (NFR6) | Important | Migrate Montserrat .woff2 to `public/fonts/`, load via `@font-face` in global.css |
| 3 | Astro `output` not set to `hybrid` | Important | Add `output: 'hybrid'` to astro.config.mjs for static pages + SSR Keystatic admin |
| 4 | No `.env.example` for environment variables | Minor | Create `.env.example` with Keystatic GitHub token, Plausible domain, site URL |
| 5 | No 404 error page | Minor | Create `src/pages/404.astro` with brand-mother styling and home link |

No critical gaps found. All gaps are minor or important but non-blocking.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (low infra / medium-high UX)
- [x] Technical constraints identified (Svelte serialization, backdrop-filter portal, Tailwind v4)
- [x] Cross-cutting concerns mapped (6 concerns)

**✅ Architectural Decisions**
- [x] Critical decisions documented (hosting, contact, images, analytics, spam protection)
- [x] Technology stack fully specified with versions
- [x] Integration patterns defined (CMS → GitHub → webhook → build → Nginx)
- [x] Performance considerations addressed (astro:assets, Svelte islands, CDN)

**✅ Implementation Patterns**
- [x] Naming conventions established (PascalCase components, kebab-case pages, camelCase TS)
- [x] Structure patterns defined (components by domain, content by collection)
- [x] Pole-aware pattern specified with canonical code example
- [x] i18n, SEO, accessibility, and image patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined (all files, existing/to-create status)
- [x] Component boundaries established (Astro static vs Svelte interactive)
- [x] Integration points mapped (CMS → content → pages → components)
- [x] Requirements to structure mapping complete (all 39 FRs)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — existing codebase validates architectural choices, patterns derived from working code, all requirements mapped.

**Key Strengths:**
- Architecture derived from working code, not theoretical — reduces implementation risk
- Clear separation: Astro (static) vs Svelte (interactive) with explicit boundary rules
- Centralized pole theming via `pole-config.ts` prevents per-component duplication
- i18n utilities already proven (3 functions covering all translation needs)
- CMS schema already defined with i18n fields per collection

**Areas for Future Enhancement:**
- Self-hosted fonts migration (Gap #2)
- Astro output hybrid mode (Gap #3)
- 404 page (Gap #5)
- Testing infrastructure (Vitest + Playwright) when ready
- Linting setup (ESLint + Prettier) when ready
```
