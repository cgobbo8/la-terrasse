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
      'Agenda': ['agenda'],
      'Contact': ['contactPage'],
      'Paramètres': ['settings', 'offreJournee', 'legalMentions'],
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
        contextualCrossLink: fields.object(
          {
            fr: fields.text({ label: 'Français', multiline: true }),
            en: fields.text({ label: 'English', multiline: true }),
            es: fields.text({ label: 'Español', multiline: true }),
          },
          {
            label: 'Phrase narrative vers le Restaurant (optionnel)',
            description: 'Phrase italique affichée en bas de la fiche pour inviter à finir la journée au restaurant. Laissez vide pour utiliser la phrase par défaut définie dans la page Aventure.',
            layout: [4, 4, 4],
          },
        ),
        content: fields.mdx({
          label: 'Description complète',
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
      label: 'Paramètres généraux',
      path: 'src/content/settings/site',
      schema: {
        contact: fields.object(
          {
            phone: fields.text({ label: 'Téléphone principal' }),
            email: fields.text({ label: 'Email de contact' }),
            address: fields.text({
              label: 'Adresse postale',
              multiline: true,
              description: 'Une ligne par élément (rue sur la 1re, code postal + ville sur la 2e).',
            }),
            googleMapsUrl: fields.text({
              label: 'Lien Google Maps (ouverture dans un onglet)',
              description: 'URL cliquable qui ouvre Google Maps dans un nouvel onglet.',
            }),
            googleMapsEmbedUrl: fields.text({
              label: 'URL de la carte Google Maps intégrée (iframe)',
              description: 'URL qui commence par https://maps.google.com/maps?q=... et se termine par &output=embed. Affichée comme carte interactive sur la page Contact.',
              multiline: true,
            }),
          },
          {
            label: 'Coordonnées',
            description: 'Téléphone, email, adresse postale et liens Google Maps. Utilisés sur la page Contact, le pied de page et la homepage.',
            layout: [6, 6, 12, 12, 12],
          },
        ),
        socials: fields.object(
          {
            facebook: fields.text({ label: 'Facebook URL' }),
            instagram: fields.text({ label: 'Instagram URL' }),
          },
          { label: 'Réseaux sociaux', layout: [6, 6] },
        ),
        hours: fields.object(
          {
            seasonEyebrow: i18n('Sur-titre « Saison »'),
            maySepLabel: i18n('Mai/septembre — label'),
            maySepPeriod: i18n('Mai/septembre — période'),
            summerLabel: i18n('Juin/juillet/août — label'),
            summerPeriod: i18n('Juin/juillet/août — période'),
            scheduleEyebrow: i18n('Sur-titre « Horaires »'),
            activitiesLabel: i18n('Label « Activités »'),
            activitiesTime: i18n('Plage horaire activités'),
            restaurantLabel: i18n('Label « Restaurant »'),
            restaurantTime: i18n('Plage horaire restaurant'),
          },
          {
            label: 'Horaires d\'ouverture',
            description: 'Saison (périodes d\'ouverture) + plages horaires par service. Affichés sur la page Contact (section « Horaires ») et sur la homepage (carte Bento « Horaires d\'ouverture »).',
          },
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
            seasonalMessage: fields.object(
              {
                fr: fields.text({ label: 'Français', multiline: true }),
                en: fields.text({ label: 'English', multiline: true }),
                es: fields.text({ label: 'Español', multiline: true }),
              },
              { label: 'Message saisonnier', layout: [4, 4, 4] },
            ),
          },
          {
            label: 'Saison en cours',
            description: 'Saison active (pour la carte saisonnière de la homepage) + message saisonnier affiché dans cette carte.',
          },
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
        branding: fields.object(
          {
            footerTagline: i18n('Tagline affichée dans le footer', true),
            photoDisclaimer: i18n('Mention légale photos (bas du footer)', true),
          },
          {
            label: 'Marque & footer',
            description: 'Textes du footer apparaissant sur toutes les pages : tagline sous le logo + mention sur les photos libres de droits.',
          },
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
        dayTripIntro: fields.object(
          {
            eyebrow: i18n('Sur-titre (ex : « Votre journée »)'),
            title: i18n('Titre'),
            cta: i18n('Libellé du bouton « En savoir plus »'),
          },
          {
            label: 'Journée type — en-tête',
            description: 'Sur-titre, titre et libellé du bouton affichés au-dessus de la timeline « Une journée type à La Terrasse ».',
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
            eyebrow: i18n('Sur-titre'),
            title: i18n('Titre'),
            body: i18n('Paragraphe', true),
            ctaAgenda: i18n('Bouton « Voir l\'agenda »'),
            ctaRestaurant: i18n('Bouton « Découvrir le restaurant »'),
            cards: fields.array(
              fields.object({
                icon: fields.select({
                  label: 'Icône',
                  options: [
                    { label: 'Musique (concerts)', value: 'music' },
                    { label: 'Cerveau (blind test)', value: 'brain' },
                    { label: 'Micro (karaoké)', value: 'mic' },
                    { label: 'Disque (DJ)', value: 'disc-3' },
                    { label: 'Étincelles', value: 'sparkles' },
                    { label: 'Cœur', value: 'heart' },
                    { label: 'Étoile', value: 'star' },
                    { label: 'Guitare', value: 'guitar' },
                  ],
                  defaultValue: 'music',
                }),
                label: i18n('Titre de la carte'),
                desc: i18n('Description courte'),
              }),
              {
                label: 'Cartes déco',
                description: '4 cartes décoratives (concerts / karaoké / blind test / DJ par défaut) disposées en triptyque autour du paragraphe central.',
                itemLabel: (props) => props.fields.label.fields.fr.value || 'Nouvelle carte',
              },
            ),
          },
          {
            label: 'Section Soirées',
            description: 'Sur la homepage : bloc avec un paragraphe central entouré de 4 cartes illustrant les types de soirées proposées.',
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
        seo: fields.object(
          {
            pageTitle: i18n('Titre de l\'onglet navigateur'),
            pageDescription: i18n('Description pour Google', true),
          },
          {
            label: 'Référencement',
            description: 'Métadonnées pour Google : titre de l\'onglet + description sous le lien dans les résultats de recherche.',
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
        crosslink: fields.object(
          {
            description: i18n('Description courte du Restaurant'),
            toAventure: i18n('Phrase narrative vers Aventure', true),
          },
          {
            label: 'Liens depuis / vers cette page',
            description: 'La description apparaît dans le bloc « La Terrasse c\'est aussi… » affiché en bas de toutes les autres pages (phrase grise sous le lien). La phrase narrative est affichée en italique au milieu de /restaurant, pour inviter à aller sur Aventure.',
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
        crosslink: fields.object(
          {
            toAventure: i18n('Phrase narrative vers Aventure', true),
          },
          {
            label: 'Lien narratif vers Aventure',
            description: 'Phrase italique affichée en bas de la carte, pour inviter à aller se balader au lac après le repas.',
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
            detailsLabel: i18n('Libellé bouton « Voir les détails »'),
            hideLabel: i18n('Libellé bouton « Masquer »'),
            list: fields.array(
              fields.object({
                icon: fields.select({
                  label: 'Icône',
                  options: [
                    { label: 'Salle polyvalente', value: 'room' },
                    { label: 'Sanitaires', value: 'sanitary' },
                    { label: 'Espace traiteur', value: 'catering' },
                  ],
                  defaultValue: 'room',
                }),
                title: i18n('Titre de la carte'),
                desc: i18n('Description', true),
                details: fields.array(i18n('Ligne de détail'), {
                  label: 'Lignes de détails (affichées après « Voir les détails »)',
                  itemLabel: (props) => props.fields.fr.value || 'Nouvelle ligne',
                }),
              }),
              {
                label: 'Cartes des espaces',
                description: 'Une carte par espace (salle polyvalente, sanitaires, traiteur). Chaque carte a son icône, son titre, une description et une liste de détails dépliables.',
                itemLabel: (props) => props.fields.title.fields.fr.value || 'Nouvel espace',
              },
            ),
          },
          {
            label: 'Bloc « Les espaces »',
            description: 'Les 3 cartes présentant la salle polyvalente, les sanitaires et l\'espace traiteur. Chaque carte est repliable avec des détails techniques.',
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
        collectivites: fields.object(
          {
            title: i18n('Titre'),
            descBefore: i18n('Début de phrase (avant le mot mis en gras)', true),
            descHighlight: i18n('Mot / expression en gras'),
            descAfter: i18n('Fin de phrase (après le mot en gras)', true),
            desc2: i18n('Deuxième paragraphe', true),
            ctaQuote: i18n('Bouton « Demander un devis »'),
            ctaPhone: i18n('Bouton « Nous appeler »'),
          },
          {
            label: 'Bloc Collectivités & associations',
            description: 'Bandeau affiché sur /la-salle et /la-salle/seminaires : « Tarifs spécifiques pour écoles, centres de loisirs et associations ». La phrase principale se compose de 3 morceaux pour mettre un mot en gras au milieu.',
          },
        ),
        crosslink: fields.object(
          {
            description: i18n('Description courte de La Salle'),
          },
          {
            label: 'Liens depuis les autres pages',
            description: 'Description affichée dans le bloc « La Terrasse c\'est aussi… » en bas de toutes les autres pages (phrase grise sous le lien La Salle).',
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
        calloutSeparator: i18n('Séparateur « ou votre projet est unique ? »'),
        callout: fields.object(
          {
            title: i18n('Titre'),
            desc: i18n('Paragraphe', true),
            phoneLabel: i18n('Libellé bouton téléphone'),
            emailLabel: i18n('Libellé bouton email'),
          },
          {
            label: 'Bloc « Un projet qui sort de l\'ordinaire ? »',
            description: 'Callout jaune soleil affiché sous le configurateur, entre le séparateur « ou votre projet est unique ? » et la section Team Building. Invite à contacter directement pour un devis sur mesure.',
          },
        ),
        teamBuilding: fields.object(
          {
            eyebrow: i18n('Sur-titre de la section'),
            title: i18n('Titre'),
            desc: i18n('Paragraphe d\'introduction', true),
            outdoor: fields.object(
              {
                title: i18n('Titre carte plein air'),
                subtitle: i18n('Sous-titre'),
                activities: fields.array(
                  fields.object({
                    icon: fields.select({
                      label: 'Icône',
                      options: [
                        { label: 'Cible (archery)', value: 'target' },
                        { label: 'Vagues (paddle/canoë)', value: 'waves' },
                        { label: 'Vélo (VTT)', value: 'bike' },
                        { label: 'Boussole (orientation)', value: 'compass' },
                        { label: 'Ancre (pédalo)', value: 'anchor' },
                        { label: 'Montagne', value: 'mountain' },
                        { label: 'Arbre', value: 'trees' },
                      ],
                      defaultValue: 'target',
                    }),
                    label: i18n('Nom de l\'activité'),
                    desc: i18n('Courte description'),
                  }),
                  {
                    label: 'Activités plein air',
                    itemLabel: (props) => props.fields.label.fields.fr.value || 'Nouvelle activité',
                  },
                ),
                ctaLabel: i18n('Libellé bouton CTA (« Voir toutes les activités »)'),
              },
              {
                label: 'Carte gauche — Activités plein air',
                description: 'Présente les activités plein air disponibles en autonomie sur le site.',
              },
            ),
            coaching: fields.object(
              {
                title: i18n('Titre carte coaching'),
                subtitle: i18n('Sous-titre'),
                premiumLabel: i18n('Badge « Premium »'),
                activities: fields.array(
                  fields.object({
                    icon: fields.select({
                      label: 'Icône',
                      options: [
                        { label: 'Flamme (Koh-Lanta)', value: 'flame' },
                        { label: 'Cerveau (mental)', value: 'brain' },
                        { label: 'Personnes (cohésion)', value: 'users' },
                        { label: 'Pièce de puzzle (logique)', value: 'puzzle' },
                        { label: 'Médaille (sport)', value: 'medal' },
                        { label: 'Trophée', value: 'trophy' },
                        { label: 'Étincelles', value: 'sparkles' },
                      ],
                      defaultValue: 'flame',
                    }),
                    label: i18n('Nom du programme'),
                    desc: i18n('Courte description'),
                  }),
                  {
                    label: 'Programmes de coaching',
                    itemLabel: (props) => props.fields.label.fields.fr.value || 'Nouveau programme',
                  },
                ),
                ctaLabel: i18n('Libellé bouton CTA (« Demander un devis »)'),
              },
              {
                label: 'Carte droite — Coaching professionnel (Premium)',
                description: 'Programmes encadrés par un coach spécialisé — Koh-Lanta, cohésion, logique, sport.',
              },
            ),
          },
          {
            label: 'Section Team Building',
            description: 'Affichée sur /la-salle/seminaires entre le configurateur et les specs de la salle. 2 cartes : activités plein air en autonomie (gauche) + coaching professionnel premium (droite).',
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
        crosslink: fields.object(
          {
            description: i18n('Description courte du pôle Aventure'),
            toRestaurant: i18n('Phrase narrative « Après l\'effort → Restaurant »', true),
            activityDefaultToRestaurant: i18n('Phrase narrative par défaut pour les fiches activité', true),
          },
          {
            label: 'Liens entre les pages',
            description: 'La description apparaît dans le bloc « La Terrasse c\'est aussi… » en bas de toutes les autres pages. La phrase narrative est affichée en bas de /aventure. La phrase par défaut est utilisée pour les fiches activité qui n\'ont pas leur propre phrase (chaque fiche peut la personnaliser).',
          },
        ),
      },
    }),

    offreJournee: singleton({
      label: 'Offre Pass Journée',
      path: 'src/content/pages/offre-journee',
      format: { data: 'yaml' },
      schema: {
        hero: fields.object(
          {
            eyebrow: i18n('Sur-titre (« Pass Journée »)'),
            titleLine1: i18n('Titre — 1re ligne'),
            titleLine2: i18n('Titre — 2e ligne (en couleur)'),
            desc: i18n('Paragraphe descriptif (le {discount} sera remplacé par le pourcentage)', true),
          },
          {
            label: 'En-tête de l\'offre',
            description: 'Bloc texte à gauche de la carte : sur-titre, titre en 2 lignes et paragraphe descriptif. Dans le paragraphe, écrivez {discount} pour insérer automatiquement le pourcentage défini dans Paramètres généraux → Offres.',
          },
        ),
        eligibleActivities: fields.object(
          {
            eyebrow: i18n('Sur-titre (« Grandes activités éligibles »)'),
            list: fields.array(
              fields.object({
                icon: fields.select({
                  label: 'Icône',
                  options: [
                    { label: 'Vélo (VTT)', value: 'bike' },
                    { label: 'Vagues (pédalo/paddle)', value: 'waves' },
                    { label: 'Cible (archery)', value: 'target' },
                    { label: 'Montagne', value: 'mountain' },
                    { label: 'Boussole', value: 'compass' },
                    { label: 'Ancre', value: 'anchor' },
                  ],
                  defaultValue: 'bike',
                }),
                label: i18n('Nom de l\'activité'),
              }),
              {
                label: 'Liste des grandes activités',
                description: 'Activités « phares » éligibles à l\'offre (le client doit en prendre au moins 1).',
                itemLabel: (props) => props.fields.label.fields.fr.value || 'Nouvelle activité',
              },
            ),
          },
          {
            label: 'Grandes activités éligibles',
            description: 'Petites puces colorées affichées sous le paragraphe descriptif.',
          },
        ),
        steps: fields.object(
          {
            step1Label: i18n('Étape 1 — titre'),
            step1Detail: i18n('Étape 1 — détail'),
            step2Label: i18n('Étape 2 — titre'),
            step2Detail: i18n('Étape 2 — détail'),
            step3Label: i18n('Étape 3 — titre (le {discount} sera remplacé)'),
            step3Detail: i18n('Étape 3 — détail'),
          },
          {
            label: 'Les 3 étapes de la formule',
            description: 'Encart à droite de la carte — les 3 étapes : 1 grande activité, + 2 petites, = remise. Dans l\'étape 3, écrivez {discount} pour insérer le pourcentage.',
          },
        ),
        ctas: fields.object(
          {
            discoverLabel: i18n('Bouton « Découvrir les activités »'),
            pricesLabel: i18n('Bouton « Voir les tarifs »'),
          },
          {
            label: 'Boutons d\'action',
          },
        ),
        packSuffix: i18n('Texte sous le pourcentage (« sur votre pack activités »)'),
        validity: i18n('Mention en bas de l\'encart (validité)', true),
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
          },
          {
            label: 'Bloc Coordonnées — titre uniquement',
            description: 'Titre H2 affiché au-dessus de la carte de contact. Le téléphone, l\'email et l\'adresse postale qui apparaissent dans cette carte sont définis dans Paramètres généraux → Coordonnées.',
          },
        ),
        hours: fields.object(
          {
            title: i18n('Titre de la section'),
          },
          {
            label: 'Bloc Horaires — titre uniquement',
            description: 'Titre H2 affiché au-dessus des cartes d\'horaires. Les périodes d\'ouverture et les plages horaires (activités, restaurant) sont définies dans Paramètres généraux → Horaires d\'ouverture.',
          },
        ),
        map: fields.object(
          {
            title: i18n('Titre de la carte'),
          },
          {
            label: 'Bloc Carte — titre uniquement',
            description: 'Titre H2 affiché au-dessus de la carte Google Maps. Les URLs Google Maps (lien et iframe) sont définies dans Paramètres généraux → Coordonnées.',
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

    agenda: singleton({
      label: 'Agenda',
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
        events: fields.array(
          fields.object({
            title: i18n('Nom de l\'événement'),
            date: fields.date({ label: 'Date' }),
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
            description: i18n('Description', true),
            highlighted: fields.checkbox({ label: 'Mettre en avant (style doré)', defaultValue: false }),
          }),
          {
            label: 'Événements',
            description: 'Liste des événements. Les événements passés ne s\'affichent plus automatiquement. Glissez-déposez pour réordonner.',
            itemLabel: (props) =>
              `${props.fields.date.value || '—'} · ${props.fields.title.fields.fr.value || 'Nouvel événement'}`,
          },
        ),
      },
    }),

  },
});
