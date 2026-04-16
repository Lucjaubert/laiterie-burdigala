// src/app/config/workshops.config.ts

export type WorkshopSlug =
  | 'realisez-vos-mozzarella-et-burrata'
  | 'realisez-la-celebre-burrata-cremeuse'
  | 'realisez-et-degustez-des-mozzarellas-en-groupe';

export interface WorkshopHardcoded {
  slug: WorkshopSlug;

  // Card/listing
  categoryLabel: string;       // "À manger"
  cardTitle: string;           // titre court sur la card
  cityLabel: string;           // "Bordeaux, Les Capucins"
  durationLabel: string;       // "1h30", "3h30"
  pricePerPerson: number;      // euros
  isGroupSpecial?: boolean;    // badge "Spécial groupe"

  // Detail page
  title: string;               // titre complet page détail
  ageMin: number;              // 15
  participantsMin?: number;    // 5
  participantsMax: number;     // 10
  privatizationMax?: number;   // 10
  summary: string;             // HTML allowed
  details: string;             // HTML allowed

  location: {
    title: string;
    address: string;
    pmrAccessible: boolean;
  };

  host: {
    name: string;
    jobTitle?: string; // "Laitière"
    bio: string;        // HTML allowed
    photoUrl: string;
  };

  media: {
    heroVideoUrl?: string; // later (safe url via sanitizer)
    gallery: string[];     // local assets
    cardImage: string;     // card cover
  };

  extraInfos: Array<{ label: string; value: string }>;
}

export const WORKSHOPS: WorkshopHardcoded[] = [
  {
    slug: 'realisez-vos-mozzarella-et-burrata',
    categoryLabel: 'À manger',
    cardTitle: 'Réalisez vos mozzarella et burrata',
    cityLabel: 'Bordeaux, Les Capucins',
    durationLabel: '1h30',
    pricePerPerson: 50,

    title: 'Confectionnez votre mozzarella et votre burrata avec Claire',
    ageMin: 15,
    participantsMin: 5,
    participantsMax: 10,
    privatizationMax: 10,

    summary: `
      <p>Découvrez les fondamentaux de la fabrication des fromages à pâte filée et préparez vos mozzarella et burrata avec Claire, à Bordeaux.</p>
      <ul>
        <li><b>1 h 30</b> de découverte avec Claire</li>
        <li>Des connaissances en cuisine italienne</li>
        <li>Votre mozzarella et votre burrata</li>
      </ul>
    `,

    details: `
      <p>Découvrez les secrets de la mozzarella et de la burrata avec Claire et réalisez vos propres fromages italiens à pâte filée.</p>
      <p><b>Déroulé de l'atelier :</b></p>
      <ul>
        <li><b>Préparation du caillé :</b> émiettez le caillé et ajoutez la quantité de sel nécessaire.</li>
        <li><b>Filage de la pâte :</b> filez la pâte à la main ou à l'aide d'une spatule dans de l'eau chaude.</li>
        <li><b>Façonnage des mozzarellas :</b> formez vos boules puis plongez-les dans l'eau froide.</li>
        <li><b>Fabrication de la burrata :</b> réalisez la burrata et la stracciatella étape par étape.</li>
        <li><b>Dégustation conviviale :</b> profitez d'un moment de partage et de bonne humeur autour de vos créations.</li>
      </ul>
      <p>Repartez avec vos fromages maison, prêts à être savourés ou partagés !</p>
    `,

    location: {
      title: "Lieu de l'atelier",
      address: '4 Rue des Douves, 33800 Bordeaux, France',
      pmrAccessible: false,
    },

    host: {
      name: 'Claire',
      jobTitle: 'Laitière',
      bio: `
        <p>Claire, issue du vin, avait à cœur de pouvoir exercer un métier en accord avec ses convictions : respect de l'environnement, de l'animal et une juste rémunération pour l'éleveur.</p>
        <p>Le lait est ensuite transformé en plein centre ville, sous les yeux des passants : mozzarella, burrata, et autres spécialités fromagères bio.</p>
        <p>À la Laiterie Burdigala, pas d'emballage plastique mais des bocaux en verre consigné.</p>
      `,
      photoUrl: '/assets/workshops/atelier-3.webp',
    },

    media: {
      // ✅ image de card dédiée
      cardImage: '/assets/workshops/mozzarella-burrata.webp',
      // ✅ galerie détail : 1 (paysage) + 4 portraits
      gallery: [
        '/assets/workshops/atelier-8.webp',
        '/assets/workshops/atelier-5.webp',
        '/assets/workshops/atelier-6.webp',
        '/assets/workshops/atelier-7.webp',
        '/assets/workshops/atelier-1.webp',
      ],
    },

    extraInfos: [{ label: "Langue d'animation", value: 'Français' }],
  },

  {
    slug: 'realisez-la-celebre-burrata-cremeuse',
    categoryLabel: 'À manger',
    cardTitle: 'Réalisez la célèbre burrata crémeuse',
    cityLabel: 'Bordeaux, Les Capucins',
    durationLabel: '3h30',
    pricePerPerson: 85,

    title: 'Confectionnez votre burrata crémeuse avec Claire',
    ageMin: 15,
    participantsMin: 5,
    participantsMax: 10,
    privatizationMax: 10,

    summary: `
      <p>Plongez dans l'univers des fromages à pâte filée et apprenez les étapes de fabrication de la burrata avec Claire.</p>
      <ul>
        <li><b>3 h 30</b> de découverte avec Claire</li>
        <li>Des connaissances en cuisine italienne</li>
        <li>De la burrata accompagnée d'un verre</li>
      </ul>
    `,

    details: `
      <p>Bienvenue chez Claire ! Cette passionnée des plaisirs de la table vous fera découvrir le merveilleux monde du fromage italien en immersion totale dans le laboratoire de production.</p>
      <p>Plongez dans une initiation gourmande en réalisant toutes les étapes de la burrata : faire la mozzarella, préparer la stracciatella et les combiner pour créer la burrata !</p>

      <p>Vous pourrez fabriquer les fromages comme un pro, vous aurez votre quantité de lait et procéderez tout d'abord à son acidification. Vous chaufferez ensuite le lait à <b>38°C</b> et y incorporerez la présure, afin de réaliser vous-même le caillé.</p>

      <p>Cela servira de base au filage de la pâte, à la formation des boules de mozzarella dans un premier temps.</p>
      <p>Une fois familiarisé avec la texture, vous réaliserez votre burrata, à l'aide de la pâte que vous aurez filée et de la stracciatella.</p>
      <p>Pendant l'atelier vous pourrez déguster une partie des spécialités de la maison autour d'un verre de vin.</p>
      <p><b>Convivialité et bonne humeur au rendez-vous !</b></p>
    `,

    location: {
      title: "Lieu de l'atelier",
      address: '4 Rue des Douves, 33800 Bordeaux, France',
      pmrAccessible: false,
    },

    host: {
      name: 'Claire',
      jobTitle: 'Laitière',
      bio: `
        <p>Claire vous accueille au laboratoire pour une immersion complète autour de la burrata et des fromages à pâte filée.</p>
      `,
      photoUrl: '/assets/workshops/atelier-3.webp',
    },

    media: {
      // ✅ image de card existante dans /assets/workshops/
      cardImage: '/assets/workshops/burrata-cremeuse.webp',
      // ✅ galerie détail (tu peux ajuster plus tard)
      gallery: [
        '/assets/workshops/burrata-cremeuse.webp',
        '/assets/workshops/atelier-5.webp',
        '/assets/workshops/atelier-6.webp',
        '/assets/workshops/atelier-7.webp',
        '/assets/workshops/atelier-3.webp',
      ],
    },

    extraInfos: [{ label: "Langue d'animation", value: 'Français' }],
  },

  {
    slug: 'realisez-et-degustez-des-mozzarellas-en-groupe',
    categoryLabel: 'À manger',
    cardTitle: 'Réalisez et dégustez des mozzarellas en groupe',
    cityLabel: 'Bordeaux, Les Capucins',
    durationLabel: '1h30',
    pricePerPerson: 50,
    isGroupSpecial: true,

    title: 'Réalisez et dégustez des mozzarellas en groupe avec Claire',
    ageMin: 15,
    participantsMax: 10,

    summary: `
      <p>Vivez une expérience de team building unique : confectionnez ensemble de savoureuses mozzarellas dans le laboratoire de Claire, en plein cœur de Bordeaux.</p>
      <ul>
        <li><b>1 h 30</b> d'atelier convivial avec Claire</li>
        <li>Un moment de cohésion pour votre équipe</li>
        <li>Une mozzarella maison par participant à déguster ou emporter</li>
      </ul>
    `,

    details: `
      <p><b>Un atelier pensé pour vos équipes et vos événements d'entreprise.</b></p>
      <p>Que ce soit pour un séminaire, un événement de fin d'année ou simplement une pause cohésion, cet atelier privatisé est idéal pour réunir vos collaborateurs autour d'une expérience gourmande et originale.</p>

      <p>Claire vous accueille dans son laboratoire pour une session privative. Ensemble, vous réalisez étape par étape vos mozzarellas maison : du filage de la pâte au façonnage des boules, jusqu'à la dégustation.</p>

      <p><b>Déroulé de l'atelier :</b></p>
      <ul>
        <li><b>Accueil et présentation :</b> Claire vous présente le laboratoire et les coulisses du métier de laitière.</li>
        <li><b>Mise en pratique :</b> chaque participant fabrique sa propre mozzarella sous la guidance bienveillante de Claire.</li>
        <li><b>Dégustation collective :</b> savourez ensemble vos créations dans une ambiance conviviale et festive.</li>
        <li><b>Échanges et anecdotes :</b> découvrez les secrets du fromage italien et l'histoire de la Laiterie Burdigala.</li>
      </ul>

      <p>Repartez avec vos mozzarellas maison et de beaux souvenirs partagés !</p>

      <p><b>Tarifs groupe :</b> 50 € TTC par personne. Pour un groupe de 5 à 7 participants, un forfait privatisation de 200 € s'applique. À partir de 8 participants, aucun supplément de privatisation.</p>
      <p><i>Prestation possible dans vos locaux sur devis. Si vous souhaitez des options supplémentaires (animation, dégustation étendue…), précisez-le lors de votre demande.</i></p>
    `,

    location: {
      title: "Lieu de l'atelier",
      address: '4 Rue des Douves, 33800 Bordeaux, France',
      pmrAccessible: false,
    },

    host: {
      name: 'Claire',
      jobTitle: 'Laitière',
      bio: `
        <p>Claire, issue du vin, a à cœur d'exercer un métier en accord avec ses convictions : respect de l'environnement, de l'animal et une juste rémunération pour l'éleveur.</p>
        <p>Elle transforme le lait en plein centre ville de Bordeaux — mozzarella, burrata et autres spécialités fromagères bio — et partage sa passion à travers des ateliers dédiés aux équipes et aux groupes.</p>
      `,
      photoUrl: '/assets/workshops/atelier-3.webp',
    },

    media: {
      // ✅ image de card existante dans /assets/workshops/
      cardImage: '/assets/workshops/mozzarellas-groupe.webp',
      // ✅ galerie détail (tu peux ajuster plus tard)
      gallery: [
        '/assets/workshops/mozzarellas-groupe.webp',
        '/assets/workshops/atelier-3.webp',
        '/assets/workshops/atelier-6.webp',
        '/assets/workshops/atelier-7.webp',
        '/assets/workshops/atelier-5.webp',
      ],
    },

    extraInfos: [{ label: "Langue d'animation", value: 'Français' }],
  },
];

export function getWorkshopBySlug(slug: string): WorkshopHardcoded | null {
  return WORKSHOPS.find(w => w.slug === slug) ?? null;
}
