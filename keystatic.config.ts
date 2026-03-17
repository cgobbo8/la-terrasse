import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: `${import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER}/${import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME}`,
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
    events: collection({
      label: 'Événements / Agenda',
      slugField: 'title',
      path: 'src/content/events/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nom de l\'événement', validation: { isRequired: true } } }),
        date: fields.date({ label: 'Date' }),
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
        reservationPhone: fields.text({ label: 'Téléphone réservation' }),
        philosophy_en: fields.text({ label: 'Philosophy (EN)', multiline: true }),
        philosophy_es: fields.text({ label: 'Filosofía (ES)', multiline: true }),
        menuSections: fields.array(
          fields.object({
            title: fields.text({ label: 'Titre de section (ex: Entrées)' }),
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
        capacitySeated: fields.integer({ label: 'Capacité assise', validation: { isRequired: true } }),
        capacityStanding: fields.integer({ label: 'Capacité debout', validation: { isRequired: true } }),
        surfaceM2: fields.integer({ label: 'Surface (m²)', validation: { isRequired: true } }),
        equipment: fields.array(
          fields.text({ label: 'Équipement' }),
          { label: 'Équipements disponibles', itemLabel: (props) => props.value || 'Équipement' },
        ),
        layoutOptions: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom de la configuration', validation: { isRequired: true } }),
            capacity: fields.integer({ label: 'Capacité pour cette configuration', validation: { isRequired: true } }),
          }),
          { label: 'Configurations possibles', itemLabel: (props) => props.fields.name.value || 'Configuration' },
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
        layoutOptions_en: fields.array(
          fields.object({
            name: fields.text({ label: 'Configuration name (EN)' }),
            capacity: fields.integer({ label: 'Capacity' }),
          }),
          { label: 'Layout options (EN)', itemLabel: (props) => props.fields.name.value || 'Layout' },
        ),
        layoutOptions_es: fields.array(
          fields.object({
            name: fields.text({ label: 'Nombre de configuración (ES)' }),
            capacity: fields.integer({ label: 'Capacidad' }),
          }),
          { label: 'Opciones de disposición (ES)', itemLabel: (props) => props.fields.name.value || 'Disposición' },
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
        promotionText: fields.text({ label: 'Promotion en cours' }),
        promotionText_en: fields.text({ label: 'Current promotion (EN)' }),
        promotionText_es: fields.text({ label: 'Promoción actual (ES)' }),
      },
    }),
  },
});
