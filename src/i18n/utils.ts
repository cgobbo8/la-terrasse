import { translations, defaultLang, type Lang } from './translations';

/**
 * Get the current language.
 * Prefers Astro.currentLocale (works with i18n rewrites),
 * falls back to URL parsing.
 */
export function getLangFromUrl(url: URL, currentLocale?: string): Lang {
  if (currentLocale && currentLocale in translations) return currentLocale as Lang;
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Lang;
  return defaultLang;
}

/**
 * Get a translated string by key
 */
export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof translations[typeof defaultLang]): string {
    return translations[lang]?.[key] ?? translations[defaultLang][key] ?? key;
  };
}

/**
 * Get localized path
 * FR (default): /restaurant
 * EN: /en/restaurant
 * ES: /es/restaurant
 */
export function getLocalizedPath(path: string, lang: Lang): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return cleanPath;
  return `/${lang}${cleanPath}`;
}

/**
 * Get localized content field.
 * Supports two schema patterns:
 *   - Nested object: { fr: '...', en: '...', es: '...' }  (preferred)
 *   - Legacy flat:   field + field_en + field_es            (used for slug fields)
 * Falls back to FR when the requested lang is missing.
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  entry: T,
  field: string,
  lang: Lang,
): string {
  const value = entry[field];

  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'fr' in (value as Record<string, unknown>)
  ) {
    const obj = value as Record<string, string | undefined>;
    return obj[lang] || obj[defaultLang] || '';
  }

  if (lang === defaultLang) return (value as string) ?? '';
  const localizedField = `${field}_${lang}`;
  return (entry[localizedField] as string) || ((value as string) ?? '');
}

/**
 * Get localized array field (list of strings).
 * Supports:
 *   - Nested:  { fr: [...], en: [...], es: [...] }
 *   - Legacy:  field + field_en + field_es
 */
export function getLocalizedArray<T extends Record<string, unknown>>(
  entry: T,
  field: string,
  lang: Lang,
): string[] {
  const value = entry[field];

  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'fr' in (value as Record<string, unknown>)
  ) {
    const obj = value as Record<string, readonly string[] | undefined>;
    return [...(obj[lang] || obj[defaultLang] || [])];
  }

  if (lang === defaultLang) return [...((value as readonly string[]) ?? [])];
  const localizedField = `${field}_${lang}`;
  return [
    ...((entry[localizedField] as readonly string[]) ||
      (value as readonly string[]) ||
      []),
  ];
}
