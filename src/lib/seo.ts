const BUSINESS_INFO = {
  name: 'La Terrasse — Base de loisirs de Saint-Ferréol',
  url: 'https://laterrasse-saintferreol.fr',
  telephone: '+33000000000',
  email: 'contact@laterrasse-saintferreol.fr',
  address: {
    streetAddress: 'Lac de Saint-Ferréol',
    addressLocality: 'Saint-Ferréol',
    postalCode: '31250',
    addressRegion: 'Occitanie',
    addressCountry: 'FR',
  },
  geo: {
    latitude: 43.4504,
    longitude: 2.0505,
  },
  image: 'https://laterrasse-saintferreol.fr/og-image.jpg',
};

export function generateLocalBusinessLD(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS_INFO.name,
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
  });
}

export function generateRestaurantLD(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'La Terrasse — Restaurant',
    url: `${BUSINESS_INFO.url}/restaurant`,
    telephone: BUSINESS_INFO.telephone,
    image: BUSINESS_INFO.image,
    servesCuisine: 'Cuisine locale et de terroir',
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

export function generateEventVenueLD(venue: {
  capacitySeated: number;
  capacityStanding: number;
  amenities: readonly string[];
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    name: 'La Terrasse — Salle de séminaire',
    url: `${BUSINESS_INFO.url}/evenements`,
    telephone: BUSINESS_INFO.telephone,
    email: BUSINESS_INFO.email,
    image: BUSINESS_INFO.image,
    maximumAttendeeCapacity: venue.capacityStanding,
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
