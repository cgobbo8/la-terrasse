export type Pole = 'restaurant' | 'aventure' | 'salle';

export interface PoleConfig {
  name: string;
  accent: string;
  accentDark: string;
  light: string;
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

/**
 * Build a mailto: link for quote requests.
 * @param email — Contact email from site settings (site.yaml)
 * @param packageName — Optional seminar package name for subject specificity
 */
export function buildQuoteMailto(email: string, packageName?: string): string {
  const subject = packageName
    ? `Demande de devis — ${packageName}`
    : 'Demande de devis — Séminaire';
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

/**
 * Build a mailto: link for event inquiries (non-seminar).
 * @param email — Contact email from site settings (site.yaml)
 */
export function buildEventContactMailto(email: string): string {
  const subject = 'Renseignements — Location de salle';
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export const poleConfigs: Record<Pole, PoleConfig> = {
  restaurant: {
    name: 'Restaurant',
    accent: '#E8603C',
    accentDark: '#C4452A',
    light: '#FFF3ED',
  },
  aventure: {
    name: 'Aventure',
    accent: '#7CB342',
    accentDark: '#5A8A2E',
    light: '#F0F7E6',
  },
  salle: {
    name: 'La Salle',
    accent: '#5B8DEF',
    accentDark: '#3D6FD1',
    light: '#EDF4FF',
  },
};

export function getCtaAccent(pole: Pole | null): string {
  if (!pole) return brandColors.soleil;
  return poleConfigs[pole].accent;
}
