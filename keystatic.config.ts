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

/**
 * Inline-style injector for the Keystatic admin UI. Stylesheet rules lose a
 * cascade fight against Keystar's :where(.kui:reset) + Emotion's late-injected
 * styles on the group elements themselves, so we apply the separators via
 * inline style (specificity 1000) on every top-level section.
 *
 * Top-level sections = fields.object that we gave a description. They are
 * rendered as <div role="group" aria-labelledby aria-describedby>.
 * Nested i18n objects don't carry a description, so they are spared.
 */
const SEPARATOR_SELECTOR =
  '#singleton-form [role="group"][aria-labelledby][aria-describedby], ' +
  '#collection-item-form [role="group"][aria-labelledby][aria-describedby]';
const LABEL_SELECTOR =
  '#singleton-form [role="group"][aria-labelledby][aria-describedby] > span[id$="-label"], ' +
  '#collection-item-form [role="group"][aria-labelledby][aria-describedby] > span[id$="-label"]';

function applyKeystaticAdminStyles() {
  if (typeof document === 'undefined') return;

  // Group sections inside each form
  const forms = document.querySelectorAll('#singleton-form, #collection-item-form');
  forms.forEach((form) => {
    const sections = form.querySelectorAll<HTMLElement>(
      '[role="group"][aria-labelledby][aria-describedby]',
    );
    sections.forEach((el, i) => {
      if (i === 0) {
        el.style.removeProperty('border-top');
        el.style.removeProperty('padding-top');
        el.style.removeProperty('margin-top');
        return;
      }
      el.style.setProperty(
        'border-top',
        '1px solid color-mix(in srgb, currentColor 18%, transparent)',
        'important',
      );
      el.style.setProperty('padding-top', '2rem', 'important');
      el.style.setProperty('margin-top', '2rem', 'important');
    });
  });

  // Labels
  document.querySelectorAll<HTMLElement>(LABEL_SELECTOR).forEach((el) => {
    el.style.setProperty('font-size', '1.125rem', 'important');
    el.style.setProperty('font-weight', '700', 'important');
  });
}

function ensureKeystaticStyleObserver() {
  if (typeof document === 'undefined') return;
  const w = window as typeof window & { __keystaticStyleObserver?: boolean };
  if (w.__keystaticStyleObserver) return;
  w.__keystaticStyleObserver = true;

  applyKeystaticAdminStyles();
  const observer = new MutationObserver(() => applyKeystaticAdminStyles());
  observer.observe(document.body, { childList: true, subtree: true });
}

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: 'cgobbo8/la-terrasse',
      },
  ui: {
    brand: {
      name: 'La Terrasse — CMS',
      mark: () => {
        ensureKeystaticStyleObserver();
        return null;
      },
    },
    navigation: {
      'Homepage': ['homepageTexts', 'nearby'],
      'Restaurant': ['restaurantHub', 'restaurantCarte', 'restaurantProducteurs'],
      'Aventure': ['activities', 'aventureHubTexts'],
      'La Salle': ['venue', 'seminars', 'seminarsPricing', 'salleHubTexts'],
      'Agenda': ['events'],
      'Paramètres': ['settings', 'legalMentions'],
    },
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
          {
            label: 'Hero',
            description: 'Grande section en tête de page, au-dessus du pli : le titre principal et une phrase d\'accroche.',
          },
        ),
        poles: fields.object(
          {
            restaurantDesc: i18n('Description — Restaurant', true),
            aventureDesc: i18n('Description — Aventure', true),
            salleDesc: i18n('Description — La Salle', true),
          },
          {
            label: 'Trois façons de profiter',
            description: 'Les 3 cartes juste après le widget agenda, qui renvoient vers Restaurant / Aventure / La Salle.',
          },
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
          {
            label: 'Une journée type à La Terrasse',
            description: 'Timeline illustrée : les 6 étapes d\'une journée (9h → 19h30). Chaque bloc a un titre court + une phrase narrative.',
          },
        ),
        soirees: fields.object(
          {
            body: i18n('Paragraphe', true),
          },
          {
            label: 'Section Soirées',
            description: 'Paragraphe central entre les 4 cartes déco (concerts / karaoké / blind test / DJ).',
          },
        ),
        history: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            intro: i18n('Introduction', true),
            body: i18n('Corps du texte', true),
            closing: i18n('Conclusion', true),
          },
          {
            label: 'Section Histoire',
            description: 'Section storytelling avec le portrait de Riquet. Eyebrow, titre, puis 3 paragraphes (intro en gras, corps, conclusion en italique).',
          },
        ),
        cta: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            subtitle: i18n('Sous-titre', true),
          },
          {
            label: 'CTA final',
            description: 'Bloc coloré au pied de la homepage avec le gros titre et une phrase sous le titre.',
          },
        ),
      },
    }),

    restaurantHub: singleton({
      label: 'Accueil Restaurant',
      path: 'src/content/pages/restaurant-hub',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            tagline: i18n('Tagline'),
            subtitle: i18n('Sous-titre', true),
          },
          {
            label: 'Hero',
            description: 'En-tête de /restaurant : titre plein écran sur la photo + phrase d\'accroche.',
          },
        ),
        moment: fields.object(
          {
            eyebrow: i18n('Eyebrow (L\'ambiance)'),
            title: i18n('Titre'),
            body: i18n('Paragraphe', true),
          },
          {
            label: "L'esprit guinguette",
            description: 'Section atmosphérique sur fond terracotta, juste après les 2 cartes "Carte / Producteurs". Eyebrow + gros titre + paragraphe sensoriel.',
          },
        ),
        reserve: fields.object(
          {
            eyebrow: i18n('Eyebrow (Réservation)'),
            title: i18n('Titre'),
            subtitle: i18n('Sous-titre', true),
          },
          {
            label: 'Réservez votre table',
            description: 'Bloc terracotta pleine largeur avec le numéro affiché en gros. Situé après la section "Offre Journée".',
          },
        ),
        subpage: fields.object(
          {
            carteDesc: i18n('Description — Carte'),
            producteursDesc: i18n('Description — Producteurs'),
          },
          {
            label: 'Cartes de navigation (carte / producteurs)',
            description: 'Deux cartes blanches à côté de la photo hero qui dirigent vers /restaurant/carte et /restaurant/producteurs. On édite juste la petite description grise sous le titre.',
          },
        ),
        soirees: fields.object(
          {
            title: i18n('Titre'),
            body: i18n('Paragraphe', true),
          },
          {
            label: 'Section Soirées en terrasse',
            description: 'Variante de la section "Soirées" déjà présente sur la homepage, adaptée au contexte restaurant.',
          },
        ),
        location: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            body: i18n('Corps du texte (prose SEO)', true),
          },
          {
            label: 'Le cadre (prose SEO)',
            description: 'Bloc éditorial en bas de page, optimisé pour le référencement (mots-clés « Sorèze », « Toulouse », « Canal du Midi »). Long paragraphe.',
          },
        ),
      },
    }),

    restaurantCarte: singleton({
      label: 'La Carte',
      path: 'src/content/pages/restaurant-carte',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            title: i18n('Titre'),
            subtitle: i18n('Sous-titre'),
          },
          {
            label: 'En-tête de la page',
            description: 'Titre et sous-titre affichés tout en haut de la page La Carte.',
          },
        ),
        menuSections: fields.array(
          fields.object({
            group: fields.select({
              label: 'Moment du service',
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
              { label: 'Titre de la section (ex : Burgers, Salades)', layout: [4, 4, 4] },
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
                  { label: 'Description du plat', layout: [4, 4, 4] },
                ),
                price: fields.text({ label: 'Prix (ex : 12.50)' }),
                tags: fields.array(
                  fields.text({ label: 'Tag' }),
                  { label: 'Tags alimentaires (végétarien, sans gluten…)', itemLabel: (props) => props.value || 'Tag' },
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
            description: 'Chaque section regroupe des plats (Burgers, Salades, Desserts…). Glissez-déposez pour réordonner.',
            itemLabel: (props) => props.fields.title.fields.fr.value || 'Nouvelle section',
          },
        ),
        cta: fields.object(
          {
            eyebrow: i18n('Sur-titre'),
            title: i18n('Titre'),
            subtitle: i18n('Phrase sous le titre', true),
          },
          {
            label: 'Bloc « Réserver une table »',
            description: 'Encadré coloré en bas de page avec le numéro de téléphone et un bouton de réservation.',
          },
        ),
        crossSell: fields.object(
          {
            text: i18n('Phrase d\'invitation'),
            link: i18n('Libellé du lien'),
          },
          {
            label: 'Suggestion activité (bandeau)',
            description: 'Petit bandeau narratif suggérant d\'enchaîner sur les activités Aventure après le repas.',
          },
        ),
      },
    }),

    restaurantProducteurs: singleton({
      label: 'Nos Producteurs',
      path: 'src/content/pages/restaurant-producteurs',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            subtitle: i18n('Sous-titre sous le titre « Nos producteurs locaux »'),
          },
          {
            label: 'En-tête de la page',
            description: 'Sous-titre affiché sous le grand titre en haut de page.',
          },
        ),
        intro: i18n('Paragraphe d\'introduction', true),
        producers: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom du producteur', validation: { isRequired: true } }),
            photo: fields.image({
              label: 'Photo',
              directory: 'public/images/producers',
              publicPath: '/images/producers/',
            }),
            location: fields.text({ label: 'Lieu (ex : Saint-Félix de Lauragais)' }),
            distance: fields.integer({ label: 'Distance du lac (km)' }),
            website: fields.url({ label: 'Site web' }),
            product: i18n('Produit / spécialité'),
            story: i18n('Histoire (2–3 phrases)', true),
            visible: fields.checkbox({ label: 'Afficher sur le site', defaultValue: true }),
          }),
          {
            label: 'Liste des producteurs',
            description: 'Chaque producteur apparaît en carte sur la page. Glissez-déposez pour réordonner.',
            itemLabel: (props) => props.fields.name.value || 'Nouveau producteur',
          },
        ),
        cta: fields.object(
          {
            eyebrow: i18n('Sur-titre'),
            title: i18n('Titre'),
            subtitle: i18n('Phrase sous le titre', true),
          },
          {
            label: 'Bloc « Venez découvrir nos saveurs » (en bas de page)',
            description: 'Encadré final invitant à réserver une table.',
          },
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
          {
            label: 'Hero',
            description: 'En-tête de /la-salle : titre plein écran sur la photo de la salle.',
          },
        ),
        venue: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
          },
          {
            label: 'Section L\'espace',
            description: 'Petit titre juste avant les chiffres clés de la salle (capacité / surface) et la liste des équipements.',
          },
        ),
        spaces: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
          },
          {
            label: 'Section 3 espaces',
            description: 'Titre de la section qui présente les 3 cards détaillées : salle, sanitaires, traiteur.',
          },
        ),
        dispatch: fields.object(
          {
            evenementielTitle: i18n('Carte Événementiel — Titre'),
            evenementielDesc: i18n('Carte Événementiel — Description', true),
            seminairesTitle: i18n('Carte Séminaires — Titre'),
            seminairesDesc: i18n('Carte Séminaires — Description', true),
          },
          {
            label: 'Cartes de dispatch (Événementiel / Séminaires)',
            description: 'Les 2 grandes cartes image + texte qui dispatchent vers /la-salle/evenementiel et /la-salle/seminaires.',
          },
        ),
        contact: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            subtitle: i18n('Sous-titre', true),
          },
          {
            label: 'CTA contact final',
            description: 'Bloc bleu ardoise pleine largeur en bas de la page avec le bouton « Demander un devis ».',
          },
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
          {
            label: 'Hero',
            description: 'En-tête de /aventure : titre plein écran sur photo.',
          },
        ),
        intro: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            body: i18n('Corps du texte (prose SEO)', true),
          },
          {
            label: 'Intro SEO',
            description: 'Bloc éditorial crème juste après le hero, optimisé référencement (mots-clés « Tarn », « Toulouse », « Castres »).',
          },
        ),
        groups: fields.object(
          {
            eyebrow: i18n('Eyebrow'),
            title: i18n('Titre'),
            body: i18n('Description', true),
            combine: i18n('Phrase combinée (« Combinez avec… »)'),
          },
          {
            label: 'Section groupes',
            description: 'Bloc en bas de page centré, appelant les groupes / scolaires / team building à commander sur mesure.',
          },
        ),
        cats: fields.object(
          {
            aquatique: i18n('Titre catégorie Aquatique'),
            terrestre: i18n('Titre catégorie Terrestre'),
          },
          {
            label: 'Titres de catégories',
            description: 'Les 2 titres de sections qui séparent les activités aquatiques des activités terrestres.',
          },
        ),
        alsoLike: i18n('« Vous pourriez aussi aimer »'),
      },
    }),
  },
});
