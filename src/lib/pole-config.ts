export type Pole = 'restaurant' | 'aventure' | 'evenements';

export interface PoleConfig {
  name: string;
  accent: string;
  light: string;
  ctaLabel: string;
  ctaHref: string;
}

export const poleConfigs: Record<Pole, PoleConfig> = {
  restaurant: {
    name: 'Restaurant',
    accent: '#2D2B1B',
    light: '#f5f0e8',
    ctaLabel: 'Réserver ma table',
    ctaHref: 'tel:+33000000000',
  },
  aventure: {
    name: 'Aventure',
    accent: '#537b47',
    light: '#eef5ec',
    ctaLabel: 'Réserver mon aventure',
    ctaHref: 'tel:+33000000000',
  },
  evenements: {
    name: 'Événements',
    accent: '#3d4969',
    light: '#edf0f5',
    ctaLabel: 'Demander un devis',
    ctaHref: 'mailto:contact@laterrasse-saintferreol.fr',
  },
};
