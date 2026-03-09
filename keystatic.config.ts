import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'La Terrasse — CMS' },
  },

  collections: {
    // ========================================
    // Activities (Aventure pole)
    // Stored as: src/content/activities/pedalo.mdx
    // ========================================
    activities: collection({
      label: 'Activités',
      slugField: 'title',
      path: 'src/content/activities/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nom de l\'activité', validation: { isRequired: true } } }),
        description: fields.text({ label: 'Description courte', multiline: true }),
        category: fields.select({
          label: 'Catégorie',
          options: [
            { label: 'Aquatique', value: 'aquatique' },
            { label: 'Terrestre', value: 'terrestre' },
          ],
          defaultValue: 'terrestre',
        }),
        price: fields.text({ label: 'Prix (ex: 25€/h)' }),
        priceDetails: fields.text({ label: 'Détails prix (ex: pour 4-5 personnes)', multiline: true }),
        duration: fields.text({ label: 'Durée (ex: 1h, 2h, demi-journée)' }),
        minPersons: fields.integer({ label: 'Nombre minimum de personnes', defaultValue: 1 }),
        maxPersons: fields.integer({ label: 'Nombre maximum de personnes' }),
        image: fields.image({
          label: 'Photo principale',
          directory: 'public/images/activities',
          publicPath: '/images/activities/',
        }),
        // i18n
        title_en: fields.text({ label: 'Title (EN)' }),
        title_es: fields.text({ label: 'Título (ES)' }),
        description_en: fields.text({ label: 'Description (EN)', multiline: true }),
        description_es: fields.text({ label: 'Descripción (ES)', multiline: true }),
        order: fields.integer({ label: 'Ordre d\'affichage', defaultValue: 0 }),
        visible: fields.checkbox({ label: 'Visible sur le site', defaultValue: true }),
        content: fields.mdx({
          label: 'Description complète',
        }),
      },
    }),

    // ========================================
    // Seminar packs (Événements pole)
    // Stored as: src/content/seminars/seminaire-simple.mdx
    // ========================================
    seminars: collection({
      label: 'Packs Séminaire',
      slugField: 'title',
      path: 'src/content/seminars/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nom du pack', validation: { isRequired: true } } }),
        subtitle: fields.text({ label: 'Sous-titre' }),
        description: fields.text({ label: 'Description courte', multiline: true }),
        includes: fields.array(
          fields.text({ label: 'Élément inclus' }),
          { label: 'Ce qui est inclus', itemLabel: (props) => props.value || 'Élément' },
        ),
        priceFrom: fields.text({ label: 'À partir de (prix indicatif)' }),
        image: fields.image({
          label: 'Photo',
          directory: 'public/images/seminars',
          publicPath: '/images/seminars/',
        }),
        // i18n
        title_en: fields.text({ label: 'Title (EN)' }),
        title_es: fields.text({ label: 'Título (ES)' }),
        description_en: fields.text({ label: 'Description (EN)', multiline: true }),
        description_es: fields.text({ label: 'Descripción (ES)', multiline: true }),
        order: fields.integer({ label: 'Ordre d\'affichage', defaultValue: 0 }),
        visible: fields.checkbox({ label: 'Visible sur le site', defaultValue: true }),
        content: fields.mdx({
          label: 'Description complète',
        }),
      },
    }),

    // ========================================
    // Events / Agenda
    // Stored as: src/content/events/soiree-tapas.mdx
    // ========================================
    events: collection({
      label: 'Événements / Agenda',
      slugField: 'title',
      path: 'src/content/events/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nom de l\'événement', validation: { isRequired: true } } }),
        date: fields.date({ label: 'Date' }),
        description: fields.text({ label: 'Description', multiline: true }),
        image: fields.image({
          label: 'Visuel',
          directory: 'public/images/events',
          publicPath: '/images/events/',
        }),
        // i18n
        title_en: fields.text({ label: 'Title (EN)' }),
        title_es: fields.text({ label: 'Título (ES)' }),
        description_en: fields.text({ label: 'Description (EN)', multiline: true }),
        description_es: fields.text({ label: 'Descripción (ES)', multiline: true }),
        visible: fields.checkbox({ label: 'Visible sur le site', defaultValue: true }),
        content: fields.mdx({
          label: 'Contenu',
        }),
      },
    }),
  },

  singletons: {
    // ========================================
    // Restaurant info
    // Stored as: src/content/restaurant/info.yaml
    // ========================================
    restaurant: singleton({
      label: 'Restaurant',
      path: 'src/content/restaurant/info',
      schema: {
        philosophy: fields.text({ label: 'Philosophie / pitch', multiline: true }),
        menuUrl: fields.text({ label: 'Lien vers le menu (PDF ou page)' }),
        openingHours: fields.text({ label: 'Horaires d\'ouverture', multiline: true }),
        reservationPhone: fields.text({ label: 'Téléphone réservation' }),
        philosophy_en: fields.text({ label: 'Philosophy (EN)', multiline: true }),
        philosophy_es: fields.text({ label: 'Filosofía (ES)', multiline: true }),
      },
    }),

    // ========================================
    // Venue info (salle séminaire)
    // Stored as: src/content/venue/info.yaml
    // ========================================
    venue: singleton({
      label: 'Salle & Équipements',
      path: 'src/content/venue/info',
      schema: {
        capacity: fields.text({ label: 'Capacité' }),
        surface: fields.text({ label: 'Surface' }),
        equipment: fields.array(
          fields.text({ label: 'Équipement' }),
          { label: 'Équipements disponibles', itemLabel: (props) => props.value || 'Équipement' },
        ),
        configurations: fields.text({ label: 'Configurations possibles', multiline: true }),
      },
    }),

    // ========================================
    // Site settings
    // Stored as: src/content/settings/site.yaml
    // ========================================
    settings: singleton({
      label: 'Paramètres du site',
      path: 'src/content/settings/site',
      schema: {
        siteName: fields.text({ label: 'Nom du site', defaultValue: 'La Terrasse — Base de loisirs de Saint-Ferréol' }),
        phone: fields.text({ label: 'Téléphone principal' }),
        email: fields.text({ label: 'Email de contact' }),
        address: fields.text({ label: 'Adresse', multiline: true }),
        googleMapsUrl: fields.text({ label: 'Lien Google Maps' }),
        facebook: fields.text({ label: 'Facebook URL' }),
        instagram: fields.text({ label: 'Instagram URL' }),
      },
    }),
  },
});
