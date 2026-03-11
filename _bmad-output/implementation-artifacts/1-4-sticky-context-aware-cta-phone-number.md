# Story 1.4: Sticky Context-Aware CTA & Phone Number

Status: ready-for-dev

## Story

As a visitor,
I want a persistent call-to-action button that adapts to the current section and a visible phone number,
so that I can always reach the business with one tap regardless of where I am on the site.

## Acceptance Criteria

1. A primary CTA button is visible in the sticky header at all scroll positions on every page
2. The CTA label and href adapt per pole context:
   - Restaurant: "Reserver ma table" → `tel:+33XXXXXXXXX`
   - Aventure: "Reserver mon aventure" → `tel:+33XXXXXXXXX`
   - Evenements: "Demander un devis" → `mailto:contact@laterrasse-saintferreol.fr?subject=Demande%20de%20devis`
   - Homepage / Transversal pages (no pole): "Nous contacter" → `tel:+33XXXXXXXXX`
3. The CTA button uses the current pole's accent color as background via inline `style` attribute, or brun-terre `#2D2B1B` when no pole is active
4. The phone number is visible and clickable (`tel:` link) in the header on desktop, and in the mobile menu panel
5. The CTA button and phone link have a minimum 44x44px touch target on all breakpoints
6. The CTA resolution logic lives in `src/lib/pole-config.ts` and is consumed by Header.astro

## Tasks / Subtasks

- [ ] Task 1: Create `src/lib/pole-config.ts` with CTA resolution (AC: #2, #6)
  - [ ] Export `Pole` type: `'restaurant' | 'aventure' | 'evenements'`
  - [ ] Export `PoleConfig` interface: `{ accent: string; light: string; name: string; ctaLabel: string; ctaHref: string }`
  - [ ] Export `poleConfigs` record with all 3 pole configurations:
    - `restaurant`: accent `#2D2B1B`, light `#f5f0e8`, ctaLabel `Reserver ma table`, ctaHref `tel:+33XXXXXXXXX`
    - `aventure`: accent `#537b47`, light `#eef5ec`, ctaLabel `Reserver mon aventure`, ctaHref `tel:+33XXXXXXXXX`
    - `evenements`: accent `#3d4969`, light `#edf0f5`, ctaLabel `Demander un devis`, ctaHref `mailto:contact@laterrasse-saintferreol.fr?subject=Demande%20de%20devis`
  - [ ] Export `defaultCta` object: `{ label: 'Nous contacter', href: 'tel:+33XXXXXXXXX', accent: '#2D2B1B' }`
  - [ ] Export helper `getCtaForPole(pole: Pole | null)` returning `{ label, href, accent }`
  - [ ] Export `PHONE_NUMBER` and `EMAIL_ADDRESS` constants for reuse across components
  - [ ] NOTE: Replace `+33XXXXXXXXX` with the actual phone number when provided by the client

- [ ] Task 2: Create `src/components/common/CTAButton.astro` (AC: #1, #3, #5)
  - [ ] Accept props: `label: string`, `href: string`, `accentColor: string`, `variant?: 'primary' | 'secondary' | 'ghost'`
  - [ ] Primary variant: solid background with accent color, white text
  - [ ] Secondary variant: outlined border with accent color, accent text
  - [ ] Ghost variant: no background, accent text, underline on hover
  - [ ] Apply accent color via inline `style` attribute: `style="background-color: {accentColor}"` for primary
  - [ ] Ensure minimum `min-h-11 px-4` for 44px touch target
  - [ ] Add `font-medium text-sm rounded-lg` base classes
  - [ ] Render as `<a>` tag (all CTAs are links — tel: or mailto:)

- [ ] Task 3: Create `src/components/common/ContactLinks.astro` (AC: #4)
  - [ ] Accept props: `phone: string`, `email?: string`, `variant?: 'header' | 'footer'`
  - [ ] Header variant: compact phone display with phone icon, single line
  - [ ] Footer variant: stacked phone + email with labels
  - [ ] Phone renders as `<a href="tel:{phone}">` with minimum 44px touch target
  - [ ] Email renders as `<a href="mailto:{email}">` if provided
  - [ ] Import `PHONE_NUMBER` and `EMAIL_ADDRESS` from `pole-config.ts` as defaults

- [ ] Task 4: Integrate CTA and phone in Header.astro (AC: #1, #4)
  - [ ] Import `getCtaForPole`, `PHONE_NUMBER` from `@/lib/pole-config.ts`
  - [ ] Import `CTAButton` and `ContactLinks` components
  - [ ] Resolve CTA config in frontmatter: `const cta = getCtaForPole(pole)`
  - [ ] Replace existing hardcoded contact `<a>` in desktop nav with `<CTAButton label={cta.label} href={cta.href} accentColor={cta.accent} />`
  - [ ] Add `<ContactLinks phone={PHONE_NUMBER} variant="header" />` next to the CTA on desktop (visible on `lg:` breakpoint)
  - [ ] Pass `cta` data to MegaMenu.svelte as `ctaLabel={cta.label}` and `ctaHref={cta.href}` and `ctaColor={cta.accent}` (replacing current static `contactLabel`/`contactHref`)
  - [ ] Pass `cta` data to MobileMenu.svelte for the mobile CTA button

- [ ] Task 5: Update MegaMenu.svelte CTA button styling (AC: #3)
  - [ ] Accept new props `ctaColor: string` for accent color
  - [ ] Apply accent color to the CTA button via inline `style="background-color: {ctaColor}"` instead of static `bg-brun-terre`
  - [ ] Ensure hover state slightly darkens the color (use CSS `filter: brightness(0.9)` on hover)

- [ ] Task 6: Update MobileMenu.svelte CTA button styling (AC: #3)
  - [ ] Accept new prop `ctaColor: string`
  - [ ] Apply accent color to the CTA button via inline `style="background-color: {ctaColor}"` instead of static `bg-brun-terre`
  - [ ] Add phone number link above or below the CTA in the mobile panel

- [ ] Task 7: Update Footer.astro with contact links (AC: #4)
  - [ ] Import `PHONE_NUMBER`, `EMAIL_ADDRESS` from `@/lib/pole-config.ts`
  - [ ] Import `ContactLinks` component
  - [ ] Replace placeholder address content in footer contact column with actual phone, email, and address using `ContactLinks` variant="footer"

## Dev Notes

### Architecture Patterns

- **Pole-aware CTA pattern:** The CTA adapts per pole using a centralized `pole-config.ts` lookup. Pages pass `pole` prop to BaseLayout, which passes it to Header.astro, which resolves the CTA. This avoids each page needing to know CTA details. [Source: architecture.md#Pole-Aware Component Pattern]
- **Inline styles for pole colors:** CTA button background MUST use inline `style` attribute, not dynamic Tailwind. [Source: CLAUDE.md#Tailwind CSS v4]
- **mailto: for evenements:** The evenements CTA uses `mailto:` with a pre-filled subject `Demande de devis` — URL-encoded as `Demande%20de%20devis`. All other poles use `tel:`. [Source: architecture.md#Contact & Booking (V1)]
- **No Svelte island needed for CTA:** CTAButton and ContactLinks are pure Astro components (zero JS). The CTA in MegaMenu/MobileMenu Svelte islands receives the resolved label/href/color as serialized props.

### Project Structure Notes

- `src/lib/pole-config.ts` — NEW file (also referenced in Story 1.1). Centralized pole configuration including colors, CTA labels, and hrefs.
- `src/components/common/CTAButton.astro` — NEW file. Reusable CTA link component with variant support.
- `src/components/common/ContactLinks.astro` — NEW file. Phone + email display component.
- `src/components/common/Header.astro` — EXISTS, integrate CTA and phone display.
- `src/components/common/MegaMenu.svelte` — EXISTS, update CTA button to accept color prop.
- `src/components/common/MobileMenu.svelte` — EXISTS, update CTA and add phone link.
- `src/components/common/Footer.astro` — EXISTS, integrate contact info.

### Key Constraints

- Phone number and email are placeholder values (`+33XXXXXXXXX`, `contact@laterrasse-saintferreol.fr`) until the client provides real ones. Store them as named constants in `pole-config.ts` for easy updating.
- The header is `sticky top-0` with `bg-white/95 backdrop-blur-sm`. The CTA button renders inside this sticky header, so it is always visible at any scroll position.
- On mobile (`< lg`), the header CTA is hidden; the CTA appears inside the MobileMenu slide-out panel instead.
- The `mailto:` link for evenements must include a pre-filled subject line. The URL encoding must be correct for all browsers.

### References

- [Source: architecture.md#Contact & Booking (V1)]
- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: architecture.md#Key File: src/lib/pole-config.ts]
- [Source: CLAUDE.md#Tailwind CSS v4]
- [Source: ux-design-specification.md#CTA Strategy]
- [Source: prd.md#FR4 Sticky CTA]
- [Source: prd.md#FR5 Phone Number Visibility]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
