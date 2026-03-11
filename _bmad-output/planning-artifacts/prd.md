---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain-skipped
  - step-06-innovation-skipped
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
workflow_completed: true
classification:
  projectType: web_app
  domain: general (tourism/leisure)
  complexity: low (business domain) / medium-high (design craft, UX coherence, immersive components GSAP/Three.js)
  projectContext: greenfield
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-base-de-loisir-saint-ferreol-2026-03-09.md'
  - '_bmad-output/brainstorming/brainstorming-session-2026-03-08-1730.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 1
  projectDocs: 0
  uxDesign: 1
workflowType: 'prd'
---

# Product Requirements Document - base-de-loisir-saint-ferreol

**Author:** Corentin
**Date:** 2026-03-11

## Executive Summary

La Terrasse Saint-Ferréol is the digital front door for a multi-service leisure base operating on Lac de Saint-Ferréol, a landmark lake near Toulouse. The site serves three interconnected service poles — Restaurant, Aventure, and Événements — under a unified brand managed by a single operator. It targets families seeking outdoor activities, couples looking for lakeside dining, corporate planners booking seminars, and group organizers assembling full-day programs. The core premise: the place is the product. Saint-Ferréol's exceptional setting drives the emotional funnel — want to be there → want to do something → act — replacing the conventional service-listing approach used by every competitor in the sector.

### What Makes This Special

- **Quality gap exploitation:** Leisure base websites are universally dated and utilitarian. A polished, well-crafted site immediately signals a premium experience and creates instant credibility — especially for corporate seminar prospects comparing venues.
- **Sole operator on a landmark site:** No direct local competition. The operator controls all three poles, enabling genuine cross-selling and unified brand storytelling impossible for multi-vendor sites.
- **Double-layer cross-linking architecture:** Structural ("La Terrasse c'est aussi...") + contextual narrative ("Après votre paddle, déjeunez au bord du lac") turns cross-selling into natural wayfinding, increasing per-visit discovery and spend.
- **90% sober, 10% immersive:** The design signature — clean, fast, functional everywhere, with strategic creative moments (logo-mask reveal, video hero, "journée type" GSAP timeline) that signal craft and intentionality.
- **Three sub-brand identities under one umbrella:** Restaurant (brun terre, sensory), Aventure (vert végétal, dynamic), Événements (bleu ardoise, professional) — each with its own emotional register, united by the lake.

## Project Classification

- **Project type:** Web application (MPA, Astro + Svelte islands, static-first)
- **Domain:** Tourism / leisure — no regulatory constraints
- **Complexity:** Low (business domain) · Medium-high (design coherence, UX multi-persona, immersive components with GSAP and potentially Three.js)
- **Project context:** Greenfield — new product from scratch
- **Target launch:** Mid-April 2026

## Success Criteria

### User Success

- **Information findability:** Visitors find activity details, prices, practical info (hours, location, parking) without needing to call. Zero "call for pricing" moments.
- **Cross-discovery:** Visitors arriving for one pole discover the other poles through cross-linking — measured by multi-page sessions and cross-pole navigation rate.
- **Activity match within 30 seconds:** Sophie finds an activity that works for her family's ages and budget, sees alternatives if it doesn't fit.
- **Specs confidence within 60 seconds:** Laurent lands on Événements, sees room capacity and equipment specs, understands the three packages without scrolling.
- **"I want to be there" in under 10 seconds:** Logo reveal + video hero create immediate emotional pull before any text is read.
- **Contact/book in under 2 taps from any page:** Sticky CTA always visible, context-aware.

### Business Success

- **V1 live by mid-April 2026** — complete, polished, operational.
- **SEO visibility:** Top 3 Google results for "base de loisir saint ferreol". First page for pole-specific keywords ("restaurant lac saint ferreol", "séminaire nature Toulouse").
- **Lead generation:** Contact form submissions and phone calls increase compared to pre-website state (word of mouth only). Baseline established in first month.
- **Professional credibility:** Corporate seminar prospects perceive the venue as premium based on website quality alone — measured by quote request conversion rate.
- **Cross-selling effectiveness:** Visitors engage with more than one pole per session — tracked via multi-pole page views.

### Technical Success

- **Page load speed:** < 2s on 4G connection (Core Web Vitals green).
- **Mobile usability:** 100% Lighthouse mobile score.
- **Accessibility:** WCAG AA compliance, 44px minimum touch targets, `prefers-reduced-motion` respected.
- **CMS operational:** Operator can update menus, prices, seasonal info, and activity details via Keystatic without developer intervention.
- **SEO-ready:** Each page indexable, proper meta tags, structured data, autonomous landing page capability.

### Measurable Outcomes

| KPI | Target | Measurement |
|-----|--------|-------------|
| V1 launch | Mid-April 2026 | Delivery milestone |
| Google ranking — primary keyword | Top 3 | Google Search Console |
| Google ranking — pole keywords | First page | Google Search Console |
| Bounce rate on landing pages | < 50% | Google Analytics |
| Contact form submissions | Baseline month 1, growth tracked | Form analytics |
| Multi-pole sessions | > 30% of visits | Google Analytics |
| Page load (4G) | < 2s | Lighthouse / CWV |
| Mobile Lighthouse score | 100 | Lighthouse audit |

## Product Scope

### MVP — V1 (mid-April 2026)

**MVP Approach:** Experience MVP — the minimum product that delivers the full emotional impact. The MVP must ship with polished design, immersive moments, and complete content structure — even if some content slots use placeholder text/images.

**Resource:** Solo developer (Corentin), ~5 weeks.

**All 5 user journeys supported from launch:**
- Sophie (family activity discovery) ✓
- Laurent (corporate seminar specs) ✓
- Marc & Léa (emotional restaurant discovery) ✓
- Karine (group cross-pole planning) ✓
- Operator (CMS content management) ✓

**Must-Have Capabilities:**
- All pages and navigation (homepage, 3 pole hubs, sub-pages, transversal pages, contact)
- Per-pole visual identity with color and tone shifts
- Mega-menu desktop + mobile slide-out panel
- Double-layer cross-linking (structural + contextual)
- Activity cards with price/age/duration visible + alternative suggestions
- Seminar packages with specs and pricing
- Logo-mask reveal animation + video hero
- "Journée type" immersive section (GSAP)
- Contact forms (generic + pole-contextual)
- Keystatic CMS operational
- i18n FR/EN/ES
- SEO optimization on every page
- Sticky context-aware CTA

**Acceptable MVP trade-offs:**
- Placeholder photography where real photos aren't yet available
- Simplified "journée type" animation if GSAP timeline proves too complex for deadline
- Contact form instead of online booking (booking is V2)
- No photo gallery (space reserved)
- No testimonials (space reserved)

### Growth — V2 (post-launch, Q2-Q3 2026)

- Real-time activity availability ("conditions du jour")
- Online booking system with calendar
- Photo galleries per pole and activity
- Customer testimonials and reviews
- Dynamic event calendar
- Seasonal promotions engine

### Vision — V3 (Q4 2026+)

- Customer accounts for repeat bookers
- Group booking self-service (quote generator)
- Integration with operator's back-office / POS
- Advanced analytics and conversion tracking

## User Journeys

### Journey 1: Sophie — "Une sortie qui plaît à tout le monde"

**Sophie, 38 ans, maman de Théo (10 ans) et Emma (6 ans).** C'est samedi matin, les enfants s'ennuient. Elle cherche "activité enfant plein air" sur son téléphone.

**Opening:** Google la mène directement sur la page Paddle de La Terrasse Aventure. Elle voit le prix (12€/h), mais Emma a 6 ans — trop jeune pour le paddle.

**Rising Action:** Sous la fiche, elle voit "Ces activités pourraient aussi vous plaire" — mini-golf (8€, dès 4 ans) et pédalo (25€/h, familial). Elle clique sur le mini-golf. Ça marche pour les deux enfants. En scrollant, un encart narratif : "Après votre partie, déjeunez au bord du lac →". Elle découvre le restaurant — terrasse à 30m du lac, menu enfant.

**Climax:** En moins de 2 minutes, Sophie a trouvé une activité pour les deux enfants ET un plan déjeuner. Ce qui devait être "une activité" devient "une vraie sortie".

**Resolution:** Elle tape sur le CTA sticky "Réserver mon aventure", appelle, réserve mini-golf + table pour midi. Dimanche soir, elle raconte à ses amis : "On a trouvé un super endroit au lac de Saint-Ferréol."

→ *Capabilities revealed: FR8-FR12, FR7, FR23*

---

### Journey 2: Laurent — "Le séminaire qui impressionne le boss"

**Laurent, 45 ans, DRH d'une PME de 60 personnes.** Il doit organiser le séminaire annuel. Son boss veut "quelque chose de différent, pas un hôtel à Toulouse."

**Opening:** Il cherche "séminaire entreprise nature Toulouse" sur son desktop. Il atterrit sur La Terrasse Événements. En 5 secondes, il voit dans le hero : 1 salle, 60 places assises, vidéoprojecteur, WiFi.

**Rising Action:** Il scrolle. Trois packages clairs : Séminaire Simple (location sèche), Séminaire Gourmet (avec repas terroir), Séminaire Aventure (avec team building). Pas besoin de décrypter 5 formules complexes — le nom du pack fait le pitch. Il compare mentalement avec les 2 autres onglets ouverts (un hôtel, un domaine viticole).

**Climax:** Le Séminaire Aventure l'accroche — team building + repas + salle, le tout au bord d'un lac. Les photos du lieu font le reste. Le prix est affiché, pas de "nous contacter pour un devis" anxiogène.

**Resolution:** Il clique "Demander un devis", remplit le formulaire court (pré-rempli avec le contexte Événements), reçoit une confirmation. Il envoie le lien à son boss : "Regarde ça." Le site fait le travail de conviction à sa place.

→ *Capabilities revealed: FR16-FR18, FR23, FR37*

---

### Journey 3: Marc & Léa — "On y va, c'est beau"

**Marc et Léa, 30 ans, couple sans enfants.** Dimanche matin, ils cherchent "restaurant bord de l'eau" sur le téléphone de Léa.

**Opening:** Google les amène sur La Terrasse Restaurant. Le hero : une terrasse en bois, lumière dorée, le lac en arrière-plan. Léa montre l'écran à Marc : "Regarde ça."

**Rising Action:** Ils ne lisent même pas le menu. L'ambiance, les photos, la proximité du lac — la décision est émotionnelle. En scrollant, ils voient "Nos producteurs" (local, terroir) et un encart : "Prolongez le plaisir — balade au lac ou pédalo après le déjeuner."

**Climax:** "On y va." La décision est prise avant d'avoir lu un prix. Le lieu a vendu le moment.

**Resolution:** Léa appuie sur "Réserver ma table", appelle, réserve pour midi. Après le repas, ils louent un pédalo spontanément — le cross-selling a fonctionné par la découverte, pas par la vente.

→ *Capabilities revealed: FR13-FR14, FR7, FR22, FR25*

---

### Journey 4: Karine — "La sortie annuelle du club"

**Karine, 50 ans, présidente du club de randonnée local, 25 membres.** Elle organise la sortie annuelle — activités + repas pour le groupe.

**Opening:** Elle arrive sur la homepage. C'est SA page — elle a besoin des 3 pôles. Le mega-menu lui montre "En Groupe" dans les entrées transversales. Elle clique.

**Rising Action:** La page En Groupe lui présente une "journée type" illustrée : activité matin (course d'orientation) → déjeuner terroir au restaurant → activité après-midi (pédalo ou mini-golf). Elle voit les prix groupe, les options modulables.

**Climax:** Elle comprend l'offre complète en une page. Pas besoin de naviguer entre 3 sites différents ou d'assembler mentalement les pièces du puzzle.

**Resolution:** Elle appelle directement (les organisateurs de groupe préfèrent le téléphone). Le numéro est visible partout. Elle négocie un programme custom avec l'opérateur, en s'appuyant sur ce qu'elle a vu sur le site.

→ *Capabilities revealed: FR1-FR3, FR19-FR20, FR22*

---

### Journey 5: L'Opérateur — "Mettre à jour la carte sans appeler Corentin"

**L'opérateur (frère de Corentin), gestionnaire du site.** C'est le printemps, il doit mettre à jour le menu du restaurant et les horaires d'ouverture des activités.

**Opening:** Il se connecte à Keystatic via son navigateur. L'interface lui présente les collections de contenu : Restaurant (carte, producteurs), Aventure (10 activités), Événements (packages), Infos pratiques.

**Rising Action:** Il modifie le prix du paddle (passé de 12€ à 14€/h), ajoute un nouveau plat à la carte, met à jour les horaires de saison. Chaque champ est clair — pas de code, pas de markdown complexe.

**Climax:** Il clique "Publier". Le site se reconstruit automatiquement. En 2 minutes, les changements sont en ligne.

**Resolution:** Il gère son contenu en autonomie. Il n'a pas besoin d'appeler Corentin pour chaque mise à jour de prix ou de menu.

→ *Capabilities revealed: FR32-FR36*

## Functional Requirements

### Navigation & Information Architecture

- FR1: Visitors can navigate between all three poles and transversal pages via a mega-menu on desktop
- FR2: Visitors can navigate the full site structure via a slide-out panel with accordion sub-menus on mobile
- FR3: Visitors can access profile-based entry points (En Famille, En Groupe, En Entreprise) from the mega-menu
- FR4: Visitors can see which pole/section they are currently in via visual identity cues (color, tone)
- FR5: Visitors can return to the homepage or any pole hub from any page in the site

### Content Discovery & Cross-Linking

- FR6: Visitors can discover other poles via a permanent structural cross-link block ("La Terrasse c'est aussi...") on every page
- FR7: Visitors can discover contextually relevant services via narrative cross-links specific to each page (e.g., "Après votre paddle, déjeunez au bord du lac")
- FR8: Visitors can browse alternative activities when the current one doesn't fit (age, group size, price)

### Activity Browsing (Aventure)

- FR9: Visitors can browse all 10 activities from the Aventure hub page
- FR10: Visitors can view activity details including price, age suitability, duration, and group size on each activity card without clicking
- FR11: Visitors can access a dedicated detail page for each activity with full description and practical info
- FR12: Visitors can navigate laterally between related activities without returning to the hub

### Restaurant

- FR13: Visitors can view the restaurant menu (la carte) with current dishes and prices
- FR14: Visitors can discover the restaurant's local producers and sourcing philosophy
- FR15: Visitors can access group meal information and pricing for groups of 10+

### Événements (Seminars & Events)

- FR16: Visitors can view the venue's technical specifications (capacity, equipment, layout) immediately on the Événements page
- FR17: Visitors can compare three named seminar packages (Simple, Gourmet, Aventure) with included services and pricing
- FR18: Visitors can request a quote via a contextual form pre-filled with seminar package context

### Transversal Pages

- FR19: Visitors can view a curated "journée type" (typical day program) tailored to their profile (family, group, corporate)
- FR20: Visitors can access combined cross-pole offerings on dedicated transversal pages

### Contact & Action

- FR21: Visitors can contact the leisure base via a contact form from any page
- FR22: Visitors can call the leisure base via a prominently displayed phone number on every page
- FR23: Visitors can access a context-aware sticky CTA that adapts its label and destination to the current page/pole
- FR24: Visitors can view a map with directions to the leisure base on the contact page

### Homepage

- FR25: Visitors can experience an emotional introduction to the location via a video hero of Lac de Saint-Ferréol
- FR26: Visitors can experience a logo-mask reveal animation on first visit
- FR27: Visitors can discover the three poles as interconnected experiences from the homepage
- FR28: Visitors can experience an immersive "journée type" timeline section on the homepage
- FR29: Visitors can view upcoming events or seasonal information from the homepage

### Internationalization

- FR30: Visitors can switch the site language between French, English, and Spanish
- FR31: Visitors can access all content in their chosen language with proper URL structure

### Content Management (CMS)

- FR32: The operator can update restaurant menu items and prices via Keystatic CMS
- FR33: The operator can update activity details, prices, and availability status via CMS
- FR34: The operator can update seminar package descriptions and pricing via CMS
- FR35: The operator can update seasonal information and practical details via CMS
- FR36: The operator can publish content changes that trigger automatic site rebuild

### SEO & Discoverability

- FR37: Each page can be indexed by search engines as an autonomous landing page with unique meta data
- FR38: The site can generate structured data (LocalBusiness, Restaurant, SportsActivityLocation) for search engines
- FR39: The site can generate an XML sitemap and proper hreflang tags for multilingual SEO

## Non-Functional Requirements

### Performance

- NFR1: All pages load in under 2 seconds on a 4G mobile connection
- NFR2: Core Web Vitals scores all green (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- NFR3: Lighthouse Performance score ≥ 90 on all pages
- NFR4: JavaScript payload limited to Svelte islands only — no JS shipped for static content pages
- NFR5: Images served in WebP/AVIF with responsive srcset and lazy loading below the fold
- NFR6: Fonts self-hosted with `font-display: swap` and preloaded critical weights

### Accessibility

- NFR7: WCAG 2.1 AA compliance on all pages
- NFR8: All interactive elements have minimum 44x44px touch targets on mobile
- NFR9: All animations respect `prefers-reduced-motion` with static fallbacks (logo reveal, video autoplay, GSAP timeline)
- NFR10: All images have descriptive alt text; video hero has text alternative
- NFR11: Visible focus indicators on all interactive elements using pole accent color
- NFR12: Semantic HTML with proper heading hierarchy, landmarks, and ARIA labels
- NFR13: No text below 14px; body text minimum 16px

### Security & Privacy

- NFR14: Contact form submissions validated server-side and protected against spam (honeypot or reCAPTCHA)
- NFR15: HTTPS enforced on all pages
- NFR16: No sensitive user data stored — contact forms deliver to email only
- NFR17: GDPR-compliant cookie consent for Google Analytics

### Scalability & Reliability

- NFR18: Static site served via CDN — scales to any traffic volume with no server management
- NFR19: Site remains fully functional during CMS content updates (rebuild doesn't cause downtime)
- NFR20: Seasonal traffic spikes (spring/summer) handled entirely by CDN caching

### SEO & Discoverability

- NFR21: Lighthouse SEO score = 100 on all pages
- NFR22: Lighthouse Best Practices score = 100 on all pages
- NFR23: Proper canonical URLs, hreflang tags, and Open Graph tags on every page

### Maintainability

- NFR24: Operator can update any CMS-managed content without developer assistance
- NFR25: Site rebuild completes in under 2 minutes after content publish
- NFR26: Component architecture allows adding new activity pages or menu items without code changes

## Technical Architecture

### Stack

- **Framework:** Astro (static-first MPA) + Svelte islands for interactive components
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin. Design tokens in `@theme` directive (`src/styles/global.css`). Per-pole colors via inline `style` attributes.
- **CMS:** Keystatic — collections structured by pole
- **i18n:** FR (primary) + EN + ES. Translation utilities in `src/i18n/utils.ts`
- **Deployment:** Static site, CDN-served. Automatic rebuild on Keystatic publish.

### Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge — latest 2 versions). No IE11.
- Mobile-first design. Breakpoints: Mobile (< 768px) → Tablet (768-1024px) → Desktop (> 1024px).

### SEO Implementation

- Every page is an autonomous landing page with unique meta title/description and structured data
- Primary keywords: "base de loisir saint ferreol", "restaurant lac saint ferreol", "séminaire nature Toulouse"
- Per-activity keyword clusters (e.g., "pédalo saint ferreol", "mini golf lac")
- Structured data: LocalBusiness, Restaurant, SportsActivityLocation schemas
- Auto-generated XML sitemap, `hreflang` tags for FR/EN/ES, URL structure `/{lang}/`
- Open Graph tags with location photography for social sharing

### Key Implementation Constraints

- Svelte islands: `client:*` directives for interactivity. Data objects as props only (functions not serializable).
- `position: fixed` inside `backdrop-filter` parent: use DOM portals to escape stacking contexts.
- No dynamic Tailwind classes in string interpolation: use `class:name={cond}` or inline `style`.

## Risk Mitigation

### Technical Risks

- GSAP "journée type" timeline is the most complex component → **Mitigation:** Build simplified version first (CSS transitions), then enhance with GSAP. Ship simplified version if deadline is tight.
- Three.js (uncertain) → **Mitigation:** Not committed. Only explore if time permits after all must-haves. Not in MVP scope.
- Svelte islands + `backdrop-filter` interactions → **Mitigation:** Known issue. Use DOM portals to escape stacking contexts.

### Market Risks

- Low risk. No competition on the lake (sole operator). The site creates digital presence where none exists.
- Validation: contact form submissions and phone calls in first month establish baseline.

### Resource Risks

- Solo developer, tight deadline → **Mitigation:** Content structure built first, content filled iteratively. Placeholder-ready design. Prioritize by traffic potential (activity pages and restaurant first, transversal pages last).
- Content dependency (photos, menu, activity descriptions from operator) → **Mitigation:** Build with placeholder content. CMS allows operator to fill in at their pace.
