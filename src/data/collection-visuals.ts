export type CollectionVisual = {
  src: string;
  alt: string;
  kicker: string;
  location: string;
  spotlight: string;
  caption: string;
  sourceHref: string;
  sourceLabel: string;
  objectPosition?: string;
};

const collectionVisuals: Record<string, CollectionVisual> = {
  "mangla-green-housing": {
    src: "/collection-visuals/mangla-green-housing-hero.jpg",
    alt: "Aerial view of the lakeside terrain and residential plots at Mangla Green Housing.",
    kicker: "Official aerial view",
    location: "Mangla, Mirpur",
    spotlight: "Lakeside masterplan and residential footprint",
    caption:
      "A live look at the lakeside terrain and residential footprint used on the official Mangla Green Housing site.",
    sourceHref: "https://mghpakistan.com/new/",
    sourceLabel: "MGH Pakistan",
    objectPosition: "center center",
  },
  "phase-10": {
    src: "/collection-visuals/phase-10-hero.jpeg",
    alt: "Official DHA Lahore Phase X illustration used for project positioning.",
    kicker: "Official Phase X visual",
    location: "DHA Lahore Phase X",
    spotlight: "Project positioning visual from DHA Lahore",
    caption:
      "The current public reference visual from DHA Lahore's Phase X article. It gives the board a recognizable project image until stronger ground photography is available.",
    sourceHref: "https://dhalahore.org/dha-phase-x-the-mega-city-of-the-future/",
    sourceLabel: "DHA Lahore",
    objectPosition: "center center",
  },
  "dha-queeta": {
    src: "/collection-visuals/dha-queeta-hero.jpg",
    alt: "Official DHA Quetta gateway render with the entry boulevard and planned urban frontage.",
    kicker: "Official DHA Quetta render",
    location: "Main RCD Highway, Quetta",
    spotlight: "Gateway render and planned urban frontage",
    caption:
      "An official DHA Quetta render used publicly to present the entry boulevard and planned project frontage.",
    sourceHref: "https://dhaquetta.pk/",
    sourceLabel: "DHA Quetta",
    objectPosition: "center bottom",
  },
};

export function getCollectionVisual(slug: string) {
  return collectionVisuals[slug] ?? null;
}
