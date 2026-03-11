# Story 4.2: Menu Page (La Carte)

Status: ready-for-dev

## Story

As a visitor,
I want to see the restaurant menu with dishes and prices in a clean, readable format,
so that I can decide what to eat and understand the price range before visiting.

## Acceptance Criteria

1. Menu is organized by course sections: Entrées, Plats, Desserts, Boissons — each with a clear heading
2. Each dish displays: name (bold), description (subtle gray), and price (right-aligned or accent-colored)
3. All menu data comes from the Keystatic restaurant singleton — no hardcoded dishes
4. The page is fully responsive without horizontal scroll — no HTML table layout
5. Prices use `tabular-nums` for consistent alignment
6. A "Réserver ma table" CTA appears at the bottom of the page
7. Hero section uses brun terre identity with a food/table photo
8. Breadcrumb: "Restaurant > La Carte" with "Restaurant" linking back to `/restaurant/`
9. SEO meta with unique title "La Carte — Restaurant | La Terrasse Saint-Ferréol"

## Tasks / Subtasks

- [ ] Task 1: Create `src/components/restaurant/MenuSection.astro` (AC: #1, #2, #4, #5)
  - [ ] Define props: `title: string`, `dishes: Array<{ name: string, description?: string, price: number, tags?: string[] }>`
  - [ ] Render section heading as H3 with brun terre accent underline or decorative element
  - [ ] For each dish, render a flex row:
    - [ ] Left: dish name (`font-bold`) + description below (`text-gray-600`, `text-sm`)
    - [ ] Right: price formatted as "{X},00 €" with `font-variant-numeric: tabular-nums`
  - [ ] Add subtle separator between dishes (1px border-bottom or spacing)
  - [ ] Optional: render dietary tags (végétarien, sans gluten) as small pills if present
  - [ ] Mobile: stack name/description above, price below-right — or keep inline with smaller text
- [ ] Task 2: Create/update `src/pages/restaurant/carte.astro` (AC: #3, #7, #8, #9)
  - [ ] Import `getLangFromUrl`, `useTranslations`, `getLocalizedField` from `@/i18n/utils`
  - [ ] Import `poleConfigs` from `@/lib/pole-config`
  - [ ] Query Keystatic restaurant singleton for menu data
  - [ ] Build hero: food/table photo with brun terre overlay, "La Carte" H1
  - [ ] Breadcrumb above title: "RESTAURANT" small-caps linked to `/restaurant/`
  - [ ] Render one `MenuSection` per course category
  - [ ] Pass SEO props: title="La Carte — Restaurant | La Terrasse Saint-Ferréol"
- [ ] Task 3: Responsive layout (AC: #4)
  - [ ] Menu sections: max-width 768px, centered — mimics a printed menu feel
  - [ ] No table element — use flexbox for dish rows
  - [ ] On mobile (<640px): dish name and price on same line (name flex-1, price flex-none), description below
  - [ ] Ensure no overflow or horizontal scroll at any viewport width
  - [ ] Test with long dish names and descriptions
- [ ] Task 4: Price formatting (AC: #5)
  - [ ] Format prices with French locale: comma as decimal separator (e.g., "14,50 €")
  - [ ] Apply `font-variant-numeric: tabular-nums` so prices align vertically
  - [ ] Price text in brun terre accent color for visual anchoring
  - [ ] Helper function or inline formatting: `(price).toFixed(2).replace('.', ',') + ' €'`
- [ ] Task 5: CTA section (AC: #6)
  - [ ] Reuse same CTA pattern from Story 4.1: brun terre background, white text, phone link
  - [ ] Heading: "Envie de goûter ?" or "Réservez votre table"
  - [ ] CTA href from `poleConfigs.restaurant.ctaHref`
- [ ] Task 6: i18n support (AC: #2, #3)
  - [ ] Use `getLocalizedField()` for dish names and descriptions
  - [ ] Section titles via `useTranslations()` or `getLocalizedField()` on the singleton
  - [ ] Breadcrumb and CTA text translated

## Dev Notes

### Architecture Patterns (MUST follow)

- **NO PDF menus.** The menu MUST be native HTML, fully responsive and accessible. This is a deliberate design decision for SEO, accessibility, and mobile experience. [Source: ux-design-specification.md#Menu Page]
- **Pole-aware pattern:** Brun terre (#2D2B1B) accent via inline `style` attributes. [Source: architecture.md#Pole-Aware Component Pattern]
- **Rendering boundary:** Pure Astro components, zero JS. Menu is static content rendered at build time. [Source: architecture.md#Rendering Boundary]
- **Import aliases:** Always use `@/` prefix. [Source: architecture.md#Import Patterns]
- **i18n:** All links via `getLocalizedPath()`. Content fields via `getLocalizedField()`. [Source: architecture.md#i18n Patterns]

### Project Structure Notes

- `src/components/restaurant/MenuSection.astro` — NEW file, reusable menu section component
- `src/pages/restaurant/carte.astro` — NEW file, the menu page
- `src/components/restaurant/` — NEW directory for restaurant-specific components

### Keystatic Restaurant Singleton (expected structure)

```
restaurant:
  menu:
    entrees:
      - name: "Salade de chèvre chaud"
        description: "Miel de Saint-Ferréol, noix du Tarn"
        price: 12.50
        tags: ["végétarien"]
    plats:
      - name: "Pavé de truite du lac"
        description: "Beurre noisette, légumes de saison"
        price: 22.00
    desserts:
      - name: "Tarte aux fruits de saison"
        description: "Pâte sablée maison, crème légère"
        price: 9.50
    boissons:
      - name: "Verre de Gaillac rouge"
        description: "Domaine de Labarthe"
        price: 6.00
```

### Design Tokens Reference

- Menu content max-width: 768px, centered (elegant, readable)
- Dish name: font-bold, 16→18px
- Dish description: text-gray-600, 14→16px
- Dish price: tabular-nums, brun terre accent color, 16→18px
- Dish separator: 1px border-gray-100 or 16px margin-bottom
- Section heading (H3): 20→24px, Montserrat Bold, brun terre underline accent
- Section spacing between courses: 48px desktop / 32px mobile
- Hero: 50vh desktop / 40vh mobile (shorter, content-focused page)
- Breadcrumb: 14px, small-caps

### References

- [Source: architecture.md#Pole-Aware Component Pattern]
- [Source: architecture.md#Rendering Boundary]
- [Source: architecture.md#i18n Patterns]
- [Source: ux-design-specification.md#Menu Page]
- [Source: ux-design-specification.md#Typography System]
- [Source: prd.md#Restaurant Pole — La Carte]
- [Source: CLAUDE.md#Tailwind CSS v4]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
