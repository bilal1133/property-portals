import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArchiveTable,
  CollectionHeroMediaPanel,
  CollectionRatesBoard,
  ConsultationSection,
  MarketPulseSection,
  ProductTicker,
  SectionHeading,
  SiteFooter,
  SiteHeader,
  TrustAndGuidanceSection,
  getCollectionRateLabel,
} from "@/components/market-ui";
import { siteMeta } from "@/data/landing-content";
import {
  getCollectionPageData,
  getCollectionSlugs,
  getMarketHomepageData,
} from "@/lib/market-data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const shellClass = "mx-auto w-full max-w-[1776px] px-5 sm:px-8 xl:px-[52px]";
const monoClass = "font-mono text-[0.72rem] uppercase tracking-[0.18em]";

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

  const featuredProducts = pageData.allProducts.slice(0, 7);
  const heroRate = pageData.allProducts[0]?.currentPrice ?? null;
  const pageLinks = [
    { label: "Overview", href: "#top" },
    { label: "Rates", href: "#rates" },
    { label: "Pulse", href: "#pulse" },
    { label: "Archive", href: "#archive" },
    { label: "Guidance", href: "#guidance" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <main id="top" className="overflow-x-clip">
      <SiteHeader
        pageLinks={pageLinks}
        collectionLinks={homepageData.collectionLinks.slice(0, 8)}
        currentCollectionSlug={pageData.collection.slug}
      />

      <section className={`${shellClass} pb-12 pt-6 lg:pb-20`}>
        <div
          className="animate-rise surface-elevation-strong relative overflow-hidden border border-line bg-white px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
          style={{ ["--delay" as string]: "60ms" }}
        >
          <div className="orb-drift pointer-events-none absolute -right-24 -top-24 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(7,85,233,0.9)_0%,rgba(7,85,233,0.34)_30%,rgba(7,85,233,0)_68%)] blur-2xl" />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
            <div className="relative z-10 space-y-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <Link className="transition hover:text-accent" href="/">
                  Home
                </Link>
                <span>/</span>
                <span>Collection board</span>
                <span>/</span>
                <span className="text-foreground">{pageData.collection.name}</span>
              </div>

              <div className="space-y-5">
                <p className={`${monoClass} text-accent`}>Dedicated market board</p>
                <h1 className="max-w-4xl font-display text-[clamp(3.35rem,8vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-foreground">
                  {pageData.collection.name} {collectionRateLabel} today
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                  A focused collection page with today&apos;s published rates, movers derived from the latest price change, archive rows, and a direct WhatsApp path when the board needs interpretation.
                </p>
              </div>

              <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
                {siteMeta.trustBadges.map((badge, index) => (
                  <div key={badge.label} className="bg-white px-4 py-5" style={{ ["--delay" as string]: `${160 + index * 60}ms` }}>
                    <p className="font-display text-[2rem] font-semibold leading-none tracking-[-0.04em] text-foreground">
                      {badge.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">{badge.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  className="pressable sheen inline-flex min-h-11 items-center justify-center gap-3 border border-accent bg-accent px-6 py-4 text-sm font-semibold text-white hover:border-brand-deep hover:bg-brand-deep"
                  href={buildWhatsAppUrl(
                    siteMeta.phoneE164,
                    `Assalam o Alaikum Kamran, I want guidance on ${pageData.collection.name}.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ask about {pageData.collection.name}
                  <ArrowUpRightIcon />
                </a>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                  <span className="border border-line bg-white px-3 py-2">
                    Last updated {pageData.collection.latestUpdateLabel}
                  </span>
                  <span className="border border-line bg-white px-3 py-2">
                    {pageData.collection.productCount} products
                  </span>
                </div>
              </div>
            </div>

            <CollectionHeroMediaPanel
              collection={pageData.collection}
              state={pageData.state}
              rateLabel={collectionRateLabel}
              heroRate={heroRate}
            />
          </div>
        </div>
      </section>

      <section className={`${shellClass} py-6 lg:py-10`}>
        <ProductTicker
          products={featuredProducts}
          title={`Today’s quick board · ${pageData.collection.name}`}
          description="A compact rate strip for the categories currently published in this collection. Scroll horizontally on mobile."
        />
      </section>

      <section id="rates" className={`${shellClass} py-10 lg:py-16`}>
        <SectionHeading
          eyebrow="Today’s Rates"
          title={`Current ${pageData.collection.name} ${collectionRateLabel}`}
          description="These cards render from the latest point in each product’s published price history. If a previous point exists, the movement badge shows the exact change."
        />

        <div className="mt-8">
          <CollectionRatesBoard collection={pageData.collection} state={pageData.state} />
        </div>
      </section>

      <section id="pulse" className={`${shellClass} py-6 lg:py-10`}>
        <MarketPulseSection
          products={pageData.pulseProducts}
          state={pageData.state}
          showCollectionColumn={false}
        />
      </section>

      <section id="archive" className={`${shellClass} py-10 lg:py-16`}>
        <SectionHeading
          eyebrow="Rate History"
          title={`Archive rows for ${pageData.collection.name}`}
          description="Instead of hiding old entries behind charts alone, this board keeps a readable archive table. It mirrors the manual-reference style users trust on narrow local-market sites."
        />

        <div className="mt-8">
          <ArchiveTable
            products={pageData.allProducts}
            rows={pageData.archiveRows}
            collectionName={pageData.collection.name}
          />
        </div>
      </section>

      <section id="guidance" className={`${shellClass} py-10 lg:py-16`}>
        <TrustAndGuidanceSection
          trustTitle={`Public trust still matters on the ${pageData.collection.name} board.`}
          trustDescription="The data comes from Strapi, but the conversion still depends on credibility, repeated proof, and clear manual guidance when a visitor wants more than one number."
          guidanceTitle="Short investor guidance for this board."
          guidanceDescription="The collection page answers the first questions directly, then hands the deeper cases to WhatsApp."
        />
      </section>

      <section id="contact" className={`${shellClass} py-10 lg:py-16`}>
        <ConsultationSection
          title={`Need help with ${pageData.collection.name}?`}
          description="Share the collection, the category you care about, and whether you are buying, selling, or comparing. The form only prepares a WhatsApp message."
          fileTypes={collectionOptions}
        />
      </section>

      <SiteFooter pageLinks={pageLinks} />
    </main>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
