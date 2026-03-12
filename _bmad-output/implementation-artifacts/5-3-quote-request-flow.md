# Story 5.3: Quote Request Flow

Status: review

## Story

As a corporate planner,
I want to request a quote with the seminar context pre-filled,
so that my inquiry reaches the operator with enough context to respond quickly.

## Acceptance Criteria

1. Every "Demander un devis" CTA on événements pages opens a mailto: link with a pre-filled subject line
2. Package-specific CTAs (from PackComparator / SeminarPackageCard) include the package name in the subject: "Demande de devis — Séminaire {PackageName}" (e.g., "Demande de devis — Séminaire Aventure")
3. Generic CTAs (from événements hub hero, en-entreprise page) use a generic subject: "Demande de devis — Séminaire"
4. A sticky CTA visible on all événements pole pages reads "Demander un devis" and resolves to the mailto: link — CTA label and href defined in pole-config.ts for the evenements pole
5. The mailto: recipient address is `contact@laterrasse.fr` (or configurable via pole-config.ts / Keystatic settings singleton)

## Tasks / Subtasks

- [x] Task 1: Define mailto: link construction utility (AC: #1, #2, #3, #5)
  - [x] Create helper function `buildQuoteMailto(packageName?: string): string` in `src/lib/pole-config.ts` or `src/lib/utils.ts`
  - [x] If packageName provided: `mailto:contact@laterrasse.fr?subject=Demande%20de%20devis%20%E2%80%94%20S%C3%A9minaire%20${encodeURIComponent(packageName)}`
  - [x] If no packageName: `mailto:contact@laterrasse.fr?subject=Demande%20de%20devis%20%E2%80%94%20S%C3%A9minaire`
  - [x] URL-encode the entire subject line properly (accented characters, em dash)
  - [x] Export for use in Astro components

- [x] Task 2: Update package CTAs in evenements page (AC: #2)
  - [x] In PackComparator.astro / SeminarPackageCard.astro: construct mailto: href using `buildQuoteMailto(package.title)` for each package
  - [x] Verify each CTA renders `<a href="mailto:...">Demander un devis</a>` with correct package-specific subject
  - [x] Test that clicking opens email client with correct pre-filled subject

- [x] Task 3: Update generic CTAs on événements pages (AC: #3)
  - [x] Événements hub hero CTA: replace current `/contact` link with `buildQuoteMailto()` (no package name)
  - [x] En-entreprise page "Demander un devis sur mesure" CTA: update href to `buildQuoteMailto()`
  - [x] Any other "Demander un devis" links on événements-related pages: audit and update

- [x] Task 4: Verify sticky CTA configuration in pole-config.ts (AC: #4)
  - [x] Confirm evenements pole config has `ctaLabel: "Demander un devis"` and `ctaHref` pointing to mailto: link
  - [x] If pole-config.ts doesn't exist yet (Story 1.1 dependency), document the expected config:
    ```ts
    evenements: {
      ctaLabel: 'Demander un devis',
      ctaHref: 'mailto:contact@laterrasse.fr?subject=Demande%20de%20devis%20%E2%80%94%20Séminaire',
    }
    ```
  - [x] Sticky CTA in header resolves from pole-config.ts when `pole="evenements"` — no hardcoded mailto: in header

- [x] Task 5: Audit all événements-related CTAs for consistency (AC: #1, #2, #3)
  - [x] List all "Demander un devis" links across: evenements/index.astro, en-entreprise.astro, any seminar detail pages
  - [x] Ensure all use `buildQuoteMailto()` utility (or hardcoded equivalent if utility not yet available)
  - [x] Ensure none point to a non-existent `/contact` page for quote requests

## Dev Notes

### V1 Strategy: mailto: Only

This is deliberately simple for V1. No backend form, no Turnstile, no server processing. The mailto: approach:
- Works offline (email client handles it)
- Zero infrastructure cost
- Pre-filled subject gives the operator immediate context
- V2 will replace with a real contact form + Cloudflare Turnstile anti-spam

### mailto: Link Format

```
mailto:contact@laterrasse.fr?subject=Demande%20de%20devis%20%E2%80%94%20S%C3%A9minaire%20Aventure
```

Decodes to: `Demande de devis — Séminaire Aventure`

The em dash (—) is `%E2%80%94` when URL-encoded. Use `encodeURIComponent()` for the package name portion to handle any special characters.

### Sticky CTA Integration

The sticky CTA (Story 1.4) displays in the header when scrolled past the hero. For événements pages:
- Label: "Demander un devis"
- Href: generic mailto: (no package name — user is on the hub, not a specific package)
- Background: bleu ardoise (#3d4969)
- This is configured via `pole-config.ts` and read by the Header/StickyBar component

### Architecture Patterns

- **No form backend in V1:** All quote CTAs are `<a href="mailto:...">` links. No `<form>` elements, no API routes.
- **Pole-config centralization:** Contact email and CTA configuration live in pole-config.ts. Components don't hardcode `contact@laterrasse.fr`.
- **Import aliases:** `@/lib/pole-config` for utility imports.

### Project Structure Notes

- `src/lib/pole-config.ts` — May not exist yet (Story 1.1 dependency). If creating `buildQuoteMailto`, place it here or in a new `src/lib/utils.ts`.
- `src/pages/evenements/index.astro` — EXISTS, update CTA hrefs
- `src/pages/en-entreprise.astro` — EXISTS, update CTA hrefs
- `src/components/evenements/PackComparator.astro` — Created in Story 5.2, update CTA hrefs
- `src/components/evenements/SeminarPackageCard.astro` — Created in Story 5.2, update CTA hrefs

### Dependencies

- Story 5.2 (creates PackComparator and SeminarPackageCard — this story updates their CTAs)
- Story 1.1 (creates pole-config.ts — this story adds/verifies mailto: config)
- Story 1.4 (creates sticky CTA — this story ensures evenements config is correct)

### References

- [Source: architecture.md#Key File: src/lib/pole-config.ts]
- [Source: prd.md#Contact V1 Strategy — mailto: + tel:]
- [Source: ux-design-specification.md#CTA Patterns]
- Current evenements/index.astro hero CTA at line 48 points to `/contact` — needs mailto: replacement

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
None — clean implementation, no issues encountered.

### Completion Notes List
- Created `buildQuoteMailto(packageName?: string)` utility in `src/lib/pole-config.ts` using `EMAIL_ADDRESS` constant and `encodeURIComponent()` for proper URL encoding of subject with em dash and accented characters
- Updated evenements pole config `ctaHref` to use `buildQuoteMailto()` for the sticky CTA
- Replaced all `/contact` hrefs on événements hub hero, groups section, and en-entreprise hero/section CTAs with `buildQuoteMailto()`
- PackComparator receives `ctaHref: buildQuoteMailto(s.entry.title)` per package from the evenements index page, providing package-specific subjects
- SeminarPackageCard receives `ctaHref` prop from PackComparator — chain is complete
- Audited all "Demander un devis" CTAs across the codebase — none point to `/contact` for événements pages
- Build passes cleanly with no errors

### File List
- `src/lib/pole-config.ts` — Added `buildQuoteMailto()` utility, updated evenements `ctaHref`
- `src/pages/evenements/index.astro` — Replaced `/contact` CTAs with `buildQuoteMailto()`, uses PackComparator with package-specific mailto hrefs
- `src/pages/en-entreprise.astro` — Replaced `/contact` CTAs with `buildQuoteMailto()`
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Updated story status
- `_bmad-output/implementation-artifacts/5-3-quote-request-flow.md` — Updated tasks, status, dev agent record

### Change Log
- 2026-03-11: Implemented quote request flow — all "Demander un devis" CTAs now use mailto: links with pre-filled subject lines via centralized `buildQuoteMailto()` utility
