export type Pole = 'restaurant' | 'aventure' | 'salle';

export interface PoleConfig {
  name: string;
  accent: string;
  accentDark: string;
  light: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Centralized brand colors — single source of truth */
export const brandColors = {
  brunTerre: '#36342F',
  soleil: '#FFFF80',
  soleilDark: '#FACC15',
  gray400: '#B0ACA6',
  gray600: '#736F69',
  gray200: '#EAE7E3',
  gray100: '#F7F5F2',
  offwhite: '#FFFBF5',
  black: '#1F1D1B',
  white: '#ffffff',
} as const;

/** Replace with actual phone number when provided by the client */
export const PHONE_NUMBER = '+33000000000';
export const EMAIL_ADDRESS = 'contact@baseloisirs-saintferreol.fr';

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
    accent: '#E8603C',
    accentDark: '#C4452A',
    light: '#FFF3ED',
    ctaLabel: 'Réserver ma table',
    ctaHref: `tel:${PHONE_NUMBER}`,
  },
  aventure: {
    name: 'Aventure',
    accent: '#7CB342',
    accentDark: '#5A8A2E',
    light: '#F0F7E6',
    ctaLabel: 'Réserver mon aventure',
    ctaHref: `tel:${PHONE_NUMBER}`,
  },
  salle: {
    name: 'La Salle',
    accent: '#5B8DEF',
    accentDark: '#3D6FD1',
    light: '#EDF4FF',
    ctaLabel: 'Nous contacter',
    ctaHref: buildQuoteMailto(),
  },
};

export const defaultCta = {
  label: 'Nous contacter',
  href: `tel:${PHONE_NUMBER}`,
  accent: brandColors.soleil,
} as const;

export function getCtaForPole(pole: Pole | null): { label: string; href: string; accent: string } {
  if (!pole) return { ...defaultCta };
  const config = poleConfigs[pole];
  return { label: config.ctaLabel, href: config.ctaHref, accent: config.accent };
}
