import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

/**
 * Single source of truth for global site settings.
 * The CMS groups fields into sections (contact, socials, season, offers) for
 * authoring ergonomics; we flatten them here so consumers keep a flat API
 * (settings.phone, settings.facebook…) and i18n fields stay as nested objects
 * readable through getLocalizedField().
 */
export async function getSiteSettings() {
  const reader = createReader(process.cwd(), keystaticConfig);
  const raw = await reader.singletons.settings.read();
  if (!raw) return null;
  return {
    ...raw.contact,
    ...raw.socials,
    ...raw.season,
    ...raw.offers,
    hours: raw.hours,
    branding: raw.branding,
  };
}

/** Convert a French local phone number to E.164 format for tel: links */
export function toTelHref(phone: string): string {
  return 'tel:' + phone.replace(/\s/g, '').replace(/^0/, '+33');
}
