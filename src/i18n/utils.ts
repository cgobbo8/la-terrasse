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
 * Get localized content field
 * Returns the translated field if available, falls back to FR
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  entry: T,
  field: string,
  lang: Lang,
): string {
  if (lang === defaultLang) return (entry[field] as string) ?? '';
  const localizedField = `${field}_${lang}`;
  return (entry[localizedField] as string) || ((entry[field] as string) ?? '');
}
