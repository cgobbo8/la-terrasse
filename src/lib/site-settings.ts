import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

/**
 * Single source of truth for global site settings (phone, email, address…)
 * Always reads from src/content/settings/site.yaml via Keystatic.
 */
export async function getSiteSettings() {
  const reader = createReader(process.cwd(), keystaticConfig);
  return await reader.singletons.settings.read();
}

/** Convert a French local phone number to E.164 format for tel: links */
export function toTelHref(phone: string): string {
  return 'tel:' + phone.replace(/\s/g, '').replace(/^0/, '+33');
}
