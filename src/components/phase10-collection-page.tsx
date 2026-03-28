import Image from "next/image";
import Link from "next/link";

import {
  CollectionActionStrip,
  CollectionDataCard,
  CollectionEditorialCard,
  CollectionPageGrid,
  CollectionPageIntro,
  CollectionPagePanel,
  CollectionPageSection,
  CollectionNoticeBand,
  CollectionPill,
  CollectionStatCell,
  CollectionStatMatrix,
  CollectionTableFrame,
  collectionPageSystemRules,
} from "@/components/collection-page-system";
import { ConsultationForm } from "@/components/consultation-form";
import { Phase10KnowledgeBaseSection } from "@/components/phase10-knowledge-base";
import {
  CollectionRatesBoard,
  formatPriceLac,
  formatShortDate,
  getTypeLabel,
} from "@/components/market-ui";
import { RatesSharePanel } from "@/components/rates-share-panel";
import { getCollectionVisual } from "@/data/collection-visuals";
import { phase10KnowledgeTopics, siteMeta } from "@/data/landing-content";
import {
  type MappedArchiveRow,
  type MappedCollectionSection,
  type MappedProductCard,
  type MarketDirection,
  type MarketState,
} from "@/lib/market-data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Phase10CollectionPageProps = {
  collection: MappedCollectionSection;
  allProducts: MappedProductCard[];
  pulseProducts: MappedProductCard[];
  archiveRows: MappedArchiveRow[];
  state: MarketState;
  collectionOptions: string[];
};

type InsightCard = {
  label: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  actionLabel: string;
  href: string;
};

type DealActivityCard = {
  date: string;
  action: "Buy" | "Sell";
  productType: string;
  category: string;
  note: string;
};

const phase10ConsultationIntents = [
  "Buy a file",
  "Sell my file",
  "Need market guidance",
  "Overseas investor",
  "Just checking rates",
];

const phase10TrustBullets = [
  "Free consultation",
  "Quick WhatsApp response",
  "Collection-specific guidance",
  "Remote support available when needed",
  "Transparent market view",
];

const phase10DealActivity: DealActivityCard[] = [
  {
    date: "Mar 2026",
    action: "Buy",
    productType: "Residential File",
    category: "Early-entry watchlist",
    note: "Buyer secured early entry after the board held its range and the paperwork trail checked out before the final commitment.",
  },
  {
    date: "Mar 2026",
    action: "Sell",
    productType: "Allocation File",
    category: "Current market range",
    note: "Seller matched within the visible board range after the desk aligned documentation, dues clarity, and buyer-side expectations.",
  },
  {
    date: "Feb 2026",
    action: "Buy",
    productType: "Affidavit File",
    category: "Verification-first case",
    note: "A first-time buyer moved only after the affidavit versus allocation distinction was cleared and the supporting papers were verified.",
  },
  {
    date: "Feb 2026",
    action: "Buy",
    productType: "Remote Transfer",
    category: "Overseas support",
    note: "Overseas transfer assistance was coordinated remotely so the buyer could move ahead without relying on verbal updates alone.",
  },
];

export function Phase10CollectionPage({
  collection,
  allProducts,
  pulseProducts,
  archiveRows,
  state,
  collectionOptions,
}: Phase10CollectionPageProps) {
  const visual = getCollectionVisual(collection.slug);
  const liveProducts = allProducts.filter(
    (product) => product.currentPrice !== null,
  );
  const featuredRates = liveProducts.slice(0, 6);
  const recentRows = archiveRows.slice(0, 6);
  const olderRows = archiveRows.slice(6);
  const latestMover = pulseProducts[0] ?? null;
  const leadProduct = featuredRates[0] ?? allProducts[0] ?? null;
  const latestTimestamp = getLatestTimestamp(allProducts);
  const movementSignals = allProducts.filter(
    (product) => product.delta !== null,
  ).length;
  const displayCollectionName = getPhase10DisplayName(collection.name);
  const locationLabel = displayCollectionName.includes("Lahore")
    ? displayCollectionName
    : `${displayCollectionName} Lahore`;
  const sectionRules = collectionPageSystemRules.sections;
  const heroMetrics = [
    {
      label: "Daily rate updates",
      value:
        state === "ready" ? "Live" : state === "empty" ? "Standby" : "Syncing",
    },
    {
      label: "Last updated",
      value: latestTimestamp ? formatShortDate(latestTimestamp) : "Pending",
    },
    {
      label: "Active products tracked",
      value: String(collection.productCount),
    },
    {
      label: "Movement tracking",
      value: movementSignals > 0 ? `${movementSignals} signals` : "Watchlist",
    },
  ];
  const insightCards = buildPhase10Insights({
    collection,
    latestMover,
    archiveRows,
  });
  const marketNotice = buildMarketNotice(
    displayCollectionName,
    state,
    latestMover,
    collection,
  );
  const shareProducts = liveProducts.map((product) => ({
    name: product.name,
    price: product.currentPrice,
    delta: product.delta,
    direction: product.direction,
  }));
  const ratesShareHeadline = `Live ${displayCollectionName} rates today`;
  const ratesShareDescription =
    "A share-ready rate board for the latest tracked categories in this collection.";

  return (
    <>
      <CollectionPageSection
        id="overview"
        tone={sectionRules.overview.tone}
        spacing={sectionRules.overview.spacing}
      >
        <div className={collectionPageSystemRules.layouts.heroCenter}>
          <CollectionPagePanel
            tone="dark"
            className="relative overflow-hidden px-6 py-10 sm:px-10 lg:px-14 lg:py-14"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(7,85,233,0.18)_0%,rgba(7,85,233,0)_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_28%)]" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/58">
                <Link className="transition hover:text-white" href="/">
                  Home
                </Link>
                <span>/</span>
                <Link
                  className="transition hover:text-white"
                  href="/#collections"
                >
                  Collections
                </Link>
                <span>/</span>
                <span className="text-white/78">{displayCollectionName}</span>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-3 glass-card">
                  <span className="live-dot" />
                  <span className="mono-label text-white/92">
                    Live Collection Data - Updated Daily
                  </span>
                </div>
              </div>

              <div className="mx-auto mt-8 max-w-4xl text-center">
                <p className="mono-label text-white/68">
                  Collection market hub
                </p>
                <h1 className="mt-4 font-display text-[clamp(3rem,6vw,5.4rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-white">
                  {locationLabel} Live Rates Today
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/74 sm:text-lg sm:leading-9">
                  Track live rates, market movement, and collection activity for{" "}
                  {displayCollectionName} in one place. Review today&apos;s
                  pricing, compare recent changes, and decide your next step
                  with better market context.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  className="btn-light"
                  href={buildWhatsAppUrl(
                    siteMeta.phoneE164,
                    `Hello, I want guidance on ${displayCollectionName} and the latest published rates.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get market guidance
                  <ArrowUpRightIcon />
                </a>
                <a
                  className="pressable inline-flex min-h-13 items-center justify-center gap-3 rounded-[14px] border border-white/24 bg-white/8 px-7 py-4 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/12"
                  href="#rates"
                >
                  Jump to live rates
                  <ArrowUpRightIcon />
                </a>
              </div>

              <CollectionStatMatrix
                inverse
                columnsClassName="sm:grid-cols-2 xl:grid-cols-4"
                className="mt-10"
              >
                {heroMetrics.map((metric) => (
                  <CollectionStatCell
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    inverse
                  />
                ))}
              </CollectionStatMatrix>

              <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
                <CollectionPagePanel tone="soft" className="px-5 py-6 sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="mono-label text-accent">
                        Market desk snapshot
                      </p>
                      <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[0.96] tracking-[-0.05em] text-white">
                        What matters right now.
                      </h2>
                    </div>
                    <span className="chip">{collection.latestUpdateLabel}</span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <SnapshotCard
                      inverse
                      label="Latest published rate"
                      value={
                        leadProduct
                          ? formatPriceLac(leadProduct.currentPrice)
                          : "Awaiting rate"
                      }
                      detail={
                        leadProduct
                          ? `${leadProduct.name} is the current lead category on the board.`
                          : "The collection page is ready while the next published rate arrives."
                      }
                    />
                    <SnapshotCard
                      inverse
                      label="Recent movement"
                      value={
                        latestMover
                          ? getCompactMovementLabel(
                              latestMover.direction,
                              latestMover.delta,
                            )
                          : "Quiet"
                      }
                      detail={
                        latestMover
                          ? `${latestMover.name} is the latest category to move on the live board.`
                          : "No meaningful change signal is published yet, so use the archive and desk for context."
                      }
                    />
                  </div>
                </CollectionPagePanel>

                <CollectionPagePanel
                  tone="light"
                  className="relative overflow-hidden px-5 py-6 sm:px-6"
                >
                  {visual ? (
                    <>
                      <div className="absolute inset-0 opacity-20">
                        <Image
                          src={visual.src}
                          alt={visual.alt}
                          fill
                          priority
                          sizes="(min-width: 1280px) 28rem, 100vw"
                          className="object-cover"
                          style={
                            visual.objectPosition
                              ? { objectPosition: visual.objectPosition }
                              : undefined
                          }
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/20 to-navy/90" />
                    </>
                  ) : null}

                  <div className="relative z-10">
                    <p className="mono-label text-accent">Collection context</p>
                    <h2 className="mt-3 font-display text-[2rem] font-semibold leading-[0.96] tracking-[-0.05em] text-white">
                      Read the board before you react.
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-white/72">
                      This page is structured to do one job well: surface the
                      current board, isolate what moved, and back that up with
                      historical depth before the visitor reaches out.
                    </p>

                    <div className="mt-6 grid gap-3">
                      <InlineTrustStat
                        label="Tracked products"
                        value={String(collection.productCount)}
                      />
                      <InlineTrustStat
                        label="Board state"
                        value={collection.latestUpdateLabel}
                      />
                      <InlineTrustStat
                        label="Latest focus"
                        value={leadProduct?.name ?? "Live watchlist"}
                      />
                    </div>
                  </div>
                </CollectionPagePanel>
              </div>
            </div>
          </CollectionPagePanel>
        </div>
      </CollectionPageSection>

      <CollectionPageSection
        id="insights"
        tone={sectionRules.insights.tone}
        spacing={sectionRules.insights.spacing}
      >
        <CollectionPageIntro
          eyebrow="Collection Insights"
          title={`Latest ${displayCollectionName} updates`}
          description="A quick view of collection-specific movement, investor notes, and recent activity so users can understand the market before diving into the full board."
        />

        <CollectionPageGrid className="xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)_minmax(0,0.85fr)]">
          {insightCards.map((card, index) => (
            <CollectionEditorialCard
              key={card.title}
              label={card.label}
              title={card.title}
              excerpt={card.excerpt}
              meta={card.dateLabel}
              href={card.href}
              actionLabel={card.actionLabel}
              featured={index === 0}
            />
          ))}
        </CollectionPageGrid>
      </CollectionPageSection>

      <CollectionPageSection
        id="rates"
        tone={sectionRules.rates.tone}
        spacing={sectionRules.rates.spacing}
      >
        <CollectionPageIntro
          eyebrow="Today's Rates"
          title={`Live ${displayCollectionName} rates today`}
          description="A quick view of the key product categories currently tracked in this collection, including the latest published values and recent movement."
        />

        {featuredRates.length > 0 ? (
          <>
            <div
              className={cx(
                collectionPageSystemRules.layouts.ratesSplit,
                "mt-8",
              )}
            >
              <div>
                <CollectionPageGrid className="mt-0 md:grid-cols-2">
                  {featuredRates.map((product) => (
                    <CollectionDataCard
                      key={product.id}
                      eyebrow={getTypeLabel(product.type)}
                      title={product.name}
                      value={formatPriceLac(product.currentPrice, {
                        showUnit: false,
                      })}
                      unit="Lac"
                      badge={<span className="chip">Live</span>}
                      meta={
                        <>
                          <MovementBadge
                            direction={product.direction}
                            delta={product.delta}
                          />
                          <span className="mono-label-sm text-white/56">
                            {product.latestTime
                              ? `Updated ${formatShortDate(product.latestTime)}`
                              : "Awaiting update"}
                          </span>
                        </>
                      }
                      description={product.description}
                      footer={
                        <>
                          <a
                            className="btn-primary"
                            href={buildWhatsAppUrl(
                              siteMeta.phoneE164,
                              `Hello, I want guidance on ${product.name} in ${displayCollectionName}.`,
                            )}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ask on WhatsApp
                            <ArrowUpRightIcon />
                          </a>
                          <a className="btn-secondary" href="#archive">
                            View details
                          </a>
                        </>
                      }
                    />
                  ))}
                </CollectionPageGrid>
              </div>

              <CollectionPagePanel
                tone="dark"
                className="overflow-hidden px-5 py-6 sm:px-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="mono-label text-white/84">
                      Share-ready board
                    </p>
                    <h3 className="mt-3 font-display text-[2rem] font-semibold leading-[0.96] tracking-[-0.05em] text-white">
                      Keep the latest snapshot handy.
                    </h3>
                  </div>
                  <span className="badge-pill badge-pill-outline">
                    Live export
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-white/88">
                  Export the current rate mix as an image without leaving the
                  board. The action flow stays unchanged so the desk can keep
                  using the same share routine.
                </p>

                <div className="mt-6 border border-white/18 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="mono-label text-white/82">
                    Current board window
                  </p>
                  <div className="mt-4 grid gap-3">
                    <SnapshotCard
                      inverse
                      label="Published rate cards"
                      value={`${featuredRates.length} live`}
                      detail="Focused categories surfaced first so the full board only opens when the visitor wants extra depth."
                    />
                    <SnapshotCard
                      inverse
                      label="Last board sync"
                      value={collection.latestUpdateLabel}
                      detail="The export panel uses the same live numbers already shown in the cards."
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <RatesSharePanel
                    collectionName={displayCollectionName}
                    headline={ratesShareHeadline}
                    updatedLabel={collection.latestUpdateLabel}
                    description={ratesShareDescription}
                    imageSrc={visual?.src}
                    products={shareProducts}
                  />
                </div>
              </CollectionPagePanel>
            </div>

            <details className="motion-panel mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-white/6 text-white shadow-[0_20px_56px_rgba(2,8,22,0.34)]">
              <summary className="cursor-pointer list-none px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="mono-label text-accent">
                      Complete live board
                    </p>
                    <p className="mt-2 text-sm text-white/68">
                      Open the full grouped board for every tracked product,
                      descriptions, and recent trend lines.
                    </p>
                  </div>
                  <span className="chip">
                    {collection.productCount} tracked products
                  </span>
                </div>
              </summary>
              <div className="border-t border-white/10 px-4 py-5 sm:px-6">
                <CollectionRatesBoard collection={collection} state={state} />
              </div>
            </details>
          </>
        ) : (
          <EmptyDataState
            title="Live rate cards will appear here once the collection has published price data."
            description={
              state === "unavailable"
                ? "The board is visible, but the live CMS connection is temporarily unavailable."
                : "The collection structure is ready and waiting for the next published rate update."
            }
          />
        )}
      </CollectionPageSection>

      <CollectionPageSection
        id="movers"
        tone={sectionRules.movers.tone}
        spacing={sectionRules.movers.spacing}
      >
        <CollectionPagePanel
          tone="dark"
          className="overflow-hidden px-5 py-8 sm:px-8 lg:px-10"
        >
          <CollectionPageIntro
            eyebrow="Daily Market Pulse"
            title={`${displayCollectionName} - today's movers`}
            description="See which categories moved recently so you can focus on what matters instead of scanning the full board manually."
            inverse
          />

          <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-white/4">
            {pulseProducts.length > 0 ? (
              <>
                <div className="hidden grid-cols-[1.6fr_0.95fr_0.95fr_0.9fr_auto] gap-4 border-b border-white/10 bg-white/8 px-5 py-4 md:grid">
                  <span className="mono-label text-white/56">
                    Product / file type
                  </span>
                  <span className="mono-label text-white/56">Category</span>
                  <span className="mono-label text-white/56">
                    Current value
                  </span>
                  <span className="mono-label text-white/56">Recent move</span>
                  <span className="mono-label text-white/56">Action</span>
                </div>

                {pulseProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="grid gap-3 border-b border-white/8 px-5 py-5 last:border-none md:grid-cols-[1.6fr_0.95fr_0.95fr_0.9fr_auto] md:items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-semibold text-white">
                          {product.name}
                        </p>
                        <span
                          className={getMoverBadgeClass(
                            index,
                            product.direction,
                          )}
                        >
                          {getMoverBadgeLabel(index, product.direction)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white/56">
                        {product.latestTime
                          ? `Updated ${formatShortDate(product.latestTime)}`
                          : "Awaiting point"}
                      </p>
                    </div>

                    <p className="mono-label text-white/56">
                      {getTypeLabel(product.type)}
                    </p>

                    <p className="font-display text-[1.9rem] font-semibold tracking-[-0.05em] text-white">
                      {formatPriceLac(product.currentPrice)}
                    </p>

                    <MovementBadge
                      direction={product.direction}
                      delta={product.delta}
                    />

                    <a
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-accent"
                      href={buildWhatsAppUrl(
                        siteMeta.phoneE164,
                        `Hello, I want context on ${product.name} in ${displayCollectionName}.`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ask on WhatsApp
                      <ArrowUpRightIcon />
                    </a>
                  </div>
                ))}
              </>
            ) : (
              <div className="px-5 py-8 text-sm leading-7 text-white/68">
                {state === "unavailable"
                  ? "The live feed is unavailable right now, so the movers list is waiting on the next sync."
                  : "No tracked category has enough history yet to surface as a mover. The archive and advisory desk remain available while the next comparison point arrives."}
              </div>
            )}
          </div>

          <CollectionActionStrip
            inverse
            eyebrow="Seen movement worth checking?"
            description="Get a quick read on whether the latest move matters or is just short-term market noise before you react."
            action={
              <a
                className="btn-light"
                href={buildWhatsAppUrl(
                  siteMeta.phoneE164,
                  `Hello, please explain whether the latest ${displayCollectionName} movement is meaningful.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                Get market guidance
                <ArrowUpRightIcon />
              </a>
            }
          />
        </CollectionPagePanel>
      </CollectionPageSection>

      <CollectionPageSection
        id="archive"
        tone={sectionRules.archive.tone}
        spacing={sectionRules.archive.spacing}
      >
        <CollectionPageIntro
          eyebrow="Historical Archive"
          title={`${displayCollectionName} complete rate history`}
          description="Review how tracked products have moved over time so decisions are based on patterns, not just today's snapshot."
        />

        {archiveRows.length > 0 ? (
          <CollectionTableFrame
            eyebrow="Historical board view"
            description="Today's row stays highlighted so visitors can compare the latest reading against earlier published levels without losing context."
            className="mt-8"
            meta={
              <div className="flex flex-wrap gap-2">
                <span className="chip">{archiveRows.length} archive rows</span>
                <span className="chip">
                  {collection.productCount} tracked products
                </span>
              </div>
            }
          >
            <ArchiveRowsTable
              products={allProducts}
              rows={recentRows}
              highlightFirstRow
            />

            {olderRows.length > 0 ? (
              <details className="border-t border-white/10 bg-white/6">
                <summary className="cursor-pointer list-none px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="mono-label text-accent">
                        Older archive rows
                      </p>
                      <p className="mt-2 text-sm text-white/68">
                        Open the remaining history entries for a wider market
                        read.
                      </p>
                    </div>
                    <span className="chip">{olderRows.length} more rows</span>
                  </div>
                </summary>
                <ArchiveRowsTable products={allProducts} rows={olderRows} />
              </details>
            ) : null}
          </CollectionTableFrame>
        ) : (
          <EmptyDataState
            title="Historical rows will appear here once the collection has published price history."
            description="The archive table is ready, but it needs stored timeline points before historical movement can be rendered."
          />
        )}
      </CollectionPageSection>

      <CollectionPageSection
        id="deals"
        tone={sectionRules.deals.tone}
        spacing={sectionRules.deals.spacing}
      >
        <CollectionPageIntro
          eyebrow="Transparent Deal History"
          title={`Recent ${displayCollectionName} deal activity`}
          description="A short view of recent advisory-side activity and representative desk support to add real-world context beyond daily rates."
        />

        <CollectionPageGrid className="md:grid-cols-2 xl:grid-cols-4">
          {phase10DealActivity.map((item) => (
            <CollectionPagePanel
              key={`${item.date}-${item.productType}-${item.action}`}
              tone="light"
              className="flex h-full flex-col gap-4 px-5 py-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="mono-label text-accent">{item.date}</span>
                <CollectionPill
                  tone={item.action === "Buy" ? "accent" : "dark"}
                >
                  {item.action}
                </CollectionPill>
              </div>
              <div>
                <h3 className="font-display text-[1.9rem] font-semibold leading-[1] tracking-[-0.05em] text-white">
                  {item.productType}
                </h3>
                <p className="mt-2 mono-label-sm text-white/56">
                  {item.category}
                </p>
              </div>
              <p className="text-sm leading-7 text-white/68">{item.note}</p>
              <div className="mt-auto border-t border-white/10 pt-4">
                <p className="mono-label-sm text-white/56">
                  Desk-side activity snapshot
                </p>
              </div>
            </CollectionPagePanel>
          ))}
        </CollectionPageGrid>
      </CollectionPageSection>

      <CollectionPageSection
        id="knowledge"
        tone={sectionRules.knowledge.tone}
        spacing={sectionRules.knowledge.spacing}
      >
        <Phase10KnowledgeBaseSection />
      </CollectionPageSection>

      <CollectionPageSection
        id="notice"
        tone={sectionRules.notice.tone}
        spacing={sectionRules.notice.spacing}
      >
        <CollectionNoticeBand
          eyebrow="Market Notice"
          title={marketNotice.title}
          description={marketNotice.description}
          action={
            <a
              className="btn-light"
              href={buildWhatsAppUrl(siteMeta.phoneE164, marketNotice.message)}
              target="_blank"
              rel="noreferrer"
            >
              Notify Me on WhatsApp
              <ArrowUpRightIcon />
            </a>
          }
        >
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Installment activity",
              "Ballot updates",
              "Development news",
              "Category shifts",
            ].map((item) => (
              <span key={item} className="badge-pill badge-pill-outline">
                {item}
              </span>
            ))}
          </div>
        </CollectionNoticeBand>
      </CollectionPageSection>

      <CollectionPageSection
        id="contact"
        tone={sectionRules.contact.tone}
        spacing={sectionRules.contact.spacing}
      >
        <div className={collectionPageSystemRules.layouts.contactSplit}>
          <div className="surface-brand theme-inverse relative overflow-hidden px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_70%)] blur-3xl" />
            <div className="relative z-10">
              <CollectionPageIntro
                eyebrow="Consultation"
                title={`Ready to explore ${displayCollectionName} more seriously?`}
                description="Speak directly with the advisory desk for collection-specific help on buying, selling, pricing, or next steps."
                inverse
              />

              <ul className="mt-8 space-y-3 text-sm leading-7 text-white/90">
                {phase10TrustBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/24 bg-white/14">
                      <CheckIcon />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <InlineTrustStat
                  label="WhatsApp line"
                  value={siteMeta.phoneDisplay}
                />
                <InlineTrustStat
                  label="Board context"
                  value={latestMover ? latestMover.name : "Live watchlist"}
                />
                <InlineTrustStat
                  label="Collection update"
                  value={collection.latestUpdateLabel}
                />
                <InlineTrustStat label="Remote support" value="Available" />
              </div>
            </div>
          </div>

          <div className="surface-navy px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
            <p className="mono-label text-white/56">Inquiry form</p>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.5rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-white">
              Start with the exact product or question.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
              Keep it short. The form only prepares a WhatsApp message so the
              advisory desk receives the collection, your intent, and the right
              context from the first message.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                className="btn-primary"
                href={buildWhatsAppUrl(
                  siteMeta.phoneE164,
                  `Hello, I need guidance on ${displayCollectionName} and the latest market picture.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                Request market brief
                <ArrowUpRightIcon />
              </a>
              <p className="text-sm text-white/62">
                Prefer to add context first? Use the form below.
              </p>
            </div>

            <div className="mt-8 rounded-[22px] border border-white/10 bg-white/6 p-5 sm:p-6">
              <ConsultationForm
                phoneE164={siteMeta.phoneE164}
                expertName={siteMeta.expertName}
                intents={phase10ConsultationIntents}
                fileTypes={collectionOptions}
              />
            </div>
          </div>
        </div>
      </CollectionPageSection>

      <CollectionPageSection
        id="advisory"
        tone={sectionRules.advisory.tone}
        spacing={sectionRules.advisory.spacing}
      >
        <div className={collectionPageSystemRules.layouts.advisorySplit}>
          <CollectionPagePanel
            tone="light"
            className="px-6 py-8 sm:px-8 lg:px-10"
          >
            <CollectionPageIntro
              eyebrow="Advisory Desk"
              title={`Direct guidance for ${displayCollectionName} buyers and sellers`}
              description="This board is built to make the market easier to read, then hand serious visitors to a real person without friction once they need help beyond the published numbers."
            />

            <CollectionStatMatrix
              className="mt-8"
              columnsClassName="sm:grid-cols-2 xl:grid-cols-4"
            >
              <AdvisoryMetric label="Daily updates" value="Tracked" />
              <AdvisoryMetric
                label="Movement visibility"
                value={
                  movementSignals > 0
                    ? `${movementSignals} signals`
                    : "Watchlist"
                }
              />
              <AdvisoryMetric
                label="Collection support"
                value={displayCollectionName}
              />
              <AdvisoryMetric label="Overseas assistance" value="Available" />
            </CollectionStatMatrix>

            <CollectionPageGrid className="mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
              <div className="border border-white/10 bg-white/6 px-5 py-5">
                <p className="mono-label text-accent">
                  Why this page is useful
                </p>
                <p className="mt-3 text-sm leading-7 text-white/68">
                  It layers the market in the right order: current snapshot,
                  recent movement, historical depth, operational context,
                  investor education, and then direct consultation.
                </p>
              </div>

              <div className="border border-white/10 bg-white/4 px-5 py-5">
                <p className="mono-label text-accent">What the desk adds</p>
                <p className="mt-3 text-sm leading-7 text-white/68">
                  The advisory desk helps when a quote needs verification, when
                  categories look similar but are not comparable, or when timing
                  matters more than the raw number.
                </p>
              </div>
            </CollectionPageGrid>
          </CollectionPagePanel>

          <CollectionPagePanel
            tone="dark"
            className="overflow-hidden px-6 py-8 sm:px-8 lg:px-10"
          >
            <p className="mono-label text-white/84">Specialist access</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.7rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
              Speak to the collection desk directly.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/90">
              Use WhatsApp for the fastest handoff when you need
              collection-specific guidance, transfer clarity, or a second read
              on the market before acting.
            </p>

            <div className="mt-8 space-y-4 border border-white/22 bg-white/14 p-5">
              <div>
                <p className="mono-label text-white/84">Advisory desk</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {siteMeta.expertName}
                </p>
              </div>
              <div>
                <p className="mono-label text-white/84">Direct line</p>
                <a
                  className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-white transition hover:text-white/84"
                  href={`tel:${siteMeta.phoneE164}`}
                >
                  {siteMeta.phoneDisplay}
                  <ArrowUpRightIcon />
                </a>
              </div>
              <div>
                <p className="mono-label text-white/84">Office position</p>
                <p className="mt-2 text-sm leading-7 text-white/90">
                  {siteMeta.address}
                </p>
              </div>
              <div>
                <p className="mono-label text-white/84">Response note</p>
                <p className="mt-2 text-sm leading-7 text-white/90">
                  Fast WhatsApp-first replies for collection guidance, remote
                  support, and transfer questions.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="btn-light"
                href={buildWhatsAppUrl(
                  siteMeta.phoneE164,
                  `Hello, I want direct guidance for ${displayCollectionName}.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp the desk
                <ArrowUpRightIcon />
              </a>
              <a
                className="pressable inline-flex min-h-13 items-center justify-center gap-3 rounded-[14px] border border-white/28 bg-white/14 px-7 py-4 text-sm font-semibold text-white hover:border-white hover:bg-white/20"
                href="#contact"
              >
                Open inquiry form
              </a>
            </div>
          </CollectionPagePanel>
        </div>
      </CollectionPageSection>
    </>
  );
}

function ArchiveRowsTable({
  products,
  rows,
  highlightFirstRow = false,
}: {
  products: MappedProductCard[];
  rows: MappedArchiveRow[];
  highlightFirstRow?: boolean;
}) {
  return (
    <div className={collectionPageSystemRules.table.wrapper}>
      <table className={collectionPageSystemRules.table.table}>
        <thead>
          <tr className={collectionPageSystemRules.table.headRow}>
            <th
              className={cx(
                collectionPageSystemRules.table.headCell,
                "mono-label text-white/56",
              )}
            >
              Date
            </th>
            {products.map((product) => (
              <th
                key={product.id}
                className={cx(
                  collectionPageSystemRules.table.headCell,
                  "min-w-36",
                )}
              >
                <span className="block text-sm font-semibold text-white">
                  {product.name}
                </span>
                <span className="mt-1 block mono-label-sm text-white/50">
                  {getTypeLabel(product.type)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row.date}
              className={cx(
                collectionPageSystemRules.table.bodyRow,
                highlightFirstRow &&
                  rowIndex === 0 &&
                  collectionPageSystemRules.table.highlightedRow,
              )}
            >
              <td
                className={cx(
                  collectionPageSystemRules.table.bodyCell,
                  "align-top",
                )}
              >
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-white">
                    {formatShortDate(row.date)}
                  </span>
                  {highlightFirstRow && rowIndex === 0 ? (
                    <span className="pill-sm w-fit">Latest</span>
                  ) : null}
                </div>
              </td>
              {products.map((product) => {
                const entry = row.values[product.id];

                return (
                  <td
                    key={product.id}
                    className={cx(
                      collectionPageSystemRules.table.bodyCell,
                      "align-top",
                    )}
                  >
                    {entry ? (
                      <div className="space-y-2">
                        <p className="font-display text-[1.7rem] font-semibold tracking-[-0.05em] text-white">
                          {formatPriceLac(entry.price, { showUnit: false })}
                        </p>
                        <span
                          className={getArchiveChangeClass(entry.direction)}
                        >
                          {getArchiveChangeLabel(entry.direction, entry.delta)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-white/40">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyDataState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="motion-panel mt-8 rounded-[24px] border border-dashed border-white/14 bg-white/6 px-5 py-6 text-white shadow-[0_20px_56px_rgba(2,8,22,0.34)]">
      <p className="mono-label text-accent">Data pending</p>
      <h3 className="mt-3 font-display text-[2rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
        {title}
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
        {description}
      </p>
    </div>
  );
}

function SnapshotCard({
  label,
  value,
  detail,
  inverse = false,
}: {
  label: string;
  value: string;
  detail: string;
  inverse?: boolean;
}) {
  return (
    <div
      className={cx(
        "border px-5 py-5",
        inverse ? "border-white/18 bg-white/8" : "border-white/10 bg-white/6",
      )}
    >
      <p
        className={cx("mono-label", inverse ? "text-white/82" : "text-accent")}
      >
        {label}
      </p>
      <p
        className={cx(
          "mt-3 font-display text-[1.8rem] font-semibold tracking-[-0.05em]",
          "text-white",
        )}
      >
        {value}
      </p>
      <p
        className={cx(
          "mt-3 text-sm leading-7",
          inverse ? "text-white/84" : "text-white/68",
        )}
      >
        {detail}
      </p>
    </div>
  );
}

function InlineTrustStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/24 bg-white/12 px-4 py-4">
      <p className="mono-label text-white/82">{label}</p>
      <p className="mt-3 text-sm font-semibold leading-7 text-white">{value}</p>
    </div>
  );
}

function AdvisoryMetric({ label, value }: { label: string; value: string }) {
  return <CollectionStatCell label={label} value={value} />;
}

function MovementBadge({
  direction,
  delta,
}: {
  direction: MarketDirection;
  delta: number | null;
}) {
  const tone =
    direction === "up"
      ? "border border-brand-soft bg-brand-soft text-accent"
      : direction === "down"
        ? "border border-danger-soft bg-danger-soft text-danger"
        : "border border-white/10 bg-white/6 text-white/68";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[999px] px-3 py-2 text-sm font-medium ${tone}`}
    >
      <span aria-hidden="true">{getMovementSymbol(direction)}</span>
      <span>{getMovementText(direction, delta)}</span>
    </span>
  );
}

function buildPhase10Insights({
  collection,
  latestMover,
  archiveRows,
}: {
  collection: MappedCollectionSection;
  latestMover: MappedProductCard | null;
  archiveRows: MappedArchiveRow[];
}): InsightCard[] {
  const affidavitTopic =
    phase10KnowledgeTopics.find((topic) => topic.title.includes("Affidavit")) ??
    phase10KnowledgeTopics[0];
  const remoteTopic =
    phase10KnowledgeTopics.find((topic) => topic.title.includes("Remote")) ??
    phase10KnowledgeTopics[phase10KnowledgeTopics.length - 1];

  return [
    {
      label: "Weekly movement summary",
      title: latestMover
        ? `${latestMover.name} is leading the latest board signal`
        : `${collection.name} is quiet, so timing matters more than speed`,
      excerpt: latestMover
        ? `${latestMover.name} is the clearest recent mover on the board. Use that change as a signal to investigate, not as a reason to react without verification.`
        : "The live board does not show a strong mover yet. Use the archive and desk guidance to separate a true opportunity from a market that is simply waiting on the next trigger.",
      dateLabel: collection.latestUpdateLabel,
      actionLabel: "Read the movers",
      href: "#movers",
    },
    {
      label: "File class note",
      title: "Separate affidavit and allocation before comparing any quote",
      excerpt: affidavitTopic.summary,
      dateLabel: collection.latestUpdateLabel,
      actionLabel: "Read the guide",
      href: "#knowledge",
    },
    {
      label: "Investor process",
      title:
        archiveRows.length > 1
          ? "Use the archive before you ask for timing advice"
          : "Remote investors should lock the paperwork path early",
      excerpt:
        archiveRows.length > 1
          ? "Multiple published rows now exist for this collection. Check the pattern first, then ask the desk whether the latest move fits the broader direction."
          : remoteTopic.summary,
      dateLabel: collection.latestUpdateLabel,
      actionLabel: archiveRows.length > 1 ? "Open the archive" : "Ask the desk",
      href: archiveRows.length > 1 ? "#archive" : "#contact",
    },
  ];
}

function buildMarketNotice(
  collectionName: string,
  state: MarketState,
  latestMover: MappedProductCard | null,
  collection: MappedCollectionSection,
) {
  if (state === "unavailable") {
    return {
      title: `Want to know when ${collectionName} data is back in sync?`,
      description:
        "Use this block for collection-specific alerts when the live board reconnects or a fresh update lands after a quiet period.",
      message: `Hello, please notify me when ${collectionName} publishes the next major board update.`,
    };
  }

  if (latestMover) {
    return {
      title: `Be notified on the next major ${collectionName} update`,
      description: `${latestMover.name} is the latest watched category on the board. Ask for an alert when the next meaningful move, development signal, or category-level shift comes through.`,
      message: `Hello, notify me when ${collectionName} publishes the next major move after ${latestMover.name}.`,
    };
  }

  return {
    title: `Waiting for the next ${collectionName} market trigger?`,
    description: `${collection.productCount > 0 ? "The board is live, but movement is still light." : "The collection shell is ready while the next published product arrives."} Use WhatsApp to stay close to installment activity, development updates, and the next category signal.`,
    message: `Hello, please keep me posted on the next major ${collectionName} market trigger.`,
  };
}

function getLatestTimestamp(products: MappedProductCard[]) {
  return (
    products
      .map((product) => product.latestTime)
      .filter((value): value is string => Boolean(value))
      .sort(
        (left, right) => new Date(right).getTime() - new Date(left).getTime(),
      )[0] ?? null
  );
}

function getPhase10DisplayName(name: string) {
  if (name.toLowerCase().includes("dha")) {
    return name;
  }

  return `DHA ${name}`;
}

function getCompactMovementLabel(
  direction: MarketDirection,
  delta: number | null,
) {
  if (direction === null || delta === null) {
    return "No delta";
  }

  if (direction === "flat") {
    return "Stable";
  }

  return `${direction === "up" ? "+" : "-"}${formatPriceLac(Math.abs(delta), { showUnit: false })}`;
}

function getMovementSymbol(direction: MarketDirection) {
  if (direction === "up") {
    return "+";
  }

  if (direction === "down") {
    return "-";
  }

  if (direction === "flat") {
    return "=";
  }

  return "o";
}

function getMovementText(direction: MarketDirection, delta: number | null) {
  if (direction === null || delta === null) {
    return "No change yet";
  }

  if (direction === "flat") {
    return "No change";
  }

  return `${direction === "up" ? "+" : "-"}${formatPriceLac(Math.abs(delta))}`;
}

function getMoverBadgeLabel(index: number, direction: MarketDirection) {
  if (index === 0) {
    return "Hot";
  }

  if (direction === "up") {
    return "Up";
  }

  if (direction === "down") {
    return "Down";
  }

  return "Stable";
}

function getMoverBadgeClass(index: number, direction: MarketDirection) {
  if (index === 0) {
    return "inline-flex min-h-8 items-center rounded-[999px] bg-accent-soft px-3 py-1 text-sm font-semibold text-accent";
  }

  if (direction === "up") {
    return "inline-flex min-h-8 items-center rounded-[999px] bg-accent-soft px-3 py-1 text-sm font-semibold text-accent";
  }

  if (direction === "down") {
    return "inline-flex min-h-8 items-center rounded-[999px] bg-danger-soft px-3 py-1 text-sm font-semibold text-danger";
  }

  return "inline-flex min-h-8 items-center rounded-[999px] border border-white/10 bg-white/6 px-3 py-1 text-sm font-semibold text-white/68";
}

function getArchiveChangeLabel(
  direction: MarketDirection,
  delta: number | null,
) {
  if (direction === null || delta === null) {
    return "First point";
  }

  if (direction === "flat") {
    return "No change";
  }

  return `${direction === "up" ? "Up" : "Down"} ${formatPriceLac(Math.abs(delta))}`;
}

function getArchiveChangeClass(direction: MarketDirection) {
  if (direction === "up") {
    return "inline-flex rounded-[999px] bg-accent-soft px-3 py-1 text-sm font-semibold text-accent";
  }

  if (direction === "down") {
    return "inline-flex rounded-[999px] bg-danger-soft px-3 py-1 text-sm font-semibold text-danger";
  }

  return "inline-flex rounded-[999px] border border-white/10 bg-white/6 px-3 py-1 text-sm font-semibold text-white/68";
}

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.2]"
    >
      <path d="m5 12 4 4L19 8" />
    </svg>
  );
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
