import { config, collection, singleton, fields } from '@keystatic/core';

/**
 * Helper: i18n text field with FR/EN/ES laid out side by side (layout 4-4-4).
 * Pass multiline=true for paragraphs.
 */
const i18n = (label: string, multiline = false) =>
  fields.object(
    {
      fr: fields.text({ label: 'Français', multiline }),
      en: fields.text({ label: 'English', multiline }),
      es: fields.text({ label: 'Español', multiline }),
    },
    { label, layout: [4, 4, 4] },
  );

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: 'cgobbo8/la-terrasse',
      },
  ui: {
    brand: { name: 'La Terrasse — CMS' },
    navigation: {
      'Contenu géré': ['events', 'activities', 'seminars', 'producers', 'nearby'],
      'Restaurant': ['restaurant', 'restaurantHubTexts', 'restaurantMenuTexts', 'producteursTexts'],
      'Aventure': ['aventureHubTexts'],
      'La Salle': ['venue', 'seminarsPricing', 'salleHubTexts'],
      'Homepage': ['homepageTexts'],
      'Paramètres': ['settings', 'legalMentions'],
    },
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
        info: fields.object(
          {
            photo: fields.image({
              label: 'Portrait',
              directory: 'public/images/producers',
              publicPath: '/images/producers/',
            }),
            location: fields.text({ label: 'Lieu (ex: Saint-Félix de Lauragais)' }),
            distance: fields.integer({ label: 'Distance depuis Saint-Ferréol (km)' }),
            website: fields.url({ label: 'Site web du producteur' }),
          },
          { label: 'Informations', layout: [12, 8, 4, 12] },
        ),
        product: fields.object(
          {
            fr: fields.text({ label: 'Français', validation: { isRequired: true } }),
            en: fields.text({ label: 'English' }),
            es: fields.text({ label: 'Español' }),
          },
          { label: 'Produit / spécialité', layout: [4, 4, 4] },
        ),
        story: fields.object(
          {
            fr: fields.text({ label: 'Français', multiline: true, validation: { isRequired: true } }),
            en: fields.text({ label: 'English', multiline: true }),
            es: fields.text({ label: 'Español', multiline: true }),
          },
          { label: 'Histoire (2–3 phrases)', layout: [4, 4, 4] },
        ),
        meta: fields.object(
          {
            order: fields.integer({ label: 'Ordre d\'affichage', defaultValue: 0 }),
            visible: fields.checkbox({ label: 'Visible sur le site', defaultValue: true }),
          },
          { label: 'Affichage', layout: [6, 6] },
        ),
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
        title: fields.slug({ name: { label: 'Nom de l\'activité (FR / slug)', validation: { isRequired: true } } }),
        title_en: fields.text({ label: 'Title (EN)' }),
        title_es: fields.text({ label: 'Título (ES)' }),
        category: fields.select({
          label: 'Catégorie',
          options: [
            { label: 'Aquatique', value: 'aquatique' },
            { label: 'Terrestre', value: 'terrestre' },
          ],
          defaultValue: 'terrestre',
        }),
        description: fields.object(
          {
            fr: fields.text({ label: 'Français', multiline: true }),
            en: fields.text({ label: 'English', multiline: true }),
            es: fields.text({ label: 'Español', multiline: true }),
          },
          { label: 'Description courte', layout: [4, 4, 4] },
        ),
        pricing: fields.object(
          {
            price: fields.text({ label: 'Prix affiché sur la carte (ex: 25€)' }),
            priceDetails: fields.object(
              {
                fr: fields.text({ label: 'Français' }),
                en: fields.text({ label: 'English' }),
                es: fields.text({ label: 'Español' }),
              },
              { label: 'Détails prix carte (ex: par personne)', layout: [4, 4, 4] },
            ),
            priceTiers: fields.array(
              fields.object({
                label: fields.object(
                  {
                    fr: fields.text({ label: 'Français' }),
                    en: fields.text({ label: 'English' }),
                    es: fields.text({ label: 'Español' }),
                  },
                  { label: 'Durée / formule', layout: [4, 4, 4] },
                ),
                price: fields.text({ label: 'Prix (ex: 10€)', validation: { isRequired: true } }),
              }),
              {
                label: 'Grille tarifaire (si plusieurs options)',
                itemLabel: (props) => `${props.fields.label.fields.fr.value || 'Tarif'}: ${props.fields.price.value}`,
              },
            ),
          },
          { label: 'Tarifs' },
        ),
        practical: fields.object(
          {
            duration: fields.text({ label: 'Durée (ex: 1h, 2h, demi-journée)' }),
            age_min: fields.integer({ label: 'Âge minimum (ans)', defaultValue: 0 }),
            minPersons: fields.integer({ label: 'Nombre minimum de personnes', defaultValue: 1 }),
            maxPersons: fields.integer({ label: 'Nombre maximum de personnes' }),
            isPremium: fields.checkbox({ label: 'Activité phare (éligible offre journée)', defaultValue: false }),
            image: fields.image({
              label: 'Photo principale',
              directory: 'public/images/activities',
              publicPath: '/images/activities/',
            }),
          },
          { label: 'Informations pratiques', layout: [6, 3, 3, 3, 6, 12] },
        ),
        meta: fields.object(
          {
            order: fields.integer({ label: 'Ordre d\'affichage', defaultValue: 0 }),
            visible: fields.checkbox({ label: 'Visible sur le site', defaultValue: true }),
          },
          { label: 'Affichage', layout: [6, 6] },
        ),
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
        title: fields.slug({ name: { label: 'Nom du pack (FR / slug)', validation: { isRequired: true } } }),
        title_en: fields.text({ label: 'Title (EN)' }),
        title_es: fields.text({ label: 'Título (ES)' }),
        subtitle: fields.object(
          {
            fr: fields.text({ label: 'Français' }),
            en: fields.text({ label: 'English' }),
            es: fields.text({ label: 'Español' }),
          },
          { label: 'Sous-titre', layout: [4, 4, 4] },
        ),
        description: fields.object(
          {
            fr: fields.text({ label: 'Français', multiline: true }),
            en: fields.text({ label: 'English', multiline: true }),
            es: fields.text({ label: 'Español', multiline: true }),
          },
          { label: 'Description courte', layout: [4, 4, 4] },
        ),
        includes: fields.object(
          {
            fr: fields.array(
              fields.text({ label: 'Élément inclus' }),
              { label: 'Français', itemLabel: (props) => props.value || 'Élément' },
            ),
            en: fields.array(
              fields.text({ label: 'Included item' }),
              { label: 'English', itemLabel: (props) => props.value || 'Item' },
            ),
            es: fields.array(
              fields.text({ label: 'Elemento incluido' }),
              { label: 'Español', itemLabel: (props) => props.value || 'Elemento' },
            ),
          },
          { label: 'Ce qui est inclus', layout: [4, 4, 4] },
        ),
        priceFrom: fields.object(
          {
            fr: fields.text({ label: 'Français' }),
            en: fields.text({ label: 'English' }),
            es: fields.text({ label: 'Español' }),
          },
          { label: 'À partir de (prix indicatif)', layout: [4, 4, 4] },
        ),
        features: fields.object(
          {
            salleEquipee: fields.checkbox({ label: 'Salle équipée', defaultValue: true }),
            videoprojecteur: fields.checkbox({ label: 'Vidéoprojecteur', defaultValue: true }),
            wifi: fields.checkbox({ label: 'Wi-Fi', defaultValue: true }),
            petitDejeuner: fields.checkbox({ label: 'Petit-déjeuner d\'accueil', defaultValue: false }),
            dejeuner: fields.checkbox({ label: 'Déjeuner terroir', defaultValue: false }),
            pausesCafe: fields.checkbox({ label: 'Pauses café', defaultValue: false }),
            teamBuilding: fields.checkbox({ label: 'Activités team building', defaultValue: false }),
            encadrement: fields.checkbox({ label: 'Encadrement dédié', defaultValue: false }),
          },
          { label: 'Fonctionnalités (comparateur)' },
        ),
        meta: fields.object(
          {
            order: fields.integer({ label: 'Ordre d\'affichage', defaultValue: 0 }),
            visible: fields.checkbox({ label: 'Visible sur le site', defaultValue: true }),
          },
          { label: 'Affichage', layout: [6, 6] },
        ),
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
        name: fields.slug({ name: { label: 'Nom du lieu (FR / slug)', validation: { isRequired: true } } }),
        name_en: fields.text({ label: 'Nom (EN)' }),
        name_es: fields.text({ label: 'Nombre (ES)' }),
        info: fields.object(
          {
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
            image: fields.image({
              label: 'Photo',
              directory: 'public/images/nearby',
              publicPath: '/images/nearby/',
            }),
            url: fields.url({ label: 'Site web du lieu' }),
          },
          { label: 'Informations', layout: [12, 12, 12] },
        ),
        description: fields.object(
          {
            fr: fields.text({ label: 'Français', multiline: true, validation: { isRequired: true } }),
            en: fields.text({ label: 'English', multiline: true }),
            es: fields.text({ label: 'Español', multiline: true }),
          },
          { label: 'Description courte (1-2 phrases)', layout: [4, 4, 4] },
        ),
        meta: fields.object(
          {
            order: fields.integer({ label: 'Ordre d\'affichage', defaultValue: 0 }),
            visible: fields.checkbox({ label: 'Visible sur le site', defaultValue: true }),
          },
          { label: 'Affichage', layout: [6, 6] },
        ),
      },
    }),

    events: collection({
      label: 'Événements / Agenda',
      slugField: 'title',
      path: 'src/content/events/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nom de l\'événement (FR / slug)', validation: { isRequired: true } } }),
        title_en: fields.text({ label: 'Title (EN)' }),
        title_es: fields.text({ label: 'Título (ES)' }),
        schedule: fields.object(
          {
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
          },
          { label: 'Date & catégorie', layout: [6, 3, 3, 12] },
        ),
        description: fields.object(
          {
            fr: fields.text({ label: 'Français', multiline: true }),
            en: fields.text({ label: 'English', multiline: true }),
            es: fields.text({ label: 'Español', multiline: true }),
          },
          { label: 'Description', layout: [4, 4, 4] },
        ),
        meta: fields.object(
          {
            highlighted: fields.checkbox({ label: 'Mettre en avant (style doré)', defaultValue: false }),
            visible: fields.checkbox({ label: 'Visible sur le site', defaultValue: true }),
          },
          { label: 'Affichage', layout: [6, 6] },
        ),
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
            title: fields.object(
              {
                fr: fields.text({ label: 'Français' }),
                en: fields.text({ label: 'English' }),
                es: fields.text({ label: 'Español' }),
              },
              { label: 'Titre de section (ex: Burgers, Salades)', layout: [4, 4, 4] },
            ),
            dishes: fields.array(
              fields.object({
                name: fields.object(
                  {
                    fr: fields.text({ label: 'Français' }),
                    en: fields.text({ label: 'English' }),
                    es: fields.text({ label: 'Español' }),
                  },
                  { label: 'Nom du plat', layout: [4, 4, 4] },
                ),
                description: fields.object(
                  {
                    fr: fields.text({ label: 'Français' }),
                    en: fields.text({ label: 'English' }),
                    es: fields.text({ label: 'Español' }),
                  },
                  { label: 'Description', layout: [4, 4, 4] },
                ),
                price: fields.text({ label: 'Prix (ex: 12.50)' }),
                tags: fields.array(
                  fields.text({ label: 'Tag' }),
                  { label: 'Tags alimentaires', itemLabel: (props) => props.value || 'Tag' },
                ),
              }),
              {
                label: 'Plats de la section',
                itemLabel: (props) => props.fields.name.fields.fr.value || 'Plat',
              },
            ),
          }),
          {
            label: 'Sections du menu',
            itemLabel: (props) => props.fields.title.fields.fr.value || 'Section',
          },
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
        space: fields.object(
          {
            capacityMax: fields.integer({ label: 'Capacité maximale (personnes)', validation: { isRequired: true } }),
            surfaceM2: fields.integer({ label: 'Surface (m²)', validation: { isRequired: true } }),
          },
          { label: 'Espace', layout: [6, 6] },
        ),
        equipment: fields.object(
          {
            fr: fields.array(
              fields.text({ label: 'Équipement' }),
              { label: 'Français', itemLabel: (props) => props.value || 'Équipement' },
            ),
            en: fields.array(
              fields.text({ label: 'Equipment' }),
              { label: 'English', itemLabel: (props) => props.value || 'Equipment' },
            ),
            es: fields.array(
              fields.text({ label: 'Equipamiento' }),
              { label: 'Español', itemLabel: (props) => props.value || 'Equipamiento' },
            ),
          },
          { label: 'Équipements disponibles', layout: [4, 4, 4] },
        ),
        layoutSuggestions: fields.object(
          {
            fr: fields.array(
              fields.text({ label: 'Disposition' }),
              { label: 'Français', itemLabel: (props) => props.value || 'Disposition' },
            ),
            en: fields.array(
              fields.text({ label: 'Layout' }),
              { label: 'English', itemLabel: (props) => props.value || 'Layout' },
            ),
            es: fields.array(
              fields.text({ label: 'Disposición' }),
              { label: 'Español', itemLabel: (props) => props.value || 'Disposición' },
            ),
          },
          { label: 'Idées de disposition', layout: [4, 4, 4] },
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
        forfaits: fields.object(
          {
            flatJournee: fields.integer({
              label: 'Journée entière (€ HT)',
              description: 'Location de salle uniquement, 8h–18h',
              defaultValue: 600,
              validation: { isRequired: true },
            }),
            flatDemiJournee: fields.integer({
              label: 'Demi-journée (€ HT)',
              description: '4h',
              defaultValue: 350,
              validation: { isRequired: true },
            }),
            flatSoiree: fields.integer({
              label: 'Soirée (€ HT)',
              description: 'Sans restauration',
              defaultValue: 450,
              validation: { isRequired: true },
            }),
          },
          { label: 'Forfaits salle sèche', layout: [4, 4, 4] },
        ),
        prestations: fields.object(
          {
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
              label: 'Heure supp. soirée (€ HT / h)',
              description: 'Après 23h',
              defaultValue: 50,
              validation: { isRequired: true },
            }),
          },
          { label: 'Prestations (par personne)', layout: [3, 3, 3, 3] },
        ),
        thresholds: fields.object(
          {
            minRepasComplet: fields.integer({
              label: 'Minimum — Repas complet',
              defaultValue: 12,
              validation: { isRequired: true },
            }),
            minApero: fields.integer({
              label: 'Minimum — Apéro dînatoire',
              defaultValue: 15,
              validation: { isRequired: true },
            }),
            maxParticipants: fields.integer({
              label: 'Maximum de participants',
              defaultValue: 80,
              validation: { isRequired: true },
            }),
          },
          { label: 'Seuils (nombre de personnes)', layout: [4, 4, 4] },
        ),
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
        contact: fields.object(
          {
            phone: fields.text({ label: 'Téléphone principal' }),
            email: fields.text({ label: 'Email de contact' }),
            address: fields.text({ label: 'Adresse', multiline: true }),
            googleMapsUrl: fields.text({ label: 'Lien Google Maps' }),
          },
          {
            label: 'Coordonnées',
            description: 'Informations de contact affichées sur le site',
            layout: [6, 6, 12, 12],
          },
        ),
        socials: fields.object(
          {
            facebook: fields.text({ label: 'Facebook URL' }),
            instagram: fields.text({ label: 'Instagram URL' }),
          },
          { label: 'Réseaux sociaux', layout: [6, 6] },
        ),
        season: fields.object(
          {
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
            openingHours: fields.object(
              {
                fr: fields.text({ label: 'Français', multiline: true }),
                en: fields.text({ label: 'English', multiline: true }),
                es: fields.text({ label: 'Español', multiline: true }),
              },
              { label: 'Horaires d\'ouverture', layout: [4, 4, 4] },
            ),
            seasonalMessage: fields.object(
              {
                fr: fields.text({ label: 'Français', multiline: true }),
                en: fields.text({ label: 'English', multiline: true }),
                es: fields.text({ label: 'Español', multiline: true }),
              },
              { label: 'Message saisonnier', layout: [4, 4, 4] },
            ),
          },
          { label: 'Saison & horaires' },
        ),
        offers: fields.object(
          {
            passJourneeDiscount: fields.integer({
              label: 'Réduction Pass Journée (%)',
              description: 'Pourcentage de réduction au restaurant avec le Pass Journée (ex: 20 pour −20%)',
              defaultValue: 20,
            }),
          },
          { label: 'Offres & promotions' },
        ),
      },
    }),

    // ========================================
    // Page texts — editorial content per page
    // Each field is { fr, en, es } so the client can edit all 3 languages
    // side by side in Keystatic. Functional labels (buttons, nav, common
    // UI) stay in src/i18n/translations.ts.
    // ========================================

    homepageTexts: singleton({
      label: 'Textes — Homepage',
      path: 'src/content/page-texts/homepage',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            tagline: i18n('Tagline (gros titre)'),
            subtitle: i18n('Sous-titre', true),
          },
          { label: 'Hero' },
        ),
        poles: fields.object(
          {
            restaurantDesc: i18n('Description — Restaurant', true),
            aventureDesc: i18n('Description — Aventure', true),
            salleDesc: i18n('Description — La Salle', true),
          },
          { label: 'Trois façons de profiter' },
        ),
        dayTrip: fields.object(
          {
            block0Title: i18n('Bloc 1 — Titre'),
            block0Desc: i18n('Bloc 1 — Description', true),
            block1Title: i18n('Bloc 2 — Titre'),
            block1Desc: i18n('Bloc 2 — Description', true),
            block2Title: i18n('Bloc 3 — Titre'),
            block2Desc: i18n('Bloc 3 — Description', true),
            block3Title: i18n('Bloc 4 — Titre'),
            block3Desc: i18n('Bloc 4 — Description', true),
            block4Title: i18n('Bloc 5 — Titre'),
            block4Desc: i18n('Bloc 5 — Description', true),
            block5Title: i18n('Bloc 6 — Titre'),
            block5Desc: i18n('Bloc 6 — Description', true),
          },
          { label: 'Une journée type à La Terrasse' },
        ),
        soirees: fields.object(
          {
            body: i18n('Paragraphe', true),
          },
          { label: 'Section Soirées' },
        ),
        history: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            intro: i18n('Introduction', true),
            body: i18n('Corps du texte', true),
            closing: i18n('Conclusion', true),
          },
          { label: 'Section Histoire' },
        ),
        cta: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            subtitle: i18n('Sous-titre', true),
          },
          { label: 'CTA final' },
        ),
      },
    }),

    restaurantHubTexts: singleton({
      label: 'Textes — Restaurant (hub)',
      path: 'src/content/page-texts/restaurant-hub',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            tagline: i18n('Tagline'),
            subtitle: i18n('Sous-titre', true),
          },
          { label: 'Hero' },
        ),
        moment: fields.object(
          {
            eyebrow: i18n('Eyebrow (L\'ambiance)'),
            title: i18n('Titre'),
            body: i18n('Paragraphe', true),
          },
          { label: "L'esprit guinguette" },
        ),
        reserve: fields.object(
          {
            eyebrow: i18n('Eyebrow (Réservation)'),
            title: i18n('Titre'),
            subtitle: i18n('Sous-titre', true),
          },
          { label: 'Réservez votre table' },
        ),
        subpage: fields.object(
          {
            carteDesc: i18n('Description — Carte'),
            producteursDesc: i18n('Description — Producteurs'),
          },
          { label: 'Cartes de navigation (carte / producteurs)' },
        ),
        soirees: fields.object(
          {
            title: i18n('Titre'),
            body: i18n('Paragraphe', true),
          },
          { label: 'Section Soirées en terrasse' },
        ),
        location: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            body: i18n('Corps du texte (prose SEO)', true),
          },
          { label: 'Le cadre (prose SEO)' },
        ),
      },
    }),

    restaurantMenuTexts: singleton({
      label: 'Textes — Restaurant Carte',
      path: 'src/content/page-texts/restaurant-menu',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            title: i18n('Titre'),
            subtitle: i18n('Sous-titre'),
          },
          { label: 'Hero' },
        ),
        cta: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            subtitle: i18n('Sous-titre', true),
          },
          { label: 'CTA réservation' },
        ),
        crossSell: fields.object(
          {
            text: i18n('Texte'),
            link: i18n('Lien'),
          },
          { label: 'Cross-link vers aventure' },
        ),
      },
    }),

    producteursTexts: singleton({
      label: 'Textes — Restaurant Producteurs',
      path: 'src/content/page-texts/restaurant-producteurs',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            subtitle: i18n('Sous-titre'),
          },
          { label: 'Hero' },
        ),
        intro: i18n('Introduction', true),
        cta: fields.object(
          {
            eyebrow: i18n('Eyebrow (Terroir)'),
            title: i18n('Titre CTA'),
            subtitle: i18n('Sous-titre CTA', true),
          },
          { label: 'CTA final' },
        ),
      },
    }),

    salleHubTexts: singleton({
      label: 'Textes — La Salle (hub)',
      path: 'src/content/page-texts/salle-hub',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            tagline: i18n('Tagline'),
            subtitle: i18n('Sous-titre', true),
          },
          { label: 'Hero' },
        ),
        venue: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
          },
          { label: 'Section L\'espace' },
        ),
        spaces: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
          },
          { label: 'Section 3 espaces' },
        ),
        dispatch: fields.object(
          {
            evenementielTitle: i18n('Carte Événementiel — Titre'),
            evenementielDesc: i18n('Carte Événementiel — Description', true),
            seminairesTitle: i18n('Carte Séminaires — Titre'),
            seminairesDesc: i18n('Carte Séminaires — Description', true),
          },
          { label: 'Cartes de dispatch (Événementiel / Séminaires)' },
        ),
        contact: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            subtitle: i18n('Sous-titre', true),
          },
          { label: 'CTA contact final' },
        ),
      },
    }),

    aventureHubTexts: singleton({
      label: 'Textes — Aventure (hub)',
      path: 'src/content/page-texts/aventure-hub',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            tagline: i18n('Tagline'),
            subtitle: i18n('Sous-titre', true),
          },
          { label: 'Hero' },
        ),
        intro: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            body: i18n('Corps du texte (prose SEO)', true),
          },
          { label: 'Intro SEO' },
        ),
        groups: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            body: i18n('Description', true),
            combine: i18n('Phrase combinée (« Combinez avec… »)'),
          },
          { label: 'Section groupes' },
        ),
        cats: fields.object(
          {
            aquatique: i18n('Titre catégorie Aquatique'),
            terrestre: i18n('Titre catégorie Terrestre'),
          },
          { label: 'Titres de catégories' },
        ),
        alsoLike: i18n('« Vous pourriez aussi aimer »'),
      },
    }),
  },
});
