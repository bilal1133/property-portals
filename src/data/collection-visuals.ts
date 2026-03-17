export type CollectionVisual = {
  src: string;
  alt: string;
  kicker: string;
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
    caption:
      "The current public reference visual from DHA Lahore's Phase X article. It gives the board a recognizable project image until stronger ground photography is available.",
    sourceHref: "https://dhalahore.org/dha-phase-x-the-mega-city-of-the-future/",
    sourceLabel: "DHA Lahore",
    objectPosition: "center center",
  },
};

export function getCollectionVisual(slug: string) {
  return collectionVisuals[slug] ?? null;
}
