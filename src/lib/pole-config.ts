export type Pole = 'restaurant' | 'aventure' | 'salle';

export interface PoleConfig {
  name: string;
  accent: string;
  light: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Replace with actual phone number when provided by the client */
export const PHONE_NUMBER = '+33000000000';
export const EMAIL_ADDRESS = 'contact@laterrasse-saintferreol.fr';

/**
 * Build a mailto: link for quote requests.
 * @param packageName — Optional seminar package name for subject specificity
 */
export function buildQuoteMailto(packageName?: string): string {
  const subject = packageName
    ? `Demande de devis — ${packageName}`
    : 'Demande de devis — Séminaire';
  return `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}`;
}

/**
 * Build a mailto: link for event inquiries (non-seminar).
 */
export function buildEventContactMailto(): string {
  const subject = 'Renseignements — Location de salle';
  return `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}`;
}

export const poleConfigs: Record<Pole, PoleConfig> = {
  restaurant: {
    name: 'Restaurant',
    accent: '#2D2B1B',
    light: '#f5f0e8',
    ctaLabel: 'Réserver ma table',
    ctaHref: `tel:${PHONE_NUMBER}`,
  },
  aventure: {
    name: 'Aventure',
    accent: '#537b47',
    light: '#eef5ec',
    ctaLabel: 'Réserver mon aventure',
    ctaHref: `tel:${PHONE_NUMBER}`,
  },
  salle: {
    name: 'La Salle',
    accent: '#3d4969',
    light: '#edf0f5',
    ctaLabel: 'Nous contacter',
    ctaHref: buildQuoteMailto(),
  },
};

export const defaultCta = {
  label: 'Nous contacter',
  href: `tel:${PHONE_NUMBER}`,
  accent: '#2D2B1B',
} as const;

export function getCtaForPole(pole: Pole | null): { label: string; href: string; accent: string } {
  if (!pole) return { ...defaultCta };
  const config = poleConfigs[pole];
  return { label: config.ctaLabel, href: config.ctaHref, accent: config.accent };
}
