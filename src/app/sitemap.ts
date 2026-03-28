import { MetadataRoute } from 'next';
import { getCollectionSlugs } from '@/lib/market-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://property-portals.com';

  let slugs: string[] = [];

  try {
    slugs = await getCollectionSlugs();
  } catch {
    // If CMS unavailable, return empty - homepage still gets indexed
  }

  const collectionUrls = slugs.map((slug) => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    ...collectionUrls,
  ];
}