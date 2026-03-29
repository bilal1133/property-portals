import { MetadataRoute } from "next";

import { siteOrigin } from "@/data/landing-content";
import { getMarketSitemapData } from "@/lib/market-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteOrigin;
  const sitemapData = await getMarketSitemapData();

  const collectionUrls = sitemapData.collections.map((collection) => ({
    url: `${baseUrl}/collections/${collection.slug}`,
    ...(collection.lastModified
      ? {
          lastModified: collection.lastModified,
        }
      : {}),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      ...(sitemapData.homepageLastModified
        ? {
            lastModified: sitemapData.homepageLastModified,
          }
        : {}),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...collectionUrls,
  ];
}
