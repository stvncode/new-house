import type { Dict } from './en'

export const fr: Dict = {
  common: {
    confirm: 'Confirmer',
    cancel: 'Annuler',
  },

  site: {
    name: 'Foyer',
    tagline: 'Planifiez votre maison connectée avant de fermer les murs.',
    nav: { home: 'Accueil', wizard: 'Guide', planner: 'Planificateur', guides: 'Apprendre' },
    footer: 'Conçu pour celles et ceux qui câblent leur première (ou dernière) maison. Open source.',
    language: 'Langue',
  },

  home: {
    heroKicker: 'La domotique se planifie tôt',
    heroTitle: 'Les décisions domotiques qui comptent se prennent avant d’emménager',
    heroSubtitle:
      'Protocoles, câbles, couverture réseau, budget — Foyer vous guide dans les choix coûteux à changer plus tard, puis vous laisse planifier votre vraie maison, pièce par pièce, en 3D.',
    ctaWizard: 'Lancer le guide',
    ctaPlanner: 'Planifier ma maison',
    heroHint: 'C’est un vrai plan — faites-le pivoter',
    features: {
      wizard: {
        title: 'Un guide qui pose les bonnes questions',
        body: 'Dix questions sur votre projet — construction neuve ou location, surface, budget, vie privée — transformées en recommandations concrètes par des règles écrites comme raisonnerait un expert, pas un quiz qui vend des gadgets.',
      },
      planner: {
        title: 'Votre maison, pas une checklist générique',
        body: 'Tracez les pièces depuis votre plan et Foyer construit une maquette 3D vivante. Planifiez les équipements pièce par pièce, suivez le budget en direct, et exportez une liste d’achats et un cahier de câblage pour votre électricien.',
      },
      guides: {
        title: 'Comprendre le pourquoi',
        body: 'Chaque recommandation renvoie vers un guide en langage clair : Zigbee vs Thread vs KNX, quoi pré-câbler, comment couvrir une grande maison sans zones mortes. Sans liens sponsorisés.',
      },
    },
    statDevices: 'équipements planifiés',
    statBudget: 'budget estimé',
    statRooms: 'pièces',
  },

  wizard: {
    title: 'Le guide de décision',
    subtitle: 'Quelques minutes maintenant, des années de « bien joué ». Répondez à ce que vous savez — tout est modifiable.',
    stepOf: (current: number, total: number) => `Question ${current} sur ${total}`,
    next: 'Suivant',
    back: 'Retour',
    seeResults: 'Voir mes recommandations',
    restart: 'Recommencer',
    multiHint: 'Plusieurs choix possibles',
    questions: {
      stage: {
        title: 'Où en est votre projet ?',
        help: 'C’est le facteur n°1 — des murs ouverts changent tout.',
        options: {
          'new-build': { label: 'Construction neuve', hint: 'Murs pas encore fermés — jackpot' },
          renovation: { label: 'Grosse rénovation', hint: 'Certains murs vont s’ouvrir' },
          existing: { label: 'Logement existant', hint: 'On fait avec l’existant' },
        },
      },
      size: {
        title: 'Quelle est la surface ?',
        help: 'Au-delà de ~200 m², la couverture sans fil et la densité du maillage deviennent un projet à part entière.',
        options: {
          s: { label: 'Moins de 100 m²' },
          m: { label: '100 – 200 m²' },
          l: { label: '200 – 350 m²' },
          xl: { label: 'Plus de 350 m²' },
        },
      },
      floors: {
        title: 'Combien de niveaux ?',
        help: 'Comptez le sous-sol et les combles aménagés — ce sont les planchers qui tuent les ondes.',
        options: {
          one: { label: 'Plain-pied' },
          two: { label: 'Deux niveaux' },
          'three-plus': { label: 'Trois ou plus' },
        },
      },
      ownership: {
        title: 'Êtes-vous propriétaire ?',
        help: 'Les locataires peuvent faire beaucoup — juste rien qui vive dans un mur.',
        options: {
          owner: { label: 'Propriétaire' },
          tenant: { label: 'Locataire' },
        },
      },
      skill: {
        title: 'Quel est votre niveau technique ?',
        help: 'Soyez honnête — cela change le hub et la part de bricolage qu’on vous suggère.',
        options: {
          beginner: { label: 'Débutant', hint: 'Je veux que ça marche, point' },
          comfortable: { label: 'À l’aise', hint: 'Je peux suivre un bon tutoriel' },
          tinkerer: { label: 'Bidouilleur', hint: 'Le YAML ne me fait pas peur' },
        },
      },
      budget: {
        title: 'Quel budget équipements ?',
        help: 'Hors main-d’œuvre de l’électricien. Vous pouvez (et devriez) l’étaler sur plusieurs années.',
        options: {
          starter: { label: 'Moins de 1 000 €' },
          mid: { label: '1 000 – 3 000 €' },
          high: { label: '3 000 – 8 000 €' },
          pro: { label: 'Plus de 8 000 €' },
        },
      },
      priorities: {
        title: 'Qu’est-ce qui compte vraiment pour vous ?',
        help: 'Choisissez ce que vous utiliserez chaque semaine — pas ce qui impressionne en démo.',
        options: {
          lighting: { label: 'Éclairage' },
          climate: { label: 'Chauffage & clim' },
          security: { label: 'Sécurité' },
          blinds: { label: 'Volets & stores' },
          energy: { label: 'Suivi énergie' },
          media: { label: 'Voix & multimédia' },
          presence: { label: 'Automatisations de présence' },
        },
      },
      privacy: {
        title: 'Et le cloud, vous en pensez quoi ?',
        help: 'Le « local d’abord » : tout continue de fonctionner quand internet — ou un fabricant — disparaît.',
        options: {
          'local-only': { label: 'Local uniquement', hint: 'Mes données restent chez moi' },
          mixed: { label: 'Mix pragmatique', hint: 'Cœur local, extras cloud' },
          'cloud-ok': { label: 'Le cloud me va', hint: 'Le confort d’abord' },
        },
      },
      wiring: {
        title: 'Quelle dose de câblage ?',
        help: 'Le filaire est invisible, fiable et éternel — mais bon marché uniquement murs ouverts.',
        options: {
          'max-wired': { label: 'Câbler tout ce qui peut l’être' },
          'some-wiring': { label: 'Les liaisons clés seulement' },
          'no-wiring': { label: 'Tout en sans-fil' },
        },
      },
      maintenance: {
        title: 'Installer et oublier, ou passion ?',
        help: 'Les deux se respectent — mais mènent à des systèmes très différents.',
        options: {
          'set-forget': { label: 'Installer et oublier', hint: 'J’y touche une fois par an' },
          tinker: { label: 'C’est un hobby', hint: 'Des soirées bien remplies' },
        },
      },
    },
  },

  results: {
    title: 'Vos recommandations',
    subtitle:
      'Basées sur vos réponses. Chaque carte renvoie vers un guide qui explique le raisonnement — lisez-les avant de dépenser.',
    editAnswers: 'Modifier mes réponses',
    share: 'Copier le lien de partage',
    shareCopied: 'Lien copié — quiconque l’ouvre voit ces recommandations',
    planCta: 'Appliquer à mon plan de maison',
    readGuide: 'Lire le guide',
    categories: {
      ecosystem: 'Écosystème & hub',
      protocol: 'Protocoles',
      wiring: 'Câblage & pré-câblage',
      network: 'Réseau & couverture',
      devices: 'Équipements',
      strategy: 'Stratégie',
    },
  },

  recommendations: {
    'eco-ha-green': {
      title: 'Commencez avec Home Assistant Green',
      body: 'Un hub prêt à brancher qui fait tourner Home Assistant — la plus grande plateforme domotique open source. Compatible avec presque tout, il garde vos données à la maison et grandit avec vous. Ajoutez une clé USB Zigbee/Thread et vous êtes tranquille pour des années.',
    },
    'eco-ha-standard': {
      title: 'Home Assistant comme cerveau',
      body: 'Une plateforme open source pour unifier toutes les marques et tous les protocoles, en contrôle local et sans abonnement. Vu votre aisance, faites-la tourner sur une petite machine (Home Assistant Yellow, mini-PC ou Pi) pour garder de la marge : enregistrement caméra, assistants vocaux, add-ons.',
    },
    'eco-local-first': {
      title: 'Achetez « local d’abord », toujours',
      body: 'Vous avez dit local uniquement — appliquez-le dès l’achat. Préférez les appareils Zigbee, Z-Wave, Thread ou à API locale, et fuyez tout ce qui s’arrête quand le cloud du fabricant tousse. Bon filtre : « ça marche, internet débranché ? »',
    },
    'proto-zigbee-backbone': {
      title: 'Zigbee comme cheval de trait',
      body: 'Pour les capteurs, boutons, ampoules et prises, Zigbee est le point d’équilibre : peu cher, choix énorme, économe en pile, et son maillage se renforce à chaque appareil sur secteur ajouté. Une seule clé coordinatrice couvre tout le système.',
    },
    'proto-thread-matter': {
      title: 'Gardez un œil sur Thread & Matter',
      body: 'Thread est le maillage nouvelle génération, aussi économe mais mieux intégré à l’IP ; Matter est la couche de compatibilité au-dessus. À prix comparable, choisir des appareils compatibles Thread est une façon raisonnable de préparer l’avenir sans parier la maison dessus.',
    },
    'proto-knx-consider': {
      title: 'Étudiez sérieusement KNX pour le socle',
      body: 'Neuf, budget confortable, « installer et oublier » : c’est exactement le profil KNX. Un bus filaire standardisé depuis plus de 30 ans, multi-fabricants — éclairage, volets et chauffage fonctionnent des décennies, sans pile ni appairage. Associez-le à Home Assistant pour la couche intelligente, et faites chiffrer par un intégrateur KNX avant de figer le plan électrique.',
    },
    'proto-zwave-security': {
      title: 'Z-Wave pour serrures et sécurité',
      body: 'Pour les serrures, sirènes et capteurs de sécurité, l’interopérabilité certifiée de Z-Wave, son chiffrement et sa bande radio séparée (zéro congestion Wi-Fi) en font le choix fiable et conservateur en Europe.',
    },
    'proto-wifi-caution': {
      title: 'Rationnez les appareils Wi-Fi',
      body: 'Quelques appareils Wi-Fi, ça va — mais chacun concurrence vos ordinateurs et vos streamings, et les moins chers appellent souvent leur cloud. Réservez le Wi-Fi au haut débit (caméras, enceintes) et mettez la myriade de capteurs sur un protocole maillé.',
    },
    'wire-ethernet-everywhere': {
      title: 'Tirez de l’Ethernet vers chaque pièce — maintenant',
      body: 'Murs ouverts, le Cat6a coûte quelques centimes le mètre ; après, chaque liaison coûte des centaines d’euros. Deux prises par pièce, une à chaque emplacement TV/bureau, une dans les angles de plafond pour les futurs points d’accès et caméras, le tout en étoile vers une baie technique. On ne regrette jamais un câble tiré.',
    },
    'wire-neutral-everywhere': {
      title: 'Un neutre dans chaque boîte d’interrupteur',
      body: 'La plupart des micromodules ont besoin d’un neutre pour s’alimenter. Demandez à l’électricien un neutre dans chaque boîte, et des boîtes profondes (50 mm et plus) tant qu’il y est — ça ne coûte presque rien maintenant et ça décide des appareils possibles pour 30 ans.',
    },
    'wire-conduits': {
      title: 'Surdimensionnez les gaines, laissez des aiguilles',
      body: 'L’assurance la moins chère du neuf : des gaines plus larges que nécessaire, une aiguille de tirage dans chacune, et une gaine vide du local technique vers chaque étage, les combles et l’extérieur. Quel que soit le standard de 2040, vous pourrez le tirer.',
    },
    'wire-shutters': {
      title: 'Câblez les volets et stores',
      body: 'Les volets motorisés sont l’une des automatisations les plus satisfaisantes — mais amener du courant à chaque fenêtre après coup est pénible. Prévoyez des moteurs filaires (ou au minimum l’alimentation à chaque fenêtre), pilotés par un module par volet, et évitez les télécommandes propriétaires.',
    },
    'wire-tenant-friendly': {
      title: 'Une domotique sans perceuse reste une vraie domotique',
      body: 'Tout ce que vous installez doit pouvoir déménager avec vous : ampoules connectées plutôt que micromodules, prises intermédiaires, capteurs à pile sur adhésif repositionnable, un hub qui voyage. Éclairage, climat, présence et sécurité s’automatisent très bien sans toucher un mur.',
    },
    'net-wired-aps': {
      title: 'Plusieurs points d’accès filaires, pas des répéteurs',
      body: 'À cette surface, un seul routeur ne couvrira pas la maison, et les répéteurs sans fil divisent le débit en multipliant les bizarreries. Le schéma fiable : deux points d’accès plafond ou plus, chacun alimenté en Ethernet, sur un seul nom de réseau.',
    },
    'net-poe': {
      title: 'Du PoE pour l’infrastructure',
      body: 'Un switch PoE dans le local technique alimente points d’accès, caméras, sonnette et tablettes murales par le câble qui transporte déjà leurs données — zéro bloc secteur, tout sur un seul onduleur, et redémarrage à distance quand un appareil boude.',
    },
    'net-mesh-density': {
      title: 'Dimensionnez votre maillage',
      body: 'Les réseaux Zigbee et Thread routent via les appareils sur secteur ; les capteurs à pile ne relaient pas. Dans une grande maison ou sur plusieurs niveaux, prévoyez quelques appareils toujours alimentés (prises, modules) par étage comme colonne vertébrale — et méfiez-vous des planchers chauffants ou épais, qui peuvent imposer un relais par niveau.',
    },
    'net-technical-room': {
      title: 'Donnez un chez-soi au système',
      body: 'Réservez un emplacement ventilé — un demi-placard suffit — pour une petite baie : panneau de brassage, switch, routeur, hub, NVR, onduleur. Centraliser transforme chaque évolution future en opération de dix minutes au lieu d’une fouille archéologique.',
    },
    'dev-presence-mmwave': {
      title: 'Capteurs de présence mmWave pour les pièces à vivre',
      body: 'Les détecteurs de mouvement classiques deviennent aveugles dès qu’on ne bouge plus ; le radar mmWave perçoit une personne qui respire dans le canapé. Mettez du mmWave là où l’on s’attarde (salon, bureau) et des PIR bon marché dans les zones de passage.',
    },
    'dev-energy-monitoring': {
      title: 'Mesurez avant d’optimiser',
      body: 'Une pince ampèremétrique au tableau montre toute la maison en temps réel ; des prises connectées sur les appareils suspects débusquent les gouffres. La mesure se rembourse en général toute seule — les veilles cachent souvent 5 à 10 % de la facture.',
    },
    'dev-climate': {
      title: 'Le chauffage, c’est l’automatisation rentable',
      body: 'Le pilotage pièce par pièce est là où la domotique paie vraiment : têtes thermostatiques connectées (ou l’intégration de votre PAC) plus un capteur de température par pièce, avec des programmes qui suivent l’occupation réelle. Le confort monte, la facture descend.',
    },
    'dev-safety-baseline': {
      title: 'Le socle sécurité, sans paillettes',
      body: 'Avant tout le reste : détecteurs de fumée interconnectés à chaque étage, et un capteur de fuite sous chaque point d’eau — lave-linge, lave-vaisselle, chauffe-eau, chaque salle de bain. Ça coûte moins cher qu’une seule franchise d’assurance.',
    },
    'strategy-phased-rollout': {
      title: 'Étalez — le bon premier euro',
      body: 'Dépensez dans cet ordre : le hub, puis le socle sécurité, puis l’éclairage et la présence dans les trois pièces que vous utilisez le plus. Vivez avec quelques mois avant d’étendre — votre deuxième vague d’achats sera bien mieux choisie que la première.',
    },
    'strategy-wire-now-devices-later': {
      title: 'Mettez l’argent dans les murs d’abord',
      body: 'Budget serré dans du neuf : l’infrastructure bat les gadgets à tous les coups. Câbles, neutres, gaines et boîtes maintenant ; les appareils viendront une paie à la fois. L’inverse est impossible.',
    },
    'strategy-start-small': {
      title: 'Commencez plus petit que l’envie',
      body: 'Vous avez coché beaucoup de priorités — bon instinct, mais chaque domaine a sa courbe d’apprentissage. Réussissez-en un de bout en bout (souvent l’éclairage) pour que la famille fasse confiance au système, puis étendez. Une maison qui marche à 80 % bat une maison qui épate à 20 %.',
    },
  },

  planner: {
    title: 'Planificateur de maison',
    subtitle: 'Tracez votre plan, puis meublez-le avec les bons équipements.',
    tabs: { plan: 'Plan 2D', house: 'Maison 3D', list: 'Liste d’achats' },
    floors: 'Niveaux',
    addFloor: 'Ajouter un niveau',
    deleteFloor: 'Supprimer ce niveau',
    deleteFloorConfirm: 'Supprimer ce niveau et toutes ses pièces ?',
    groundFloor: 'Rez-de-chaussée',
    floorN: (n: number) =>
      n === 0 ? 'Rez-de-chaussée' : n < 0 ? `Sous-sol ${-n}` : `Étage ${n}`,
    rooms: 'Pièces',
    noRooms: 'Aucune pièce — dessinez-en une sur le plan.',
    drawRoom: 'Dessiner une pièce',
    drawingHint:
      'Cliquez pour poser les angles · Retour arrière (ou clic sur le dernier angle) le supprime · cliquez le premier angle ou Entrée pour fermer · Échap annule',
    select: 'Sélection',
    deleteRoom: 'Supprimer la pièce',
    roomName: 'Nom de la pièce',
    roomType: 'Type de pièce',
    devices: 'Équipements',
    suggested: 'Suggérés pour cette pièce',
    loadExample: 'Charger la maison témoin',
    clearAll: 'Repartir de zéro',
    clearConfirm: 'Supprimer tout le projet ? Action irréversible.',
    area: (m2: string) => `${m2} m²`,
    totalBudget: 'Budget estimé',
    totalDevices: 'Équipements',
    exportJson: 'Exporter le projet',
    importJson: 'Importer un projet',
    importError: 'Ce fichier ne ressemble pas à un projet Foyer.',
    print: 'Imprimer / PDF',
    emptyList: 'Aucun équipement planifié. Sélectionnez une pièce et ajoutez-en.',
    listHeaders: {
      device: 'Équipement',
      category: 'Catégorie',
      qty: 'Qté',
      unit: 'Prix unitaire',
      total: 'Total',
      rooms: 'Pièces',
    },
    wiringNotes: 'Notes de câblage pour votre électricien',
    wiringNeutral: (rooms: string) =>
      `Neutre + boîtes profondes nécessaires dans : ${rooms}`,
    wiringPoE: (count: number) =>
      `${count} équipement(s) gagneraient à être en Ethernet/PoE — prévoyez les liaisons avant de fermer les murs`,
    is3dEmpty: 'Dessinez au moins une pièce sur le plan 2D pour voir la maison.',
    background: 'Image du plan',
    backgroundHint:
      'Optionnel : chargez une photo/un scan de votre plan pour décalquer. Conservée localement dans votre navigateur — elle ne quitte jamais votre appareil.',
    removeBackground: 'Retirer l’image',
    showImage: 'Afficher l’image',
    hideImage: 'Masquer l’image',
    roomDeleted: 'Pièce supprimée',
    floorDeleted: 'Niveau supprimé',
    projectCleared: 'Projet réinitialisé',
    exported: 'Projet exporté',
    calibrate: 'Calibrer l’échelle',
    calibrateHint:
      'Cliquez les deux extrémités d’une distance connue sur le plan — une cote imprimée fonctionne très bien.',
    calibrateTitle: 'Distance réelle',
    calibrateBody: 'Saisissez la distance réelle entre les deux points cliqués.',
    calibrateMeters: 'Distance en mètres',
    calibrateDone: 'Échelle calibrée — surfaces et budget utilisent désormais les vraies dimensions',
    calibrateInvalid: 'Saisissez une distance valide en mètres',
    editHint:
      'Glissez les angles pour ajuster · double-clic sur un angle pour le supprimer · cliquez un point d’arête pour en ajouter · glissez les points d’équipement pour les placer',
    undo: 'Annuler',
    redo: 'Rétablir',
    profileHint: 'Adapté à vos réponses du guide',
    planDialogTitle: 'À quel niveau correspond ce plan ?',
    planDialogBody:
      'Le plan et ses pièces détectées seront affectés au niveau choisi.',
    planDialogReplaceWarning: 'Remplace le plan et les pièces existants de ce niveau',
    planDialogNewFloor: 'Ajouter comme nouveau niveau',
    detect: 'Détecter les pièces',
    detecting: 'Analyse du plan…',
    detected: (n: number) =>
      `${n} pièce${n > 1 ? 's' : ''} détectée${n > 1 ? 's' : ''} — vérifiez les formes, puis nommez et typez. Supprimez et redessinez celles qui sont ratées.`,
    detectNone:
      'Aucune pièce trouvée. Fonctionne mieux avec un plan propre : murs sombres sur papier clair, bon contraste. Vous pouvez toujours tracer à la main.',
  },

  roomTypes: {
    living: 'Salon',
    kitchen: 'Cuisine',
    dining: 'Salle à manger',
    bedroom: 'Chambre',
    bathroom: 'Salle de bain',
    toilet: 'WC',
    office: 'Bureau',
    hallway: 'Couloir',
    entrance: 'Entrée',
    garage: 'Garage',
    laundry: 'Buanderie',
    technical: 'Local technique',
    outdoor: 'Extérieur',
    other: 'Autre',
  },

  tiers: { essential: 'Essentiel', comfort: 'Confort', premium: 'Premium' },

  deviceCategories: {
    hub: 'Hub',
    lighting: 'Éclairage',
    climate: 'Climat',
    sensors: 'Capteurs',
    security: 'Sécurité',
    blinds: 'Volets',
    energy: 'Énergie',
    network: 'Réseau',
    media: 'Multimédia',
  },

  catalog: {
    'hub-home-assistant': 'Hub Home Assistant (Green ou équivalent)',
    'switch-module': 'Micromodule interrupteur',
    'dimmer-module': 'Micromodule variateur',
    'smart-bulb': 'Ampoule connectée',
    'wireless-button': 'Bouton / télécommande sans fil',
    'motion-sensor': 'Détecteur de mouvement (PIR)',
    'presence-sensor-mmwave': 'Capteur de présence (mmWave)',
    'door-window-sensor': 'Capteur porte / fenêtre',
    'temp-humidity-sensor': 'Capteur température & humidité',
    'air-quality-sensor': 'Capteur qualité d’air (CO₂)',
    'smart-thermostat': 'Thermostat connecté',
    'radiator-valve': 'Tête thermostatique connectée',
    'smoke-detector': 'Détecteur de fumée connecté',
    'leak-sensor': 'Capteur de fuite d’eau',
    'smart-lock': 'Serrure connectée',
    'video-doorbell': 'Sonnette vidéo',
    'camera-outdoor': 'Caméra extérieure (PoE)',
    siren: 'Sirène intérieure',
    'shutter-module': 'Module volet roulant',
    'curtain-motor': 'Moteur de rideau',
    'smart-plug': 'Prise connectée avec mesure',
    'energy-meter': 'Compteur d’énergie maison (pince)',
    'wifi-ap': 'Point d’accès Wi-Fi (plafond)',
    'poe-switch': 'Switch réseau PoE',
    'voice-satellite': 'Satellite assistant vocal',
    'wall-tablet': 'Tablette murale de contrôle',
  },

  guides: {
    title: 'Apprendre',
    subtitle: 'Le raisonnement derrière les recommandations — écrit pour des humains, pas pour des liens sponsorisés.',
    readMore: 'Lire',
    backToGuides: 'Tous les guides',
    minRead: (n: number) => `${n} min de lecture`,
  },
}
