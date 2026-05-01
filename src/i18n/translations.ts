export const languages = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'fr';

export const translations = {
  fr: {
    // Navigation
    'nav.restaurant': 'Restaurant',
    'nav.aventure': 'Aventure',
    'nav.salle': 'La Salle',
    'nav.agenda': 'Agenda',

    // Homepage
    'home.hero.ctaAgenda': 'Voir l\'agenda',
    'home.hero.ctaContact': 'Nous contacter',
    'home.poles.title': 'Trois façons de profiter',
    'home.poles.cta.restaurant': 'Découvrir le restaurant',
    'home.poles.cta.aventure': 'Découvrir les aventures',
    'home.poles.cta.salle': 'Découvrir la salle',
    'home.bento.title': 'Infos pratiques',
    'home.bento.info': 'Nous trouver',
    'home.bento.cta': 'Planifier votre visite',
    'home.agenda.title': 'Les rendez-vous de La Terrasse',
    'home.agenda.empty': 'Prochainement... Restez connectés !',
    'home.upcoming.title': 'Prochains événements',
    'home.upcoming.cta': 'Voir l\'agenda complet',
    'home.nearby.eyebrow': 'Que faire ?',
    'home.nearby.title': 'À découvrir à proximité',
    'home.nearby.visit': 'Visiter le site',
    'home.mudpark.eyebrow': '30 mai 2026',
    'home.mudpark.title': 'Mud Park arrive bientôt',
    'home.mudpark.intro': 'Le 30 mai 2026, la base devient le terrain de jeu de Mud Park : 24 obstacles, 4 ou 8 km dans la boue, dans le cadre UNESCO du lac.',
    'home.mudpark.body': 'Course à obstacles dans la boue, accessible de 7 à 77 ans, en famille, entre amis ou en équipe. Pas de chrono, pas de podium : juste un parcours à traverser ensemble, à son rythme, entre pinède, plage et cascades. On rit fort, on s\'éclabousse, et tout le monde finit la journée sur la terrasse.',
    'home.mudpark.dateLabel': 'Rendez-vous le',
    'home.mudpark.date': '30 mai 2026',
    'home.mudpark.placeLabel': 'Lieu',
    'home.mudpark.place': 'Base de loisir · Saint-Ferréol',
    'home.mudpark.cta': 'Découvrir Mud Park',
    'home.mudpark.ctaSecondary': 'Voir le parcours',
    'home.mudpark.imageAlt': 'Participants en pleine action sur un obstacle Mud Park',


    // Restaurant
    'restaurant.producers.title': 'Nos producteurs locaux',
    'restaurant.producers.breadcrumb': 'Nos Producteurs',
    'restaurant.menu.breadcrumb': 'La Carte',
    'restaurant.menu.empty': 'Menu à venir — restez connectés !',

    // Aventure
    'aventure.alsoLike': 'Vous pourriez aussi aimer',
    'aventure.activity.ageLabel': 'Âge',
    'aventure.activity.groupLabel': 'Groupe',
    'aventure.activity.ageFrom': 'Dès {age} ans',
    'aventure.activity.premium': 'Activité phare',
    'aventure.cta.label': 'Réserver mon aventure',
    'aventure.hub.viewActivities': 'Voir les activités',
    'aventure.hub.groupCta': 'Sortie de groupe',
    // Aventure — SEO prose section

    // Restaurant hub
    'restaurant.hub.viewMenu': 'Voir la carte',
    'restaurant.cta.label': 'Réserver ma table',
    'restaurant.subpage.carte.title': 'La Carte',
    'restaurant.subpage.producteurs.title': 'Nos Producteurs',
    // Restaurant — SEO prose section

    // La Salle — Hub
    'salle.venue.title': 'L\'espace',
    'salle.hub.seminairesCta': 'Organiser un séminaire',
    'salle.hub.evenementielCta': 'Découvrir l\'événementiel',
    'salle.venue.capacityLabel': 'personnes max.',
    'salle.venue.surfaceLabel': 'de surface',
    'salle.venue.equipmentTitle': 'Équipements',
    'salle.venue.layoutTitle': 'Idées de disposition',
    // La Salle — Les espaces (3 cards)
    // La Salle — Séminaires (page)
    'salle.seminaires.venue.eyebrow': 'L\'espace',
    'salle.seminaires.contact.eyebrow': 'Devis',
    // La Salle — Séminaires (configurateur)
    'salle.seminaires.cfg.journee': 'Journée',
    'salle.seminaires.cfg.soiree': 'Soirée',
    'salle.seminaires.cfg.journeeHours': '8h – 18h',
    'salle.seminaires.cfg.soireeHours': '17h – 23h',
    'salle.seminaires.cfg.participants': 'Nombre de participants',
    'salle.seminaires.cfg.participantsRange': 'Entre {min} et 80 personnes',
    'salle.seminaires.cfg.optionsShort': 'Options',
    'salle.seminaires.cfg.from': 'dès',
    'salle.seminaires.cfg.mealFormat': 'Format du repas',
    'salle.seminaires.cfg.activityChoice': 'Format de journée',
    'salle.seminaires.cfg.noActivity': 'En salle',
    'salle.seminaires.cfg.noActivity.sub': 'Journée complète en salle',
    'salle.seminaires.cfg.withTB': 'Salle + Team Building',
    'salle.seminaires.cfg.withTB.sub': '½ journée salle · ½ journée activité',
    'salle.seminaires.cfg.mealFull': 'Repas complet',
    'salle.seminaires.cfg.mealAperitif': 'Apéro dînatoire',
    'salle.seminaires.cfg.breakfast': 'Accueil petit déjeuner',
    'salle.seminaires.cfg.lunchFull': 'Repas midi complet',
    'salle.seminaires.cfg.coffeeBreak': 'Pause café',
    'salle.seminaires.cfg.extraHours': 'Heures supplémentaires',
    'salle.seminaires.cfg.extraHours.desc': 'Après 23h · 50 € HT / heure',
    'salle.seminaires.cfg.endAt': 'Fin à',
    'salle.seminaires.cfg.includedHours': 'Inclus : 17h – 23h (6 heures)',
    'salle.seminaires.cfg.estimate': 'Votre estimation',
    'salle.seminaires.cfg.forParticipants': 'pour {n} participants',
    'salle.seminaires.cfg.tbLine': 'Team Building',
    'salle.seminaires.cfg.coachingLine': 'Coaching pro',
    'salle.seminaires.cfg.extraHoursLine': 'h supp.',
    'salle.seminaires.cfg.totalHT': 'Total estimé HT',
    'salle.seminaires.cfg.perPerson': 'Soit {price} HT /pers.',
    'salle.seminaires.cfg.disclaimer': 'Estimation indicative HT. Le tarif exact est confirmé par devis personnalisé.',
    'salle.seminaires.cfg.ctaLabel': 'Demander un devis',
    'salle.seminaires.cfg.response24h': 'Réponse sous 24h',
    'salle.seminaires.cfg.freeQuote': 'Devis gratuit',
    'salle.seminaires.cfg.mobileHint': 'Sélectionnez vos options ci-dessus pour affiner l\'estimation.',
    'salle.seminaires.cfg.mailto.greeting': 'Bonjour,',
    'salle.seminaires.cfg.mailto.intro': 'Je souhaite obtenir un devis pour :',
    'salle.seminaires.cfg.mailto.slotJournee': 'Salle journée (8h-18h)',
    'salle.seminaires.cfg.mailto.slotSoiree': 'Salle soirée (17h-23h)',
    'salle.seminaires.cfg.mailto.slot': 'Créneau',
    'salle.seminaires.cfg.mailto.participants': 'Participants',
    'salle.seminaires.cfg.mailto.restauration': 'Restauration',
    'salle.seminaires.cfg.mailto.teamBuilding': 'Team Building',
    'salle.seminaires.cfg.mailto.coaching': '+ Coaching professionnel',
    'salle.seminaires.cfg.mailto.extraHours': 'Heures supplémentaires',
    'salle.seminaires.cfg.mailto.estimate': 'Estimation',
    'salle.seminaires.cfg.mailto.closing': 'Merci de me recontacter.',
    'salle.seminaires.cfg.mailto.subject': 'Devis séminaire',
    'salle.seminaires.cfg.mailto.formula': 'Formule',
    'salle.seminaires.cfg.mailto.flatPrice': 'Tarif forfaitaire',
    'salle.seminaires.cfg.mailto.pathDryHire': 'Location de salle',
    'salle.seminaires.cfg.mailto.pathStudyDay': 'Journée d\'étude',
    'salle.seminaires.cfg.pathDryHire': 'Location de salle',
    'salle.seminaires.cfg.pathDryHire.desc': 'Forfait location de salle uniquement',
    'salle.seminaires.cfg.pathStudyDay': 'Journée d\'étude',
    'salle.seminaires.cfg.pathStudyDay.desc': 'Salle + restauration, tout compris',
    'salle.seminaires.cfg.orLabel': 'ou',
    'salle.seminaires.cfg.durationChoice': 'Durée de location',
    'salle.seminaires.cfg.fullDay': 'Journée entière',
    'salle.seminaires.cfg.fullDayHours': '8h – 18h',
    'salle.seminaires.cfg.halfDay': 'Demi-journée',
    'salle.seminaires.cfg.halfDayHours': '4h',
    'salle.seminaires.cfg.chooseSlot': 'Choisissez votre créneau',
    'salle.seminaires.cfg.flatRate': 'forfait',
    'salle.seminaires.cfg.perPers': 'HT / pers.',
    'salle.seminaires.cfg.minPersons': '{n} pers. minimum',
    'salle.seminaires.cfg.choose': 'Choisir',
    'salle.seminaires.cfg.selected': 'Sélectionné',
    'salle.seminaires.cfg.included': 'Inclus',
    'salle.seminaires.cfg.noMeal': 'Sans restauration',
    'salle.seminaires.cfg.noMeal.desc': 'Location de salle uniquement',
    'salle.seminaires.cfg.chooseMeal': 'Restauration',
    'salle.seminaires.cfg.mealFull.cardDesc': 'Déjeuner assis complet',
    'salle.seminaires.cfg.mealApero.cardDesc': 'Formule cocktail conviviale',
    'salle.seminaires.cfg.coachingOption': 'Coaching professionnel',
    'salle.seminaires.cfg.coachingOption.desc': 'Coach dédié : Koh-Lanta, défis d\'équipe…',
    'salle.seminaires.cfg.onQuote': 'Sur devis',
    'salle.seminaires.cfg.flatSoiree': 'forfait soirée',

    // Agenda page
    'agenda.category.concert': 'Concert',
    'agenda.category.soiree-theme': 'Soirée à thème',
    'agenda.category.festival': 'Festival',
    'agenda.category.marche': 'Marché',
    'agenda.category.autre': 'Événement',

    // Transversal pages — En Famille (DEPRECATED - pages removed)

    // Transversal pages — En Groupe

    // Transversal pages — En Entreprise

    // Common
    'common.reserve': 'Réserver',
    'common.contact': 'Nous contacter',
    'common.discover': 'Découvrir',
    'common.price': 'Tarif',
    'common.duration': 'Durée',
    'common.persons': 'personnes',
    'common.alsoAt': 'La Terrasse c\'est aussi',
    'common.previous': 'Précédent',
    'common.next': 'Suivant',
    'common.requestQuote': 'Demander un devis',
    'common.requestQuoteDesc': 'Un projet en tête ? Contactez-nous pour un devis personnalisé.',
    'common.recommended': 'Recommandé',
    'common.phone': 'Téléphone',
    'common.email': 'Email',
    'common.address': 'Adresse',
    'common.openingHours': 'Horaires d\'ouverture',

    // Header / Navigation
    'nav.explore': 'Explorer',
    'nav.close': 'Fermer',
    'nav.closeMenu': 'Fermer le menu',
    'nav.submenu': 'Sous-menu',
    'nav.directions': 'S\'y rendre',
    // Header — Restaurant sub-links
    'nav.restaurant.carte': 'La carte',
    'nav.restaurant.carte.desc': 'Menu et plats de saison',
    'nav.restaurant.producteurs.desc': 'Circuits courts et producteurs locaux',
    'nav.restaurant.featured.title': 'Une cuisine au bord du lac',
    'nav.restaurant.featured.desc': 'Produits locaux, plats faits maison, vue sur le lac de Saint-Ferréol.',
    'nav.restaurant.featured.cta': 'Découvrir le restaurant',
    'nav.restaurant.crossSell': 'Après le repas, profitez des activités',
    // Header — Aventure sub-links
    'nav.aventure.aquatiques': 'Activités aquatiques',
    'nav.aventure.aquatiques.desc': 'Pédalo, paddle, canoë…',
    'nav.aventure.terrestres': 'Activités terrestres',
    'nav.aventure.terrestres.desc': 'Mini-golf, VTT, archery tag…',
    'nav.aventure.passJournee': 'Pack Activités',
    'nav.aventure.featured.title': 'Activités nature au lac',
    'nav.aventure.featured.desc': 'Aquatiques ou terrestres, seul ou en groupe, profitez du cadre.',
    'nav.aventure.featured.cta': 'Voir les activités',
    'nav.aventure.crossSell': 'Déjeunez sur place après votre activité',
    // Header — La Salle sub-links
    'nav.salle.evenementiel': 'Location événementielle',
    'nav.salle.evenementiel.desc': 'Concerts, foires, soirées privées, marchés — sur réservation',
    'nav.salle.seminairesPro': 'Séminaires & Pro',
    'nav.salle.seminairesPro.desc': 'Entreprises, associations, formations — formules sur mesure',
    'nav.salle.featured.title': 'Location de salle',
    'nav.salle.featured.desc': 'Louez notre salle pour vos événements — concerts, marchés, soirées, séminaires.',
    'nav.salle.featured.cta': 'Découvrir la salle',
    'nav.salle.crossSell': 'Combinez location de salle et restauration sur place',
    // Header — Pole labels
    'nav.pole.salle': 'La Salle',

    // Shared UI label (footer, bento card)
    'contact.map.fallback': 'Voir sur Google Maps',
    // Season enum labels (homepage Bento)
    'common.season.printemps': 'Printemps',
    'common.season.ete': 'Été',
    'common.season.automne': 'Automne',
    'common.season.hiver': 'Hiver',

    // Homepage

    // Footer
    'footer.legalNotice': 'Mentions légales',
    'footer.privacy': 'Politique de confidentialité',
    'footer.restaurantLink': 'Le restaurant',
    'footer.activitiesLink': 'Les activités',
    'footer.salleLink': 'La salle',

    // Restaurant — Menu periods
    'restaurant.menu.period.midi': 'Le Midi',
    'restaurant.menu.period.midiSub': 'Servi du lundi au dimanche',
    'restaurant.menu.period.soir': 'Le Soir',
    'restaurant.menu.period.soirSub': 'Tapas, planches & partage',
    'restaurant.menu.period.desserts': 'Les Desserts',
    'restaurant.menu.period.enfant': 'Menu Enfant',

    // Home — Bento (infos pratiques)
    'home.bento.eyebrow': 'Pratique',
    'home.bento.contactLabel': 'Contact',
    'home.bento.distance': 'À 45 min de Toulouse',
    'home.bento.ctaDesc': 'Une question ? Écrivez-nous.',

    // Home — Soirées decorative cards

    // Pass Journée (OffreJournee)

    // La Salle — Collectivités callout

    // La Salle — Hub contact CTA

    // 404
    'error.404.pageTitle': 'Page introuvable',
    'error.404.title': 'Cette page n\'existe pas',
    'error.404.description': 'Pas d\'inquiétude, vous pouvez retrouver votre chemin depuis la page d\'accueil ou utiliser le menu de navigation.',
    'error.404.cta': 'Retour à l\'accueil',
  },

  en: {
    'nav.restaurant': 'Restaurant',
    'nav.aventure': 'Adventure',
    'nav.salle': 'La Salle',
    'nav.agenda': 'What\'s On',

    'home.hero.ctaAgenda': 'See what\'s on',
    'home.hero.ctaContact': 'Contact us',
    'home.poles.title': 'Three ways to enjoy',
    'home.poles.cta.restaurant': 'Discover the restaurant',
    'home.poles.cta.aventure': 'Discover the adventures',
    'home.poles.cta.salle': 'Discover La Salle',
    'home.bento.title': 'Practical info',
    'home.bento.info': 'Find us',
    'home.bento.cta': 'Plan your visit',
    'home.agenda.title': 'Upcoming events',
    'home.agenda.empty': 'Coming soon... Stay tuned!',
    'home.upcoming.title': 'Upcoming events',
    'home.upcoming.cta': 'See full agenda',
    'home.nearby.eyebrow': 'What to do?',
    'home.nearby.title': 'Discover nearby',
    'home.nearby.visit': 'Visit website',
    'home.mudpark.eyebrow': 'May 30, 2026',
    'home.mudpark.title': 'Mud Park is coming soon',
    'home.mudpark.intro': 'On May 30, 2026, the base becomes the playground of Mud Park: 24 obstacles, 4 or 8 km through the mud, in the UNESCO-listed setting of the lake.',
    'home.mudpark.body': 'Obstacle course in the mud, open to every age from 7 to 77, families, friends or crews. No clock, no podium: just a course to cross together, at your own pace, between pine forest, beach and waterfalls. Loud laughs, big splashes — and everyone wraps up the day on the terrace.',
    'home.mudpark.dateLabel': 'Save the date',
    'home.mudpark.date': '30 May 2026',
    'home.mudpark.placeLabel': 'Where',
    'home.mudpark.place': 'Leisure base · Saint-Ferréol',
    'home.mudpark.cta': 'Discover Mud Park',
    'home.mudpark.ctaSecondary': 'See the course',
    'home.mudpark.imageAlt': 'Participants in action on a Mud Park obstacle',


    'restaurant.producers.title': 'Our local producers',
    'restaurant.producers.breadcrumb': 'Our Producers',
    'restaurant.menu.breadcrumb': 'The Menu',
    'restaurant.menu.empty': 'Menu coming soon — stay tuned!',

    'aventure.alsoLike': 'You might also like',
    'aventure.activity.ageLabel': 'Age',
    'aventure.activity.groupLabel': 'Group',
    'aventure.activity.ageFrom': 'From {age} years old',
    'aventure.activity.premium': 'Featured activity',
    'aventure.cta.label': 'Book my adventure',
    'aventure.hub.viewActivities': 'View activities',
    'aventure.hub.groupCta': 'Group outing',
    // Aventure — SEO prose section

    // Restaurant hub
    'restaurant.hub.viewMenu': 'View menu',
    'restaurant.cta.label': 'Book my table',
    'restaurant.subpage.carte.title': 'The Menu',
    'restaurant.subpage.producteurs.title': 'Our Producers',
    // Restaurant — SEO prose section

    // La Salle — Hub
    'salle.venue.title': 'The venue',
    'salle.hub.seminairesCta': 'Plan a seminar',
    'salle.hub.evenementielCta': 'Discover events',
    'salle.venue.capacityLabel': 'people max.',
    'salle.venue.surfaceLabel': 'floor area',
    'salle.venue.equipmentTitle': 'Equipment',
    'salle.venue.layoutTitle': 'Layout ideas',
    // La Salle — Les espaces (3 cards)
    // La Salle — Séminaires (page)
    'salle.seminaires.venue.eyebrow': 'The space',
    'salle.seminaires.contact.eyebrow': 'Quote',
    // La Salle — Séminaires (configurator)
    'salle.seminaires.cfg.journee': 'Full day',
    'salle.seminaires.cfg.soiree': 'Evening',
    'salle.seminaires.cfg.journeeHours': '8am – 6pm',
    'salle.seminaires.cfg.soireeHours': '5pm – 11pm',
    'salle.seminaires.cfg.participants': 'Number of participants',
    'salle.seminaires.cfg.participantsRange': 'Between {min} and 80 people',
    'salle.seminaires.cfg.optionsShort': 'Options',
    'salle.seminaires.cfg.from': 'from',
    'salle.seminaires.cfg.mealFormat': 'Meal format',
    'salle.seminaires.cfg.activityChoice': 'Day format',
    'salle.seminaires.cfg.noActivity': 'In venue',
    'salle.seminaires.cfg.noActivity.sub': 'Full day in venue',
    'salle.seminaires.cfg.withTB': 'Venue + Team Building',
    'salle.seminaires.cfg.withTB.sub': '½ day venue · ½ day activity',
    'salle.seminaires.cfg.mealFull': 'Full meal',
    'salle.seminaires.cfg.mealAperitif': 'Cocktail dinner',
    'salle.seminaires.cfg.breakfast': 'Welcome breakfast',
    'salle.seminaires.cfg.lunchFull': 'Full lunch',
    'salle.seminaires.cfg.coffeeBreak': 'Coffee break',
    'salle.seminaires.cfg.extraHours': 'Extra hours',
    'salle.seminaires.cfg.extraHours.desc': 'After 11pm · €50 excl. VAT / hour',
    'salle.seminaires.cfg.endAt': 'Ends at',
    'salle.seminaires.cfg.includedHours': 'Included: 5pm – 11pm (6 hours)',
    'salle.seminaires.cfg.estimate': 'Your estimate',
    'salle.seminaires.cfg.forParticipants': 'for {n} participants',
    'salle.seminaires.cfg.tbLine': 'Team Building',
    'salle.seminaires.cfg.coachingLine': 'Coaching',
    'salle.seminaires.cfg.extraHoursLine': 'extra hr.',
    'salle.seminaires.cfg.totalHT': 'Estimated total excl. VAT',
    'salle.seminaires.cfg.perPerson': 'i.e. {price} excl. VAT /pers.',
    'salle.seminaires.cfg.disclaimer': 'Indicative estimate excl. VAT. The exact rate is confirmed by personalised quote.',
    'salle.seminaires.cfg.ctaLabel': 'Request a quote',
    'salle.seminaires.cfg.response24h': 'Reply within 24h',
    'salle.seminaires.cfg.freeQuote': 'Free quote',
    'salle.seminaires.cfg.mobileHint': 'Select your options above to refine the estimate.',
    'salle.seminaires.cfg.mailto.greeting': 'Hello,',
    'salle.seminaires.cfg.mailto.intro': 'I would like a quote for:',
    'salle.seminaires.cfg.mailto.slotJournee': 'Venue full day (8am-6pm)',
    'salle.seminaires.cfg.mailto.slotSoiree': 'Venue evening (5pm-11pm)',
    'salle.seminaires.cfg.mailto.slot': 'Time slot',
    'salle.seminaires.cfg.mailto.participants': 'Participants',
    'salle.seminaires.cfg.mailto.restauration': 'Catering',
    'salle.seminaires.cfg.mailto.teamBuilding': 'Team Building',
    'salle.seminaires.cfg.mailto.coaching': '+ Professional coaching',
    'salle.seminaires.cfg.mailto.extraHours': 'Extra hours',
    'salle.seminaires.cfg.mailto.estimate': 'Estimate',
    'salle.seminaires.cfg.mailto.closing': 'Please get back to me.',
    'salle.seminaires.cfg.mailto.subject': 'Seminar quote',
    'salle.seminaires.cfg.mailto.formula': 'Formula',
    'salle.seminaires.cfg.mailto.flatPrice': 'Flat rate',
    'salle.seminaires.cfg.mailto.pathDryHire': 'Venue hire',
    'salle.seminaires.cfg.mailto.pathStudyDay': 'Study day',
    'salle.seminaires.cfg.pathDryHire': 'Venue hire',
    'salle.seminaires.cfg.pathDryHire.desc': 'Venue hire only, no catering',
    'salle.seminaires.cfg.pathStudyDay': 'Study day',
    'salle.seminaires.cfg.pathStudyDay.desc': 'Venue + catering included',
    'salle.seminaires.cfg.orLabel': 'or',
    'salle.seminaires.cfg.durationChoice': 'Hire duration',
    'salle.seminaires.cfg.fullDay': 'Full day',
    'salle.seminaires.cfg.fullDayHours': '8am – 6pm',
    'salle.seminaires.cfg.halfDay': 'Half day',
    'salle.seminaires.cfg.halfDayHours': '4h',
    'salle.seminaires.cfg.chooseSlot': 'Choose your time slot',
    'salle.seminaires.cfg.flatRate': 'flat rate',
    'salle.seminaires.cfg.perPers': 'excl. VAT / pers.',
    'salle.seminaires.cfg.minPersons': '{n} people minimum',
    'salle.seminaires.cfg.choose': 'Select',
    'salle.seminaires.cfg.selected': 'Selected',
    'salle.seminaires.cfg.included': 'Included',
    'salle.seminaires.cfg.noMeal': 'No catering',
    'salle.seminaires.cfg.noMeal.desc': 'Venue hire only',
    'salle.seminaires.cfg.chooseMeal': 'Catering',
    'salle.seminaires.cfg.mealFull.cardDesc': 'Full sit-down lunch',
    'salle.seminaires.cfg.mealApero.cardDesc': 'Cocktail format',
    'salle.seminaires.cfg.coachingOption': 'Professional coaching',
    'salle.seminaires.cfg.coachingOption.desc': 'Dedicated coach: team challenges…',
    'salle.seminaires.cfg.onQuote': 'On quote',
    'salle.seminaires.cfg.flatSoiree': 'evening flat rate',

    // Agenda page
    'agenda.category.concert': 'Concert',
    'agenda.category.soiree-theme': 'Theme night',
    'agenda.category.festival': 'Festival',
    'agenda.category.marche': 'Market',
    'agenda.category.autre': 'Event',

    // Transversal pages — En Famille (DEPRECATED - pages removed)

    // Transversal pages — En Groupe

    // Transversal pages — En Entreprise

    'common.reserve': 'Book now',
    'common.contact': 'Contact us',
    'common.discover': 'Discover',
    'common.price': 'Price',
    'common.duration': 'Duration',
    'common.persons': 'persons',
    'common.alsoAt': 'La Terrasse is also',
    'common.previous': 'Previous',
    'common.next': 'Next',
    'common.requestQuote': 'Request a quote',
    'common.requestQuoteDesc': 'Have a project in mind? Contact us for a personalised quote.',
    'common.recommended': 'Recommended',
    'common.phone': 'Phone',
    'common.email': 'Email',
    'common.address': 'Address',
    'common.openingHours': 'Opening hours',

    // Header / Navigation
    'nav.explore': 'Explore',
    'nav.close': 'Close',
    'nav.closeMenu': 'Close menu',
    'nav.submenu': 'Submenu',
    'nav.directions': 'Get directions',
    'nav.restaurant.carte': 'The Menu',
    'nav.restaurant.carte.desc': 'Menu and seasonal dishes',
    'nav.restaurant.producteurs.desc': 'Local producers and short supply chains',
    'nav.restaurant.featured.title': 'Lakeside dining',
    'nav.restaurant.featured.desc': 'Local products, homemade dishes, lake views at Saint-Ferréol.',
    'nav.restaurant.featured.cta': 'Discover the restaurant',
    'nav.restaurant.crossSell': 'After the meal, enjoy activities',
    'nav.aventure.aquatiques': 'Water activities',
    'nav.aventure.aquatiques.desc': 'Pedal boat, paddle, canoe…',
    'nav.aventure.terrestres': 'Land activities',
    'nav.aventure.terrestres.desc': 'Mini-golf, mountain bike, archery tag…',
    'nav.aventure.passJournee': 'Activity Pack',
    'nav.aventure.featured.title': 'Nature activities at the lake',
    'nav.aventure.featured.desc': 'Water or land, alone or in groups, enjoy the setting.',
    'nav.aventure.featured.cta': 'See activities',
    'nav.aventure.crossSell': 'Eat on site after your activity',
    // Header — La Salle sub-links
    'nav.salle.evenementiel': 'Event venue hire',
    'nav.salle.evenementiel.desc': 'Concerts, fairs, private parties, markets — by reservation',
    'nav.salle.seminairesPro': 'Seminars & Corporate',
    'nav.salle.seminairesPro.desc': 'Companies, associations, training — tailored packages',
    'nav.salle.featured.title': 'Venue hire',
    'nav.salle.featured.desc': 'Hire our venue for your events — concerts, markets, parties, seminars.',
    'nav.salle.featured.cta': 'Discover the venue',
    'nav.salle.crossSell': 'Combine venue hire with on-site catering',
    'nav.pole.salle': 'La Salle',

    // Shared UI label (footer, bento card)
    'contact.map.fallback': 'View on Google Maps',
    // Season enum labels (homepage Bento)
    'common.season.printemps': 'Spring',
    'common.season.ete': 'Summer',
    'common.season.automne': 'Autumn',
    'common.season.hiver': 'Winter',

    // Homepage

    // Footer
    'footer.legalNotice': 'Legal notice',
    'footer.privacy': 'Privacy policy',
    'footer.restaurantLink': 'The restaurant',
    'footer.activitiesLink': 'Activities',
    'footer.salleLink': 'The venue',

    // Restaurant — Menu periods
    'restaurant.menu.period.midi': 'Lunch',
    'restaurant.menu.period.midiSub': 'Served Monday to Sunday',
    'restaurant.menu.period.soir': 'Evening',
    'restaurant.menu.period.soirSub': 'Tapas, boards & sharing',
    'restaurant.menu.period.desserts': 'Desserts',
    'restaurant.menu.period.enfant': 'Kids\' Menu',

    // Home — Bento (practical info)
    'home.bento.eyebrow': 'Practical',
    'home.bento.contactLabel': 'Contact',
    'home.bento.distance': '45 min from Toulouse',
    'home.bento.ctaDesc': 'A question? Drop us a line.',

    // Home — Evenings decorative cards

    // Day Pass (OffreJournee)

    // La Salle — Community & associations callout

    // La Salle — Hub contact CTA

    // 404
    'error.404.pageTitle': 'Page not found',
    'error.404.title': 'This page does not exist',
    'error.404.description': 'Don\'t worry, you can find your way back from the homepage or use the navigation menu.',
    'error.404.cta': 'Back to homepage',
  },

  es: {
    'nav.restaurant': 'Restaurante',
    'nav.aventure': 'Aventura',
    'nav.salle': 'La Salle',
    'nav.agenda': 'Agenda',

    'home.hero.ctaAgenda': 'Ver la agenda',
    'home.hero.ctaContact': 'Contactar',
    'home.poles.title': 'Tres formas de disfrutar',
    'home.poles.cta.restaurant': 'Descubrir el restaurante',
    'home.poles.cta.aventure': 'Descubrir las aventuras',
    'home.poles.cta.salle': 'Descubrir La Salle',
    'home.bento.title': 'Información práctica',
    'home.bento.info': 'Encuéntranos',
    'home.bento.cta': 'Planifica tu visita',
    'home.agenda.title': 'Próximos eventos',
    'home.agenda.empty': 'Próximamente... ¡Mantente conectado!',
    'home.upcoming.title': 'Próximos eventos',
    'home.upcoming.cta': 'Ver agenda completa',
    'home.nearby.eyebrow': '¿Qué hacer?',
    'home.nearby.title': 'Descubrir cerca',
    'home.nearby.visit': 'Visitar el sitio',
    'home.mudpark.eyebrow': '30 de mayo de 2026',
    'home.mudpark.title': 'Mud Park llega pronto',
    'home.mudpark.intro': 'El 30 de mayo de 2026, la base se transforma en el escenario de Mud Park: 24 obstáculos, 4 u 8 km a través del barro, en el entorno UNESCO del lago.',
    'home.mudpark.body': 'Carrera de obstáculos en el barro, abierta de 7 a 77 años, en familia, entre amigos o por equipos. Sin cronómetro, sin podio: solo un recorrido para cruzar juntos, a tu ritmo, entre pinar, playa y cascadas. Risas, salpicaduras — y todos terminan el día en la terraza.',
    'home.mudpark.dateLabel': 'Reserva la fecha',
    'home.mudpark.date': '30 de mayo de 2026',
    'home.mudpark.placeLabel': 'Dónde',
    'home.mudpark.place': 'Base de ocio · Saint-Ferréol',
    'home.mudpark.cta': 'Descubrir Mud Park',
    'home.mudpark.ctaSecondary': 'Ver el recorrido',
    'home.mudpark.imageAlt': 'Participantes en plena acción en un obstáculo de Mud Park',


    'restaurant.producers.title': 'Nuestros productores locales',
    'restaurant.producers.breadcrumb': 'Nuestros Productores',
    'restaurant.menu.breadcrumb': 'La Carta',
    'restaurant.menu.empty': 'Menú próximamente — ¡mantente conectado!',

    'aventure.alsoLike': 'También te puede gustar',
    'aventure.activity.ageLabel': 'Edad',
    'aventure.activity.groupLabel': 'Grupo',
    'aventure.activity.ageFrom': 'Desde {age} años',
    'aventure.activity.premium': 'Actividad destacada',
    'aventure.cta.label': 'Reservar mi aventura',
    'aventure.hub.viewActivities': 'Ver las actividades',
    'aventure.hub.groupCta': 'Salida en grupo',
    // Aventure — SEO prose section

    // Restaurant hub
    'restaurant.hub.viewMenu': 'Ver la carta',
    'restaurant.cta.label': 'Reservar mi mesa',
    'restaurant.subpage.carte.title': 'La Carta',
    'restaurant.subpage.producteurs.title': 'Nuestros Productores',
    // Restaurant — SEO prose section

    // La Salle — Hub
    'salle.venue.title': 'El espacio',
    'salle.hub.seminairesCta': 'Organizar un seminario',
    'salle.hub.evenementielCta': 'Descubrir eventos',
    'salle.venue.capacityLabel': 'personas máx.',
    'salle.venue.surfaceLabel': 'de superficie',
    'salle.venue.equipmentTitle': 'Equipamiento',
    'salle.venue.layoutTitle': 'Ideas de disposición',
    // La Salle — Les espaces (3 cards)
    // La Salle — Séminaires (página)
    'salle.seminaires.venue.eyebrow': 'El espacio',
    'salle.seminaires.contact.eyebrow': 'Presupuesto',
    // La Salle — Séminaires (configurador)
    'salle.seminaires.cfg.journee': 'Jornada',
    'salle.seminaires.cfg.soiree': 'Noche',
    'salle.seminaires.cfg.journeeHours': '8h – 18h',
    'salle.seminaires.cfg.soireeHours': '17h – 23h',
    'salle.seminaires.cfg.participants': 'Número de participantes',
    'salle.seminaires.cfg.participantsRange': 'Entre {min} y 80 personas',
    'salle.seminaires.cfg.optionsShort': 'Opciones',
    'salle.seminaires.cfg.from': 'desde',
    'salle.seminaires.cfg.mealFormat': 'Formato de comida',
    'salle.seminaires.cfg.activityChoice': 'Formato del día',
    'salle.seminaires.cfg.noActivity': 'En sala',
    'salle.seminaires.cfg.noActivity.sub': 'Jornada completa en sala',
    'salle.seminaires.cfg.withTB': 'Sala + Team Building',
    'salle.seminaires.cfg.withTB.sub': '½ jornada sala · ½ jornada actividad',
    'salle.seminaires.cfg.mealFull': 'Comida completa',
    'salle.seminaires.cfg.mealAperitif': 'Cóctel',
    'salle.seminaires.cfg.breakfast': 'Desayuno de bienvenida',
    'salle.seminaires.cfg.lunchFull': 'Almuerzo completo',
    'salle.seminaires.cfg.coffeeBreak': 'Pausa café',
    'salle.seminaires.cfg.extraHours': 'Horas adicionales',
    'salle.seminaires.cfg.extraHours.desc': 'Después de las 23h · 50 € sin IVA / hora',
    'salle.seminaires.cfg.endAt': 'Fin a las',
    'salle.seminaires.cfg.includedHours': 'Incluido: 17h – 23h (6 horas)',
    'salle.seminaires.cfg.estimate': 'Su estimación',
    'salle.seminaires.cfg.forParticipants': 'para {n} participantes',
    'salle.seminaires.cfg.tbLine': 'Team Building',
    'salle.seminaires.cfg.coachingLine': 'Coaching pro',
    'salle.seminaires.cfg.extraHoursLine': 'h extra',
    'salle.seminaires.cfg.totalHT': 'Total estimado sin IVA',
    'salle.seminaires.cfg.perPerson': 'Es decir {price} sin IVA /pers.',
    'salle.seminaires.cfg.disclaimer': 'Estimación indicativa sin IVA. La tarifa exacta se confirma mediante presupuesto personalizado.',
    'salle.seminaires.cfg.ctaLabel': 'Solicitar presupuesto',
    'salle.seminaires.cfg.response24h': 'Respuesta en 24h',
    'salle.seminaires.cfg.freeQuote': 'Presupuesto gratuito',
    'salle.seminaires.cfg.mobileHint': 'Seleccione sus opciones arriba para afinar la estimación.',
    'salle.seminaires.cfg.mailto.greeting': 'Buenos días,',
    'salle.seminaires.cfg.mailto.intro': 'Quisiera obtener un presupuesto para:',
    'salle.seminaires.cfg.mailto.slotJournee': 'Sala jornada (8h-18h)',
    'salle.seminaires.cfg.mailto.slotSoiree': 'Sala noche (17h-23h)',
    'salle.seminaires.cfg.mailto.slot': 'Horario',
    'salle.seminaires.cfg.mailto.participants': 'Participantes',
    'salle.seminaires.cfg.mailto.restauration': 'Restauración',
    'salle.seminaires.cfg.mailto.teamBuilding': 'Team Building',
    'salle.seminaires.cfg.mailto.coaching': '+ Coaching profesional',
    'salle.seminaires.cfg.mailto.extraHours': 'Horas adicionales',
    'salle.seminaires.cfg.mailto.estimate': 'Estimación',
    'salle.seminaires.cfg.mailto.closing': 'Por favor, contácteme.',
    'salle.seminaires.cfg.mailto.subject': 'Presupuesto seminario',
    'salle.seminaires.cfg.mailto.formula': 'Fórmula',
    'salle.seminaires.cfg.mailto.flatPrice': 'Tarifa fija',
    'salle.seminaires.cfg.mailto.pathDryHire': 'Alquiler de sala',
    'salle.seminaires.cfg.mailto.pathStudyDay': 'Jornada de estudio',
    'salle.seminaires.cfg.pathDryHire': 'Alquiler de sala',
    'salle.seminaires.cfg.pathDryHire.desc': 'Solo alquiler de sala, sin restauración',
    'salle.seminaires.cfg.pathStudyDay': 'Jornada de estudio',
    'salle.seminaires.cfg.pathStudyDay.desc': 'Sala + restauración incluida',
    'salle.seminaires.cfg.orLabel': 'o',
    'salle.seminaires.cfg.durationChoice': 'Duración del alquiler',
    'salle.seminaires.cfg.fullDay': 'Jornada completa',
    'salle.seminaires.cfg.fullDayHours': '8h – 18h',
    'salle.seminaires.cfg.halfDay': 'Media jornada',
    'salle.seminaires.cfg.halfDayHours': '4h',
    'salle.seminaires.cfg.chooseSlot': 'Elija su horario',
    'salle.seminaires.cfg.flatRate': 'tarifa fija',
    'salle.seminaires.cfg.perPers': 'sin IVA / pers.',
    'salle.seminaires.cfg.minPersons': '{n} pers. mínimo',
    'salle.seminaires.cfg.choose': 'Elegir',
    'salle.seminaires.cfg.selected': 'Seleccionado',
    'salle.seminaires.cfg.included': 'Incluido',
    'salle.seminaires.cfg.noMeal': 'Sin restauración',
    'salle.seminaires.cfg.noMeal.desc': 'Alquiler de sala únicamente',
    'salle.seminaires.cfg.chooseMeal': 'Restauración',
    'salle.seminaires.cfg.mealFull.cardDesc': 'Almuerzo sentado completo',
    'salle.seminaires.cfg.mealApero.cardDesc': 'Formato cóctel convivial',
    'salle.seminaires.cfg.coachingOption': 'Coaching profesional',
    'salle.seminaires.cfg.coachingOption.desc': 'Coach dedicado: Koh-Lanta, retos de equipo…',
    'salle.seminaires.cfg.onQuote': 'Bajo presupuesto',
    'salle.seminaires.cfg.flatSoiree': 'tarifa fija noche',

    // Agenda page
    'agenda.category.concert': 'Concierto',
    'agenda.category.soiree-theme': 'Noche temática',
    'agenda.category.festival': 'Festival',
    'agenda.category.marche': 'Mercado',
    'agenda.category.autre': 'Evento',

    // Transversal pages — En Famille (DEPRECATED - pages removed)

    // Transversal pages — En Groupe

    // Transversal pages — En Entreprise

    'common.reserve': 'Reservar',
    'common.contact': 'Contáctenos',
    'common.discover': 'Descubrir',
    'common.price': 'Precio',
    'common.duration': 'Duración',
    'common.persons': 'personas',
    'common.alsoAt': 'La Terrasse también es',
    'common.previous': 'Anterior',
    'common.next': 'Siguiente',
    'common.requestQuote': 'Solicitar presupuesto',
    'common.requestQuoteDesc': '¿Tienes un proyecto en mente? Contáctenos para un presupuesto personalizado.',
    'common.recommended': 'Recomendado',
    'common.phone': 'Teléfono',
    'common.email': 'Email',
    'common.address': 'Dirección',
    'common.openingHours': 'Horarios de apertura',

    // Header / Navigation
    'nav.explore': 'Explorar',
    'nav.close': 'Cerrar',
    'nav.closeMenu': 'Cerrar menú',
    'nav.submenu': 'Submenú',
    'nav.directions': 'Cómo llegar',
    'nav.restaurant.carte': 'La Carta',
    'nav.restaurant.carte.desc': 'Menú y platos de temporada',
    'nav.restaurant.producteurs.desc': 'Productores locales y circuitos cortos',
    'nav.restaurant.featured.title': 'Cocina junto al lago',
    'nav.restaurant.featured.desc': 'Productos locales, platos caseros, vistas al lago de Saint-Ferréol.',
    'nav.restaurant.featured.cta': 'Descubrir el restaurante',
    'nav.restaurant.crossSell': 'Después de comer, disfruta de las actividades',
    'nav.aventure.aquatiques': 'Actividades acuáticas',
    'nav.aventure.aquatiques.desc': 'Hidropedal, paddle, canoa…',
    'nav.aventure.terrestres': 'Actividades terrestres',
    'nav.aventure.terrestres.desc': 'Mini-golf, BTT, archery tag…',
    'nav.aventure.passJournee': 'Pack Actividades',
    'nav.aventure.featured.title': 'Actividades en la naturaleza',
    'nav.aventure.featured.desc': 'Acuáticas o terrestres, solo o en grupo, disfruta del entorno.',
    'nav.aventure.featured.cta': 'Ver actividades',
    'nav.aventure.crossSell': 'Almuerza en el lugar después de tu actividad',
    // Header — La Salle sub-links
    'nav.salle.evenementiel': 'Alquiler para eventos',
    'nav.salle.evenementiel.desc': 'Conciertos, ferias, fiestas privadas, mercados — bajo reserva',
    'nav.salle.seminairesPro': 'Seminarios & Pro',
    'nav.salle.seminairesPro.desc': 'Empresas, asociaciones, formaciones — fórmulas a medida',
    'nav.salle.featured.title': 'Alquiler de sala',
    'nav.salle.featured.desc': 'Alquile nuestra sala para sus eventos — conciertos, mercados, fiestas, seminarios.',
    'nav.salle.featured.cta': 'Descubrir la sala',
    'nav.salle.crossSell': 'Combine alquiler de sala y restauración in situ',
    'nav.pole.salle': 'La Salle',

    // Shared UI label (footer, bento card)
    'contact.map.fallback': 'Ver en Google Maps',
    // Season enum labels (homepage Bento)
    'common.season.printemps': 'Primavera',
    'common.season.ete': 'Verano',
    'common.season.automne': 'Otoño',
    'common.season.hiver': 'Invierno',

    // Homepage

    // Footer
    'footer.legalNotice': 'Aviso legal',
    'footer.privacy': 'Política de privacidad',
    'footer.restaurantLink': 'El restaurante',
    'footer.activitiesLink': 'Actividades',
    'footer.salleLink': 'La sala',

    // Restaurant — Menu periods
    'restaurant.menu.period.midi': 'Mediodía',
    'restaurant.menu.period.midiSub': 'Servido de lunes a domingo',
    'restaurant.menu.period.soir': 'Noche',
    'restaurant.menu.period.soirSub': 'Tapas, tablas y platos para compartir',
    'restaurant.menu.period.desserts': 'Postres',
    'restaurant.menu.period.enfant': 'Menú Infantil',

    // Home — Bento (información práctica)
    'home.bento.eyebrow': 'Práctico',
    'home.bento.contactLabel': 'Contacto',
    'home.bento.distance': 'A 45 min de Toulouse',
    'home.bento.ctaDesc': '¿Una pregunta? Escríbenos.',

    // Home — Veladas decorative cards

    // Pase Día (OffreJournee)

    // La Salle — Colectividades y asociaciones

    // La Salle — Hub contact CTA

    // 404
    'error.404.pageTitle': 'Página no encontrada',
    'error.404.title': 'Esta página no existe',
    'error.404.description': 'No se preocupe, puede encontrar su camino desde la página de inicio o usar el menú de navegación.',
    'error.404.cta': 'Volver al inicio',
  },
} as const;
