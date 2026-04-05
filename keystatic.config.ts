import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: 'cgobbo8/la-terrasse',
      },
  ui: {
    brand: { name: 'La Terrasse — CMS' },
  },

  collections: {
    // ========================================
    // Producers (Restaurant pole)
    // Stored as: src/content/producers/jean-pierre-dubois.yaml
    // ========================================
    producers: collection({
      label: 'Producteurs locaux',
      slugField: 'name',
      path: 'src/content/producers/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Nom du producteur', validation: { isRequired: true } } }),
        product: fields.text({ label: 'Produit / spécialité', validation: { isRequired: true } }),
        story: fields.text({ label: 'Histoire (2–3 phrases)', multiline: true, validation: { isRequired: true } }),
        photo: fields.image({
          label: 'Portrait',
          directory: 'public/images/producers',
          publicPath: '/images/producers/',
        }),
        location: fields.text({ label: 'Lieu (ex: Saint-Félix de Lauragais)' }),
        distance: fields.integer({ label: 'Distance depuis Saint-Ferréol (km)' }),
        website: fields.url({ label: 'Site web du producteur' }),
        // i18n
        product_en: fields.text({ label: 'Product (EN)' }),
        product_es: fields.text({ label: 'Producto (ES)' }),
        story_en: fields.text({ label: 'Story (EN)', multiline: true }),
        story_es: fields.text({ label: 'Historia (ES)', multiline: true }),
        order: fields.integer({ label: 'Ordre d\'affichage', defaultValue: 0 }),
        visible: fields.checkbox({ label: 'Visible sur le site', defaultValue: true }),
      },
    }),

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
        price: fields.text({ label: 'Prix affiché sur la carte (ex: 25€)' }),
        priceDetails: fields.text({ label: 'Détails prix carte (ex: par personne)', multiline: true }),
        priceDetails_en: fields.text({ label: 'Price details card (EN)' }),
        priceDetails_es: fields.text({ label: 'Detalles de precio tarjeta (ES)' }),
        priceTiers: fields.array(
          fields.object({
            label: fields.text({ label: 'Durée / formule (ex: 1h, Demi-journée)', validation: { isRequired: true } }),
            price: fields.text({ label: 'Prix (ex: 10€)', validation: { isRequired: true } }),
            label_en: fields.text({ label: 'Duration / formula (EN)' }),
            label_es: fields.text({ label: 'Duración / fórmula (ES)' }),
          }),
          { label: 'Grille tarifaire (si plusieurs options)', itemLabel: (props) => `${props.fields.label.value}: ${props.fields.price.value}` || 'Tarif' },
        ),
        isPremium: fields.checkbox({ label: 'Activité phare (éligible offre journée)', defaultValue: false }),
        duration: fields.text({ label: 'Durée (ex: 1h, 2h, demi-journée)' }),
        minPersons: fields.integer({ label: 'Nombre minimum de personnes', defaultValue: 1 }),
        maxPersons: fields.integer({ label: 'Nombre maximum de personnes' }),
        age_min: fields.integer({ label: 'Âge minimum (ans)', defaultValue: 0 }),
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
    // Seminar packs (La Salle pole)
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
        // i18n — subtitle, includes, priceFrom
        subtitle_en: fields.text({ label: 'Subtitle (EN)' }),
        subtitle_es: fields.text({ label: 'Subtítulo (ES)' }),
        includes_en: fields.array(
          fields.text({ label: 'Included item (EN)' }),
          { label: 'What\'s included (EN)', itemLabel: (props) => props.value || 'Item' },
        ),
        includes_es: fields.array(
          fields.text({ label: 'Elemento incluido (ES)' }),
          { label: 'Qué incluye (ES)', itemLabel: (props) => props.value || 'Elemento' },
        ),
        priceFrom_en: fields.text({ label: 'Price from (EN)' }),
        priceFrom_es: fields.text({ label: 'Precio desde (ES)' }),
        features: fields.object({
          salleEquipee: fields.checkbox({ label: 'Salle équipée', defaultValue: true }),
          videoprojecteur: fields.checkbox({ label: 'Vidéoprojecteur', defaultValue: true }),
          wifi: fields.checkbox({ label: 'Wi-Fi', defaultValue: true }),
          parking: fields.checkbox({ label: 'Parking', defaultValue: true }),
          petitDejeuner: fields.checkbox({ label: 'Petit-déjeuner d\'accueil', defaultValue: false }),
          dejeuner: fields.checkbox({ label: 'Déjeuner terroir', defaultValue: false }),
          pausesCafe: fields.checkbox({ label: 'Pauses café', defaultValue: false }),
          teamBuilding: fields.checkbox({ label: 'Activités team building', defaultValue: false }),
          encadrement: fields.checkbox({ label: 'Encadrement dédié', defaultValue: false }),
        }, { label: 'Fonctionnalités (comparateur)' }),
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
    // ========================================
    // Nearby places (À proximité)
    // Stored as: src/content/nearby/abbaye-soreze.yaml
    // ========================================
    nearby: collection({
      label: 'À proximité',
      slugField: 'name',
      path: 'src/content/nearby/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Nom du lieu', validation: { isRequired: true } } }),
        categories: fields.multiselect({
          label: 'Catégories',
          options: [
            { label: 'Culture', value: 'culture' },
            { label: 'Patrimoine', value: 'patrimoine' },
            { label: 'Nature', value: 'nature' },
            { label: 'Gastronomie', value: 'gastronomie' },
            { label: 'Activités', value: 'activites' },
            { label: 'Hébergement', value: 'hebergement' },
          ],
          defaultValue: ['culture'],
        }),
        description: fields.text({ label: 'Description courte (1-2 phrases)', multiline: true, validation: { isRequired: true } }),
        image: fields.image({
          label: 'Photo',
          directory: 'public/images/nearby',
          publicPath: '/images/nearby/',
        }),
        url: fields.url({ label: 'Site web du lieu' }),
        // i18n
        name_en: fields.text({ label: 'Name (EN)' }),
        name_es: fields.text({ label: 'Nombre (ES)' }),
        description_en: fields.text({ label: 'Description (EN)', multiline: true }),
        description_es: fields.text({ label: 'Descripción (ES)', multiline: true }),
        order: fields.integer({ label: 'Ordre d\'affichage', defaultValue: 0 }),
        visible: fields.checkbox({ label: 'Visible sur le site', defaultValue: true }),
      },
    }),

    events: collection({
      label: 'Événements / Agenda',
      slugField: 'title',
      path: 'src/content/events/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nom de l\'événement', validation: { isRequired: true } } }),
        date: fields.date({ label: 'Date' }),
        startTime: fields.text({ label: 'Heure de début (ex: 19:00)' }),
        endTime: fields.text({ label: 'Heure de fin (ex: 22:00)' }),
        category: fields.select({
          label: 'Catégorie',
          options: [
            { label: 'Concert', value: 'concert' },
            { label: 'Soirée à thème', value: 'soiree-theme' },
            { label: 'Festival / Fête', value: 'festival' },
            { label: 'Marché / Salon', value: 'marche' },
            { label: 'Autre', value: 'autre' },
          ],
          defaultValue: 'autre',
        }),
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
        openingHours_en: fields.text({ label: 'Opening hours (EN)', multiline: true }),
        openingHours_es: fields.text({ label: 'Horarios de apertura (ES)', multiline: true }),
        reservationPhone: fields.text({ label: 'Téléphone réservation' }),
        philosophy_en: fields.text({ label: 'Philosophy (EN)', multiline: true }),
        philosophy_es: fields.text({ label: 'Filosofía (ES)', multiline: true }),
        menuSections: fields.array(
          fields.object({
            group: fields.select({
              label: 'Moment',
              defaultValue: 'midi',
              options: [
                { label: 'Midi', value: 'midi' },
                { label: 'Desserts', value: 'desserts' },
                { label: 'Soir', value: 'soir' },
                { label: 'Menu enfant', value: 'enfant' },
              ],
            }),
            title: fields.text({ label: 'Titre de section (ex: Burgers, Salades)' }),
            title_en: fields.text({ label: 'Section title (EN)' }),
            title_es: fields.text({ label: 'Título de sección (ES)' }),
            dishes: fields.array(
              fields.object({
                name: fields.text({ label: 'Nom du plat' }),
                description: fields.text({ label: 'Description' }),
                price: fields.text({ label: 'Prix (ex: 12.50)' }),
                tags: fields.array(
                  fields.text({ label: 'Tag' }),
                  { label: 'Tags alimentaires', itemLabel: (props) => props.value || 'Tag' },
                ),
                name_en: fields.text({ label: 'Name (EN)' }),
                name_es: fields.text({ label: 'Nombre (ES)' }),
                description_en: fields.text({ label: 'Description (EN)' }),
                description_es: fields.text({ label: 'Descripción (ES)' }),
              }),
              { label: 'Plats de la section', itemLabel: (props) => props.fields.name.value || 'Plat' },
            ),
          }),
          { label: 'Sections du menu', itemLabel: (props) => props.fields.title.value || 'Section' },
        ),
      },
    }),

    // ========================================
    // Venue info (salle séminaire)
    // Stored as: src/content/venue/info.yaml
    // ========================================
    venue: singleton({
      label: 'Salle & Équipements',
      path: 'src/content/venue/info',
      format: { data: 'yaml' },
      schema: {
        capacityMax: fields.integer({ label: 'Capacité maximale (personnes)', validation: { isRequired: true } }),
        surfaceM2: fields.integer({ label: 'Surface (m²)', validation: { isRequired: true } }),
        equipment: fields.array(
          fields.text({ label: 'Équipement' }),
          { label: 'Équipements disponibles', itemLabel: (props) => props.value || 'Équipement' },
        ),
        layoutSuggestions: fields.array(
          fields.text({ label: 'Disposition' }),
          { label: 'Idées de disposition', itemLabel: (props) => props.value || 'Disposition' },
        ),
        // i18n
        equipment_en: fields.array(
          fields.text({ label: 'Equipment (EN)' }),
          { label: 'Equipment (EN)', itemLabel: (props) => props.value || 'Equipment' },
        ),
        equipment_es: fields.array(
          fields.text({ label: 'Equipamiento (ES)' }),
          { label: 'Equipamiento (ES)', itemLabel: (props) => props.value || 'Equipamiento' },
        ),
        layoutSuggestions_en: fields.array(
          fields.text({ label: 'Layout suggestion (EN)' }),
          { label: 'Layout ideas (EN)', itemLabel: (props) => props.value || 'Layout' },
        ),
        layoutSuggestions_es: fields.array(
          fields.text({ label: 'Disposición (ES)' }),
          { label: 'Ideas de disposición (ES)', itemLabel: (props) => props.value || 'Disposición' },
        ),
      },
    }),

    // ========================================
    // Legal mentions
    // Stored as: src/content/legal/mentions-legales.yaml
    // ========================================
    legalMentions: singleton({
      label: 'Mentions légales',
      path: 'src/content/legal/mentions-legales',
      format: { data: 'yaml' },
      schema: {
        companyName: fields.text({ label: 'Raison sociale', validation: { isRequired: true } }),
        legalForm: fields.text({ label: 'Forme juridique (SAS, SARL, EURL…)' }),
        address: fields.text({ label: 'Adresse complète', multiline: true }),
        siret: fields.text({ label: 'N° SIRET' }),
        director: fields.text({ label: 'Directeur de publication' }),
        phone: fields.text({ label: 'Téléphone' }),
        email: fields.text({ label: 'Email de contact' }),
        rgpdEmail: fields.text({ label: 'Email dédié RGPD (si différent)' }),
      },
    }),

    // ========================================
    // Seminars pricing (configurator)
    // Stored as: src/content/seminars-pricing/info.yaml
    // ========================================
    seminarsPricing: singleton({
      label: 'Tarifs Séminaires',
      path: 'src/content/seminars-pricing/info',
      format: { data: 'yaml' },
      schema: {
        flatJournee: fields.integer({
          label: 'Forfait Salle sèche — Journée (€ HT)',
          description: 'Location de salle uniquement, sans restauration',
          defaultValue: 600,
          validation: { isRequired: true },
        }),
        flatSoiree: fields.integer({
          label: 'Forfait Salle sèche — Soirée (€ HT)',
          description: 'Location de salle soirée sans restauration',
          defaultValue: 500,
          validation: { isRequired: true },
        }),
        priceMealFull: fields.integer({
          label: 'Repas complet (€ HT / pers.)',
          defaultValue: 45,
          validation: { isRequired: true },
        }),
        priceMealApero: fields.integer({
          label: 'Apéro dînatoire (€ HT / pers.)',
          defaultValue: 35,
          validation: { isRequired: true },
        }),
        priceTeamBuilding: fields.integer({
          label: 'Supplément Team Building (€ HT / pers.)',
          description: 'Demi-journée activités de cohésion',
          defaultValue: 25,
          validation: { isRequired: true },
        }),
        priceExtraHour: fields.integer({
          label: 'Heure supplémentaire soirée (€ HT / h)',
          description: 'Après 23h',
          defaultValue: 50,
          validation: { isRequired: true },
        }),
        minRepasComplet: fields.integer({
          label: 'Minimum personnes — Repas complet',
          defaultValue: 12,
          validation: { isRequired: true },
        }),
        minApero: fields.integer({
          label: 'Minimum personnes — Apéro dînatoire',
          defaultValue: 15,
          validation: { isRequired: true },
        }),
        maxParticipants: fields.integer({
          label: 'Maximum de participants',
          defaultValue: 80,
          validation: { isRequired: true },
        }),
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
        // Seasonal info fields
        openingHours: fields.text({ label: 'Horaires d\'ouverture', multiline: true }),
        openingHours_en: fields.text({ label: 'Opening hours (EN)', multiline: true }),
        openingHours_es: fields.text({ label: 'Horarios de apertura (ES)', multiline: true }),
        seasonalMessage: fields.text({ label: 'Message saisonnier', multiline: true }),
        seasonalMessage_en: fields.text({ label: 'Seasonal message (EN)', multiline: true }),
        seasonalMessage_es: fields.text({ label: 'Mensaje estacional (ES)', multiline: true }),
        currentSeason: fields.select({
          label: 'Saison actuelle',
          options: [
            { label: 'Printemps', value: 'printemps' },
            { label: 'Été', value: 'ete' },
            { label: 'Automne', value: 'automne' },
            { label: 'Hiver', value: 'hiver' },
          ],
          defaultValue: 'printemps',
        }),
        passJourneeDiscount: fields.integer({
          label: 'Réduction Pass Journée (%)',
          description: 'Pourcentage de réduction au restaurant avec le Pass Journée (ex: 20 pour −20%)',
          defaultValue: 20,
        }),
        promotionText: fields.text({ label: 'Promotion en cours' }),
        promotionText_en: fields.text({ label: 'Current promotion (EN)' }),
        promotionText_es: fields.text({ label: 'Promoción actual (ES)' }),
      },
    }),
  },
});
