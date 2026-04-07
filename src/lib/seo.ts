const BUSINESS_INFO = {
  name: 'La Terrasse — Base de loisirs de Saint-Ferréol',
  url: 'https://baseloisirs-saintferreol.fr',
  telephone: '+33602438641',
  email: 'contact@baseloisirs-saintferreol.fr',
  address: {
    streetAddress: '144 avenue de Carcassonne',
    addressLocality: 'Sorèze',
    postalCode: '81540',
    addressRegion: 'Occitanie',
    addressCountry: 'FR',
  },
  geo: {
    latitude: 43.4504,
    longitude: 2.0505,
  },
  image: 'https://baseloisirs-saintferreol.fr/og-image.jpg',
  hasMap: 'https://maps.google.com/?q=144+avenue+de+Carcassonne+81540+Soreze',
  areaServed: [
    // Grandes villes
    { '@type': 'City', name: 'Toulouse' },
    { '@type': 'City', name: 'Castres' },
    { '@type': 'City', name: 'Carcassonne' },
    { '@type': 'City', name: 'Albi' },
    { '@type': 'City', name: 'Montauban' },
    // Villes moyennes proches
    { '@type': 'City', name: 'Revel' },
    { '@type': 'City', name: 'Sorèze' },
    { '@type': 'City', name: 'Mazamet' },
    { '@type': 'City', name: 'Castelnaudary' },
    { '@type': 'City', name: 'Lavaur' },
    { '@type': 'City', name: 'Pamiers' },
    { '@type': 'City', name: 'Foix' },
    { '@type': 'City', name: 'Muret' },
    { '@type': 'City', name: 'Limoux' },
    { '@type': 'City', name: 'Dourgne' },
    { '@type': 'City', name: 'Puylaurens' },
    // Départements et région
    { '@type': 'AdministrativeArea', name: 'Tarn' },
    { '@type': 'AdministrativeArea', name: 'Haute-Garonne' },
    { '@type': 'AdministrativeArea', name: 'Aude' },
    { '@type': 'AdministrativeArea', name: 'Ariège' },
    { '@type': 'AdministrativeArea', name: 'Tarn-et-Garonne' },
    { '@type': 'AdministrativeArea', name: 'Occitanie' },
  ],
};

export function generateLocalBusinessLD(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS_INFO.name,
    alternateName: ['La Terrasse', 'La Terrasse Saint-Ferréol', 'Base de loisirs Saint-Ferréol', 'Base de loisirs de Saint-Ferréol'],
    url: BUSINESS_INFO.url,
    telephone: BUSINESS_INFO.telephone,
    email: BUSINESS_INFO.email,
    image: BUSINESS_INFO.image,
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS_INFO.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      ...BUSINESS_INFO.geo,
    },
    hasMap: BUSINESS_INFO.hasMap,
    areaServed: BUSINESS_INFO.areaServed,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
  });
}

export function generateRestaurantLD(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'La Terrasse — Restaurant au lac de Saint-Ferréol',
    url: `${BUSINESS_INFO.url}/restaurant`,
    telephone: BUSINESS_INFO.telephone,
    image: BUSINESS_INFO.image,
    servesCuisine: 'Tapas, burgers, salades, cuisine conviviale',
    priceRange: '€€',
    menu: `${BUSINESS_INFO.url}/restaurant/carte`,
    hasMap: BUSINESS_INFO.hasMap,
    areaServed: BUSINESS_INFO.areaServed,
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS_INFO.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      ...BUSINESS_INFO.geo,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '12:00',
        closes: '14:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '19:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '12:00',
        closes: '14:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '19:00',
        closes: '21:30',
      },
    ],
  });
}

export function generateEventVenueLD(venue: {
  capacityMax: number;
  amenities: readonly string[];
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    name: 'La Terrasse — La Salle',
    url: `${BUSINESS_INFO.url}/la-salle`,
    telephone: BUSINESS_INFO.telephone,
    email: BUSINESS_INFO.email,
    image: BUSINESS_INFO.image,
    maximumAttendeeCapacity: venue.capacityMax,
    amenityFeature: venue.amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS_INFO.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      ...BUSINESS_INFO.geo,
    },
  });
}

export function generateSportsActivityLD(activity: {
  name: string;
  description: string;
  url: string;
  image?: string;
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: activity.name,
    description: activity.description,
    url: activity.url,
    image: activity.image ?? BUSINESS_INFO.image,
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS_INFO.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      ...BUSINESS_INFO.geo,
    },
  });
}

export function generateFAQLD(faqs: { question: string; answer: string }[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}
