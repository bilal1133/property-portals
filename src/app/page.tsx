import type { Metadata } from "next";

import { HomepageRedesign } from "@/components/homepage-redesign";
import {
  consultationFallbackOptions,
  defaultSocialImagePath,
  siteMeta,
} from "@/data/landing-content";
import { getMarketHomepageData } from "@/lib/market-data";

export const metadata: Metadata = {
  title: siteMeta.siteTitle,
  description: siteMeta.heroDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteMeta.brandName,
    url: "/",
    title: siteMeta.siteTitle,
    description: siteMeta.heroDescription,
    images: [defaultSocialImagePath],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.siteTitle,
    description: siteMeta.heroDescription,
    images: [defaultSocialImagePath],
  },
};

export default async function Home() {
  const marketData = await getMarketHomepageData();
  const consultationOptions =
    marketData.productOptions.length > 0
      ? [...marketData.productOptions, "Not sure yet"]
      : consultationFallbackOptions;

  return (
    <HomepageRedesign
      marketData={marketData}
      consultationOptions={consultationOptions}
    />
  );
}
