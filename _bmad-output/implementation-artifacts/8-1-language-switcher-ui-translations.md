# Story 8.1: Language Switcher & UI Translations

Status: ready-for-dev

## Story

As a non-French speaking visitor,
I want to switch the site language to English or Spanish,
so that I can understand the content and navigate the site in my preferred language.

## Acceptance Criteria

1. A language selector is visible in the header, showing FR / EN / ES options
2. Selecting a language redirects to the equivalent localized page (e.g., `/restaurant` → `/en/restaurant`)
3. All UI strings render in the selected language via `useTranslations(lang)`
4. If a translation is missing for EN or ES, the system falls back to the FR string
5. The `<html lang="...">` attribute reflects the current page language (`fr`, `en`, or `es`)
6. URL structure follows the convention: `/` (FR, no prefix), `/en/` (EN), `/es/` (ES)
7. The language switcher highlights or visually distinguishes the currently active language
8. The switcher works on both desktop and mobile navigation

## Tasks / Subtasks

- [ ] Create language switcher component (AC: #1, #7, #8)
  - [ ] Create `src/components/LanguageSwitcher.astro` (static component, no client JS needed)
  - [ ] Display three language options: FR, EN, ES — as text links or a compact button group
  - [ ] Highlight/bold the currently active language based on `getLangFromUrl(Astro.url)`
  - [ ] Each option links to the equivalent page in the target locale using `getLocalizedPath()`
  - [ ] Style: minimal, clean — fits in header without competing with navigation
  - [ ] Position: right side of header, after main nav / before CTA or at the far end
  - [ ] Ensure it renders properly inside both desktop header and mobile nav panel

- [ ] Integrate switcher into header (AC: #1, #8)
  - [ ] Import and render `LanguageSwitcher.astro` in the site header component
  - [ ] Desktop: inline in the header bar, right-aligned
  - [ ] Mobile: include in the mobile slide-out panel, near the top or bottom

- [ ] Ensure all pages extract language correctly (AC: #3, #5, #6)
  - [ ] Verify every page calls `const lang = getLangFromUrl(Astro.url)` at the top of the frontmatter
  - [ ] Verify `BaseLayout.astro` sets `<html lang={lang}>` dynamically
  - [ ] Verify `useTranslations(lang)` is called and used for all UI text in every page/component

- [ ] Audit and replace all hardcoded French strings (AC: #3, #4)
  - [ ] Audit `src/components/` — find all hardcoded French text in templates
  - [ ] Audit `src/pages/` — find all hardcoded French text in page files
  - [ ] Audit `src/layouts/` — find hardcoded French text in BaseLayout, headers, footers
  - [ ] Replace each hardcoded string with `t('key')` call using `useTranslations(lang)`
  - [ ] Add corresponding keys to `src/i18n/translations.ts`

- [ ] Complete EN and ES translations in `src/i18n/translations.ts` (AC: #3, #4)
  - [ ] Navigation labels: Home, Restaurant, Adventure, Events, Contact, etc.
  - [ ] CTA text: "Book now", "Call us", "See the menu", "Discover activities", etc.
  - [ ] Footer text: copyright, legal mentions, social media labels
  - [ ] Section headings: "Our activities", "The restaurant", "Upcoming events", etc.
  - [ ] Contact page strings: "Phone", "Email", "Address", "Opening hours", "How to get here"
  - [ ] Common UI strings: "Back", "Read more", "See all", "Close", etc.
  - [ ] Ensure FR translations are complete as the fallback baseline

- [ ] Verify fallback behavior (AC: #4)
  - [ ] Test that `useTranslations(lang)` returns FR string when EN/ES key is missing
  - [ ] Review `src/i18n/utils.ts` implementation to confirm fallback logic exists
  - [ ] If fallback is not implemented, add it: check target lang first, then fall back to `fr`

- [ ] Verify URL routing and page generation (AC: #2, #6)
  - [ ] Confirm `astro.config.mjs` i18n config: `defaultLocale: 'fr'`, `locales: ['fr', 'en', 'es']`
  - [ ] Confirm routing strategy generates `/en/` and `/es/` prefixed pages
  - [ ] Test `getLocalizedPath()` produces correct URLs for each locale
  - [ ] Verify all pages exist at `/en/...` and `/es/...` paths after build

## Dev Notes

### Project Structure Notes

- i18n utilities: `src/i18n/utils.ts` — contains `getLangFromUrl()`, `useTranslations()`, `getLocalizedField()`, `getLocalizedPath()`
- Translation strings: `src/i18n/translations.ts` — dictionary object keyed by language code, then by string key
- Astro i18n config: `astro.config.mjs` — defines locales, default locale, routing strategy
- Language switcher: `src/components/LanguageSwitcher.astro` (new file)
- Header integration: wherever the site header/nav is defined (likely `src/components/Header.astro` or similar)

### Design Decisions

- **Astro component over Svelte island:** The language switcher is purely link-based navigation — no client-side JS needed. An `.astro` component is simpler and lighter than a Svelte island
- **Text links over flags:** Use text labels (FR / EN / ES) rather than country flags. Flags are problematic: English is spoken in many countries (not just UK/US), Spanish likewise. Text is clearer and more accessible
- **Compact layout:** Use a simple `FR | EN | ES` inline format with pipe separators or a small button group. Active language gets `font-bold` or underline treatment
- **No dropdown:** For just 3 languages, a dropdown adds unnecessary interaction. Inline links are faster (one click vs two)

### Translation Strategy

The translation file structure in `translations.ts` should follow this pattern:
```typescript
export const translations = {
  fr: {
    'nav.home': 'Accueil',
    'nav.restaurant': 'Le Restaurant',
    'nav.adventure': 'Aventure & Nature',
    'nav.events': 'Événements',
    'nav.contact': 'Contact',
    'cta.book': 'Réserver',
    'cta.call': 'Appelez-nous',
    // ...
  },
  en: {
    'nav.home': 'Home',
    'nav.restaurant': 'The Restaurant',
    'nav.adventure': 'Adventure & Nature',
    'nav.events': 'Events',
    'nav.contact': 'Contact',
    'cta.book': 'Book now',
    'cta.call': 'Call us',
    // ...
  },
  es: {
    'nav.home': 'Inicio',
    'nav.restaurant': 'El Restaurante',
    'nav.adventure': 'Aventura y Naturaleza',
    'nav.events': 'Eventos',
    'nav.contact': 'Contacto',
    'cta.book': 'Reservar',
    'cta.call': 'Llámanos',
    // ...
  }
}
```

### Fallback Logic

If `useTranslations()` does not already implement fallback, the pattern should be:
```typescript
export function useTranslations(lang: string) {
  return function t(key: string): string {
    return translations[lang]?.[key] || translations['fr']?.[key] || key;
  }
}
```
This tries the target language first, falls back to FR, then returns the raw key as a last resort (useful for debugging missing translations).

### References

- Astro i18n docs: https://docs.astro.build/en/guides/internationalization/
- Existing `src/i18n/utils.ts` for current implementation
- Existing `src/i18n/translations.ts` for current translation keys
- Header component for integration point

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
