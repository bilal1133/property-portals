import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import {
  ArchiveTable,
  buildHeaderTickerItems,
  CollectionShowcaseHero,
  CollectionTodayRatesShowcase,
  CollectionRatesBoard,
  ConsultationSection,
  MarketPulseSection,
  SectionHeading,
  SiteFooter,
  SiteHeader,
  TrustAndGuidanceSection,
  getCollectionRateLabel,
} from "@/components/market-ui";
import { Phase10KnowledgeBaseSection } from "@/components/phase10-knowledge-base";
import { siteMeta } from "@/data/landing-content";
import {
  getCollectionPageData,
  getCollectionSlugs,
  getMarketHomepageData,
} from "@/lib/market-data";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = "https://property-portals.com";

function generateBreadcrumbSchema(slug: string, collectionName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: `${siteUrl}/#collections`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: collectionName,
        item: `${siteUrl}/collections/${slug}`,
      },
    ],
  };
}

const shellClass = "mx-auto w-full max-w-[1600px] px-5 sm:px-8 xl:px-[52px]";
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getCollectionSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await getCollectionPageData(slug);

  if (!pageData) {
    return {
      title: `${siteMeta.brandName} | Collection Board`,
      description: siteMeta.heroDescription,
    };
  }

  const rateLabel = getCollectionRateLabel(pageData.allProducts);

  return {
    title: `${pageData.collection.name} ${rateLabel} | ${siteMeta.brandName}`,
    description: `Live ${pageData.collection.name} ${rateLabel}, movers, archive rows, and direct WhatsApp consultation.`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const [pageData, homepageData] = await Promise.all([
    getCollectionPageData(slug),
    getMarketHomepageData(),
  ]);

  if (!pageData) {
    notFound();
  }

  const collectionRateLabel = getCollectionRateLabel(pageData.allProducts);
  const collectionOptions =
    pageData.allProducts.length > 0
      ? [
          pageData.collection.name,
          ...pageData.allProducts.map((product) => product.name),
          "Not sure yet",
        ]
      : [pageData.collection.name, "Not sure yet"];

  const heroRate = pageData.allProducts[0]?.currentPrice ?? null;
  const pageLinks = [
    { label: "Overview", href: "#top" },
    { label: "Rates", href: "#rates" },
    { label: "Pulse", href: "#pulse" },
    { label: "Archive", href: "#archive" },
    { label: "Guidance", href: "#guidance" },
    ...(pageData.collection.slug === "phase-10"
      ? [{ label: "Knowledge", href: "#knowledge" }]
      : []),
    { label: "Contact", href: "#contact" },
  ];
  const headerTickerItems = buildHeaderTickerItems(homepageData.sections);

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema(slug, pageData.collection.name)
          ),
        }}
      />
      <main id="top" className="overflow-x-clip">
      <SiteHeader
        pageLinks={pageLinks}
        collectionLinks={homepageData.collectionLinks.slice(0, 8)}
        currentCollectionSlug={pageData.collection.slug}
        tickerItems={headerTickerItems}
      />

      <CollectionShowcaseHero
        collection={pageData.collection}
        state={pageData.state}
        rateLabel={collectionRateLabel}
        heroRate={heroRate}
      />

      <section id="rates" className="section-paper py-8 lg:py-12">
        <div className={shellClass}>
          <CollectionTodayRatesShowcase collection={pageData.collection} state={pageData.state} />
        </div>
      </section>

      <section className="section-mist py-16 lg:py-24">
        <div className={shellClass}>
          <SectionHeading
            eyebrow="Board Breakdown"
            title={`Detailed ${pageData.collection.name} ${collectionRateLabel}`}
            description="Use the detailed board when you want more than the hero summary and need every live product grouped clearly before making a decision."
          />

          <div className="mt-8">
            <CollectionRatesBoard collection={pageData.collection} state={pageData.state} />
          </div>
        </div>
      </section>

      <section id="pulse" className="section-signal py-16 lg:py-20">
        <div className={shellClass}>
          <MarketPulseSection
            products={pageData.pulseProducts}
            state={pageData.state}
            showCollectionColumn={false}
          />
        </div>
      </section>

      <section id="archive" className="section-cloud py-16 lg:py-24">
        <div className={shellClass}>
          <SectionHeading
            eyebrow="Rate History"
            title={`Archive rows for ${pageData.collection.name}`}
            description="Use the archive to see whether pricing is building, flat, or noisy over time before you ask for help on timing."
          />

          <div className="mt-8">
            <ArchiveTable
              products={pageData.allProducts}
              rows={pageData.archiveRows}
              collectionName={pageData.collection.name}
            />
          </div>
        </div>
      </section>

      <section id="guidance" className="section-mist py-16 lg:py-24">
        <div className={shellClass}>
          <TrustAndGuidanceSection
            trustTitle={`Visitors still need proof before they act on ${pageData.collection.name}.`}
            trustDescription="Live data helps, but the conversion still depends on clear credibility signals, recent examples, and a visible route to human guidance once the visitor wants more than one number."
            guidanceTitle="What this board can answer quickly."
            guidanceDescription="Use the board to get the first read fast, then move to WhatsApp when you need help with buying, selling, comparison, or timing."
          />
        </div>
      </section>

      <section id="contact" className="section-cloud py-16 lg:py-24">
        <div className={shellClass}>
          <ConsultationSection
            title={`Need a read on ${pageData.collection.name} before you move?`}
            description="Share the collection, the product type, and whether you are buying, selling, or comparing. The form only prepares a WhatsApp message so the conversation starts with context."
            fileTypes={collectionOptions}
            quickMessage={`Hello, I need guidance on ${pageData.collection.name} and the latest published rates.`}
          />
        </div>
      </section>

      {pageData.collection.slug === "phase-10" ? (
        <section className="section-paper py-16 lg:py-24">
          <div className={shellClass}>
            <Phase10KnowledgeBaseSection />
          </div>
        </section>
      ) : null}

      <SiteFooter pageLinks={pageLinks} />
    </main>
    </>
  );
}
