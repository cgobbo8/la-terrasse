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
      'Homepage': ['homepage'],
      'Restaurant': ['restaurantHub', 'restaurantCarte', 'restaurantProducteurs'],
      'Aventure': ['aventureHub', 'activities'],
      'La Salle': ['salleHub', 'salleEvenementiel', 'salleSeminaires'],
      'Agenda': ['agendaPage', 'events'],
      'Contact': ['contactPage'],
      'Paramètres': ['settings', 'crosslinks', 'legalMentions'],
    },
  },

  collections: {

    // ========================================
    // Activities (Aventure pole)
    // Stored as: src/content/activities/pedalo.mdx
    // ========================================
    activities: collection({
      label: 'Fiches Activités',
      slugField: 'title',
      path: 'src/content/activities/*',
      format: { contentField: 'content' },
      columns: ['title', 'category'],
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
          { label: 'Informations pratiques', layout: [6, 3, 3, 6, 6, 12] },
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

    events: collection({
      label: 'Événements à venir',
      slugField: 'title',
      path: 'src/content/events/*',
      format: { contentField: 'content' },
      columns: ['title', 'date', 'category'],
      schema: {
        title: fields.slug({ name: { label: 'Nom de l\'événement (FR / slug)', validation: { isRequired: true } } }),
        title_en: fields.text({ label: 'Title (EN)' }),
        title_es: fields.text({ label: 'Título (ES)' }),
        date: fields.date({ label: 'Date', description: 'Date à laquelle l\'événement a lieu. Cliquez sur l\'en-tête « Date » dans la liste pour trier.' }),
        startTime: fields.text({ label: 'Heure de début (ex : 19:00)' }),
        endTime: fields.text({ label: 'Heure de fin (ex : 22:00)' }),
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
    // Legal mentions
    // Stored as: src/content/legal/mentions-legales.yaml
    // ========================================
    legalMentions: singleton({
      label: 'Mentions légales (footer)',
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
      label: 'Paramètres généraux',
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

    homepage: singleton({
      label: 'Accueil du site',
      path: 'src/content/pages/homepage',
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
        dayTrip: fields.array(
          fields.object({
            timeLabel: fields.text({
              label: 'Heure (ex : 9h00, 12h30)',
              validation: { isRequired: true },
            }),
            title: i18n('Titre court'),
            desc: i18n('Description narrative', true),
            image: fields.image({
              label: 'Photo du moment',
              directory: 'public/images/journee',
              publicPath: '/images/journee/',
            }),
            pole: fields.select({
              label: 'Pôle associé (couleur + lien)',
              description: 'Définit la couleur d\'accent de la carte et le lien vers lequel elle renvoie. « Aucun » pour une étape non cliquable.',
              options: [
                { label: 'Aucun (neutre)', value: 'none' },
                { label: 'Restaurant', value: 'restaurant' },
                { label: 'Aventure', value: 'aventure' },
                { label: 'La Salle', value: 'salle' },
              ],
              defaultValue: 'none',
            }),
          }),
          {
            label: 'Une journée type à La Terrasse',
            description: 'Timeline illustrée : les étapes d\'une journée au lac. Glissez-déposez pour réordonner, ajoutez/supprimez autant d\'étapes que vous voulez.',
            itemLabel: (props) =>
              `${props.fields.timeLabel.value || '—'} · ${props.fields.title.fields.fr.value || 'Nouveau bloc'}`,
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
        nearby: fields.array(
          fields.object({
            name: i18n('Nom du lieu'),
            image: fields.image({
              label: 'Photo',
              directory: 'public/images/nearby',
              publicPath: '/images/nearby/',
            }),
            url: fields.url({ label: 'Site web du lieu' }),
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
            description: i18n('Description courte (1-2 phrases)', true),
          }),
          {
            label: 'À proximité du lac',
            description: 'Carrousel de lieux voisins affiché en bas de la homepage. Glissez-déposez pour réordonner.',
            itemLabel: (props) => props.fields.name.fields.fr.value || 'Nouveau lieu',
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

    salleHub: singleton({
      label: 'La Salle',
      path: 'src/content/pages/salle-hub',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            tagline: i18n('Grand titre'),
            subtitle: i18n('Phrase d\'accroche', true),
          },
          {
            label: 'En-tête de la page',
            description: 'Titre et sous-titre affichés tout en haut, sur la photo de la salle.',
          },
        ),
        overview: fields.object(
          {
            eyebrow: i18n('Sur-titre'),
            title: i18n('Titre'),
          },
          {
            label: 'Bloc « L\'espace » — titre',
            description: 'Petit titre juste avant les chiffres clés (capacité, surface) et la liste des équipements.',
          },
        ),
        space: fields.object(
          {
            capacityMax: fields.integer({ label: 'Capacité maximale (nombre de personnes)', validation: { isRequired: true } }),
            surfaceM2: fields.integer({ label: 'Surface (m²)', validation: { isRequired: true } }),
          },
          {
            label: 'Chiffres clés de la salle',
            layout: [6, 6],
            description: 'Les deux gros chiffres affichés en entête : capacité max + surface. Utilisés aussi pour la page Séminaire et Événementiel.',
          },
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
          {
            label: 'Équipements disponibles',
            layout: [4, 4, 4],
            description: 'Liste des équipements affichés en puces (vidéoprojecteur, Wi-Fi, etc.). Une ligne = un équipement.',
          },
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
          {
            label: 'Idées de disposition',
            layout: [4, 4, 4],
            description: 'Propositions d\'agencement (théâtre, U, îlots…) affichées en badges.',
          },
        ),
        spaces: fields.object(
          {
            eyebrow: i18n('Sur-titre'),
            title: i18n('Titre'),
          },
          {
            label: 'Bloc « Les espaces » — titre',
            description: 'Titre de la section qui présente les 3 cards : salle polyvalente, sanitaires, espace traiteur.',
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
            label: 'Les 2 cartes « Événementiel » + « Séminaires »',
            description: 'Cartes image + texte qui renvoient vers les 2 sous-pages /la-salle/evenementiel et /la-salle/seminaires.',
          },
        ),
        contact: fields.object(
          {
            eyebrow: i18n('Sur-titre'),
            title: i18n('Titre'),
            subtitle: i18n('Phrase sous le titre', true),
          },
          {
            label: 'Bloc « Demander un devis » (bas de page)',
            description: 'Bandeau bleu ardoise tout en bas de la page avec le bouton de contact.',
          },
        ),
      },
    }),

    salleEvenementiel: singleton({
      label: 'Événementiel',
      path: 'src/content/pages/salle-evenementiel',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            tagline: i18n('Grand titre'),
            subtitle: i18n('Phrase d\'accroche', true),
          },
          {
            label: 'En-tête de la page',
            description: 'Titre et sous-titre affichés tout en haut de /la-salle/evenementiel.',
          },
        ),
        intro: fields.object(
          {
            title: i18n('Titre'),
            desc: i18n('Paragraphe', true),
          },
          {
            label: 'Paragraphe d\'introduction',
            description: 'Bloc d\'intro juste après le hero — présente rapidement ce qu\'on peut faire dans la salle.',
          },
        ),
        typesTitle: i18n('Titre de la section « Quel événement ? »'),
        types: fields.array(
          fields.object({
            title: i18n('Titre'),
            desc: i18n('Description', true),
            icon: fields.select({
              label: 'Icône',
              options: [
                { label: 'Musique (concerts)', value: 'music' },
                { label: 'Boutique (foires/expo)', value: 'store' },
                { label: 'Étincelles (soirées)', value: 'sparkles' },
                { label: 'Sac de courses (marchés)', value: 'shopping-bag' },
              ],
              defaultValue: 'music',
            }),
            image: fields.image({
              label: 'Photo',
              directory: 'public/images/salle',
              publicPath: '/images/salle/',
            }),
          }),
          {
            label: 'Types d\'événement',
            description: 'Cartes présentant les types d\'événements accueillis. Glissez-déposez pour réordonner.',
            itemLabel: (props) => props.fields.title.fields.fr.value || 'Nouveau type',
          },
        ),
        cta: fields.object(
          {
            label: i18n('Libellé du bouton'),
          },
          {
            label: 'Bouton de contact',
            description: 'Texte du bouton de contact utilisé dans le hero et en bas de page.',
          },
        ),
      },
    }),

    salleSeminaires: singleton({
      label: 'Séminaire',
      path: 'src/content/pages/salle-seminaires',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            tagline: i18n('Grand titre'),
            subtitle: i18n('Phrase d\'accroche', true),
          },
          {
            label: 'En-tête de la page',
            description: 'Titre et sous-titre affichés tout en haut de /la-salle/seminaires.',
          },
        ),
        config: fields.object(
          {
            eyebrow: i18n('Sur-titre'),
            title: i18n('Titre'),
            desc: i18n('Phrase sous le titre', true),
          },
          {
            label: 'Titre au-dessus du configurateur',
            description: 'Introduit le configurateur interactif qui calcule une estimation de devis.',
          },
        ),
        why: fields.object(
          {
            eyebrow: i18n('Sur-titre'),
            title: i18n('Titre'),
            body: i18n('Paragraphe complet', true),
          },
          {
            label: 'Bloc « Pourquoi Saint-Ferréol » (prose SEO)',
            description: 'Long paragraphe éditorial en bas de page, optimisé pour le référencement.',
          },
        ),
        faqTitle: i18n('Titre de la section FAQ'),
        faq: fields.array(
          fields.object({
            question: i18n('Question'),
            answer: i18n('Réponse', true),
          }),
          {
            label: 'FAQ',
            description: 'Liste de questions fréquentes affichée en bas de page. Utile pour le référencement. Ajoutez/supprimez autant de questions que vous voulez.',
            itemLabel: (props) => props.fields.question.fields.fr.value || 'Nouvelle question',
          },
        ),
        pricingForfaits: fields.object(
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
          {
            label: 'Tarifs — Forfaits salle sèche',
            layout: [4, 4, 4],
            description: 'Prix de base du configurateur (location salle uniquement, sans repas).',
          },
        ),
        pricingPrestations: fields.object(
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
          {
            label: 'Tarifs — Prestations (par personne)',
            layout: [3, 3, 3, 3],
            description: 'Prix unitaires ajoutés par le configurateur selon les options choisies.',
          },
        ),
        pricingThresholds: fields.object(
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
          {
            label: 'Tarifs — Seuils (nombre de personnes)',
            layout: [4, 4, 4],
            description: 'Seuils utilisés par le configurateur : nombre minimum pour la restauration, maximum total.',
          },
        ),
      },
    }),

    aventureHub: singleton({
      label: 'Aventure',
      path: 'src/content/pages/aventure-hub',
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

    contactPage: singleton({
      label: 'Page Contact',
      path: 'src/content/pages/contact',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            tagline: i18n('Grand titre'),
            subtitle: i18n('Phrase d\'accroche', true),
          },
          {
            label: 'En-tête de la page',
            description: 'Titre et sous-titre affichés tout en haut, sur la photo de hero.',
          },
        ),
        info: fields.object(
          {
            title: i18n('Titre de la section'),
            name: i18n('Nom affiché (ex : La Terrasse — Base de loisirs)'),
            addressLine1: i18n('Adresse — 1re ligne'),
            addressLine2: i18n('Adresse — 2e ligne'),
          },
          {
            label: 'Bloc Coordonnées',
            description: 'Carte affichant le téléphone, l\'email et l\'adresse postale. Le téléphone et l\'email sont tirés des Paramètres généraux — seul le libellé du nom et les 2 lignes d\'adresse sont édités ici.',
          },
        ),
        hours: fields.object(
          {
            title: i18n('Titre de la section'),
            seasonEyebrow: i18n('Sur-titre de la carte « Saison »'),
            maySepLabel: i18n('Mai & septembre — label'),
            maySepPeriod: i18n('Mai & septembre — période'),
            summerLabel: i18n('Juin/juillet/août — label'),
            summerPeriod: i18n('Juin/juillet/août — période'),
            scheduleEyebrow: i18n('Sur-titre de la carte « Horaires »'),
            activitiesLabel: i18n('Label « Activités »'),
            activitiesTime: i18n('Plage horaire activités'),
            restaurantTime: i18n('Plage horaire restaurant'),
          },
          {
            label: 'Bloc Horaires d\'ouverture',
            description: 'Deux cartes empilées : « Saison » (périodes d\'ouverture) et « Horaires » (plages horaires par service : activités, restaurant).',
          },
        ),
        map: fields.object(
          {
            title: i18n('Titre de la carte'),
            fallback: i18n('Libellé du lien vers Google Maps'),
          },
          {
            label: 'Bloc Carte (Google Maps)',
            description: 'L\'iframe Google Maps à droite et le lien « Voir sur Google Maps » sous la carte. L\'URL Google Maps elle-même est dans Paramètres généraux.',
          },
        ),
        directions: fields.object(
          {
            eyebrow: i18n('Sur-titre de la section'),
            title: i18n('Titre de la section'),
            distance: i18n('Badge distance (ex : ~60 km de Toulouse)'),
            duration: i18n('Badge durée (ex : ~1h de trajet)'),
          },
          {
            label: 'Bloc Accès — en-tête',
            description: 'Titre de la section suivie des 2 badges ronds (distance, durée de trajet).',
          },
        ),
        directionsList: fields.array(
          fields.object({
            icon: fields.select({
              label: 'Icône',
              options: [
                { label: 'Voiture', value: 'car' },
                { label: 'Bus', value: 'bus' },
                { label: 'Vélo', value: 'bike' },
                { label: 'Sur place (pin)', value: 'map-pin-check' },
                { label: 'Train', value: 'train' },
                { label: 'Marche', value: 'footprints' },
              ],
              defaultValue: 'car',
            }),
            title: i18n('Titre (ex : En voiture)'),
            desc: i18n('Description', true),
          }),
          {
            label: 'Modes d\'accès',
            description: 'Grille de cartes : un mode de transport = une carte avec son icône, son titre et sa description. Glissez-déposez pour réordonner, ajoutez-en autant que vous voulez.',
            itemLabel: (props) => props.fields.title.fields.fr.value || 'Nouveau mode',
          },
        ),
        social: fields.object(
          {
            title: i18n('Sur-titre du bloc'),
          },
          {
            label: 'Bloc Réseaux sociaux',
            description: 'Le sur-titre au-dessus des icônes Facebook/Instagram dans la carte Coordonnées. Les URLs viennent des Paramètres généraux.',
          },
        ),
        seo: fields.object(
          {
            pageTitle: i18n('Titre de l\'onglet navigateur'),
            pageDescription: i18n('Description pour Google', true),
          },
          {
            label: 'Référencement',
            description: 'Métadonnées pour Google : titre de l\'onglet + description affichée sous le lien dans les résultats de recherche.',
          },
        ),
      },
    }),

    agendaPage: singleton({
      label: 'Page Agenda',
      path: 'src/content/pages/agenda',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            tagline: i18n('Grand titre'),
            subtitle: i18n('Phrase d\'accroche', true),
          },
          {
            label: 'En-tête de la page',
            description: 'Titre et sous-titre affichés tout en haut de la page /agenda, sur la photo.',
          },
        ),
        emptyMessage: i18n('Message affiché quand l\'agenda est vide', true),
        seo: fields.object(
          {
            pageTitle: i18n('Titre de l\'onglet navigateur'),
          },
          {
            label: 'Référencement',
            description: 'Titre de l\'onglet navigateur. La description reprend automatiquement la phrase d\'accroche du hero.',
          },
        ),
      },
    }),

    crosslinks: singleton({
      label: 'Liens entre les pages',
      path: 'src/content/pages/crosslinks',
      format: { data: 'yaml' },
      schema: {
        polesDescription: fields.object(
          {
            restaurant: i18n('Description — Restaurant'),
            aventure: i18n('Description — Aventure'),
            salle: i18n('Description — La Salle'),
          },
          {
            label: 'Bloc « La Terrasse c\'est aussi… »',
            description: 'Affiché en bas de chaque page de pôle : 2 cartes grises avec le nom du pôle et une petite description dessous. C\'est la phrase grise qui est éditée ici.',
          },
        ),
        hubNarratives: fields.object(
          {
            aventureToRestaurant: i18n('Depuis Aventure → vers Restaurant', true),
            restaurantToAventure: i18n('Depuis Restaurant (hub) → vers Aventure', true),
            carteToAventure: i18n('Depuis La Carte → vers Aventure', true),
          },
          {
            label: 'Phrases narratives entre pages (hubs)',
            description: 'Phrase italique centrée, avec une flèche, affichée entre 2 sections sur les pages de pôle. Invite à consulter un autre pôle. Exemple : « Après l\'effort, le réconfort — déjeunez au bord du lac… ».',
          },
        ),
        activityToRestaurant: fields.object(
          {
            defaultText: i18n('Phrase par défaut (activités sans texte propre)', true),
            paddle: i18n('Après Paddle', true),
            archeryTag: i18n('Après Archery Tag', true),
            pedalo: i18n('Après Pédalo', true),
            canoe: i18n('Après Canoë', true),
            vtt: i18n('Après VTT', true),
            miniGolf: i18n('Après Mini-golf', true),
          },
          {
            label: 'Phrases narratives après activité → Restaurant',
            description: 'Phrase italique affichée en bas de chaque fiche activité, invitant à finir la journée au restaurant. Si une activité n\'a pas sa propre phrase, la phrase par défaut est utilisée.',
          },
        ),
      },
    }),
  },
});
