import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ConsultationForm } from "@/components/consultation-form";
import { ConstructionCalculator } from "@/components/construction-calculator";
import { formatPriceLac } from "@/components/market-ui";
import { getCollectionVisual } from "@/data/collection-visuals";
import { consultationIntents, siteMeta } from "@/data/landing-content";
import {
  slugify,
  type MarketHomepageData,
  type MappedCollectionCard,
  type MappedProductCard,
} from "@/lib/market-data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type HomepageRedesignProps = {
  marketData: MarketHomepageData;
  consultationOptions: string[];
};

type IntentCardData = {
  index: string;
  title: string;
  copy: string;
  href: string;
  cta: string;
  tone: "paper" | "mist" | "brand";
  className: string;
};

export function HomepageRedesign({
  marketData,
  consultationOptions,
}: HomepageRedesignProps) {
  const rankedCollections = rankCollections(marketData.collectionCards);
  const heroCollection = rankedCollections[0] ?? marketData.collectionCards[0] ?? null;
  const leadCollection = rankedCollections[0] ?? null;
  const sideCollections = rankedCollections.slice(1, 3);
  const pulseProducts = marketData.pulseProducts.slice(0, 5);
  const pulseHref = pulseProducts[0]
    ? `/collections/${slugify(pulseProducts[0].collectionName)}#pulse`
    : heroCollection
      ? `/collections/${heroCollection.slug}`
      : "#collections";
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteMeta.officeMapQuery
  )}`;
  const heroLinks = marketData.collectionLinks.slice(0, 4);
  const intentCards: IntentCardData[] = [
    {
      index: "01",
      title: "Buy With Context",
      copy: "Check live rates, compare collections, and understand the board before making a buying decision.",
      href: "#collections",
      cta: "Explore Boards",
      tone: "paper",
      className: "lg:col-span-5",
    },
    {
      index: "02",
      title: "Sell With Better Timing",
      copy: "Review movement, read the market, and decide when to act with more confidence.",
      href: "#pulse",
      cta: "See Market Movement",
      tone: "mist",
      className: "lg:col-span-3",
    },
    {
      index: "03",
      title: "Compare Collections Fast",
      copy: "Open key boards, scan changes, and identify where the strongest activity is happening.",
      href: "#collections",
      cta: "Compare Collections",
      tone: "brand",
      className: "lg:col-span-4",
    },
  ];

  return (
    <main id="top" className="overflow-x-clip bg-background">
      <HomeHeader />

      <section className="section-paper border-b-0">
        <div className="shell py-6 sm:py-8 lg:py-10">
          <div className="relative overflow-hidden border border-line bg-[linear-gradient(180deg,#f7faff_0%,#eef4ff_100%)]">
            <div className="pointer-events-none absolute right-6 top-4 hidden font-display text-[clamp(6rem,17vw,14rem)] font-semibold leading-none tracking-[-0.08em] text-[rgba(16,52,126,0.06)] xl:block">
              BOARD
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(7,85,233,0)_0%,rgba(7,85,233,0.45)_50%,rgba(7,85,233,0)_100%)]" />

            <div className="grid gap-10 px-6 py-8 sm:px-8 sm:py-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] xl:gap-14 xl:px-10 xl:py-12">
              <div className="relative xl:pl-14">
                <div className="hidden xl:absolute xl:bottom-0 xl:left-0 xl:top-0 xl:flex xl:w-9 xl:items-center xl:justify-center xl:bg-accent">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-white [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                    Live Property Market
                  </span>
                </div>

                <p className="mono-label text-accent">{siteMeta.heroEyebrow}</p>
                <h1 className="mt-5 max-w-4xl font-display text-[clamp(3.8rem,9vw,7.4rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-foreground">
                  {siteMeta.heroHeadline}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl sm:leading-9">
                  {siteMeta.heroDescription}
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <a className="btn-primary" href="#collections">
                    Explore Collections
                    <ArrowUpRightIcon />
                  </a>
                  <a
                    className="inline-flex min-h-13 items-center justify-center gap-3 border border-line bg-white px-6 py-4 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
                    href={buildWhatsAppUrl(
                      siteMeta.phoneE164,
                      "Hello, I want help comparing live collection boards."
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Talk on WhatsApp
                    <ArrowUpRightIcon />
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                  <span>{describeCount(marketData.totalCollections, "live board", "live boards")}</span>
                  <span>{describeCount(marketData.totalProducts, "published rate", "published rates")}</span>
                </div>

                <div className="mt-8 max-w-2xl border-l-2 border-accent pl-4 text-sm leading-7 text-muted">
                  {getMarketStateNote(marketData)}
                </div>
              </div>

              <HeroBoardFeature
                collection={heroCollection}
                state={marketData.state}
              />
            </div>

            <div className="grid gap-px border-t border-line bg-line lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <div className="bg-white px-6 py-5 sm:px-8 xl:px-10">
                <p className="mono-label text-muted">Quick board access</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {heroLinks.length > 0 ? (
                    heroLinks.map((collection) => (
                      <Link
                        key={collection.slug}
                        href={`/collections/${collection.slug}`}
                        className="inline-flex items-center gap-2 border border-line bg-panel-strong px-3 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
                      >
                        {collection.label}
                      </Link>
                    ))
                  ) : (
                    <span className="text-sm text-muted">
                      Live board links will appear here once collections are available.
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-panel-strong px-6 py-5 sm:px-8 xl:px-10">
                <p className="mono-label text-muted">What this page does</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <EditorialFact title="Collections" body="Open curated boards instead of one crowded dashboard." />
                  <EditorialFact title="Movement" body="See what shifted without scanning every board." />
                  <EditorialFact title="Guidance" body="Reach the desk the moment the numbers need context." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="start" className="scroll-mt-28 border-y border-line bg-background">
        <div className="shell py-16 lg:py-24">
          <SectionIntro
            eyebrow="Start Here"
            title="Choose How You Want To Use The Market"
            description="Each section answers one question. Start with intent, move into the market, then go deeper only where needed."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-12">
            {intentCards.map((card) => (
              <IntentCard key={card.index} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="pulse"
        className="scroll-mt-28 border-y border-line bg-[linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)]"
      >
        <div className="shell py-16 lg:py-24">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_22rem] xl:items-start">
            <div>
              <SectionIntro
                eyebrow="Market Pulse"
                title="See What Moved Recently"
                description="A fast reading of current movement across the boards. The homepage keeps it curated so the signal stays readable."
              />

              <div className="mt-10 overflow-hidden border-y border-line bg-white">
                {pulseProducts.length > 0 ? (
                  pulseProducts.map((product) => (
                    <MarketPulseRow key={product.id} product={product} />
                  ))
                ) : (
                  <EmptyState
                    title={
                      marketData.state === "unavailable"
                        ? "The live market feed is temporarily offline."
                        : "Recent movers will appear as soon as the boards publish comparable points."
                    }
                    description={
                      marketData.state === "unavailable"
                        ? "The boards and advisory flow remain available while the live connection recovers."
                        : "The homepage stays intentionally selective. As soon as products have comparable history, movement appears here automatically."
                    }
                  />
                )}
              </div>
            </div>

            <aside className="overflow-hidden border border-line bg-white">
              <div className="bg-panel-strong px-5 py-5">
                <p className="mono-label text-accent">Need A Read?</p>
                <h3 className="mt-4 font-display text-[clamp(2rem,3vw,2.9rem)] font-semibold leading-[0.94] tracking-[-0.05em] text-foreground">
                  Numbers still need context.
                </h3>
              </div>

              <div className="px-5 py-5">
                <p className="text-sm leading-7 text-muted">
                  Use the market pulse to spot change. Use the desk when you need timing, comparison, or confirmation before moving.
                </p>

                <div className="mt-6 space-y-3 border-t border-line pt-5 text-sm text-foreground">
                  <PulseSidebarLine label="Best for" value="Fast market scanning" />
                  <PulseSidebarLine label="Next step" value="Open the full board" />
                  <PulseSidebarLine label="Human route" value="WhatsApp advisory" />
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <a className="btn-primary" href={pulseHref}>
                    View Full Market Pulse
                    <ArrowUpRightIcon />
                  </a>
                  <a
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-accent"
                    href={buildWhatsAppUrl(
                      siteMeta.phoneE164,
                      "Hello, I want help understanding the current market pulse."
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ask on WhatsApp
                    <ArrowUpRightIcon />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="collections" className="scroll-mt-28 border-y border-line bg-white">
        <div className="shell py-16 lg:py-24">
          <SectionIntro
            eyebrow="Collections"
            title="Explore The Boards That Matter"
            description="Featured boards stay large and intentional here. The homepage previews only the strongest collection paths and leaves the full depth for inner pages."
          />

          {leadCollection ? (
            <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_24rem] xl:items-start">
              <CollectionLeadCard collection={leadCollection} />

              <div className="space-y-6">
                {sideCollections.map((collection) => (
                  <CollectionSideCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-10 border border-line bg-panel-strong">
              <EmptyState
                title={
                  marketData.state === "unavailable"
                    ? "Collection boards are temporarily syncing."
                    : "Collection boards will appear here once they are published."
                }
                description="The homepage is ready to surface a smaller editorial set of boards as soon as live collection data is available."
              />
            </div>
          )}
        </div>
      </section>

      <section
        id="calculator"
        className="scroll-mt-28 border-y border-line bg-[linear-gradient(180deg,#f7faff_0%,#edf3ff_100%)]"
      >
        <div className="shell py-16 lg:py-24">
          <ConstructionCalculator />
        </div>
      </section>

      <section className="border-y border-line bg-transparent">
        <div className="shell py-8 lg:py-12">
          <StatementBanner />
        </div>
      </section>

      <section
        id="advisory"
        className="scroll-mt-28 border-y border-line bg-[linear-gradient(180deg,#eef4ff_0%,#f7faff_100%)]"
      >
        <div className="shell py-16 lg:py-24">
          <div className="overflow-hidden border border-line bg-white">
            <div className="grid gap-px bg-line xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="bg-brand-gradient px-6 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
                <p className="mono-label text-white/82">Advisory Desk</p>
                <h2 className="mt-5 max-w-xl font-display text-[clamp(2.6rem,5vw,4.6rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-white">
                  When The Board Is Not Enough, Talk To Us
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/88">
                  Get direct help through WhatsApp or contact channels when you want a quick read on pricing, collections, or where to look next.
                </p>

                <div className="mt-8 border-t border-white/18 pt-6">
                  <ContactLine
                    label="WhatsApp"
                    value="Quick market reads and comparison help"
                    href={buildWhatsAppUrl(
                      siteMeta.phoneE164,
                      "Hello, I want direct guidance on pricing, collections, and where to look next."
                    )}
                    action="Chat on WhatsApp"
                    external
                  />
                  <ContactLine
                    label="Office Phone"
                    value={siteMeta.phoneDisplay}
                    href={`tel:${siteMeta.phoneE164}`}
                    action="Call advisory desk"
                  />
                  <ContactLine
                    label="Office Location"
                    value={siteMeta.address}
                    href={mapHref}
                    action="Open location"
                    external
                    last
                  />
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <AdvisoryFact
                    title="Direct and human"
                    body="No generic contact funnel. The desk is visible and easy to reach."
                  />
                  <AdvisoryFact
                    title="Usually within the hour"
                    body="Built for fast reads when the next move depends on timing."
                  />
                </div>
              </div>

              <div className="bg-white px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
                <p className="mono-label text-accent">Start The Message</p>
                <h3 className="mt-5 font-display text-[clamp(2.4rem,4vw,3.8rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-foreground">
                  Open with the right context.
                </h3>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">
                  Share the board, collection, or buying and selling intent first. The form stays lightweight and only prepares the WhatsApp message with the right context already filled in.
                </p>

                <div className="mt-8 border-t border-line pt-8">
                  <ConsultationForm
                    phoneE164={siteMeta.phoneE164}
                    expertName={siteMeta.expertName}
                    intents={consultationIntents}
                    fileTypes={consultationOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="shell py-16 lg:py-20">
          <ProprietorSection />
        </div>
      </section>

      <HomeFooter collectionCards={marketData.collectionCards} />
    </main>
  );
}

function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-[rgba(244,247,251,0.88)] backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-4 py-4">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line bg-white shadow-[0_10px_24px_rgba(16,24,40,0.08)]">
            <Image
              src="/brand/property-portals-logo-mark.svg"
              alt="Property Portals"
              width={24}
              height={24}
              className="h-auto w-auto"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-semibold tracking-[-0.04em] text-foreground">
              {siteMeta.brandName}
            </span>
            <span className="mono-label-sm mt-1 block text-muted">Live boards and advisory</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {siteMeta.quickLinks.map((link) => (
            <a
              key={link.href}
              className="text-sm font-medium text-muted transition hover:text-foreground"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          className="btn-primary !min-h-11 !px-5 !py-3"
          href={buildWhatsAppUrl(
            siteMeta.phoneE164,
            "Hello, I want direct guidance on the live property market."
          )}
          target="_blank"
          rel="noreferrer"
        >
          Talk on WhatsApp
        </a>
      </div>
    </header>
  );
}

function HeroBoardFeature({
  collection,
  state,
}: {
  collection: MappedCollectionCard | null;
  state: MarketHomepageData["state"];
}) {
  if (!collection) {
    return (
      <article className="border border-line bg-white p-6 shadow-[0_20px_50px_rgba(16,24,40,0.08)] sm:p-8">
        <p className="mono-label text-accent">Featured board</p>
        <h2 className="mt-5 font-display text-[clamp(2.4rem,4vw,3.8rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-foreground">
          Live boards will appear here as soon as collections are available.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-muted">
          The homepage structure is ready. Once collections sync, this space becomes the featured board preview.
        </p>
      </article>
    );
  }

  const visual = getCollectionVisual(collection.slug);
  const highlightedRate = collection.featuredProducts[0]?.currentPrice ?? null;

  return (
    <article className="lg:min-h-[34rem]">
      <div className="flex flex-col gap-4 lg:relative lg:h-full lg:block">
        <div className="relative min-h-[21rem] overflow-hidden bg-brand-deep lg:absolute lg:inset-y-0 lg:left-0 lg:right-20">
          {visual ? (
            <>
              <Image
                src={visual.src}
                alt={visual.alt}
                fill
                priority
                sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 48vw, 100vw"
                className="object-cover"
                style={visual.objectPosition ? { objectPosition: visual.objectPosition } : undefined}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,22,0.12)_0%,rgba(2,8,22,0.28)_34%,rgba(2,8,22,0.84)_100%)]" />
              <div className="absolute left-4 top-4 border border-white/20 bg-[rgba(3,28,75,0.62)] px-3 py-2 text-mono-xs font-semibold uppercase tracking-[0.18em] text-white sm:left-6 sm:top-6">
                Featured board
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="mono-label text-white/82">{visual.location}</p>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/90">{visual.spotlight}</p>
              </div>
            </>
          ) : (
            <div className="bg-brand-gradient flex h-full items-end p-8 text-white">
              <p className="max-w-xs text-sm leading-7 text-white/90">
                Featured market preview ready for the homepage.
              </p>
            </div>
          )}
        </div>

        <div className="border border-line bg-white p-5 shadow-[0_20px_52px_rgba(16,24,40,0.08)] sm:p-6 lg:absolute lg:bottom-6 lg:right-0 lg:w-[19.5rem]">
          <p className="mono-label text-accent">{collection.name}</p>
          <p className="mt-4 font-display text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-foreground">
            {highlightedRate !== null ? formatPriceLac(highlightedRate) : "Awaiting rate"}
          </p>
          <p className="mt-4 text-sm leading-7 text-muted">
            {state === "ready"
              ? "Curated from the live board."
              : state === "empty"
                ? "Board is ready. Rates are still being published."
                : "Preview remains visible while the live feed recovers."}
          </p>

          <div className="mt-6 space-y-3 border-t border-line pt-5 text-sm text-foreground">
            <PulseSidebarLine
              label="Listings"
              value={describeCount(collection.productCount, "listing", "listings")}
            />
            <PulseSidebarLine label="Context" value={visual?.location ?? "Direct collection access"} />
          </div>

          {collection.featuredProducts.length > 0 ? (
            <div className="mt-6 border-t border-line pt-5">
              <p className="mono-label text-muted">Board sample</p>
              <div className="mt-3 space-y-3">
                {collection.featuredProducts.slice(0, 2).map((product) => (
                  <div key={product.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{product.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
                        {formatPriceLac(product.currentPrice)}
                      </p>
                    </div>
                    <MovementTag direction={product.direction} delta={product.delta} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3">
            <Link className="btn-primary" href={`/collections/${collection.slug}`}>
              Open Collection
              <ArrowUpRightIcon />
            </Link>
            <a
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-accent"
              href={buildWhatsAppUrl(
                siteMeta.phoneE164,
                `Hello, I want direct guidance on ${collection.name}.`
              )}
              target="_blank"
              rel="noreferrer"
            >
              Ask on WhatsApp
              <ArrowUpRightIcon />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function EditorialFact({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="mono-label text-accent">{title}</p>
      <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
    </div>
  );
}

function IntentCard({
  index,
  title,
  copy,
  href,
  cta,
  tone,
  className,
}: IntentCardData) {
  const toneClasses =
    tone === "brand"
      ? "border-white/14 bg-brand-gradient text-white"
      : tone === "mist"
        ? "border-line bg-panel-strong text-foreground"
        : "border-line bg-white text-foreground";
  const eyebrowClasses = tone === "brand" ? "text-white/82" : "text-accent";
  const copyClasses = tone === "brand" ? "text-white/86" : "text-muted";
  const actionClasses = tone === "brand" ? "text-white hover:text-white/80" : "text-foreground hover:text-accent";

  return (
    <article
      className={`relative flex h-full flex-col justify-between overflow-hidden border px-6 py-6 shadow-[0_18px_40px_rgba(16,24,40,0.06)] sm:px-7 sm:py-7 ${toneClasses} ${className}`}
    >
      <p
        className={`pointer-events-none absolute right-4 top-2 font-display text-[4.8rem] font-semibold leading-none tracking-[-0.08em] ${
          tone === "brand" ? "text-white/10" : "text-[rgba(7,85,233,0.08)]"
        }`}
      >
        {index}
      </p>

      <div className="relative">
        <p className={`mono-label ${eyebrowClasses}`}>Intent {index}</p>
        <h3 className="mt-5 max-w-lg font-display text-[clamp(2.1rem,3vw,3rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
          {title}
        </h3>
        <p className={`mt-4 max-w-lg text-sm leading-7 ${copyClasses}`}>{copy}</p>
      </div>

      <div className="relative mt-10 border-t border-current/12 pt-5">
        <a className={`inline-flex items-center gap-2 text-sm font-semibold transition ${actionClasses}`} href={href}>
          {cta}
          <ArrowUpRightIcon />
        </a>
      </div>
    </article>
  );
}

function MarketPulseRow({ product }: { product: MappedProductCard }) {
  return (
    <div className="grid gap-4 border-b border-line px-5 py-5 last:border-b-0 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)_auto_auto] md:items-center sm:px-6 lg:px-8">
      <div>
        <p className="text-base font-semibold text-foreground">{product.name}</p>
        <p className="mt-2 text-sm leading-7 text-muted">
          {product.collectionName}
        </p>
      </div>

      <div>
        <p className="mono-label text-muted">Current rate</p>
        <p className="mt-3 font-display text-[2rem] font-semibold leading-none tracking-[-0.055em] text-foreground">
          {formatPriceLac(product.currentPrice)}
        </p>
      </div>

      <div>
        <p className="mono-label text-muted">Recent change</p>
        <div className="mt-3">
          <MovementTag direction={product.direction} delta={product.delta} />
        </div>
      </div>

      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-accent"
        href={`/collections/${slugify(product.collectionName)}`}
      >
        Open board
        <ArrowUpRightIcon />
      </Link>
    </div>
  );
}

function PulseSidebarLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="mono-label text-muted">{label}</span>
      <span className="max-w-[13rem] text-right">{value}</span>
    </div>
  );
}

function CollectionLeadCard({ collection }: { collection: MappedCollectionCard }) {
  const visual = getCollectionVisual(collection.slug);
  const leadProduct = collection.featuredProducts[0] ?? null;
  const secondaryProduct = collection.featuredProducts[1] ?? null;

  return (
    <article className="overflow-hidden border border-line bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(320px,0.88fr)_minmax(0,1.12fr)]">
        <div className="relative min-h-[19rem] overflow-hidden bg-brand-deep">
          {visual ? (
            <>
              <Image
                src={visual.src}
                alt={visual.alt}
                fill
                sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 44vw, 100vw"
                className="object-cover"
                style={visual.objectPosition ? { objectPosition: visual.objectPosition } : undefined}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,22,0.1)_0%,rgba(2,8,22,0.82)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="mono-label text-white/82">{visual.location}</p>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/90">{visual.caption}</p>
              </div>
            </>
          ) : (
            <div className="bg-brand-gradient flex h-full items-end p-8 text-white">
              <p className="max-w-xs text-sm leading-7 text-white/90">
                Featured live collection ready for the editorial homepage.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="mono-label text-accent">Featured collection</p>
              <div className="flex flex-wrap gap-2">
                <span className="chip">{describeCount(collection.productCount, "listing", "listings")}</span>
              </div>
            </div>

          <h3 className="mt-5 font-display text-[clamp(2.8rem,5vw,4.6rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-foreground">
            {collection.name}
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
            {getCollectionDescriptor(collection)}
          </p>

          <div className="mt-8 grid gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-2">
            <CollectionRateCell
              label={leadProduct?.name ?? "Highlighted rate"}
              value={leadProduct ? formatPriceLac(leadProduct.currentPrice) : "Awaiting rate"}
              delta={leadProduct ? <MovementTag direction={leadProduct.direction} delta={leadProduct.delta} /> : null}
            />
            <CollectionRateCell
              label={secondaryProduct?.name ?? "Board status"}
              value={
                secondaryProduct
                  ? formatPriceLac(secondaryProduct.currentPrice)
                  : collection.hasProducts
                    ? "Live board"
                    : "Awaiting products"
              }
              delta={
                secondaryProduct ? (
                  <MovementTag direction={secondaryProduct.direction} delta={secondaryProduct.delta} />
                ) : null
              }
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" href={`/collections/${collection.slug}`}>
              View Live Rates
              <ArrowUpRightIcon />
            </Link>
            <a
              className="inline-flex min-h-13 items-center justify-center gap-3 border border-line bg-white px-6 py-4 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
              href={buildWhatsAppUrl(
                siteMeta.phoneE164,
                `Hello, I want guidance on the ${collection.name} collection.`
              )}
              target="_blank"
              rel="noreferrer"
            >
              Ask on WhatsApp
              <ArrowUpRightIcon />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function CollectionSideCard({ collection }: { collection: MappedCollectionCard }) {
  const visual = getCollectionVisual(collection.slug);
  const leadProduct = collection.featuredProducts[0] ?? null;

  return (
    <article className="overflow-hidden border border-line bg-white">
      <div className="relative min-h-[13rem] overflow-hidden bg-brand-deep">
        {visual ? (
          <>
            <Image
              src={visual.src}
              alt={visual.alt}
              fill
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 34vw, 100vw"
              className="object-cover"
              style={visual.objectPosition ? { objectPosition: visual.objectPosition } : undefined}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,22,0.08)_0%,rgba(2,8,22,0.82)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="mono-label text-white/82">{visual.location}</p>
            </div>
          </>
        ) : (
          <div className="bg-brand-gradient h-full" />
        )}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mono-label text-accent">Collection board</p>
        </div>

        <h3 className="mt-4 font-display text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-foreground">
          {collection.name}
        </h3>
        <p className="mt-4 text-sm leading-7 text-muted">{getCollectionDescriptor(collection)}</p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-5">
          <div>
            <p className="mono-label text-muted">Lead rate</p>
            <p className="mt-3 text-base font-semibold text-foreground">
              {leadProduct ? formatPriceLac(leadProduct.currentPrice) : "Awaiting rate"}
            </p>
          </div>
          {leadProduct ? <MovementTag direction={leadProduct.direction} delta={leadProduct.delta} /> : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-accent"
            href={`/collections/${collection.slug}`}
          >
            Open Collection
            <ArrowUpRightIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CollectionRateCell({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: ReactNode;
}) {
  return (
    <div className="bg-white px-5 py-5">
      <p className="mono-label text-muted">{label}</p>
      <p className="mt-4 font-display text-[clamp(2rem,3vw,3.2rem)] font-semibold leading-none tracking-[-0.055em] text-foreground">
        {value}
      </p>
      {delta ? <div className="mt-4">{delta}</div> : null}
    </div>
  );
}

function StatementBanner() {
  return (
    <div className="overflow-hidden border border-white/18 bg-brand-gradient px-6 py-10 text-white shadow-[0_24px_64px_rgba(7,85,233,0.22)] sm:px-8 lg:px-10 lg:py-12">
      <p className="mono-label text-white/82">Market Context</p>
      <h2 className="mt-5 max-w-5xl font-display text-[clamp(2.7rem,6vw,5.8rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-white">
        Better Property Decisions Start With Better Market Context.
      </h2>
    </div>
  );
}

function ContactLine({
  label,
  value,
  href,
  action,
  external = false,
  last = false,
}: {
  label: string;
  value: string;
  href: string;
  action: string;
  external?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`py-4 ${last ? "" : "border-b border-white/14"}`}>
      <p className="mono-label text-white/74">{label}</p>
      <p className="mt-3 max-w-xl text-base leading-8 text-white">{value}</p>
      <a
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-white/78"
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {action}
        <ArrowUpRightIcon />
      </a>
    </div>
  );
}

function AdvisoryFact({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-white/16 bg-white/10 px-4 py-4">
      <p className="mono-label text-white/78">{title}</p>
      <p className="mt-3 text-sm leading-7 text-white/86">{body}</p>
    </div>
  );
}

function ProprietorSection() {
  return (
    <div className="overflow-hidden border border-line bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(300px,0.84fr)_minmax(0,1.16fr)]">
        <div className="relative min-h-[22rem] overflow-hidden bg-brand-deep">
          <Image
            src="/proprietor/property-portals-proprietor-mian-iqbal-mehmood.png"
            alt="Mian Iqbal Mehmood"
            fill
            sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 44vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "center top" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,22,0.08)_0%,rgba(2,8,22,0.62)_100%)]" />
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
          <div>
            <p className="mono-label text-accent">Proprietor</p>
            <h2 className="mt-5 font-display text-[clamp(2.8rem,5vw,4.8rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-foreground">
              Mian Iqbal Mehmood
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
              The proprietor behind Property Portals, positioned here as the direct face of the advisory-led market experience.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="btn-primary"
              href={buildWhatsAppUrl(
                siteMeta.phoneE164,
                "Hello, I want direct guidance from Mian Iqbal Mehmood."
              )}
              target="_blank"
              rel="noreferrer"
            >
              Talk on WhatsApp
              <ArrowUpRightIcon />
            </a>
            <a
              className="inline-flex min-h-13 items-center justify-center gap-3 border border-line bg-white px-6 py-4 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
              href={`tel:${siteMeta.phoneE164}`}
            >
              Call Advisory Desk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeFooter({ collectionCards }: { collectionCards: MappedCollectionCard[] }) {
  const footerCollections = rankCollections(collectionCards).slice(0, 4);
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteMeta.officeMapQuery
  )}`;

  return (
    <footer className="bg-[linear-gradient(180deg,#081324_0%,#020816_100%)] text-white">
      <div className="shell grid gap-10 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,1fr)] lg:py-16">
        <div>
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center border border-white/12 bg-white/10">
              <Image
                src="/brand/property-portals-logo-mark.svg"
                alt="Property Portals"
                width={24}
                height={24}
                className="h-auto w-auto"
              />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold tracking-[-0.04em] text-white">
                {siteMeta.brandName}
              </span>
              <span className="mono-label-sm mt-1 block text-white/68">Live boards and advisory</span>
            </span>
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/72">
            A cleaner property homepage for live collection boards, practical tools, and direct guidance when numbers alone are not enough.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {siteMeta.socialLinks.map((link) => (
              <SocialIconButton key={link.label} label={link.label} href={link.href} />
            ))}
          </div>
        </div>

        <FooterGroup title="Collections">
          {footerCollections.length > 0 ? (
            footerCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="transition hover:text-white"
              >
                {collection.name}
              </Link>
            ))
          ) : (
            <span className="text-white/56">Boards syncing</span>
          )}
          <a href="#collections" className="transition hover:text-white">
            All Boards
          </a>
          <a href="#collections" className="transition hover:text-white">
            Live Rates
          </a>
        </FooterGroup>

        <FooterGroup title="Tools">
          <a href="#pulse" className="transition hover:text-white">
            Market Pulse
          </a>
          <a href="#calculator" className="transition hover:text-white">
            Calculator
          </a>
          <a href="#advisory" className="transition hover:text-white">
            Advisory
          </a>
        </FooterGroup>

        <FooterGroup title="Contact">
          <a
            href={buildWhatsAppUrl(
              siteMeta.phoneE164,
              "Hello, I want direct guidance on the live property market."
            )}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            WhatsApp
          </a>
          <a href={`tel:${siteMeta.phoneE164}`} className="transition hover:text-white">
            {siteMeta.phoneDisplay}
          </a>
          <a href={mapHref} target="_blank" rel="noreferrer" className="transition hover:text-white">
            {siteMeta.address}
          </a>
        </FooterGroup>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-5 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} {siteMeta.brandName}. All rights reserved.</p>
          <p className="max-w-4xl">{siteMeta.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mono-label text-white/68">{title}</p>
      <div className="mt-5 flex flex-col gap-3 text-sm leading-7 text-white/74">{children}</div>
    </div>
  );
}

function SocialIconButton({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <a
      className="inline-flex h-11 w-11 items-center justify-center border border-white/12 bg-white/10 text-white/78 transition hover:border-white/28 hover:text-white"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
    >
      <SocialIcon label={label} className="h-5 w-5" />
    </a>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="mono-label text-accent">{eyebrow}</p>
      <h2 className="mt-4 font-display text-[clamp(3rem,5vw,5.2rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-foreground">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{description}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
      <h3 className="font-display text-[clamp(1.9rem,3vw,2.7rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-foreground">
        {title}
      </h3>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}

function MovementTag({
  direction,
  delta,
}: {
  direction: MappedProductCard["direction"];
  delta: number | null;
}) {
  const appearance =
    direction === "up"
      ? "border-[rgba(7,85,233,0.18)] bg-[rgba(7,85,233,0.08)] text-accent"
      : direction === "down"
        ? "border-[rgba(250,41,93,0.18)] bg-[rgba(250,41,93,0.08)] text-danger"
        : "border-line bg-white text-muted";

  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-2 text-mono-xs font-semibold uppercase tracking-[0.16em] ${appearance}`}
    >
      <span>{getDirectionLabel(direction)}</span>
      <span>{formatDelta(delta)}</span>
    </span>
  );
}

function rankCollections(collections: MappedCollectionCard[]) {
  return [...collections].sort((left, right) => {
    const scoreDifference = getCollectionScore(right) - getCollectionScore(left);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return right.productCount - left.productCount;
  });
}

function getCollectionScore(collection: MappedCollectionCard) {
  return [
    collection.hasProducts ? 5 : 0,
    getCollectionVisual(collection.slug) ? 3 : 0,
    Math.min(collection.featuredProducts.length, 3),
  ].reduce((total, score) => total + score, 0);
}

function getCollectionDescriptor(collection: MappedCollectionCard) {
  const visual = getCollectionVisual(collection.slug);

  if (visual) {
    return visual.caption;
  }

  return collection.hasProducts
    ? "Open the board for live rates, recent movement, and a direct path to human guidance."
    : "The board is published and ready to watch while live rates continue to populate.";
}

function getMarketStateNote(marketData: MarketHomepageData) {
  if (marketData.state === "ready") {
    return `${marketData.totalProducts} published rates are live across ${marketData.totalCollections} collections right now.`;
  }

  if (marketData.state === "empty") {
    return "The boards are published, but live products are still being added. You can still open collections, shortlist markets, and reach the advisory desk.";
  }

  return "The live feed is temporarily unavailable. The homepage, collection routes, calculator, and advisory path remain visible while the connection recovers.";
}

function describeCount(value: number, singular: string, plural: string) {
  if (value <= 0) {
    return `No ${plural}`;
  }

  return `${value} ${value === 1 ? singular : plural}`;
}

function getDirectionLabel(direction: MappedProductCard["direction"]) {
  if (direction === "up") {
    return "Up";
  }

  if (direction === "down") {
    return "Down";
  }

  if (direction === "flat") {
    return "Flat";
  }

  return "New";
}

function formatDelta(delta: number | null) {
  if (delta === null) {
    return "Fresh";
  }

  const lac = Math.abs(delta) / 100000;
  const sign = delta > 0 ? "+" : delta < 0 ? "-" : "";
  const formatted = new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(lac);

  return `${sign}${formatted} Lac`;
}

function SocialIcon({
  label,
  className = "h-4.5 w-4.5",
}: {
  label: string;
  className?: string;
}) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.4" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M13.37 20v-7.29h2.45l.37-2.84h-2.82V8.05c0-.82.23-1.38 1.4-1.38H16V4.12c-.55-.08-1.35-.12-2.27-.12-2.24 0-3.77 1.37-3.77 3.89v1.98H7.43v2.84h2.53V20h3.41Z" />
    </svg>
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
