import type { Metadata } from "next";
import Link from "next/link";

import {
  BrandStorySection,
  buildHeaderTickerItems,
  CollectionHubCard,
  ConsultationSection,
  FeaturedCollectionBoard,
  MarketPulseSection,
  OfficeAndCoverageSection,
  SectionHeading,
  SiteFooter,
  SiteHeader,
  formatPriceLac,
} from "@/components/market-ui";
import { ConstructionCalculator } from "@/components/construction-calculator";
import {
  consultationFallbackOptions,
  dealProofs,
  guideTopics,
  journeySteps,
  siteMeta,
} from "@/data/landing-content";
import { getMarketHomepageData } from "@/lib/market-data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `${siteMeta.siteTitle} | ${siteMeta.brandName}`,
  description: siteMeta.heroDescription,
};

const shellClass = "mx-auto w-full max-w-[1600px] px-5 sm:px-8 xl:px-[52px]";
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
  const headerTickerItems = buildHeaderTickerItems(marketData.sections);
  const heroStats = [
    {
      value: marketData.totalCollections > 0 ? String(marketData.totalCollections) : "Soon",
      label: "Live collections",
    },
    {
      value: marketData.totalProducts > 0 ? String(marketData.totalProducts) : "Pending",
      label: "Published rates",
    },
    {
      value: marketData.lastUpdatedLabel,
      label: "Last refresh",
    },
    {
      value: "WhatsApp",
      label: "Guidance path",
    },
  ];

  return (
    <main id="top" className="overflow-x-clip">
      <SiteHeader
        pageLinks={siteMeta.quickLinks}
        collectionLinks={marketData.collectionLinks.slice(0, 8)}
        tickerItems={headerTickerItems}
      />

      <section className="section-paper">
        <div className={`${shellClass} pb-16 pt-8 lg:pb-28 lg:pt-10`}>
          <div
            className="animate-rise surface-elevation-strong relative overflow-hidden border border-line bg-white px-6 py-10 sm:px-10 lg:px-14 lg:py-14"
            style={{ ["--delay" as string]: "60ms" }}
          >
            <div className="orb-drift pointer-events-none absolute -right-28 -top-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(7,85,233,0.88)_0%,rgba(7,85,233,0.34)_28%,rgba(7,85,233,0)_68%)] blur-2xl" />

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] xl:gap-16">
              <div className="relative z-10 space-y-10">
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
                    Buyer flow · Seller flow · Dedicated market pages
                  </p>
                  <h1 className="max-w-5xl font-display text-[clamp(3.4rem,8vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-foreground">
                    {siteMeta.heroHeadline}
                  </h1>
                  <p className="max-w-3xl text-lg leading-9 text-muted sm:text-xl">
                    {siteMeta.heroDescription}
                  </p>
                </div>

                <div className="border border-line bg-panel-strong px-5 py-4 text-sm leading-7 text-muted">
                  {marketData.state === "unavailable"
                    ? "The live Strapi connection is temporarily unavailable. The collection pages, trust layer, and WhatsApp path remain visible while the feed recovers."
                    : marketData.state === "empty"
                      ? "Collections are published, but products are still being pushed live. You can still open boards, shortlist markets, and ask for guidance."
                      : `${marketData.totalProducts} live product rates are published across ${marketData.totalCollections} collections right now.`}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    className="pressable sheen inline-flex min-h-11 items-center justify-center gap-3 border border-accent bg-accent px-6 py-4 text-sm font-semibold text-white hover:border-brand-deep hover:bg-brand-deep"
                    href={buildWhatsAppUrl(
                      siteMeta.phoneE164,
                      "Hello, I want help comparing the live collection boards."
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get WhatsApp guidance
                    <ArrowUpRightIcon />
                  </a>
                  <a
                    className="pressable inline-flex min-h-11 items-center justify-center gap-3 border border-line bg-white px-6 py-4 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
                    href="#collections"
                  >
                    Browse live collections
                    <ArrowUpRightIcon />
                  </a>
                  <a
                    className="pressable inline-flex min-h-11 items-center justify-center gap-3 border border-line bg-white px-6 py-4 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
                    href={buildWhatsAppUrl(
                      siteMeta.phoneE164,
                      "Hello, I want selling guidance and current market context for my asset."
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    I want to sell
                    <ArrowUpRightIcon />
                  </a>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                    <span className="border border-line bg-white px-3 py-2">
                      {siteMeta.address}
                    </span>
                    <a
                      className="pressable min-h-11 border border-line bg-white px-3 py-2 hover:border-accent hover:text-accent"
                      href={`tel:${siteMeta.phoneE164}`}
                    >
                      {siteMeta.phoneDisplay}
                    </a>
                  </div>
                </div>

                <p className="text-sm leading-7 text-muted">
                  No account required. Open a collection, compare the latest move, and message the desk only when you need a human read.
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  {journeySteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="motion-lift border border-line bg-white px-4 py-5"
                      style={{ ["--delay" as string]: `${160 + index * 60}ms` }}
                    >
                      <p className={`${monoClass} text-accent`}>How it works</p>
                      <h3 className="mt-3 font-display text-[1.9rem] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
                  {heroStats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="bg-white px-4 py-5"
                      style={{ ["--delay" as string]: `${340 + index * 60}ms` }}
                    >
                      <p className="font-display text-[2rem] font-semibold leading-none tracking-[-0.04em] text-foreground">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">{stat.label}</p>
                    </div>
                  ))}
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
              className="animate-rise surface-elevation mt-6 overflow-x-auto border border-line bg-panel-strong px-5 py-5"
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
        </div>
      </section>

      <section id="about" className="section-cloud py-16 lg:py-24">
        <div className={shellClass}>
          <BrandStorySection preferredVisualSlug={featuredCollection?.slug} />
        </div>
      </section>

      <section id="collections" className="section-mist py-16 lg:py-24">
        <div className={shellClass}>
          <SectionHeading
            eyebrow="Collection Boards"
            title="Choose a collection and open the full decision page."
            description="Each board gives visitors current rates, recent movement, archive history, and a direct WhatsApp path without forcing them to compare every market inside one crowded homepage."
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
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
        </div>
      </section>

      <section id="pulse" className="section-signal py-16 lg:py-20">
        <div className={shellClass}>
          <MarketPulseSection products={marketData.pulseProducts} state={marketData.state} />
        </div>
      </section>

      <section id="calculator" className="section-paper py-16 lg:py-24">
        <div className={shellClass}>
          <ConstructionCalculator />
        </div>
      </section>

      <section id="guidance" className="section-cloud py-16 lg:py-24">
        <div className={shellClass}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] xl:gap-14">
            <div className="space-y-10">
              <SectionHeading
                eyebrow="Lead With Context"
                title="The homepage earns the click. The collection page closes the confidence gap."
                description="A strong landing page gets the visitor into the right board. The dedicated page then does the heavier conversion work with current rates, movement, archive visibility, and a clean WhatsApp handoff."
              />
              <div className="grid gap-5 md:grid-cols-2">
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
                  <article
                    key={topic.title}
                    className="motion-lift border border-line bg-white px-4 py-4"
                  >
                    <h3 className="font-display text-[1.8rem] font-semibold tracking-[-0.04em] text-foreground">
                      {topic.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{topic.description}</p>
                  </article>
                ))}
              </div>
              {featuredCollection?.featuredProducts[0] ? (
                <div className="bg-brand-gradient mt-6 border border-white/22 px-4 py-5 text-white">
                  <p className={`${monoClass} text-white/86`}>Current featured rate</p>
                  <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-white">
                    {formatPriceLac(featuredCollection.featuredProducts[0].currentPrice)}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/92">
                    {featuredCollection.featuredProducts[0].name} on {featuredCollection.name}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section id="office" className="section-mist py-16 lg:py-24">
        <div className={shellClass}>
          <OfficeAndCoverageSection collectionLinks={marketData.collectionLinks} />
        </div>
      </section>

      <section id="contact" className="section-mist py-16 lg:py-24">
        <div className={shellClass}>
          <ConsultationSection
            title="Need help choosing a collection or reading a quoted rate?"
            description="Use WhatsApp to compare a few collections, ask whether a move looks actionable, or get buying and selling guidance with the right market already in context."
            fileTypes={consultationOptions}
            quickMessage="Hello, I want help choosing the right collection and understanding the latest published rates."
          />
        </div>
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
