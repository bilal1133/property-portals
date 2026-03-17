import Image from "next/image";
import Link from "next/link";

import { ConsultationForm } from "@/components/consultation-form";
import { getCollectionVisual } from "@/data/collection-visuals";
import {
  consultationIntents,
  dealProofs,
  guideTopics,
  siteMeta,
  type DealProof,
  type GuideTopic,
} from "@/data/landing-content";
import {
  slugify,
  type MappedArchiveRow,
  type MappedCollectionCard,
  type MappedCollectionSection,
  type MappedProductCard,
  type MarketDirection,
  type MarketState,
} from "@/lib/market-data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type PageLink = {
  label: string;
  href: string;
};

type CollectionLink = {
  slug: string;
  label: string;
};

const typeLabels = {
  plot: "Plots",
  file: "Files",
  home: "Homes",
} as const;

const shellClass = "mx-auto w-full max-w-[1776px] px-5 sm:px-8 xl:px-[52px]";
const surfaceClass = "motion-panel surface-elevation border border-line bg-white";
const softSurfaceClass = "motion-panel surface-elevation border border-line bg-panel-strong";
const brandSurfaceClass =
  "motion-panel brand-elevation border border-white/20 bg-[var(--brand-gradient)] text-white";
const darkSurfaceClass = "border border-white/10 bg-navy text-white";
const monoClass = "font-mono text-[0.72rem] uppercase tracking-[0.18em]";
const utilityMonoClass = "font-mono text-[0.64rem] uppercase tracking-[0.16em]";
const primaryButtonClass =
  "pressable sheen inline-flex min-h-11 items-center justify-center gap-3 border border-accent bg-accent px-5 py-3 text-sm font-semibold text-white hover:border-brand-deep hover:bg-brand-deep";
const secondaryButtonClass =
  "pressable sheen inline-flex min-h-11 items-center justify-center gap-3 border border-line bg-white px-5 py-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent";
const lightButtonClass =
  "pressable sheen inline-flex min-h-11 items-center justify-center gap-3 border border-white bg-white px-5 py-3 text-sm font-semibold text-foreground hover:text-accent";
const chipClass =
  "inline-flex min-h-9 items-center gap-2 rounded-[20px] border border-line bg-white px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted transition hover:border-accent hover:text-accent";

export function SiteHeader({
  pageLinks,
  collectionLinks,
  currentCollectionSlug,
}: {
  pageLinks: PageLink[];
  collectionLinks: CollectionLink[];
  currentCollectionSlug?: string;
}) {
  const activeCollectionLabel = collectionLinks.find(
    (collection) => collection.slug === currentCollectionSlug
  )?.label;

  return (
    <header className="sticky top-0 z-40 bg-white/94 backdrop-blur-md">
      <div className="border-b border-white/16 bg-[var(--brand-gradient)] text-white">
        <div className={`${shellClass} flex flex-col gap-3 py-2.5 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/84">
            <span className={`${utilityMonoClass} text-white/72`}>{siteMeta.agencyName}</span>
            <span className="hidden h-3.5 w-px bg-white/24 lg:block" />
            <span>{siteMeta.address}</span>
            <span className="hidden h-3.5 w-px bg-white/24 lg:block" />
            <span className={`${utilityMonoClass} rounded-[20px] border border-white/20 bg-white/10 px-3 py-1 text-white/88`}>
              {activeCollectionLabel ? `${activeCollectionLabel} board` : "Live market boards"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <a
              className="text-sm font-medium text-white transition hover:text-white/72"
              href={`tel:${siteMeta.phoneE164}`}
            >
              Call / WhatsApp {siteMeta.phoneDisplay}
            </a>
            <SocialLinks compact inverse />
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-white">
        <div className={`${shellClass} grid gap-4 py-4 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center`}>
          <div className="flex items-start gap-4">
            <Link className="motion-lift border border-line bg-white px-4 py-3" href="/">
              <p className="font-display text-[1.65rem] font-semibold tracking-[-0.05em] text-foreground">
                {siteMeta.brandName}
              </p>
              <p className={`${monoClass} mt-1 text-muted`}>
                {currentCollectionSlug ? "Dedicated collection board" : "Collection market hub"}
              </p>
            </Link>

            <div className="hidden min-[1150px]:block">
              <p className={`${monoClass} text-accent`}>
                {activeCollectionLabel ? "Current board" : "Daily coverage"}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {activeCollectionLabel ?? "Switch between published collection pages"}
              </p>
              <p className="mt-1 text-sm text-muted">
                Direct WhatsApp support with Muhammad Kamran Sharif
              </p>
            </div>
          </div>

          <div className="overflow-x-auto xl:px-6">
            <nav className="flex min-w-max items-center gap-1.5">
              {pageLinks.map((link) => (
                <a
                  key={link.href}
                  className="pressable inline-flex min-h-11 items-center border-b-2 border-transparent px-3 text-sm font-medium text-muted hover:border-accent hover:text-foreground"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 xl:justify-end">
            <div className="hidden min-[860px]:flex flex-wrap items-center gap-2">
              <span className={chipClass}>5 min sync</span>
              <span className={chipClass}>
                {currentCollectionSlug ? "Board view" : "Hub view"}
              </span>
            </div>
            <a
              className={primaryButtonClass}
              href={buildWhatsAppUrl(
                siteMeta.phoneE164,
                "Assalam o Alaikum Kamran, I want direct guidance on a live property collection."
              )}
              target="_blank"
              rel="noreferrer"
            >
              Chat with Kamran
              <ArrowUpRightIcon />
            </a>
          </div>
        </div>
      </div>

      {collectionLinks.length > 0 ? (
        <div className="border-b border-line bg-panel-strong/95">
          <div className={`${shellClass} flex flex-col gap-3 py-3 lg:flex-row lg:items-center`}>
            <div className="flex shrink-0 items-center gap-3">
              <p className={`${monoClass} text-accent`}>Collection boards</p>
              <span className="hidden h-4 w-px bg-line lg:block" />
              <p className="hidden text-sm text-muted xl:block">
                Open a dedicated page for each published market board.
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="flex min-w-max items-center gap-2 pb-1">
                {collectionLinks.map((collection) => {
                  const isActive = currentCollectionSlug === collection.slug;

                  return (
                    <Link
                      key={collection.slug}
                      className={`pressable min-h-11 px-3 py-2 text-sm ${
                        isActive
                          ? "border border-accent bg-accent text-white"
                          : "border border-line bg-white text-muted hover:border-accent hover:text-accent"
                      }`}
                      href={`/collections/${collection.slug}`}
                    >
                      {collection.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  inverse?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className={`${monoClass} ${inverse ? "text-white/72" : "text-accent"}`}>{eyebrow}</p>
      <h2
        className={`mt-3 font-display text-[clamp(2.4rem,4.5vw,4.8rem)] font-semibold leading-[0.94] tracking-[-0.05em] ${
          inverse ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      <p className={`mt-4 max-w-3xl text-base leading-8 ${inverse ? "text-white/80" : "text-muted"}`}>
        {description}
      </p>
    </div>
  );
}

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-line bg-white px-4 py-3">
      <p className={`${monoClass} leading-none text-muted`}>{label}</p>
      <p className="font-display text-[1.7rem] font-semibold tracking-[-0.04em] text-foreground">
        {value}
      </p>
    </div>
  );
}

function CollectionVisualPreview({
  slug,
  name,
  aspectClass,
  sizes,
  priority = false,
}: {
  slug: string;
  name: string;
  aspectClass: string;
  sizes: string;
  priority?: boolean;
}) {
  const visual = getCollectionVisual(slug);

  if (!visual) {
    return null;
  }

  return (
    <div className={`group relative overflow-hidden bg-navy ${aspectClass}`}>
      <Image
        src={visual.src}
        alt={visual.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        style={visual.objectPosition ? { objectPosition: visual.objectPosition } : undefined}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,22,0.08)_0%,rgba(2,8,22,0.18)_34%,rgba(2,8,22,0.86)_100%)]" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
        <span className="border border-white/16 bg-black/20 px-3 py-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">
          {visual.kicker}
        </span>
        <a
          className="pressable inline-flex min-h-10 items-center gap-2 border border-white/18 bg-white/10 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm hover:bg-white/18"
          href={visual.sourceHref}
          target="_blank"
          rel="noreferrer"
        >
          Visit source
          <ArrowUpRightIcon />
        </a>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className={`${monoClass} text-white/72`}>{name}</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/84">{visual.caption}</p>
        <p className={`${utilityMonoClass} mt-3 text-white/60`}>Source · {visual.sourceLabel}</p>
      </div>
    </div>
  );
}

export function CollectionHeroMediaPanel({
  collection,
  state,
  rateLabel,
  heroRate,
}: {
  collection: MappedCollectionSection;
  state: MarketState;
  rateLabel: string;
  heroRate: number | null;
}) {
  const visual = getCollectionVisual(collection.slug);

  return (
    <aside className="relative overflow-hidden border border-white/20 bg-[var(--brand-gradient)] text-white shadow-[0_16px_48px_rgba(7,85,233,0.24)]">
      {visual ? (
        <div className="border-b border-white/16">
          <CollectionVisualPreview
            slug={collection.slug}
            name={collection.name}
            aspectClass="aspect-[16/10] min-h-[16rem]"
            sizes="(min-width: 1280px) 36vw, (min-width: 1024px) 42vw, 100vw"
            priority
          />
        </div>
      ) : (
        <div className="orb-drift pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.36)_0%,rgba(255,255,255,0)_68%)] blur-3xl" />
      )}

      <div className="relative p-6">
        <p className={`${monoClass} text-white/72`}>Board snapshot</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
          {collection.name}
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/80">
          {state === "ready"
            ? "The public board is live, the current rates are visible below, and the image panel links back to the source project reference."
            : state === "empty"
              ? "The board is live, but products have not been published yet. The image panel still gives the visitor a direct project reference."
              : "The collection shell is visible while the live CMS connection recovers, and the visual panel keeps the board grounded in the source project."}
        </p>

        <div className="mt-6 space-y-3">
          <MetricCard label="Live price" value={heroRate ? formatPriceLac(heroRate) : "Pending"} />
          <MetricCard label="Rate family" value={rateLabel} />
          <MetricCard
            label="Board state"
            value={
              state === "ready" ? "Live" : state === "empty" ? "Waiting" : "Unavailable"
            }
          />
        </div>
      </div>
    </aside>
  );
}

export function FeaturedCollectionBoard({
  collection,
  state,
  lastUpdatedLabel,
}: {
  collection: MappedCollectionCard | null;
  state: MarketState;
  lastUpdatedLabel: string;
}) {
  if (!collection) {
    return (
      <aside className={`${brandSurfaceClass} overflow-hidden p-6`}>
        <p className={`${monoClass} text-white/72`}>Collection board</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
          Awaiting live collection data
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/80">
          The homepage stays live even when Strapi does not return any collection data yet.
        </p>
      </aside>
    );
  }

  const visual = getCollectionVisual(collection.slug);

  return (
    <aside className={`${brandSurfaceClass} relative overflow-hidden`}>
      {visual ? (
        <div className="border-b border-white/16">
          <CollectionVisualPreview
            slug={collection.slug}
            name={collection.name}
            aspectClass="aspect-[16/9] min-h-[15rem]"
            sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 40vw, 100vw"
            priority
          />
        </div>
      ) : (
        <div className="orb-drift pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0)_68%)] blur-3xl" />
      )}

      <div className="relative space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`${monoClass} text-white/72`}>Featured board</p>
            <h2 className="mt-2 font-display text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
              {collection.name}
            </h2>
          </div>
          <span className="border border-white/20 bg-white/12 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/88">
            {collection.latestUpdateLabel}
          </span>
        </div>

        <div className="grid gap-px overflow-hidden border border-white/20 bg-white/20 md:grid-cols-3">
          <MetricTile label="Products" value={String(collection.productCount)} />
          <MetricTile
            label="Status"
            value={state === "ready" ? "Live" : state === "empty" ? "Waiting" : "Offline"}
          />
          <MetricTile label="Last sync" value={lastUpdatedLabel} />
        </div>

        {collection.hasProducts ? (
          <div className="space-y-3">
            {collection.featuredProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="motion-lift sheen grid gap-3 border border-white/20 bg-white/10 px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div>
                  <p className={`${monoClass} text-white/72`}>{getTypeLabel(product.type)}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{product.name}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-display text-[2rem] font-semibold tracking-[-0.05em] text-white">
                    {formatPriceLac(product.currentPrice)}
                  </p>
                  <div className="mt-2 md:justify-end">
                    <MovementBadge direction={product.direction} delta={product.delta} compact inverse />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-white/24 bg-white/8 px-4 py-5 text-sm leading-7 text-white/80">
            This collection is published but does not have live products yet. Open the board anyway to keep the market on your watchlist.
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <Link className={lightButtonClass} href={`/collections/${collection.slug}`}>
            Open full board
            <ArrowUpRightIcon />
          </Link>
          <a
            className="pressable sheen inline-flex min-h-11 items-center justify-center gap-3 border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/18"
            href={buildWhatsAppUrl(
              siteMeta.phoneE164,
              `Assalam o Alaikum Kamran, please guide me on the ${collection.name} collection.`
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
  );
}

export function CollectionHubCard({ collection }: { collection: MappedCollectionCard }) {
  const visual = getCollectionVisual(collection.slug);

  return (
    <article className={`${surfaceClass} surface-elevation-strong overflow-hidden`}>
      {visual ? (
        <div className="border-b border-line">
          <CollectionVisualPreview
            slug={collection.slug}
            name={collection.name}
            aspectClass="aspect-[16/8] min-h-[14rem]"
            sizes="(min-width: 1280px) 44vw, (min-width: 1024px) 48vw, 100vw"
          />
        </div>
      ) : null}

      <div className="border-b border-line px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={`${monoClass} text-accent`}>Collection board</p>
            <h3 className="mt-2 font-display text-[clamp(2.2rem,4vw,3.4rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-foreground">
              {collection.name}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              {collection.hasProducts
                ? `${collection.productCount} live products are already published inside this board.`
                : "This board is live but still waiting for published products."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={chipClass}>{collection.productCount} products</span>
            <span className={chipClass}>{collection.latestUpdateLabel}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
        {collection.hasProducts ? (
          <div className="grid gap-3 md:grid-cols-2">
            {collection.featuredProducts.map((product) => (
              <div key={product.id} className="motion-lift border border-line bg-panel-strong px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`${monoClass} text-muted`}>{getTypeLabel(product.type)}</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{product.name}</p>
                  </div>
                  <MovementBadge direction={product.direction} delta={product.delta} compact />
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-[2.35rem] font-semibold leading-none tracking-[-0.05em] text-foreground">
                      {formatPriceLac(product.currentPrice)}
                    </p>
                    <p className={`${monoClass} mt-2 text-muted`}>
                      {product.latestTime ? formatDate(product.latestTime) : "Awaiting date"}
                    </p>
                  </div>
                  {product.sparklinePoints.length >= 2 ? (
                    <div className="w-28">
                      <MiniTrend points={product.sparklinePoints} direction={product.direction} />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-line bg-panel-strong px-5 py-6 text-sm leading-7 text-muted">
            Rates coming soon. The dedicated collection page is ready, but there are no published products to render yet.
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link className={primaryButtonClass} href={`/collections/${collection.slug}`}>
            View {collection.name}
            <ArrowUpRightIcon />
          </Link>
          <a
            className={secondaryButtonClass}
            href={buildWhatsAppUrl(
              siteMeta.phoneE164,
              `Assalam o Alaikum Kamran, I want the current rates for ${collection.name}.`
            )}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
    </article>
  );
}

export function SourceBackedCollectionsSection({
  collections,
}: {
  collections: MappedCollectionCard[];
}) {
  const visualCollections = collections.filter((collection) => getCollectionVisual(collection.slug));

  if (visualCollections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Source-Backed Boards"
        title="Each featured board now ties back to a real project visual."
        description="Instead of leaving the collection pages as abstract rate shells, the strongest boards now carry project imagery sourced from the public collection site or official project reference."
      />

      <div className="mt-8 space-y-6">
        {visualCollections.map((collection, index) => {
          const visual = getCollectionVisual(collection.slug);
          const leadProduct = collection.featuredProducts[0] ?? null;
          const reverseLayout = index % 2 === 1;

          if (!visual) {
            return null;
          }

          return (
            <article
              key={collection.id}
              className={`${surfaceClass} surface-elevation-strong overflow-hidden lg:grid lg:grid-cols-[minmax(320px,0.96fr)_minmax(0,1.04fr)] ${
                reverseLayout ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""
              }`}
            >
              <CollectionVisualPreview
                slug={collection.slug}
                name={collection.name}
                aspectClass="aspect-[16/10] min-h-[18rem] h-full"
                sizes="(min-width: 1280px) 44vw, (min-width: 1024px) 48vw, 100vw"
              />

              <div className="flex flex-col justify-between gap-6 p-6 sm:p-8 lg:p-10">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`${monoClass} text-accent`}>Source-backed board</span>
                    <span className={chipClass}>{collection.productCount} products</span>
                    <span className={chipClass}>{collection.latestUpdateLabel}</span>
                  </div>

                  <h3 className="mt-4 font-display text-[clamp(2.4rem,4.2vw,4rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-foreground">
                    {collection.name}
                  </h3>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
                    {visual.caption}
                  </p>
                </div>

                <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
                  <div className="bg-panel-strong px-4 py-4">
                    <p className={`${monoClass} text-muted`}>Board status</p>
                    <p className="mt-3 font-display text-[1.75rem] font-semibold tracking-[-0.04em] text-foreground">
                      {collection.hasProducts ? "Live" : "Waiting"}
                    </p>
                  </div>
                  <div className="bg-panel-strong px-4 py-4">
                    <p className={`${monoClass} text-muted`}>Source</p>
                    <p className="mt-3 text-sm font-semibold text-foreground">{visual.sourceLabel}</p>
                  </div>
                  <div className="bg-panel-strong px-4 py-4">
                    <p className={`${monoClass} text-muted`}>Lead rate</p>
                    <p className="mt-3 font-display text-[1.75rem] font-semibold tracking-[-0.04em] text-foreground">
                      {leadProduct ? formatPriceLac(leadProduct.currentPrice) : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <div className="border border-line bg-panel-strong px-4 py-4">
                    {leadProduct ? (
                      <>
                        <p className={`${monoClass} text-muted`}>Featured product</p>
                        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{leadProduct.name}</p>
                            <p className="mt-2 text-sm leading-7 text-muted">
                              Open the collection board for the complete rate table, market pulse, and archive rows.
                            </p>
                          </div>
                          <MovementBadge direction={leadProduct.direction} delta={leadProduct.delta} compact />
                        </div>
                      </>
                    ) : (
                      <>
                        <p className={`${monoClass} text-muted`}>Board note</p>
                        <p className="mt-3 text-sm leading-7 text-muted">
                          The image and board shell are live, but published price records have not been added yet.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 md:justify-end">
                    <Link className={primaryButtonClass} href={`/collections/${collection.slug}`}>
                      Open board
                      <ArrowUpRightIcon />
                    </Link>
                    <a
                      className={secondaryButtonClass}
                      href={visual.sourceHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit source
                      <ArrowUpRightIcon />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function ProductTicker({
  products,
  title,
  description,
}: {
  products: MappedProductCard[];
  title: string;
  description: string;
}) {
  return (
    <div className={`${surfaceClass} overflow-hidden`}>
      <div className="border-b border-line px-5 py-5 sm:px-6">
        <p className={`${monoClass} text-accent`}>{title}</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{description}</p>
      </div>

      {products.length > 0 ? (
        <div className="overflow-x-auto px-4 py-4 sm:px-6">
          <div className="flex min-w-max gap-3">
            {products.map((product) => (
              <div key={product.id} className="motion-lift min-w-56 border border-line bg-panel-strong px-4 py-4">
                <p className={`${monoClass} text-muted`}>{getTypeLabel(product.type)}</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{product.name}</p>
                <p className="mt-5 font-display text-[2.2rem] font-semibold leading-none tracking-[-0.05em] text-foreground">
                  {formatPriceLac(product.currentPrice)}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <MovementBadge direction={product.direction} delta={product.delta} compact />
                  <span className={`${monoClass} text-muted`}>
                    {product.latestTime ? formatShortDate(product.latestTime) : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-5 py-6 text-sm leading-7 text-muted sm:px-6">
          Published products will appear here as soon as Strapi has live price data for this board.
        </div>
      )}
    </div>
  );
}

export function MarketPulseSection({
  products,
  state,
  showCollectionColumn = true,
}: {
  products: MappedProductCard[];
  state: MarketState;
  showCollectionColumn?: boolean;
}) {
  const columns = showCollectionColumn
    ? "md:grid-cols-[1.25fr_0.85fr_0.9fr_0.9fr_auto]"
    : "md:grid-cols-[1.55fr_0.95fr_0.9fr_0.9fr_auto]";

  return (
    <div className={`${brandSurfaceClass} overflow-hidden px-5 py-8 sm:px-8 lg:px-10`}>
      <SectionHeading
        eyebrow="Market Pulse"
        title="Movement worth noticing first."
        description="The pulse ranks products by their latest move. If a product has only one recorded point, it remains visible on the board but drops out of this movers table until a real comparison exists."
        inverse
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="overflow-hidden border border-white/20 bg-white">
          {products.length > 0 ? (
            <>
              <div
                className={`hidden gap-4 border-b border-line bg-panel-strong px-5 py-4 ${monoClass} text-muted md:grid ${columns}`}
              >
                <span>Product</span>
                <span>{showCollectionColumn ? "Collection" : "Type"}</span>
                <span>Price</span>
                <span>Movement</span>
                <span>Action</span>
              </div>

              {products.map((product) => (
                <div
                  key={product.id}
                  className={`motion-row grid gap-3 border-b border-line px-5 py-5 last:border-none md:items-center ${columns}`}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{product.name}</p>
                    <p className="mt-2 text-sm text-muted">
                      {product.latestTime
                        ? `Updated ${formatShortDate(product.latestTime)}`
                        : "Awaiting point"}
                    </p>
                  </div>

                  {showCollectionColumn ? (
                    <Link
                      className="text-sm text-muted transition hover:text-accent"
                      href={`/collections/${slugify(product.collectionName)}`}
                    >
                      {product.collectionName}
                    </Link>
                  ) : (
                    <p className={`${monoClass} text-muted`}>{getTypeLabel(product.type)}</p>
                  )}

                  <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {formatPriceLac(product.currentPrice)}
                  </p>
                  <MovementBadge direction={product.direction} delta={product.delta} />
                  <a
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-accent"
                    href={buildWhatsAppUrl(
                      siteMeta.phoneE164,
                      `Assalam o Alaikum Kamran, I want context on ${product.name} in ${product.collectionName}.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                    <ArrowUpRightIcon />
                  </a>
                </div>
              ))}
            </>
          ) : (
            <div className="px-5 py-8 text-sm leading-7 text-muted">
              {state === "unavailable"
                ? "The live CMS connection is unavailable right now, so movement cannot be computed."
                : "No product has enough history yet to produce a real mover. As soon as two points exist, the latest change will appear here automatically."}
            </div>
          )}
        </div>

        <div className="sheen border border-white/20 bg-white/10 p-5">
          <p className={`${monoClass} text-white/72`}>Need context?</p>
          <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
            Numbers still need a reader.
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/80">
            The board shows structure and momentum. Kamran fills the gaps when a collection is thin, a price looks unusual, or you need to compare multiple markets fast.
          </p>
          <a
            className={`${lightButtonClass} mt-5`}
            href={buildWhatsAppUrl(
              siteMeta.phoneE164,
              "Assalam o Alaikum Kamran, please explain the current market pulse."
            )}
            target="_blank"
            rel="noreferrer"
          >
            Ask Kamran
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

export function CollectionRatesBoard({
  collection,
  state,
}: {
  collection: MappedCollectionSection;
  state: MarketState;
}) {
  if (!collection.hasProducts) {
    return <CollectionEmptyState collectionName={collection.name} state={state} />;
  }

  return (
    <div className="space-y-8">
      {collection.groups.map((group) => (
        <section key={group.type} className={`${surfaceClass} p-6 sm:p-8`}>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className={`${monoClass} text-accent`}>{group.label}</p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Today&apos;s published {group.label.toLowerCase()} for {collection.name}, sorted the same way the public board reads them.
              </p>
            </div>
            <span className={chipClass}>{group.products.length} items</span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {group.products.map((product) => (
              <ProductBoardCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ArchiveTable({
  products,
  rows,
  collectionName,
}: {
  products: MappedProductCard[];
  rows: MappedArchiveRow[];
  collectionName: string;
}) {
  if (products.length === 0 || rows.length === 0) {
    return (
      <div className="border border-dashed border-line bg-panel-strong px-5 py-6 text-sm leading-7 text-muted">
        Historical rows will appear here once this collection has published price history.
      </div>
    );
  }

  return (
    <div className={`${surfaceClass} overflow-hidden`}>
      <div className="border-b border-line px-5 py-5 sm:px-6">
        <p className={`${monoClass} text-accent`}>30-day archive preview</p>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">
          A table-first history view for {collectionName}. Values are shown in Lac and generated directly from the published `price[]` entries in Strapi.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-panel-strong">
              <th className={`px-4 py-4 ${monoClass} text-muted`}>Date</th>
              {products.map((product) => (
                <th key={product.id} className="min-w-36 px-4 py-4">
                  <span className="block text-sm font-semibold text-foreground">{product.name}</span>
                  <span className={`${monoClass} mt-1 block text-muted`}>
                    {getTypeLabel(product.type)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date} className="motion-row border-b border-line last:border-none">
                <td className="px-4 py-4 align-top text-sm font-semibold text-foreground">
                  {formatShortDate(row.date)}
                </td>
                {products.map((product) => {
                  const entry = row.values[product.id];

                  return (
                    <td key={product.id} className="px-4 py-4 align-top">
                      {entry ? (
                        <div className="space-y-1">
                          <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                            {formatPriceLac(entry.price, { showUnit: false })}
                          </p>
                          <p className={`${monoClass} text-muted`}>
                            {entry.direction === "up"
                              ? "▲ Up"
                              : entry.direction === "down"
                                ? "▼ Down"
                                : entry.direction === "flat"
                                  ? "No change"
                                  : "First point"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TrustAndGuidanceSection({
  trustTitle,
  trustDescription,
  guidanceTitle,
  guidanceDescription,
  deals = dealProofs,
  guides = guideTopics,
}: {
  trustTitle: string;
  trustDescription: string;
  guidanceTitle: string;
  guidanceDescription: string;
  deals?: DealProof[];
  guides?: GuideTopic[];
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className={`${surfaceClass} p-6 sm:p-8`}>
        <SectionHeading
          eyebrow="Trust Signals"
          title={trustTitle}
          description={trustDescription}
        />

        <div className="mt-8 space-y-4">
          {deals.map((deal) => (
            <article key={`${deal.month}-${deal.productType}-${deal.action}`} className="motion-lift border border-line bg-panel-strong p-5">
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

      <div className={`${softSurfaceClass} p-6 sm:p-8`}>
        <SectionHeading
          eyebrow="Investor Guide"
          title={guidanceTitle}
          description={guidanceDescription}
        />

        <div className="mt-8 space-y-4">
          {guides.map((topic) => (
            <article key={topic.title} className="motion-lift border border-line bg-white px-5 py-5">
              <h3 className="font-display text-[2rem] font-semibold tracking-[-0.04em] text-foreground">
                {topic.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">{topic.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConsultationSection({
  title,
  description,
  fileTypes,
}: {
  title: string;
  description: string;
  fileTypes: string[];
}) {
  return (
    <div className="grid overflow-hidden border border-line bg-white lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div className="relative overflow-hidden bg-[var(--brand-gradient)] px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_70%)] blur-3xl" />
        <div className="relative space-y-6">
          <SectionHeading
            eyebrow="Free Consultation"
            title={title}
            description={description}
            inverse
          />

          <ul className="space-y-3 text-sm leading-7 text-white/82">
            {siteMeta.consultationBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center border border-white/24 bg-white/12 text-white">
                  <CheckIcon />
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="sheen border border-white/20 bg-white/10 p-5">
            <p className={`${monoClass} text-white/72`}>Human operator</p>
            <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
              {siteMeta.expertName}
            </p>
            <p className="mt-2 text-sm leading-7 text-white/82">{siteMeta.agencyName}</p>
            <p className="text-sm leading-7 text-white/82">{siteMeta.address}</p>
            <a
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-white/70"
              href={`tel:${siteMeta.phoneE164}`}
            >
              {siteMeta.phoneDisplay}
              <ArrowUpRightIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <p className={`${monoClass} text-muted`}>Get market guidance</p>
        <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-foreground">
          Ask for context before you act on one quoted price.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          The form does not hit a backend. It simply prepares a WhatsApp message with the collection or product details the visitor has shared.
        </p>

        <div className="mt-8 border border-line bg-panel-strong p-5 sm:p-6">
          <ConsultationForm
            phoneE164={siteMeta.phoneE164}
            expertName={siteMeta.expertName}
            intents={consultationIntents}
            fileTypes={fileTypes}
          />
        </div>
      </div>
    </div>
  );
}

export function SiteFooter({ pageLinks }: { pageLinks: PageLink[] }) {
  return (
    <footer className={`${darkSurfaceClass} border-x-0 border-b-0`}>
      <div className={`${shellClass} grid gap-10 py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] lg:py-16`}>
        <div>
          <p className="font-display text-4xl font-semibold tracking-[-0.05em] text-white">
            {siteMeta.brandName}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
            A premium collection hub for public-facing market boards, with direct WhatsApp guidance when the data alone is not enough.
          </p>
          <SocialLinks footer />
        </div>

        <div>
          <p className={`${monoClass} text-white/72`}>Quick Links</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/72">
            {pageLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </a>
            ))}
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
          </div>
        </div>

        <div>
          <p className={`${monoClass} text-white/72`}>Contact</p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/72">
            <p>{siteMeta.agencyName}</p>
            <p>{siteMeta.address}</p>
            <a href={`tel:${siteMeta.phoneE164}`} className="block transition hover:text-white">
              WhatsApp / Call: {siteMeta.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/12">
        <div className={`${shellClass} flex flex-col gap-3 py-5 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between`}>
          <p>© 2026 {siteMeta.brandName}. All rights reserved.</p>
          <p className="max-w-3xl">{siteMeta.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}

export function formatPriceLac(
  value: number | null,
  options: {
    showUnit?: boolean;
  } = {}
) {
  if (value === null) {
    return "Awaiting rate";
  }

  const lac = value / 100000;
  const formatted = new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(lac);

  return options.showUnit === false ? formatted : `${formatted} Lac`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export function getTypeLabel(type: MappedProductCard["type"]) {
  return typeLabels[type] ?? "Products";
}

export function getCollectionRateLabel(products: MappedProductCard[]) {
  if (products.length === 0) {
    return "market rates";
  }

  const uniqueTypes = new Set(products.map((product) => product.type));

  if (uniqueTypes.size === 1) {
    const [onlyType] = [...uniqueTypes];
    return `${onlyType} rates`;
  }

  return "market rates";
}

function ProductBoardCard({ product }: { product: MappedProductCard }) {
  return (
    <article className="motion-lift border border-line bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`${monoClass} text-muted`}>{product.collectionName}</p>
          <h4 className="mt-2 font-display text-[2rem] font-semibold leading-none tracking-[-0.05em] text-foreground">
            {product.name}
          </h4>
        </div>
        <span className={chipClass}>{getTypeLabel(product.type)}</span>
      </div>

      <p className="mt-4 text-sm leading-7 text-muted">{product.description}</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-[3rem] font-semibold leading-none tracking-[-0.06em] text-foreground">
            {formatPriceLac(product.currentPrice)}
          </p>
          <p className={`${monoClass} mt-3 text-muted`}>
            {product.latestTime
              ? `Latest point ${formatDate(product.latestTime)}`
              : "No published price points yet"}
          </p>
        </div>

        <div className="space-y-4">
          <MovementBadge direction={product.direction} delta={product.delta} />
          <a
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-accent"
            href={buildWhatsAppUrl(
              siteMeta.phoneE164,
              `Assalam o Alaikum Kamran, please guide me on ${product.name} in ${product.collectionName}.`
            )}
            target="_blank"
            rel="noreferrer"
          >
            Get guidance
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>

      <div className="mt-6 border border-line bg-panel-strong px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <p className={`${monoClass} text-muted`}>Recent trend</p>
          <p className={`${monoClass} text-muted`}>{product.pricePointCount} points</p>
        </div>

        {product.sparklinePoints.length >= 2 ? (
          <div className="mt-4">
            <MiniTrend points={product.sparklinePoints} direction={product.direction} />
          </div>
        ) : (
          <p className="mt-4 text-sm leading-7 text-muted">
            Publish at least two price points in Strapi to unlock a visible trend for this product.
          </p>
        )}
      </div>
    </article>
  );
}

function CollectionEmptyState({
  collectionName,
  state,
}: {
  collectionName: string;
  state: MarketState;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="border border-dashed border-line bg-panel-strong px-5 py-6">
        <p className={`${monoClass} text-muted`}>
          {state === "unavailable" ? "Connection issue" : "Rates coming soon"}
        </p>
        <h4 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
          {state === "unavailable"
            ? "The live collection feed is temporarily unavailable."
            : `The ${collectionName} board is ready, but no products are published yet.`}
        </h4>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          {state === "unavailable"
            ? "The page still keeps the trust layer and consultation path visible while the Strapi connection recovers."
            : "This is an intentional empty state, not a broken page. Once products are published, the rate cards, movers, and archive will appear here automatically."}
        </p>
      </div>

      <div className={`${brandSurfaceClass} sheen p-5`}>
        <p className={`${monoClass} text-white/72`}>Interim action</p>
        <p className="mt-3 text-sm leading-7 text-white/80">
          If this is the board you care about, use WhatsApp now and ask whether the market is awaiting publication or simply waiting for the next manual update.
        </p>
        <a
          className={`${lightButtonClass} mt-5`}
          href={buildWhatsAppUrl(
            siteMeta.phoneE164,
            `Assalam o Alaikum Kamran, please share the current situation for ${collectionName}.`
          )}
          target="_blank"
          rel="noreferrer"
        >
          Request update
          <ArrowUpRightIcon />
        </a>
      </div>
    </div>
  );
}

function MovementBadge({
  direction,
  delta,
  compact = false,
  inverse = false,
}: {
  direction: MarketDirection;
  delta: number | null;
  compact?: boolean;
  inverse?: boolean;
}) {
  const baseClass = compact
    ? "inline-flex items-center gap-2 rounded-[20px] px-2.5 py-1 text-[0.68rem] font-mono uppercase tracking-[0.12em]"
    : "inline-flex items-center gap-2 rounded-[20px] px-3 py-2 text-sm font-medium";

  if (direction === null || delta === null) {
    return (
      <span
        className={`${baseClass} ${
          inverse
            ? "border border-white/20 bg-white/10 text-white/78"
            : "border border-line bg-white text-muted"
        }`}
      >
        <span aria-hidden="true">○</span>
        <span>{compact ? "No delta" : "No delta yet"}</span>
      </span>
    );
  }

  const config =
    direction === "up"
      ? {
          symbol: "▲",
          label: `+${formatPriceLac(Math.abs(delta))}`,
          className: inverse
            ? "border border-white/20 bg-white/12 text-white"
            : "border border-brand-soft bg-brand-soft text-accent",
        }
      : direction === "down"
        ? {
            symbol: "▼",
            label: `-${formatPriceLac(Math.abs(delta))}`,
            className: inverse
              ? "border border-white/20 bg-white/12 text-white"
              : "border border-danger-soft bg-danger-soft text-danger",
          }
        : {
            symbol: "━",
            label: "No change",
            className: inverse
              ? "border border-white/20 bg-white/12 text-white"
              : "border border-line bg-white text-muted",
          };

  return (
    <span className={`${baseClass} ${config.className}`}>
      <span aria-hidden="true">{config.symbol}</span>
      <span>{config.label}</span>
    </span>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/8 px-4 py-4">
      <p className={`${monoClass} text-white/72`}>{label}</p>
      <p className="mt-3 font-display text-[1.9rem] font-semibold tracking-[-0.04em] text-white">
        {value}
      </p>
    </div>
  );
}

function MiniTrend({
  points,
  direction,
}: {
  points: number[];
  direction: MarketDirection;
}) {
  const width = 220;
  const height = 68;
  const padding = 8;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const path = points
    .map((point, index) => {
      const x = padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((point - min) / range) * (height - padding * 2);

      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  const stroke =
    direction === "up"
      ? "var(--accent)"
      : direction === "down"
        ? "var(--danger)"
        : "var(--foreground)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-[4.25rem] w-full"
      aria-label="Price trend"
      role="img"
    >
      <path
        d={`M ${padding} ${height - padding} L ${width - padding} ${height - padding}`}
        fill="none"
        stroke="color-mix(in oklab, var(--line) 85%, transparent)"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      <path d={path} fill="none" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" />
      {points.map((point, index) => {
        const x = padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2);
        const y = height - padding - ((point - min) / range) * (height - padding * 2);

        return <circle key={`${point}-${index}`} cx={x} cy={y} r="2.8" fill={stroke} />;
      })}
    </svg>
  );
}

function SocialLinks({
  compact = false,
  footer = false,
  inverse = false,
}: {
  compact?: boolean;
  footer?: boolean;
  inverse?: boolean;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact || footer ? "" : "mt-5"}`}>
      {siteMeta.socialLinks.map((social) => (
        <a
          key={social.label}
          className={`pressable inline-flex h-10 w-10 items-center justify-center border text-xs font-semibold uppercase tracking-[0.16em] ${
            footer
              ? "border-white/16 bg-white/6 text-white/72 hover:border-white/32 hover:text-white"
              : inverse
                ? "border-white/16 bg-white/6 text-white/72 hover:border-white/32 hover:text-white"
              : "border-line bg-white text-foreground hover:border-accent hover:text-accent"
          }`}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          aria-label={social.label}
        >
          {social.shortLabel}
        </a>
      ))}
    </div>
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.2]">
      <path d="m5 12 4 4L19 8" />
    </svg>
  );
}
