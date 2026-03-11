# Story 7.1: Contact Page with Map & Practical Info

Status: ready-for-dev

## Story

As a visitor ready to act,
I want a contact page with all contact methods and directions to the leisure base,
so that I can easily reach the venue by phone, email, or in person.

## Acceptance Criteria

1. Phone number is displayed as a clickable `tel:` link; tapping on mobile opens the dialer
2. Email address is displayed as a clickable `mailto:` link; tapping opens the mail client
3. Physical address is clearly visible with full postal details
4. Opening hours are displayed in a readable table/grid format
5. An embedded Google Maps iframe shows the leisure base location with lazy loading (`loading="lazy"`)
6. Practical directions section includes: car access route, parking availability, distance from Toulouse (~60 km)
7. Page includes `LocalBusiness` JSON-LD structured data with name, address, phone, email, geo coordinates, and opening hours
8. Page is fully responsive — phone and email are tap-friendly on mobile
9. Page uses brand-mother styling (no pole-specific color theming)
10. All UI strings use `useTranslations(lang)` for i18n support

## Tasks / Subtasks

- [ ] Create/update `src/pages/contact.astro` with full contact page layout (AC: #1, #2, #3, #4, #8, #9)
  - [ ] Import `getLangFromUrl()` and `useTranslations()` from `src/i18n/utils.ts`
  - [ ] Build hero section with page title and brief intro text
  - [ ] Build contact info card: phone number (large, prominent, `tel:` link), email (`mailto:` link), full postal address
  - [ ] Build opening hours section using a clean `<table>` or CSS grid with day/hours pairs
  - [ ] Ensure phone and email links are large enough for mobile tap targets (min 44x44px)
  - [ ] Apply brand-mother palette (#2D2B1B brun terre as accent) — no pole-specific colors

- [ ] Embed Google Maps iframe with the leisure base location (AC: #5)
  - [ ] Read `googleMapsUrl` from Keystatic `settings` singleton via `astro:content` API
  - [ ] Render `<iframe>` with `loading="lazy"`, `allowfullscreen`, appropriate `title` attribute for a11y
  - [ ] Set responsive dimensions: full-width container, ~400px height on desktop, ~300px on mobile
  - [ ] Add fallback text/link if iframe cannot load

- [ ] Build practical access/directions section (AC: #6)
  - [ ] Car access: describe route from A68/A61 autoroute, mention nearby towns (Revel, Soreze)
  - [ ] Distance callout: "~60 km from Toulouse, ~1h drive"
  - [ ] Parking info: availability, capacity indication, free/paid status
  - [ ] Optional: mention public transport limitations (rural area, car recommended)

- [ ] Add LocalBusiness JSON-LD structured data (AC: #7)
  - [ ] Include: `@type: "LocalBusiness"`, `name`, `address` (PostalAddress), `telephone`, `email`, `url`
  - [ ] Include `geo` with latitude/longitude of Saint-Ferreol lake
  - [ ] Include `openingHoursSpecification` array matching displayed hours
  - [ ] Inject JSON-LD in `<script type="application/ld+json">` in the page head or body

- [ ] Create localized route files for EN/ES (AC: #10)
  - [ ] Create `src/pages/en/contact.astro` and `src/pages/es/contact.astro` (or rely on Astro i18n routing if configured for auto-generation)
  - [ ] Add all contact page UI strings to `src/i18n/translations.ts` (page title, section headings, directions text, hours labels)

- [ ] Responsive layout and final polish (AC: #8, #9)
  - [ ] Desktop: two-column layout — contact info + hours on left, map on right
  - [ ] Mobile: single-column stack — contact info, then hours, then map, then directions
  - [ ] Verify tap targets, font sizes, spacing on mobile viewports

## Dev Notes

### Project Structure Notes

- Contact page lives at `src/pages/contact.astro` (FR default, no prefix)
- EN/ES variants at `src/pages/en/contact.astro` and `src/pages/es/contact.astro`
- Uses `BaseLayout.astro` for consistent head, header, footer
- Contact data (phone, email, address, hours, googleMapsUrl) should come from the Keystatic `settings` singleton — if not yet available, hardcode initially and note for Story 9.1 to add those fields

### Design Decisions

- **Brand-mother styling:** This page represents the entire leisure base, not a specific pole. Use neutral palette with brun terre (#2D2B1B) accents
- **Phone number prominence:** Display phone as the primary CTA — large font size (text-2xl or larger), visually distinct from surrounding text
- **Opening hours:** Use a simple two-column grid (day | hours). Consider seasonal variations — the `settings` singleton should eventually support seasonal hours
- **Map:** Google Maps embed iframe is simplest for V1. The URL stored in Keystatic settings allows the operator to update it without code changes. Use `loading="lazy"` to avoid blocking page load
- **Directions:** Lac de Saint-Ferreol is located near Revel (Haute-Garonne), roughly 60 km southeast of Toulouse. Key routes: A61 toward Castelnaudary then D629, or A68 toward Castres then D629

### LocalBusiness JSON-LD Example Structure

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "La Terrasse — Base de Loisirs Saint-Ferréol",
  "telephone": "+33...",
  "email": "contact@...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "...",
    "addressLocality": "Saint-Ferréol",
    "postalCode": "31250",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 43.4412,
    "longitude": 2.0505
  }
}
```

### References

- Google Maps embed docs: https://developers.google.com/maps/documentation/embed/get-started
- Schema.org LocalBusiness: https://schema.org/LocalBusiness
- Existing `SEOHead.astro` for JSON-LD injection pattern
- `src/i18n/utils.ts` for `getLangFromUrl()`, `useTranslations()`, `getLocalizedPath()`

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
