const STRAPI_BASE_URL =
  process.env.STRAPI_BASE_URL ?? "https://omniback-production.up.railway.app/api";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const REVALIDATE_SECONDS = 300;
const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

export type MarketType = "plot" | "file" | "home";
export type MarketDirection = "up" | "down" | "flat" | null;
export type MarketState = "ready" | "empty" | "unavailable";

type CmsListResponse<T> = {
  data: T[];
};

type CmsCollection = {
  id: number;
  documentId: string;
  name: string;
  updatedAt?: string;
};

type CmsPricePoint = {
  id?: number;
  __component?: string;
  price?: string | null;
  time?: string | null;
};

type CmsProduct = {
  id: number;
  documentId: string;
  name: string;
  description?: string | null;
  type?: MarketType;
  updatedAt?: string;
  price?: CmsPricePoint[] | null;
  collection?: {
    id: number;
    documentId: string;
    name: string;
  } | null;
};

type PricePoint = {
  value: number;
  time: string;
};

export type MappedProductCard = {
  id: string;
  name: string;
  description: string;
  type: MarketType;
  collectionId: string;
  collectionName: string;
  currentPrice: number | null;
  previousPrice: number | null;
  direction: MarketDirection;
  delta: number | null;
  latestTime: string | null;
  sparklinePoints: number[];
  pricePointCount: number;
  priceHistory: PricePoint[];
};

export type MappedCollectionSection = {
  id: string;
  slug: string;
  anchorId: string;
  name: string;
  productCount: number;
  hasProducts: boolean;
  latestUpdateLabel: string;
  groups: Array<{
    type: MarketType;
    label: string;
    products: MappedProductCard[];
  }>;
};

export type MappedCollectionCard = {
  id: string;
  slug: string;
  name: string;
  productCount: number;
  hasProducts: boolean;
  latestUpdateLabel: string;
  featuredProducts: MappedProductCard[];
};

export type MappedArchiveRow = {
  date: string;
  values: Record<
    string,
    {
      price: number;
      delta: number | null;
      direction: MarketDirection;
    } | null
  >;
};

export type MarketHomepageData = {
  state: MarketState;
  sections: MappedCollectionSection[];
  collectionCards: MappedCollectionCard[];
  totalCollections: number;
  totalProducts: number;
  lastUpdatedLabel: string;
  collectionLinks: Array<{
    slug: string;
    label: string;
  }>;
  pulseProducts: MappedProductCard[];
  productOptions: string[];
};

export type CollectionPageData = {
  state: MarketState;
  collection: MappedCollectionSection;
  allProducts: MappedProductCard[];
  pulseProducts: MappedProductCard[];
  archiveRows: MappedArchiveRow[];
  productOptions: string[];
};

export async function getMarketHomepageData(): Promise<MarketHomepageData> {
  if (!STRAPI_API_TOKEN) {
    return emptyHomepageResult("unavailable");
  }

  try {
    const { collections, products } = await loadMarketSource();
    const sections = mapCollections(collections, products);
    const liveProducts = sections.flatMap(flattenSectionProducts);
    const lastUpdatedLabel = getLastUpdatedLabel(collections, liveProducts);

    if (collections.length === 0) {
      return {
        ...emptyHomepageResult("empty"),
        lastUpdatedLabel,
      };
    }

    return {
      state: liveProducts.length > 0 ? "ready" : "empty",
      sections,
      collectionCards: sections.map(buildCollectionCard),
      totalCollections: sections.length,
      totalProducts: liveProducts.length,
      lastUpdatedLabel,
      collectionLinks: sections.map((section) => ({
        slug: section.slug,
        label: section.name,
      })),
      pulseProducts: buildPulseProducts(liveProducts),
      productOptions: buildProductOptions(liveProducts),
    };
  } catch (error) {
    console.error("Failed to load market homepage data", error);
    return emptyHomepageResult("unavailable");
  }
}

export async function getCollectionPageData(
  slug: string
): Promise<CollectionPageData | null> {
  if (!STRAPI_API_TOKEN) {
    return buildUnavailableCollection(slug);
  }

  try {
    const { collections, products } = await loadMarketSource();
    const sections = mapCollections(collections, products);
    const collection = sections.find((section) => section.slug === slug);

    if (!collection) {
      return null;
    }

    const allProducts = flattenSectionProducts(collection);

    return {
      state: allProducts.length > 0 ? "ready" : "empty",
      collection,
      allProducts,
      pulseProducts: buildPulseProducts(allProducts, 10),
      archiveRows: buildArchiveRows(allProducts),
      productOptions: buildProductOptions(allProducts),
    };
  } catch (error) {
    console.error("Failed to load collection page data", error);
    return buildUnavailableCollection(slug);
  }
}

export async function getCollectionSlugs() {
  if (!STRAPI_API_TOKEN) {
    return [];
  }

  try {
    const { collections } = await loadMarketSource();
    return collections.map((collection) => slugify(collection.name));
  } catch (error) {
    console.error("Failed to load collection slugs", error);
    return [];
  }
}

async function loadMarketSource() {
  const [collectionsResponse, productsResponse] = await Promise.all([
    fetchStrapi<CmsListResponse<CmsCollection>>(
      "/collections?sort=name:asc&pagination[limit]=100"
    ),
    fetchStrapi<CmsListResponse<CmsProduct>>(
      "/products?populate=*&sort=name:asc&pagination[limit]=100"
    ),
  ]);

  return {
    collections: collectionsResponse.data ?? [],
    products: productsResponse.data ?? [],
  };
}

async function fetchStrapi<T>(path: string): Promise<T> {
  const response = await fetch(`${STRAPI_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    next: {
      revalidate: REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed for ${path}: ${response.status}`);
  }

  return (await response.json()) as T;
}

function mapCollections(
  collections: CmsCollection[],
  products: CmsProduct[]
): MappedCollectionSection[] {
  const productsByCollection = new Map<string, CmsProduct[]>();

  for (const product of products) {
    const collectionId = product.collection?.documentId;

    if (!collectionId) {
      continue;
    }

    const current = productsByCollection.get(collectionId) ?? [];
    current.push(product);
    productsByCollection.set(collectionId, current);
  }

  return [...collections]
    .sort((left, right) => collator.compare(left.name, right.name))
    .map((collection) => {
      const collectionProducts = productsByCollection.get(collection.documentId) ?? [];
      const mappedProducts = collectionProducts
        .map((product) => mapProduct(product, collection))
        .sort((left, right) => collator.compare(left.name, right.name));

      return {
        id: collection.documentId,
        slug: slugify(collection.name),
        anchorId: slugify(collection.name),
        name: collection.name,
        productCount: mappedProducts.length,
        hasProducts: mappedProducts.length > 0,
        latestUpdateLabel: getCollectionUpdatedLabel(collection, mappedProducts),
        groups: groupProducts(mappedProducts),
      };
    });
}

function mapProduct(
  product: CmsProduct,
  collection: CmsCollection
): MappedProductCard {
  const priceHistory = normalizePricePoints(product.price);
  const current = priceHistory.at(-1) ?? null;
  const previous = priceHistory.length > 1 ? priceHistory.at(-2) ?? null : null;
  const delta =
    current && previous ? Number((current.value - previous.value).toFixed(2)) : null;

  return {
    id: product.documentId,
    name: product.name,
    description:
      product.description?.trim() ||
      "No supporting description is published for this product yet.",
    type: product.type ?? "plot",
    collectionId: collection.documentId,
    collectionName: collection.name,
    currentPrice: current?.value ?? null,
    previousPrice: previous?.value ?? null,
    direction:
      delta === null ? null : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
    delta,
    latestTime: current?.time ?? null,
    sparklinePoints: priceHistory.slice(-7).map((point) => point.value),
    pricePointCount: priceHistory.length,
    priceHistory,
  };
}

function normalizePricePoints(pricePoints: CmsPricePoint[] | null | undefined): PricePoint[] {
  return (pricePoints ?? [])
    .map((point) => {
      const value = parseNumericValue(point.price);

      if (value === null || !point.time) {
        return null;
      }

      return {
        value,
        time: point.time,
      };
    })
    .filter((point): point is PricePoint => point !== null)
    .sort((left, right) => new Date(left.time).getTime() - new Date(right.time).getTime());
}

function parseNumericValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const numericValue = Number(value.replaceAll(",", ""));

  return Number.isFinite(numericValue) ? numericValue : null;
}

function groupProducts(products: MappedProductCard[]) {
  const groups: MappedCollectionSection["groups"] = [];
  const order: MarketType[] = ["plot", "file", "home"];

  for (const type of order) {
    const entries = products.filter((product) => product.type === type);

    if (entries.length === 0) {
      continue;
    }

    groups.push({
      type,
      label: type === "plot" ? "Plots" : type === "file" ? "Files" : "Homes",
      products: entries,
    });
  }

  return groups;
}

function buildPulseProducts(products: MappedProductCard[], limit = 4) {
  return [...products]
    .filter((product) => product.delta !== null)
    .sort((left, right) => Math.abs(right.delta ?? 0) - Math.abs(left.delta ?? 0))
    .slice(0, limit);
}

function buildProductOptions(products: MappedProductCard[]) {
  return Array.from(
    new Set(products.map((product) => `${product.collectionName} · ${product.name}`))
  );
}

function buildCollectionCard(section: MappedCollectionSection): MappedCollectionCard {
  return {
    id: section.id,
    slug: section.slug,
    name: section.name,
    productCount: section.productCount,
    hasProducts: section.hasProducts,
    latestUpdateLabel: section.latestUpdateLabel,
    featuredProducts: flattenSectionProducts(section).slice(0, 4),
  };
}

function buildUnavailableCollection(slug: string): CollectionPageData {
  return {
    state: "unavailable",
    collection: {
      id: slug,
      slug,
      anchorId: slug,
      name: titleCaseSlug(slug),
      productCount: 0,
      hasProducts: false,
      latestUpdateLabel: "Live CMS connection unavailable",
      groups: [],
    },
    allProducts: [],
    pulseProducts: [],
    archiveRows: [],
    productOptions: [],
  };
}

function buildArchiveRows(products: MappedProductCard[], limit = 10): MappedArchiveRow[] {
  const rows = new Map<string, MappedArchiveRow>();

  for (const product of products) {
    for (let index = 0; index < product.priceHistory.length; index += 1) {
      const point = product.priceHistory[index];
      const previous = index > 0 ? product.priceHistory[index - 1] : null;
      const date = point.time.slice(0, 10);
      const delta = previous ? Number((point.value - previous.value).toFixed(2)) : null;

      const row = rows.get(date) ?? {
        date,
        values: {},
      };

      row.values[product.id] = {
        price: point.value,
        delta,
        direction:
          delta === null ? null : delta > 0 ? "up" : delta < 0 ? "down" : "flat",
      };

      rows.set(date, row);
    }
  }

  return [...rows.values()]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, limit);
}

function flattenSectionProducts(section: MappedCollectionSection) {
  return section.groups.flatMap((group) => group.products);
}

function getLastUpdatedLabel(
  collections: CmsCollection[],
  products: MappedProductCard[]
) {
  const timestamps = [
    ...collections.map((collection) => collection.updatedAt).filter(Boolean),
    ...products.map((product) => product.latestTime).filter(Boolean),
  ] as string[];

  if (timestamps.length === 0) {
    return "Awaiting published market data";
  }

  const latest = timestamps.sort(
    (left, right) => new Date(right).getTime() - new Date(left).getTime()
  )[0];

  return formatUpdatedLabel(latest);
}

function getCollectionUpdatedLabel(
  collection: CmsCollection,
  products: MappedProductCard[]
) {
  const timestamps = [
    collection.updatedAt,
    ...products.map((product) => product.latestTime),
  ].filter(Boolean) as string[];

  if (timestamps.length === 0) {
    return "Awaiting published data";
  }

  const latest = timestamps.sort(
    (left, right) => new Date(right).getTime() - new Date(left).getTime()
  )[0];

  return formatUpdatedLabel(latest);
}

function formatUpdatedLabel(value: string) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function emptyHomepageResult(state: MarketState): MarketHomepageData {
  return {
    state,
    sections: [],
    collectionCards: [],
    totalCollections: 0,
    totalProducts: 0,
    lastUpdatedLabel:
      state === "unavailable"
        ? "Live CMS connection unavailable"
        : "Awaiting published market data",
    collectionLinks: [],
    pulseProducts: [],
    productOptions: [],
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCaseSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
