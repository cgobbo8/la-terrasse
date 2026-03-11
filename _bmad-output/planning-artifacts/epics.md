---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
workflow_completed: true
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# base-de-loisir-saint-ferreol - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for base-de-loisir-saint-ferreol, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1: Visitors can navigate between all three poles and transversal pages via a mega-menu on desktop
- FR2: Visitors can navigate the full site structure via a slide-out panel with accordion sub-menus on mobile
- FR3: Visitors can access profile-based entry points (En Famille, En Groupe, En Entreprise) from the mega-menu
- FR4: Visitors can see which pole/section they are currently in via visual identity cues (color, tone)
- FR5: Visitors can return to the homepage or any pole hub from any page in the site
- FR6: Visitors can discover other poles via a permanent structural cross-link block ("La Terrasse c'est aussi...") on every page
- FR7: Visitors can discover contextually relevant services via narrative cross-links specific to each page
- FR8: Visitors can browse alternative activities when the current one doesn't fit (age, group size, price)
- FR9: Visitors can browse all 10 activities from the Aventure hub page
- FR10: Visitors can view activity details including price, age suitability, duration, and group size on each activity card without clicking
- FR11: Visitors can access a dedicated detail page for each activity with full description and practical info
- FR12: Visitors can navigate laterally between related activities without returning to the hub
- FR13: Visitors can view the restaurant menu (la carte) with current dishes and prices
- FR14: Visitors can discover the restaurant's local producers and sourcing philosophy
- FR15: Visitors can access group meal information and pricing for groups of 10+
- FR16: Visitors can view the venue's technical specifications (capacity, equipment, layout) immediately on the Événements page
- FR17: Visitors can compare three named seminar packages (Simple, Gourmet, Aventure) with included services and pricing
- FR18: Visitors can request a quote via a contextual form pre-filled with seminar package context
- FR19: Visitors can view a curated "journée type" (typical day program) tailored to their profile (family, group, corporate)
- FR20: Visitors can access combined cross-pole offerings on dedicated transversal pages
- FR21: Visitors can contact the leisure base via a contact form from any page
- FR22: Visitors can call the leisure base via a prominently displayed phone number on every page
- FR23: Visitors can access a context-aware sticky CTA that adapts its label and destination to the current page/pole
- FR24: Visitors can view a map with directions to the leisure base on the contact page
- FR25: Visitors can experience an emotional introduction to the location via a video hero of Lac de Saint-Ferréol
- FR26: Visitors can experience a logo-mask reveal animation on first visit
- FR27: Visitors can discover the three poles as interconnected experiences from the homepage
- FR28: Visitors can experience an immersive "journée type" timeline section on the homepage
- FR29: Visitors can view upcoming events or seasonal information from the homepage
- FR30: Visitors can switch the site language between French, English, and Spanish
- FR31: Visitors can access all content in their chosen language with proper URL structure
- FR32: The operator can update restaurant menu items and prices via Keystatic CMS
- FR33: The operator can update activity details, prices, and availability status via CMS
- FR34: The operator can update seminar package descriptions and pricing via CMS
- FR35: The operator can update seasonal information and practical details via CMS
- FR36: The operator can publish content changes that trigger automatic site rebuild
- FR37: Each page can be indexed by search engines as an autonomous landing page with unique meta data
- FR38: The site can generate structured data (LocalBusiness, Restaurant, SportsActivityLocation) for search engines
- FR39: The site can generate an XML sitemap and proper hreflang tags for multilingual SEO

### NonFunctional Requirements

- NFR1: All pages load in under 2 seconds on a 4G mobile connection
- NFR2: Core Web Vitals scores all green (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- NFR3: Lighthouse Performance score ≥ 90 on all pages
- NFR4: JavaScript payload limited to Svelte islands only — no JS shipped for static content pages
- NFR5: Images served in WebP/AVIF with responsive srcset and lazy loading below the fold
- NFR6: Fonts self-hosted with font-display: swap and preloaded critical weights
- NFR7: WCAG 2.1 AA compliance on all pages
- NFR8: All interactive elements have minimum 44x44px touch targets on mobile
- NFR9: All animations respect prefers-reduced-motion with static fallbacks
- NFR10: All images have descriptive alt text; video hero has text alternative
- NFR11: Visible focus indicators on all interactive elements using pole accent color
- NFR12: Semantic HTML with proper heading hierarchy, landmarks, and ARIA labels
- NFR13: No text below 14px; body text minimum 16px
- NFR14: Contact form submissions validated server-side and protected against spam (honeypot or reCAPTCHA)
- NFR15: HTTPS enforced on all pages
- NFR16: No sensitive user data stored — contact forms deliver to email only
- NFR17: GDPR-compliant cookie consent for Google Analytics
- NFR18: Static site served via CDN — scales to any traffic volume with no server management
- NFR19: Site remains fully functional during CMS content updates (rebuild doesn't cause downtime)
- NFR20: Seasonal traffic spikes handled entirely by CDN caching
- NFR21: Lighthouse SEO score = 100 on all pages
- NFR22: Lighthouse Best Practices score = 100 on all pages
- NFR23: Proper canonical URLs, hreflang tags, and Open Graph tags on every page
- NFR24: Operator can update any CMS-managed content without developer assistance
- NFR25: Site rebuild completes in under 2 minutes after content publish
- NFR26: Component architecture allows adding new activity pages or menu items without code changes

### Additional Requirements

**From Architecture:**

- AR1: Self-managed VPS hosting with Nginx reverse proxy in front of Node process
- AR2: HTTPS via Let's Encrypt / Certbot
- AR3: Keystatic migration from `local` to `github` storage mode before operator handoff
- AR4: GitHub webhook triggers automatic rebuild on VPS on content changes
- AR5: Contact mechanism in V1 is `mailto:` + `tel:` links (no backend forms) — CTA labels adapt per pole
- AR6: Image optimization via `astro:assets` — WebP/AVIF, responsive srcset (480w/768w/1280w/1920w), lazy loading
- AR7: Plausible Analytics instead of Google Analytics — no cookie consent banner needed
- AR8: Install GSAP for signature animations (LogoMaskReveal, JournéeTypeTimeline, HistoireDuLieu)
- AR9: Astro output set to `hybrid` for static pages + SSR Keystatic admin route
- AR10: Self-host Montserrat fonts (migrate from Google CDN to `public/fonts/` with `@font-face`)
- AR11: Create 404 error page with brand-mother styling
- AR12: Create `.env.example` for environment variables (Keystatic GitHub token, Plausible domain, site URL)
- AR13: Centralized pole config in `src/lib/pole-config.ts` — single source of truth for pole colors, labels, CTAs
- AR14: SEO utilities in `src/lib/seo.ts` — JSON-LD generators per page type (LocalBusiness, Restaurant, SportsActivityLocation)
- AR15: SEOHead.astro component for meta tags, Open Graph, hreflang, and JSON-LD on every page
- AR16: Rendering boundary: Astro for static content (zero JS), Svelte islands only for interactivity (`client:load` for critical UI, `client:visible` for below-fold)
- AR17: All Svelte islands receive data objects as props (no functions — serialization boundary)
- AR18: Per-pole colors via inline `style` attributes, never dynamic Tailwind classes
- AR19: Import aliases with `@/` prefix for all imports from `src/`

**From UX Design:**

- UX1: Logo SVGs must accept color as prop (parameterizable fill) — default to brun terre #2D2B1B
- UX2: Mobile-first responsive design: Mobile (<768px) → Tablet (768-1024px) → Desktop (>1024px)
- UX3: Hero areas: full viewport width, min-height 70vh desktop / 50vh mobile
- UX4: Max content width 1280px, full-bleed for heroes and section backgrounds
- UX5: 12-column grid on desktop, collapsing to 2-column tablet, 1-column mobile
- UX6: Section rhythm with alternating white/off-white backgrounds
- UX7: Returning visitors skip logo-mask reveal (cookie/session check)
- UX8: Emotional funnel page structure: atmosphere → offering → details → CTA
- UX9: Vertical-slice motif from DA triptych for section transitions and image galleries
- UX10: Typography scale: H1 32px→48px, H2 24px→36px, H3 20px→24px, Body 16px→18px, Small 14px
- UX11: Airy spacing with generous white space — premium positioning requires breathing room
- UX12: Activity cards in 3-column grid (desktop) → 2-column (tablet) → 1-column (mobile)

### FR Coverage Map

- FR1: Epic 1 — Desktop mega-menu navigation
- FR2: Epic 1 — Mobile navigation panel
- FR3: Epic 1 — Profile-based entry points in mega-menu
- FR4: Epic 1 — Pole visual identity cues via theming
- FR5: Epic 1 — Return navigation to homepage/hub
- FR6: Epic 6 — Structural cross-link block ("La Terrasse c'est aussi...")
- FR7: Epic 6 — Contextual narrative cross-links
- FR8: Epic 3 — Alternative activity suggestions
- FR9: Epic 3 — Activity grid on Aventure hub
- FR10: Epic 3 — Activity cards with visible price/age/duration
- FR11: Epic 3 — Activity detail pages
- FR12: Epic 3 — Lateral navigation between activities
- FR13: Epic 4 — Restaurant menu (la carte)
- FR14: Epic 4 — Local producers page
- FR15: Epic 4 — Group meal information
- FR16: Epic 5 — Venue technical specifications
- FR17: Epic 5 — Seminar package comparison
- FR18: Epic 5 — Quote request flow
- FR19: Epic 6 — Journée type per profile on transversal pages
- FR20: Epic 6 — Transversal pages (En Famille, En Groupe, En Entreprise)
- FR21: Epic 7 — Contact page with all contact methods
- FR22: Epic 1 — Phone number displayed on every page
- FR23: Epic 1 — Context-aware sticky CTA
- FR24: Epic 7 — Map with directions on contact page
- FR25: Epic 2 — Video hero on homepage
- FR26: Epic 2 — Logo-mask reveal animation
- FR27: Epic 2 — Three-pole discovery section
- FR28: Epic 2 — Immersive "journée type" timeline
- FR29: Epic 2 — Seasonal info and event agenda
- FR30: Epic 8 — Language switcher (FR/EN/ES)
- FR31: Epic 8 — Multilingual URL structure and content
- FR32: Epic 9 — CMS restaurant menu management
- FR33: Epic 9 — CMS activity management
- FR34: Epic 9 — CMS seminar management
- FR35: Epic 9 — CMS seasonal info management
- FR36: Epic 9 — CMS publish triggers auto-rebuild
- FR37: Epic 1 — SEO meta data per page
- FR38: Epic 1 — Structured data generation (JSON-LD)
- FR39: Epic 1 — XML sitemap and hreflang tags

## Epic List

### Epic 1: Site Foundation & Navigation
Visitors can navigate the complete site structure with pole-aware visual identity, persistent contact access, SEO-optimized pages, and a consistent design system across all breakpoints.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR22, FR23, FR37, FR38, FR39

### Epic 2: Homepage Experience
Visitors experience the emotional gateway to La Terrasse with immersive animations, discover all three poles as interconnected experiences, and see upcoming events.
**FRs covered:** FR25, FR26, FR27, FR28, FR29

### Epic 3: Aventure Pole — Activity Discovery
Families and visitors can browse all activities with key info visible at a glance, access detail pages, navigate laterally between activities, and discover alternatives when one doesn't fit.
**FRs covered:** FR8, FR9, FR10, FR11, FR12

### Epic 4: Restaurant Pole — Dining Experience
Visitors can feel the restaurant atmosphere, view the complete menu with prices, discover local producers, and explore group dining options.
**FRs covered:** FR13, FR14, FR15

### Epic 5: Événements Pole — Seminars & Events
Corporate planners can evaluate venue specs instantly, compare three named seminar packages side by side, and request a contextual quote.
**FRs covered:** FR16, FR17, FR18

### Epic 6: Cross-Pole Discovery & Transversal Pages
Visitors discover complementary services naturally through structural and narrative cross-links, and can access profile-based pages combining offerings across all three poles.
**FRs covered:** FR6, FR7, FR19, FR20

### Epic 7: Contact & Practical Information
Visitors can easily contact the leisure base via multiple methods and find practical information including directions and an interactive map.
**FRs covered:** FR21, FR24

### Epic 8: Internationalization
Visitors can browse the full site in French, English, or Spanish with proper URL structure, localized content, and multilingual SEO.
**FRs covered:** FR30, FR31

### Epic 9: Content Management & Deployment
The operator can manage all content autonomously via Keystatic CMS, publish changes that trigger automatic site rebuilds, and serve the site reliably from a self-managed VPS.
**FRs covered:** FR32, FR33, FR34, FR35, FR36

---

## Epic 1: Site Foundation & Navigation

Visitors can navigate the complete site structure with pole-aware visual identity, persistent contact access, SEO-optimized pages, and a consistent design system across all breakpoints. This epic establishes the shell that all subsequent epics build upon.

### Story 1.1: Base Layout, Pole Theming & SEO Infrastructure

As a visitor,
I want every page to have a consistent layout with visual identity that shifts per pole and proper SEO metadata,
So that I always know which section I'm in and every page is discoverable by search engines.

**Acceptance Criteria:**

**Given** I am on any page of the site
**When** the page loads
**Then** it renders within a BaseLayout that includes a header, main content area, and footer with consistent spacing and typography following the design tokens (Montserrat, spacing scale, max-width 1280px)
**And** Montserrat fonts are self-hosted from `public/fonts/` with `font-display: swap` and preloaded critical weights

**Given** I am on a pole page (restaurant, aventure, or evenements)
**When** the page loads
**Then** the accent color, light background, and emotional tone reflect the current pole identity via inline `style` attributes resolved from `src/lib/pole-config.ts`

**Given** I am on any page
**When** I view the page source
**Then** it includes a unique `<title>`, `<meta name="description">`, canonical URL, Open Graph tags (og:title, og:description, og:image, og:url), and hreflang tags for FR/EN/ES via the SEOHead.astro component

**Given** I am on the homepage
**When** search engines crawl the page
**Then** they find LocalBusiness JSON-LD structured data generated by `src/lib/seo.ts`

**Given** I am on a restaurant page
**When** search engines crawl the page
**Then** they find Restaurant JSON-LD structured data

**Given** the site is built
**When** I check the output
**Then** an XML sitemap is generated including all pages with proper hreflang references

**Given** the project is configured
**When** I check `astro.config.mjs`
**Then** output mode is set to `hybrid` for static pages + SSR Keystatic admin route

**Given** the project repository
**When** I check the root
**Then** a `.env.example` file documents all required environment variables (Keystatic GitHub token, Plausible domain, site URL)

### Story 1.2: Desktop Mega-Menu Navigation

As a visitor on desktop,
I want a mega-menu that shows all three poles with their sub-pages and transversal entry points,
So that I can navigate to any section of the site in one click.

**Acceptance Criteria:**

**Given** I am on desktop (>1024px)
**When** I hover or click the navigation trigger
**Then** a multi-column mega-menu opens showing Restaurant, Aventure, and Événements columns with their respective sub-pages

**Given** the mega-menu is open
**When** I look at the transversal section
**Then** I see profile-based entry points: En Famille, En Groupe, and En Entreprise

**Given** the mega-menu is open
**When** I press Escape or click outside
**Then** the mega-menu closes

**Given** the mega-menu is open
**When** I navigate with keyboard (Tab, Arrow keys)
**Then** I can reach all menu items with visible focus indicators using the current pole accent color

**Given** I am on any page
**When** I look at the mega-menu
**Then** I can identify which pole/section I'm currently in via visual cues (active state, color)

**Given** I am deep in a sub-page
**When** I look at the navigation
**Then** I can return to the homepage or any pole hub

### Story 1.3: Mobile Navigation Panel

As a visitor on mobile,
I want a slide-out panel with accordion sub-menus,
So that I can navigate the full site structure on a small screen.

**Acceptance Criteria:**

**Given** I am on mobile (<768px)
**When** I tap the hamburger icon
**Then** a slide-out panel opens from the right showing the full navigation structure

**Given** the mobile panel is open
**When** I tap a pole section header (e.g., "Restaurant")
**Then** it expands as an accordion revealing sub-pages (Carte, Producteurs, Repas de Groupe), and other pole sections collapse

**Given** the mobile panel is open
**When** I tap outside the panel or press the close button
**Then** the panel closes with a smooth transition

**Given** the mobile panel is rendered
**When** inspecting the DOM
**Then** it is portaled to `document.body` to escape any `backdrop-filter` stacking context

**Given** the mobile panel is open
**When** I look for transversal pages
**Then** I see En Famille, En Groupe, and En Entreprise in the menu

**Given** the mobile panel is open
**When** I check touch targets
**Then** all interactive elements are minimum 44x44px

### Story 1.4: Sticky Context-Aware CTA & Phone Number

As a visitor,
I want a persistent CTA in the header that adapts to my current section and a visible phone number,
So that I can contact the leisure base or take action from any page in under 2 taps.

**Acceptance Criteria:**

**Given** I am on a restaurant page
**When** I see the sticky header
**Then** the CTA reads "Réserver ma table" and links to `tel:`

**Given** I am on an aventure page
**When** I see the sticky header
**Then** the CTA reads "Réserver mon aventure" and links to `tel:`

**Given** I am on an événements page
**When** I see the sticky header
**Then** the CTA reads "Demander un devis" and links to `mailto:` with pre-filled subject line

**Given** I am on the homepage or a transversal page
**When** I see the sticky header
**Then** the CTA reads "Nous contacter" and links to `tel:`

**Given** I am on any page
**When** I look at the header
**Then** the phone number is visible and clickable as a `tel:` link

**Given** I am on mobile
**When** I tap the CTA button
**Then** it initiates the phone call or opens the email client immediately

**Given** I scroll down on any page
**When** the header becomes sticky
**Then** the CTA remains visible and accessible at all scroll positions

### Story 1.5: Footer & Site-Wide Elements

As a visitor,
I want a consistent footer with brand info, contact details, and legal links on every page,
So that I can find essential information regardless of where I am.

**Acceptance Criteria:**

**Given** I am on any page
**When** I scroll to the bottom
**Then** I see a footer with La Terrasse branding (logo with parameterizable color defaulting to brun terre), physical address, phone number, and email

**Given** I am on any page
**When** I look at the footer
**Then** I see links to legal pages (mentions légales, politique de confidentialité)

**Given** I am on any page
**When** I look at the footer
**Then** I see a Plausible Analytics script loaded (lightweight, no cookie consent needed)

**Given** I check the site
**When** I inspect images
**Then** all images use `astro:assets` for WebP/AVIF conversion with responsive srcset and appropriate lazy/eager loading

### Story 1.6: 404 Error Page

As a visitor who reaches a broken link,
I want a helpful and branded 404 page,
So that I can find my way back to the site.

**Acceptance Criteria:**

**Given** I navigate to a non-existent URL
**When** the page loads
**Then** I see a styled 404 page with La Terrasse brand-mother styling, a clear message, and a prominent link to the homepage

**Given** I am on the 404 page
**When** I look for navigation
**Then** I see the main navigation (header) and can access any section of the site

---

## Epic 2: Homepage Experience

Visitors experience the emotional gateway to La Terrasse with immersive animations, discover all three poles as interconnected experiences, and see what's happening now. The homepage follows the emotional funnel: marvel → explore → act.

### Story 2.1: Video Hero Section

As a visitor arriving on the homepage,
I want a full-screen video of Lac de Saint-Ferréol,
So that I immediately feel "I want to be there" before reading any text.

**Acceptance Criteria:**

**Given** I arrive on the homepage
**When** the hero section loads
**Then** I see a full-viewport video of the lake playing (muted, looping, autoplay) with an overlay for text readability

**Given** I have `prefers-reduced-motion` enabled
**When** the hero loads
**Then** the video is replaced by a static hero image of the lake

**Given** I am on mobile
**When** the hero loads
**Then** the hero takes at least 50vh height with an optimized video or fallback image

**Given** I am on desktop
**When** the hero loads
**Then** the hero takes at least 70vh height

**Given** the video is present
**When** accessibility is checked
**Then** a text alternative describes the video content and the video has no audio track or is muted by default

**Given** the hero video loads
**When** I check performance
**Then** the video is loaded with `fetchpriority="high"` and does not block page rendering

### Story 2.2: Logo Mask Reveal Animation

As a first-time visitor,
I want to experience a logo-mask reveal animation that signals quality and craft,
So that I understand this is a premium experience different from typical leisure base websites.

**Acceptance Criteria:**

**Given** I am a first-time visitor (no session cookie)
**When** the page loads
**Then** a GSAP-powered logo-mask reveal animation plays on a brun-terre (#2D2B1B) background before revealing the site

**Given** I am a returning visitor (session cookie present)
**When** the page loads
**Then** the reveal animation is skipped and the site content loads directly

**Given** I have `prefers-reduced-motion` enabled
**When** the page loads
**Then** the animation is replaced by a brief static logo display that fades to reveal the site

**Given** the animation plays
**When** it completes
**Then** the video hero section is smoothly revealed and a session cookie is set to skip the animation on next visit

**Given** GSAP is used
**When** checking the bundle
**Then** GSAP is loaded only on the homepage via `client:load` on the LogoMaskReveal.svelte island

### Story 2.3: Pole Discovery Section

As a visitor on the homepage,
I want to see the three poles presented as interconnected experiences,
So that I understand the full range of what La Terrasse offers and can explore what interests me.

**Acceptance Criteria:**

**Given** I am on the homepage
**When** I scroll past the hero
**Then** I see three distinct pole cards (Restaurant, Aventure, Événements) each with their respective accent color and visual identity

**Given** I see a pole card
**When** I view it
**Then** it shows a representative image, the pole name, a short evocative description, and a CTA ("Découvrir le restaurant" / "Découvrir les aventures" / "Découvrir nos séminaires")

**Given** I click a pole card CTA
**When** the navigation occurs
**Then** I am taken to the corresponding pole hub page

**Given** I am on mobile
**When** I view the pole discovery section
**Then** the three cards stack vertically in a single column with proper spacing

### Story 2.4: "Journée Type" Immersive Timeline

As a visitor,
I want to experience an immersive timeline showing a typical day at La Terrasse,
So that I can visualize a complete outing and feel excited about coming.

**Acceptance Criteria:**

**Given** I scroll to the journée type section on the homepage
**When** it enters the viewport
**Then** a scroll-driven GSAP timeline animates through a typical day (morning activity → lunch at the restaurant → afternoon activity)

**Given** I have `prefers-reduced-motion` enabled
**When** the section is visible
**Then** a static version of the timeline is displayed without animation, showing all steps visible at once

**Given** I am on mobile
**When** I view the section
**Then** it displays a simplified but still engaging vertical version of the timeline

**Given** the timeline shows a moment of the day
**When** I see it
**Then** it includes a time indicator, a description, a representative image, and a link to the relevant pole or activity

**Given** the GSAP island loads
**When** checking the bundle
**Then** the JourneeTypeTimeline.svelte island uses `client:visible` to defer loading until the section enters the viewport

### Story 2.5: Seasonal Info & Event Agenda

As a visitor,
I want to see upcoming events and seasonal information on the homepage,
So that I know what's happening now and can plan my visit accordingly.

**Acceptance Criteria:**

**Given** I am on the homepage
**When** I scroll to the info section
**Then** I see a bento-style grid displaying current seasonal information (opening hours, weather-dependent notes, promotions)

**Given** events exist in the CMS
**When** I view the agenda section
**Then** I see upcoming events with dates, titles, and brief descriptions, ordered chronologically

**Given** no events are currently published in the CMS
**When** I view the page
**Then** the agenda section is hidden gracefully or shows a generic seasonal message

**Given** seasonal info exists in CMS
**When** the site is built
**Then** the bento grid pulls content from the Keystatic settings singleton

---

## Epic 3: Aventure Pole — Activity Discovery

Families and visitors can browse all activities with key info visible at a glance, access detail pages with full descriptions, navigate laterally between activities, and discover alternatives when an activity doesn't fit their needs.

### Story 3.1: Aventure Hub with Activity Grid

As a family visitor,
I want to browse all available activities from a single hub page with key info visible on each card,
So that I can quickly find an activity that fits my family's ages, budget, and interests.

**Acceptance Criteria:**

**Given** I am on the Aventure hub page
**When** the page loads
**Then** I see a hero section in the Aventure visual identity (vert végétal #537b47) followed by a grid of all 10 activity cards

**Given** I see an activity card
**When** I look at it without clicking
**Then** I can see the activity name, price, minimum age, duration, and a representative image

**Given** I am on desktop
**When** I view the activity grid
**Then** cards display in a 3-column grid

**Given** I am on tablet
**When** I view the activity grid
**Then** cards display in a 2-column grid

**Given** I am on mobile
**When** I view the activity grid
**Then** cards display in a single column

**Given** activity data exists in CMS
**When** the page builds
**Then** cards pull data from the Keystatic activities collection

**Given** the hub page is indexed
**When** search engines crawl it
**Then** it has unique meta title/description optimized for "activités lac saint ferreol" and similar keywords

### Story 3.2: Activity Detail Pages

As a visitor interested in a specific activity,
I want a dedicated detail page with full description, practical information, and beautiful imagery,
So that I have all the information I need to decide and book.

**Acceptance Criteria:**

**Given** I click on an activity card from the hub
**When** the detail page loads
**Then** I see a full hero image, activity name, complete description from CMS (MDX), price, age range, duration, group size info, and practical details (location within the site, what to bring)

**Given** I am on an activity detail page
**When** I see the header
**Then** the sticky CTA reads "Réserver mon aventure" with a `tel:` link, and the page uses the Aventure pole visual identity

**Given** I am on the detail page
**When** search engines index it
**Then** it has unique meta title/description and SportsActivityLocation JSON-LD structured data

**Given** the activity has CMS content
**When** the page builds via `[slug].astro`
**Then** all content is dynamically pulled from the Keystatic activities collection by slug

### Story 3.3: Lateral Navigation & Alternative Suggestions

As a visitor browsing activities,
I want to navigate between related activities and see alternatives when one doesn't fit,
So that I always find something suitable without hitting a dead end.

**Acceptance Criteria:**

**Given** I am on an activity detail page
**When** I scroll down past the main content
**Then** I see 2-3 alternative activity suggestions in an "Vous pourriez aussi aimer" section with ActivityCard components

**Given** the current activity has an age minimum of 10 years
**When** I see alternatives
**Then** at least one alternative has a lower age minimum, ensuring families with younger children have options

**Given** I am on an activity detail page
**When** I look for lateral navigation
**Then** I can navigate to the previous/next activity via navigation links without returning to the hub

**Given** I click an alternative suggestion
**When** the page loads
**Then** I am on the new activity's detail page with its own alternatives displayed

---

## Epic 4: Restaurant Pole — Dining Experience

Visitors can feel the restaurant atmosphere through immersive visuals, view the complete menu with current dishes and prices, discover local producers and their stories, and find group dining options.

### Story 4.1: Restaurant Hub & Atmosphere

As a visitor discovering the restaurant,
I want an emotional introduction that conveys the atmosphere of dining by the lake,
So that I feel "on y va" before even reading the menu.

**Acceptance Criteria:**

**Given** I am on the Restaurant hub page
**When** the page loads
**Then** I see a hero section with atmospheric photography of the terrace and lake in the Restaurant visual identity (brun terre #2D2B1B), warm and sensory tone

**Given** I am on the hub
**When** I scroll past the hero
**Then** I see an evocative description of the dining experience followed by navigation to sub-pages: La Carte, Nos Producteurs, Repas de Groupe

**Given** I am on the hub
**When** the page is indexed
**Then** it has Restaurant JSON-LD structured data and unique meta description optimized for "restaurant lac saint ferreol"

**Given** I follow the emotional funnel
**When** I scroll through the page
**Then** content follows the pattern: atmosphere (hero) → offering (menu highlights) → details (practical info) → CTA (réserver)

### Story 4.2: Menu Page (La Carte)

As a visitor,
I want to view the restaurant's current dishes and prices in a clean, readable format,
So that I can decide what to eat without needing to download a PDF or call for prices.

**Acceptance Criteria:**

**Given** I am on the Carte page
**When** the page loads
**Then** I see the restaurant menu organized by course (entrées, plats, desserts, boissons) with dish names, descriptions, and prices

**Given** menu data exists in CMS
**When** the page builds
**Then** all dishes and prices are pulled from the Keystatic restaurant singleton

**Given** I am on mobile
**When** I view the menu
**Then** it is fully responsive and readable without horizontal scrolling, with clear price alignment

**Given** I want to take action
**When** I look for a CTA
**Then** I see a "Réserver ma table" CTA linking to `tel:`

### Story 4.3: Local Producers Page

As a visitor,
I want to discover the restaurant's local producers and sourcing philosophy,
So that I trust the quality and feel connected to the terroir.

**Acceptance Criteria:**

**Given** I am on the Producteurs page
**When** the page loads
**Then** I see producer cards with photos, names, their products, and short stories about their craft

**Given** I read the page
**When** I absorb the content
**Then** I understand the restaurant's commitment to local, quality, terroir-driven ingredients

**Given** producer information exists in CMS
**When** the page builds
**Then** producer cards pull content from the Keystatic restaurant singleton or a dedicated content field

### Story 4.4: Group Dining Page

As a group organizer,
I want to see group meal options and pricing for 10+ people,
So that I can plan a group meal at the restaurant.

**Acceptance Criteria:**

**Given** I am on the Repas de Groupe page
**When** the page loads
**Then** I see group meal formulas with menus, prices per person, and minimum group sizes

**Given** I want to book a group meal
**When** I look for a CTA
**Then** I see a clear contact option (tel: or mailto:) for group reservations with context

**Given** the page follows the emotional funnel
**When** I scroll
**Then** I see atmosphere visuals of group dining → menu options → practical details → CTA

---

## Epic 5: Événements Pole — Seminars & Events

Corporate planners can evaluate venue specs instantly, compare three clearly named seminar packages side by side, and request a contextual quote — all within a sober, professional visual identity that signals competence and premium quality.

### Story 5.1: Événements Hub & Venue Specs

As a corporate planner,
I want to see the venue's technical specifications immediately upon landing,
So that I can quickly assess if it meets my seminar requirements without scrolling.

**Acceptance Criteria:**

**Given** I am on the Événements hub page
**When** the page loads
**Then** I see venue specs prominently in or just below the hero area: room capacity (seated/standing), available equipment (vidéoprojecteur, WiFi, flipchart, sound system), and room layout options — all in the Événements visual identity (bleu ardoise #3d4969)

**Given** I view the specs
**When** I scan them
**Then** they are presented in a scannable grid or list format (VenueSpecs.astro component), not buried in paragraph text

**Given** the page is indexed
**When** search engines crawl it
**Then** it has LocalBusiness JSON-LD with event venue properties and meta description optimized for "séminaire nature Toulouse"

**Given** venue data exists in CMS
**When** the page builds
**Then** specs are pulled from the Keystatic venue singleton

### Story 5.2: Seminar Package Comparison

As a corporate planner,
I want to compare three named seminar packages side by side,
So that I can choose the right package without deciphering complex options.

**Acceptance Criteria:**

**Given** I am on the Événements page
**When** I scroll to the packages section
**Then** I see three packages — Séminaire Simple (location sèche), Séminaire Gourmet (avec repas terroir), Séminaire Aventure (avec team building) — each with clear names, included services, and pricing

**Given** I see the three packages
**When** I compare them
**Then** the differences are immediately visible through a side-by-side comparison layout (PackComparator.astro) showing inclusions, exclusions, and prices

**Given** package data exists in CMS
**When** the page builds
**Then** package details (name, description, inclusions, price) come from the Keystatic seminars collection

**Given** I am on mobile
**When** I view the packages
**Then** they stack vertically with clear visual separation between each package

### Story 5.3: Quote Request Flow

As a corporate planner,
I want to request a quote with my seminar context pre-filled,
So that I can start the conversation without repeating what I've already seen.

**Acceptance Criteria:**

**Given** I am on the Événements page
**When** I click "Demander un devis" (sticky CTA or in-page CTA)
**Then** a `mailto:` link opens with a pre-filled subject line indicating the seminar context (e.g., "Demande de devis — Séminaire")

**Given** I am on a specific package section
**When** I click that package's CTA
**Then** the `mailto:` subject includes the package name (e.g., "Demande de devis — Séminaire Aventure")

**Given** I am on any Événements page
**When** I see the sticky CTA in the header
**Then** it reads "Demander un devis" and links to the contextual `mailto:`

---

## Epic 6: Cross-Pole Discovery & Transversal Pages

Visitors discover complementary services naturally through two layers of cross-linking (structural blocks and narrative suggestions), and cross-pole visitors (families, groups, corporate) can access dedicated transversal pages that combine offerings from all three poles.

### Story 6.1: Structural Cross-Link Block

As a visitor on any page,
I want to discover the other poles through a permanent "La Terrasse c'est aussi..." section,
So that I learn about the full range of services at the leisure base.

**Acceptance Criteria:**

**Given** I am on any pole page (restaurant, aventure, or evenements)
**When** I scroll near the bottom of the content
**Then** I see a "La Terrasse c'est aussi..." section showing the other two poles with images, short descriptions, and links to their hub pages

**Given** I am on a Restaurant page
**When** I see the cross-link block
**Then** it shows Aventure and Événements cards

**Given** I am on an Aventure page
**When** I see the cross-link block
**Then** it shows Restaurant and Événements cards

**Given** I click a cross-link card
**When** the navigation occurs
**Then** I arrive at the corresponding pole hub page

**Given** I am on a transversal page
**When** I view the page
**Then** the cross-link block is not displayed (transversal pages already span all poles)

### Story 6.2: Contextual Narrative Cross-Links

As a visitor reading about a specific service,
I want to discover complementary services through natural narrative suggestions,
So that I organically discover what else La Terrasse offers without feeling sold to.

**Acceptance Criteria:**

**Given** I am on an activity detail page (e.g., Paddle)
**When** I scroll through the content
**Then** I see a narrative cross-link like "Après votre paddle, déjeunez au bord du lac →" linking to the Restaurant

**Given** I am on a Restaurant page
**When** I read the content
**Then** I see a narrative cross-link like "Prolongez le plaisir — balade au lac ou pédalo après le déjeuner →" linking to Aventure

**Given** I am on the Événements page
**When** I read about seminar packages
**Then** I see contextual mentions of team-building activities (Aventure) and the restaurant (catering)

**Given** the cross-link is visible
**When** I click it
**Then** I am taken to the relevant page on the other pole

**Given** the narrative cross-links are rendered
**When** I assess the tone
**Then** they use warm, narrative language (not commercial "upsell" blocks) consistent with the page's emotional register

### Story 6.3: Transversal Pages (En Famille, En Groupe, En Entreprise)

As a visitor with cross-pole needs,
I want dedicated pages that combine offerings across all poles tailored to my profile,
So that I can plan a complete experience without assembling it myself from separate sections.

**Acceptance Criteria:**

**Given** I navigate to En Famille
**When** the page loads
**Then** I see family-oriented activities (with age suitability highlighted), family meal options at the restaurant, and a curated "journée type" for families

**Given** I navigate to En Groupe
**When** the page loads
**Then** I see group activities with pricing, group meal packages at the restaurant, and a modular day program for groups with total pricing estimates

**Given** I navigate to En Entreprise
**When** the page loads
**Then** I see seminar packages, team-building activities, and corporate dining options with a professional tone matching Événements

**Given** I am on any transversal page
**When** I see CTAs within sections
**Then** they lead to the relevant detail pages within each pole (e.g., activity card links to `/aventure/pedalo`)

**Given** I am on any transversal page
**When** I see the "journée type" section
**Then** it shows a curated day program tailored to that profile (family/group/corporate) with time blocks, activities, and meals

**Given** I am on any transversal page
**When** I check the page structure
**Then** it uses brand-mother styling (neutral, warm) rather than a single pole's visual identity

---

## Epic 7: Contact & Practical Information

Visitors can easily contact the leisure base through multiple methods and find all practical information they need to plan their visit, including an interactive map with directions.

### Story 7.1: Contact Page with Map & Practical Info

As a visitor ready to contact the leisure base or plan my visit,
I want a contact page with all methods to reach them and practical directions,
So that I can get in touch easily and know exactly how to get there.

**Acceptance Criteria:**

**Given** I am on the Contact page
**When** the page loads
**Then** I see: phone number (clickable `tel:` link), email address (clickable `mailto:` link), physical address, and opening hours

**Given** I am on the Contact page
**When** I scroll to the map section
**Then** I see an embedded map (Google Maps iframe or similar) showing the Lac de Saint-Ferréol location with the leisure base pinpointed

**Given** I am on the Contact page
**When** I look for directions
**Then** I see practical access information: how to get there by car, nearest parking, approximate distance from Toulouse

**Given** I am on mobile
**When** I tap the phone number
**Then** it initiates a phone call

**Given** I am on mobile
**When** I tap the email address
**Then** it opens the mail client with a pre-filled recipient

**Given** the contact page is indexed
**When** search engines crawl it
**Then** it has LocalBusiness structured data with address and contact information

---

## Epic 8: Internationalization

Visitors can browse the full site in French (primary), English, or Spanish, with proper URL structure, localized UI strings, CMS content localization, and multilingual SEO.

### Story 8.1: Language Switcher & UI Translations

As a non-French-speaking visitor,
I want to switch the site language to English or Spanish,
So that I can understand all navigation, labels, and interface text.

**Acceptance Criteria:**

**Given** I am on any page
**When** I look for the language switcher
**Then** I see a language selector in the header showing FR / EN / ES options

**Given** I am on a French page (e.g., `/restaurant/carte`)
**When** I select English
**Then** I am redirected to the equivalent English page (`/en/restaurant/carte`)

**Given** I switch to Spanish
**When** the page loads
**Then** all UI strings (navigation labels, CTA text, section headings, footer text) are displayed in Spanish via `useTranslations(lang)`

**Given** the language is changed
**When** the page renders
**Then** the `<html lang>` attribute reflects the current language

**Given** I am on a localized page
**When** I look at the URL structure
**Then** French pages have no prefix (`/`), English pages use `/en/`, Spanish pages use `/es/`

### Story 8.2: Multilingual Content & SEO

As a search engine or international visitor,
I want proper hreflang tags, localized CMS content, and multilingual URLs on every page,
So that the right language version is served and all content is accessible.

**Acceptance Criteria:**

**Given** any page exists
**When** search engines crawl it
**Then** they find `<link rel="alternate" hreflang="fr">`, `<link rel="alternate" hreflang="en">`, and `<link rel="alternate" hreflang="es">` tags

**Given** CMS content has translated fields (e.g., `title_en`, `description_en`)
**When** the page builds in English
**Then** translated content is displayed via `getLocalizedField(entry, 'title', lang)`, falling back to French if translation is missing

**Given** the site is built
**When** I check the XML sitemap
**Then** it includes all language versions of all pages with proper hreflang references

**Given** a page is viewed in English
**When** I check the SEO meta tags
**Then** the title, description, and Open Graph tags are in English (using localized translations)

---

## Epic 9: Content Management & Deployment

The site operator can manage all content autonomously via Keystatic CMS — restaurant menus, activity details, seminar packages, events, and seasonal information — and publish changes that trigger automatic site rebuilds on the production VPS.

### Story 9.1: Keystatic Content Schema & Collections

As the site operator,
I want a complete CMS schema with all content types organized logically,
So that I can manage every piece of content without developer help.

**Acceptance Criteria:**

**Given** I access the Keystatic admin interface at `/keystatic`
**When** I browse collections
**Then** I see: activities (10 activity items), seminars (3 seminar packages), events (event entries for agenda)

**Given** I access Keystatic singletons
**When** I browse them
**Then** I see: restaurant (menu, info), venue (room specs, equipment), settings (site-wide config, opening hours, seasonal info)

**Given** I edit an activity
**When** I update price, age range, or duration
**Then** the fields are clearly labeled, typed (number for price, text for description), and include translation fields (`title_en`, `title_es`, `description_en`, `description_es`)

**Given** I edit the restaurant singleton
**When** I update dishes and prices
**Then** changes are saved to the content files with proper structure

**Given** I create a new event
**When** I fill in date, title, and description
**Then** it appears in the events collection and will show on the homepage agenda after rebuild

**Given** I edit any content
**When** I check available fields
**Then** each content type has a rich MDX body field for detailed descriptions

### Story 9.2: Deployment Pipeline & Auto-Rebuild

As the site operator,
I want to publish content changes and have the site automatically rebuild and go live,
So that updates are visible within minutes without calling the developer.

**Acceptance Criteria:**

**Given** Keystatic is configured in `github` storage mode
**When** I publish changes via the admin UI
**Then** content changes are committed to the GitHub repository via the GitHub API

**Given** a commit is pushed to GitHub
**When** the webhook fires to the VPS
**Then** the VPS pulls the latest changes, runs `pnpm build`, and serves the updated static files

**Given** a rebuild is triggered
**When** it completes
**Then** the updated site is served via Nginx with HTTPS (Let's Encrypt / Certbot)

**Given** a rebuild is in progress
**When** visitors access the site
**Then** they see the previous version without any downtime (Nginx continues serving old build until new one is ready)

**Given** the deployment pipeline is set up
**When** I check the server configuration
**Then** Nginx serves static files directly and proxies `/keystatic/*` requests to the Node SSR process

**Given** the full pipeline is operational
**When** the operator publishes a price change
**Then** the updated price is visible on the live site within 2 minutes
