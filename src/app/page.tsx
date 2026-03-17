import type { Metadata } from "next";
import Link from "next/link";

import {
  CollectionHubCard,
  ConsultationSection,
  FeaturedCollectionBoard,
  MarketPulseSection,
  ProductTicker,
  SectionHeading,
  SiteFooter,
  SiteHeader,
  SourceBackedCollectionsSection,
  formatPriceLac,
} from "@/components/market-ui";
import {
  consultationFallbackOptions,
  dealProofs,
  guideTopics,
  siteMeta,
} from "@/data/landing-content";
import { getMarketHomepageData } from "@/lib/market-data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `${siteMeta.siteTitle} | ${siteMeta.brandName}`,
  description: siteMeta.heroDescription,
};

const shellClass = "mx-auto w-full max-w-[1776px] px-5 sm:px-8 xl:px-[52px]";
const monoClass = "font-mono text-[0.72rem] uppercase tracking-[0.18em]";

export default async function Home() {
  const marketData = await getMarketHomepageData();
  const featuredCollection =
    marketData.collectionCards.find((collection) => collection.hasProducts) ??
    marketData.collectionCards[0] ??
    null;
  const consultationOptions =
    marketData.productOptions.length > 0
      ? [...marketData.productOptions, "Not sure yet"]
      : consultationFallbackOptions;

  return (
    <main id="top" className="overflow-x-clip">
      <SiteHeader
        pageLinks={siteMeta.quickLinks}
        collectionLinks={marketData.collectionLinks.slice(0, 8)}
      />

      <section className={`${shellClass} pb-12 pt-6 lg:pb-20`}>
        <div
          className="animate-rise surface-elevation-strong relative overflow-hidden border border-line bg-white px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
          style={{ ["--delay" as string]: "60ms" }}
        >
          <div className="orb-drift pointer-events-none absolute -right-28 -top-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(7,85,233,0.88)_0%,rgba(7,85,233,0.34)_28%,rgba(7,85,233,0)_68%)] blur-2xl" />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
            <div className="relative z-10 space-y-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="border border-line bg-panel-strong px-3 py-2">
                  {siteMeta.heroEyebrow}
                </span>
                <span className="border border-accent bg-accent px-3 py-2 text-white">
                  Last sync {marketData.lastUpdatedLabel}
                </span>
              </div>

              <div className="space-y-5">
                <p className={`${monoClass} text-accent`}>
                  Collection hub · Dedicated market pages
                </p>
                <h1 className="max-w-4xl font-display text-[clamp(3.35rem,8vw,6.7rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-foreground">
                  {siteMeta.heroHeadline}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                  {siteMeta.heroDescription}
                </p>
              </div>

              <div className="border border-line bg-panel-strong px-5 py-4 text-sm leading-7 text-muted">
                {marketData.state === "unavailable"
                  ? "The live Strapi connection is temporarily unavailable. The collection pages, trust layer, and WhatsApp path remain visible while the feed recovers."
                  : marketData.state === "empty"
                    ? "Collections are published, but products have not been pushed live yet. The dedicated pages still make the coverage visible and ready for buyers."
                    : `${marketData.totalProducts} live products are currently published across ${marketData.totalCollections} collections.`}
              </div>

              <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
                {siteMeta.trustBadges.map((badge, index) => (
                  <div
                    key={badge.label}
                    className="bg-white px-4 py-5"
                    style={{ ["--delay" as string]: `${160 + index * 60}ms` }}
                  >
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
                    "Assalam o Alaikum Kamran, I want help comparing the live collection boards."
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Request market context
                  <ArrowUpRightIcon />
                </a>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                  <span className="border border-line bg-white px-3 py-2">{siteMeta.address}</span>
                  <a
                    className="pressable min-h-11 border border-line bg-white px-3 py-2 hover:border-accent hover:text-accent"
                    href={`tel:${siteMeta.phoneE164}`}
                  >
                    {siteMeta.phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            <div className="animate-rise relative z-10" style={{ ["--delay" as string]: "220ms" }}>
              <FeaturedCollectionBoard
                collection={featuredCollection}
                state={marketData.state}
                lastUpdatedLabel={marketData.lastUpdatedLabel}
              />
            </div>
          </div>
        </div>

        {marketData.collectionLinks.length > 0 ? (
          <div
            className="animate-rise surface-elevation mt-4 overflow-x-auto border border-line bg-panel-strong px-4 py-4"
            style={{ ["--delay" as string]: "300ms" }}
          >
            <div className="flex min-w-max gap-3">
              {marketData.collectionLinks.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/collections/${collection.slug}`}
                  className="pressable min-h-11 border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
                >
                  {collection.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {featuredCollection?.featuredProducts.length ? (
        <section className={`${shellClass} py-6 lg:py-10`}>
          <ProductTicker
            products={featuredCollection.featuredProducts}
            title={`Quick preview · ${featuredCollection.name}`}
            description="A compact strip of the products currently visible on the featured board. Open the collection page for the full table, movers, and archive."
          />
        </section>
      ) : null}

      <section id="collections" className={`${shellClass} py-10 lg:py-16`}>
        <SectionHeading
          eyebrow="Collection Boards"
          title="Browse every collection as its own decision page."
          description="The homepage is now a market hub. Each card links to a dedicated board so the user can read one collection deeply instead of comparing everything inside a single crowded grid."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {marketData.collectionCards.length > 0 ? (
            marketData.collectionCards.map((collection) => (
              <CollectionHubCard key={collection.id} collection={collection} />
            ))
          ) : (
            <div className="border border-line bg-panel-strong px-5 py-8 sm:px-8 lg:col-span-2 lg:px-10">
              <p className={`${monoClass} text-accent`}>
                {marketData.state === "unavailable" ? "Connection issue" : "Awaiting collections"}
              </p>
              <h3 className="mt-4 font-display text-[clamp(2.4rem,4vw,4.2rem)] font-semibold tracking-[-0.05em] text-foreground">
                {marketData.state === "unavailable"
                  ? "The live collection feed is temporarily offline."
                  : "No published collection cards are available yet."}
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
                The trust layer and WhatsApp route stay live even when the CMS has not returned usable collection data.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className={`${shellClass} py-6 lg:py-10`}>
        <SourceBackedCollectionsSection collections={marketData.collectionCards} />
      </section>

      <section id="pulse" className={`${shellClass} py-6 lg:py-10`}>
        <MarketPulseSection products={marketData.pulseProducts} state={marketData.state} />
      </section>

      <section id="guidance" className={`${shellClass} py-10 lg:py-16`}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Lead With Context"
              title="The public board earns the click. The dedicated page closes the trust gap."
              description="The collection pages carry the job that a generic landing page cannot: live rates, recent movement, archive visibility, and a clean WhatsApp handoff when the visitor is ready to ask a real question."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {dealProofs.map((deal) => (
                <article
                  key={`${deal.month}-${deal.productType}-${deal.action}`}
                  className="motion-lift border border-line bg-white px-5 py-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`${monoClass} text-muted`}>{deal.month}</span>
                    <span className="border border-foreground bg-foreground px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">
                      {deal.action}
                    </span>
                    <span className="border border-accent bg-accent px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">
                      {deal.outcomeTag}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    {deal.productType}
                  </h3>
                  <p className={`${monoClass} mt-2 text-muted`}>{deal.market}</p>
                  <p className="mt-4 text-sm leading-7 text-muted">{deal.summary}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="border border-line bg-panel-strong p-6 sm:p-8">
            <p className={`${monoClass} text-accent`}>What users can read fast</p>
            <div className="mt-6 space-y-4">
              {guideTopics.map((topic) => (
                <article key={topic.title} className="motion-lift border border-line bg-white px-4 py-4">
                  <h3 className="font-display text-[1.8rem] font-semibold tracking-[-0.04em] text-foreground">
                    {topic.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{topic.description}</p>
                </article>
              ))}
            </div>
            {featuredCollection?.featuredProducts[0] ? (
              <div className="mt-6 border border-white/20 bg-[var(--brand-gradient)] px-4 py-5 text-white">
                <p className={`${monoClass} text-white/72`}>Current featured rate</p>
                <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-white">
                  {formatPriceLac(featuredCollection.featuredProducts[0].currentPrice)}
                </p>
                <p className="mt-2 text-sm leading-7 text-white/82">
                  {featuredCollection.featuredProducts[0].name} on {featuredCollection.name}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="contact" className={`${shellClass} py-10 lg:py-16`}>
        <ConsultationSection
          title="Need help reading the boards?"
          description="Use WhatsApp to ask for current context across collections, compare a few quoted rates, or verify whether a board is fully populated enough to act on."
          fileTypes={consultationOptions}
        />
      </section>

      <SiteFooter pageLinks={siteMeta.quickLinks} />
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
