import Image from "next/image";
import Link from "next/link";

import { CollapsingHeader } from "@/components/collapsing-header";
import { ConsultationForm } from "@/components/consultation-form";
import { RatesSharePanel } from "@/components/rates-share-panel";
import { getCollectionVisual } from "@/data/collection-visuals";
import {
  consultationExpectations,
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

export type HeaderTickerItem = {
  id: string;
  href: string;
  label: string;
  price: number;
  delta: number | null;
  direction: MarketDirection;
};

const typeLabels = {
  plot: "Plots",
  file: "Files",
  home: "Homes",
} as const;

// Use global utility classes from globals.css (shell, mono-label, mono-label-sm, surface-card, surface-card-strong, surface-brand, surface-navy)

function BrandMark({ size = 48 }: { size?: number }) {
  return (
    <Image
      src="/brand/property-portals-logo-mark.svg"
      alt="Property Portals mark"
      width={size}
      height={size}
      className="h-auto w-auto"
    />
  );
}

function BrandLockup({
  compact = false,
  caption,
  inverse = false,
  dense = false,
}: {
  compact?: boolean;
  caption: string;
  inverse?: boolean;
  dense?: boolean;
}) {
  return (
    <div className={`flex items-center ${dense ? "gap-3" : "gap-4"}`}>
      <div
        className={`motion-lift ${dense ? "p-1.5" : "p-2.5"} ${
          inverse
            ? "border border-white/18 bg-white/12"
            : "border border-line bg-white"
        }`}
      >
        <BrandMark size={dense ? 22 : compact ? 34 : 44} />
      </div>
      <div>
        <p
          className={`font-display ${dense ? "text-[1.2rem]" : "text-[1.55rem]"} font-semibold tracking-[-0.05em] ${
            inverse ? "text-white" : "text-foreground"
          }`}
        >
          {siteMeta.brandName}
        </p>
        <p
          className={`${dense ? "font-mono text-mono-xxxs uppercase tracking-mono" : "mono-label"} ${dense ? "mt-0.5" : "mt-1"} ${
            inverse ? "text-white/82" : "text-muted"
          }`}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}

export function SiteHeader({
  pageLinks,
  collectionLinks,
  currentCollectionSlug,
  tickerItems,
}: {
  pageLinks: PageLink[];
  collectionLinks: CollectionLink[];
  currentCollectionSlug?: string;
  tickerItems: HeaderTickerItem[];
}) {
  const activeCollectionLabel = collectionLinks.find(
    (collection) => collection.slug === currentCollectionSlug,
  )?.label;
  const marqueeItems =
    tickerItems.length > 0 ? [...tickerItems, ...tickerItems] : [];

  return (
    <CollapsingHeader
      topBar={
        <div className="border-b border-white/12 bg-brand-gradient text-white">
          <div className="shell flex items-center justify-between gap-4 py-3">
            <div className="min-w-0 flex items-center gap-4">
              <Link className="group shrink-0" href="/">
                <BrandLockup
                  compact
                  inverse
                  dense
                  caption={
                    currentCollectionSlug
                      ? "Dedicated collection board"
                      : "Collection market hub"
                  }
                />
              </Link>

              <div className="hidden overflow-x-auto md:block">
                <nav className="flex min-w-max items-center gap-1">
                  {pageLinks.map((link) => (
                    <a
                      key={link.href}
                      className="badge-pill badge-pill-light"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden items-center gap-2 text-xs text-white/80 xl:flex">
                <span className="mono-label-sm">Live market data</span>
                <span>
                  {activeCollectionLabel
                    ? `${activeCollectionLabel} board`
                    : "All collections"}
                </span>
              </div>
              <div className="hidden sm:block">
                <SocialLinks compact inverse />
              </div>
              <a
                className="pressable inline-flex min-h-10 items-center justify-center gap-2 rounded-[12px] border border-white/24 bg-white px-5 py-2.5 text-sm font-semibold text-accent shadow-[0_12px_24px_rgba(255,255,255,0.16)] hover:border-white hover:text-brand-deep hover:shadow-[0_18px_32px_rgba(255,255,255,0.22)]"
                href={buildWhatsAppUrl(
                  siteMeta.phoneE164,
                  "Hello, I want direct guidance on a live property collection.",
                )}
                target="_blank"
                rel="noreferrer"
              >
                Talk to the desk
                <ArrowUpRightIcon />
              </a>
            </div>
          </div>

          <div className="shell pb-3 md:hidden">
            <div className="overflow-x-auto">
              <nav className="flex min-w-max items-center gap-1">
                {pageLinks.map((link) => (
                  <a
                    key={link.href}
                    className="nav-pill nav-pill-outline-sm"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      }
      lowerBars={
        <>
          <div className="border-b border-line bg-white/96 text-foreground">
            <div className="shell flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="hidden flex-wrap items-center gap-3 text-sm text-muted lg:flex">
                <span className="mono-label-sm text-accent">
                  {siteMeta.agencyName}
                </span>
                <span className="hidden h-3.5 w-px bg-line sm:block" />
                <span className="max-w-[34rem] text-muted">
                  {siteMeta.address}
                </span>
                <span className="hidden h-3.5 w-px bg-line lg:block" />
                <span className="text-muted">
                  Verified boards · Market-guidance desk
                </span>
              </div>

              <div className="overflow-x-auto lg:max-w-[48%]">
                <div className="flex min-w-max items-center gap-2 pb-1">
                  {collectionLinks.map((collection) => {
                    const isActive = currentCollectionSlug === collection.slug;

                    return (
                      <Link
                        key={collection.slug}
                        className={`pressable min-h-10 rounded-[10px] px-3.5 py-2 text-sm ${
                          isActive
                            ? "border border-accent bg-accent text-white"
                            : "border border-line bg-panel-strong hover:border-accent hover:bg-white hover:text-accent"
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

          {tickerItems.length > 0 ? (
            <div className="hidden border-b border-line bg-panel-strong/96 md:block">
              <div className="shell flex items-center gap-4 overflow-hidden py-3">
                <p className={`mono-label shrink-0 text-accent`}>Live rates</p>
                <div className="header-marquee min-w-0 flex-1">
                  <div className="header-marquee-inner">
                    {marqueeItems.map((item, index) => (
                      <a
                        key={`${item.id}-${index}`}
                        href={item.href}
                        className="group inline-flex shrink-0 items-center gap-3 px-4 text-sm text-muted transition hover:text-foreground"
                      >
                        <span className="font-medium text-muted group-hover:text-foreground">
                          {item.label}
                        </span>
                        <span className="font-semibold text-foreground">
                          {formatPriceLac(item.price)}
                        </span>
                        <TickerDelta
                          direction={item.direction}
                          delta={item.delta}
                        />
                        <span className="text-line">|</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      }
    />
  );
}

export function buildHeaderTickerItems(
  sections: MappedCollectionSection[],
): HeaderTickerItem[] {
  return sections
    .flatMap((section) =>
      section.groups.flatMap((group) =>
        group.products
          .filter((product) => product.currentPrice !== null)
          .map((product) => ({
            id: product.id,
            href: `/collections/${section.slug}`,
            label: product.name,
            price: product.currentPrice ?? 0,
            delta: product.delta,
            direction: product.direction,
          })),
      ),
    )
    .slice(0, 18);
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
      <p className={`mono-label ${inverse ? "text-white/86" : "text-accent"}`}>
        {eyebrow}
      </p>
      <h2
        className={`mt-4 font-display text-[clamp(2.9rem,5vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.055em] ${
          inverse ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-6 max-w-3xl text-lg leading-9 ${inverse ? "text-white/90" : "text-muted"}`}
      >
        {description}
      </p>
    </div>
  );
}

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-line bg-white px-4 py-3">
      <p className={`mono-label leading-none text-muted`}>{label}</p>
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
        style={
          visual.objectPosition
            ? { objectPosition: visual.objectPosition }
            : undefined
        }
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,22,0.18)_0%,rgba(2,8,22,0.34)_32%,rgba(2,8,22,0.94)_100%)]" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
        <span className="brand-badge">{visual.kicker}</span>
        <a
          className="brand-button"
          href={visual.sourceHref}
          target="_blank"
          rel="noreferrer"
        >
          Visit source
          <ArrowUpRightIcon />
        </a>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className={`mono-label text-white/86`}>{visual.location}</p>
        <p className="mt-2 text-lg font-semibold text-white">{name}</p>
        <p className="mt-2 text-sm leading-6 text-white/92">
          {visual.spotlight}
        </p>
        <p className="mono-label-sm mt-3 text-white/88">
          Source · {visual.sourceLabel}
        </p>
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
    <aside className="relative overflow-hidden border border-white/20 bg-brand-gradient text-white shadow-[0_16px_48px_rgba(7,85,233,0.24)]">
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
        <p className={`mono-label text-white/84`}>Board snapshot</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
          {collection.name}
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/88">
          {state === "ready"
            ? "Live board with published rates, a clean market snapshot, and a direct source reference."
            : state === "empty"
              ? "The board is ready, but published products have not been added yet."
              : "The collection shell is visible while the live CMS connection recovers."}
        </p>

        <div className="mt-6 grid gap-px overflow-hidden border border-white/28 bg-white/28 sm:grid-cols-3">
          <MetricTile
            label="Live price"
            value={heroRate ? formatPriceLac(heroRate) : "Pending"}
          />
          <MetricTile label="Rate family" value={rateLabel} />
          <MetricTile
            label="Board state"
            value={
              state === "ready"
                ? "Live"
                : state === "empty"
                  ? "Waiting"
                  : "Unavailable"
            }
          />
        </div>
      </div>
    </aside>
  );
}

export function CollectionShowcaseHero({
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
  const displayRateLabel =
    rateLabel === "market rates"
      ? "Live rates, recent movement, and direct guidance"
      : `Live ${rateLabel}, recent movement, and direct guidance`;
  const trustHeading = getCollectionTrustHeading(collection.name, rateLabel);
  const heroNarrative =
    state === "ready"
      ? `${collection.name} gives you current published numbers, visible movement, and a fast route to human guidance when you want to buy, sell, compare, or wait with more confidence.`
      : state === "empty"
        ? `${collection.name} already has a dedicated decision page. Published products are still being added, but the board is ready for watchlist use and direct questions.`
        : `${collection.name} stays visible while the live feed recovers, so the trust layer and contact path remain active even during a temporary sync issue.`;
  const heroActions = visual
    ? [visual.location, visual.spotlight, "Direct WhatsApp handoff"]
    : [
        "Check current published rates",
        "See what moved since the previous point",
        "Ask whether to buy, sell, compare, or wait",
      ];

  return (
    <section className="section-paper">
      <div className="shell pb-16 pt-8 lg:pb-28 lg:pt-10">
        <div className="theme-inverse animate-rise surface-elevation-strong bg-brand-gradient relative overflow-hidden border border-white/16 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-18">
          {visual ? (
            <>
              <Image
                src={visual.src}
                alt={visual.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={
                  visual.objectPosition
                    ? { objectPosition: visual.objectPosition }
                    : undefined
                }
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,28,75,0.9)_0%,rgba(3,28,75,0.82)_24%,rgba(3,28,75,0.96)_100%)]" />
            </>
          ) : (
            <>
              <div className="orb-drift pointer-events-none absolute -left-12 -top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_70%)] blur-3xl" />
              <div className="orb-drift pointer-events-none absolute -right-18 bottom-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_72%)] blur-3xl" />
            </>
          )}

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/84">
              <Link className="transition hover:text-white" href="/">
                Home
              </Link>
              <span>/</span>
              <span>Collection board</span>
              <span>/</span>
              <span className="text-white">{collection.name}</span>
            </div>

            <div className="mt-8 glass-card">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#88e592]" />
              <span className={`mono-label text-white/92`}>
                Live collection data · Updated daily
              </span>
            </div>

            <div className="mt-10 space-y-5">
              <p className="mono-label text-white/94">{trustHeading}</p>
              <h1 className="font-display text-[clamp(3.3rem,8vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-white [text-shadow:0_10px_32px_rgba(2,8,22,0.36)]">
                {collection.name}
              </h1>
              <p className="font-display text-[clamp(2.8rem,6vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white [text-shadow:0_10px_32px_rgba(2,8,22,0.32)]">
                <span className="text-[#eef4ff]">{displayRateLabel}</span>
              </p>
            </div>

            <p className="mt-8 max-w-3xl text-lg leading-9 text-white/90 sm:text-xl">
              {heroNarrative}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {[
                "Live board data",
                "Visible movement badges",
                "Direct WhatsApp handoff",
              ].map((item) => (
                <span key={item} className="badge-pill badge-pill-outline">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex w-full max-w-4xl flex-wrap items-center justify-center gap-4">
              <a
                className="btn-light w-full sm:w-auto"
                href={buildWhatsAppUrl(
                  siteMeta.phoneE164,
                  `Hello, I want guidance on ${collection.name}.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                Get {collection.name} guidance
                <ArrowUpRightIcon />
              </a>
              <a
                className="pressable inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-[14px] border border-white/28 bg-white/14 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm hover:border-white hover:bg-white/20 sm:w-auto"
                href="#rates"
              >
                Jump to live rates
                <ArrowUpRightIcon />
              </a>
              <Link
                className="pressable inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-[14px] border border-white/28 bg-white/14 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm hover:border-white hover:bg-white/20 sm:w-auto"
                href="/#collections"
              >
                Compare collections
                <ArrowUpRightIcon />
              </Link>
            </div>

            <div className="mt-8 grid w-full max-w-5xl gap-3 md:grid-cols-3">
              {heroActions.map((action) => (
                <div
                  key={action}
                  className="border border-white/24 bg-white/14 px-4 py-4 text-left backdrop-blur-sm"
                >
                  <p className={`mono-label text-white/86`}>
                    {visual ? "Collection highlight" : "Use this board to"}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-7 text-white">
                    {action}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid w-full max-w-4xl gap-px overflow-hidden rounded-[24px] border border-white/28 bg-white/18 sm:grid-cols-2 xl:grid-cols-4">
              <HeroTrustMetric
                label="Board status"
                value={
                  state === "ready"
                    ? "Live"
                    : state === "empty"
                      ? "Ready"
                      : "Syncing"
                }
              />
              <HeroTrustMetric
                label="Products"
                value={String(collection.productCount)}
              />
              <HeroTrustMetric
                label="Latest rate"
                value={heroRate !== null ? formatPriceLac(heroRate) : "Pending"}
              />
              <HeroTrustMetric
                label="Last updated"
                value={collection.latestUpdateLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
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
      <aside className="surface-brand motion-panel overflow-hidden p-6">
        <p className={`mono-label text-white/84`}>Collection board</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
          Awaiting live collection data
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/88">
          The homepage stays live even when Strapi does not return any
          collection data yet.
        </p>
      </aside>
    );
  }

  const visual = getCollectionVisual(collection.slug);

  return (
    <aside className="surface-brand motion-panel relative overflow-hidden">
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
            <p className={`mono-label text-white/84`}>Featured board</p>
            <h2 className="mt-2 font-display text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
              {collection.name}
            </h2>
          </div>
          <span className="border border-white/24 bg-white/16 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-loosest text-white/92">
            {collection.latestUpdateLabel}
          </span>
        </div>

        <div className="grid gap-px overflow-hidden border border-white/22 bg-white/30 md:grid-cols-3">
          <MetricTile
            label="Products"
            value={String(collection.productCount)}
          />
          <MetricTile
            label="Status"
            value={
              state === "ready"
                ? "Live"
                : state === "empty"
                  ? "Waiting"
                  : "Offline"
            }
          />
          <MetricTile label="Last sync" value={lastUpdatedLabel} />
        </div>

        {collection.hasProducts ? (
          <div className="space-y-3">
            {collection.featuredProducts.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="motion-lift sheen grid gap-3 border border-white/28 bg-white/22 px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div>
                  <p className={`mono-label text-white/84`}>
                    {getTypeLabel(product.type)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {product.name}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-display text-[2rem] font-semibold tracking-[-0.05em] text-white">
                    {formatPriceLac(product.currentPrice)}
                  </p>
                  <div className="mt-2 md:justify-end">
                    <MovementBadge
                      direction={product.direction}
                      delta={product.delta}
                      compact
                      inverse
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-white/28 bg-white/12 px-4 py-5 text-sm leading-7 text-white/88">
            This collection is published but does not have live products yet.
            Open the board anyway to keep the market on your watchlist.
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <Link className="btn-light" href={`/collections/${collection.slug}`}>
            View live rates & history
            <ArrowUpRightIcon />
          </Link>
          <a
            className="pressable sheen inline-flex min-h-11 items-center justify-center gap-3 border border-white/24 bg-white/14 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
            href={buildWhatsAppUrl(
              siteMeta.phoneE164,
              `Hello, please guide me on the ${collection.name} collection.`,
            )}
            target="_blank"
            rel="noreferrer"
          >
            Ask about this board
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
    </aside>
  );
}

function HeroTrustMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/12 px-5 py-6 backdrop-blur-sm">
      <p className={`mono-label text-white/82`}>{label}</p>
      <p className="mt-3 font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-semibold leading-none tracking-[-0.05em] text-white">
        {value}
      </p>
    </div>
  );
}

export function CollectionHubCard({
  collection,
}: {
  collection: MappedCollectionCard;
}) {
  const visual = getCollectionVisual(collection.slug);

  return (
    <article className="surface-card motion-panel overflow-hidden">
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
            <p className={`mono-label text-accent`}>Collection board</p>
            <h3>{collection.name}</h3>
            <p className="max-w-2xl">
              {collection.hasProducts
                ? "Open this board for current rates, recent movement, archive history, and a fast WhatsApp handoff when you want help deciding."
                : "The board is live and ready for watchlists, even while published products are still being added."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="chip">{collection.productCount} products</span>
            <span className="chip">{collection.latestUpdateLabel}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
        {collection.hasProducts ? (
          <div className="overflow-hidden border border-line bg-panel-strong">
            {collection.featuredProducts.slice(0, 2).map((product) => (
              <div
                key={product.id}
                className="motion-row grid gap-3 border-b border-line px-4 py-4 last:border-none md:grid-cols-[minmax(0,1fr)_auto_auto]"
              >
                <div>
                  <p className={`mono-label text-muted`}>
                    {getTypeLabel(product.type)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {product.name}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {product.latestTime
                      ? `Updated ${formatDate(product.latestTime)}`
                      : "Awaiting date"}
                  </p>
                </div>
                <p className="font-display text-[2.2rem] font-semibold leading-none tracking-[-0.05em] text-foreground md:text-right">
                  {formatPriceLac(product.currentPrice)}
                </p>
                <div className="md:self-center md:justify-self-end">
                  <MovementBadge
                    direction={product.direction}
                    delta={product.delta}
                    compact
                  />
                </div>
              </div>
            ))}
            {collection.featuredProducts.length > 2 ? (
              <div className="border-t border-line bg-white px-4 py-3">
                <p className={`mono-label text-muted`}>
                  +{collection.featuredProducts.length - 2} more products on the
                  full board
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="border border-dashed border-line bg-panel-strong px-5 py-6">
            Rates coming soon. The dedicated collection page is ready, but there
            are no published products to render yet.
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            className="btn-primary"
            href={`/collections/${collection.slug}`}
          >
            View live rates
            <ArrowUpRightIcon />
          </Link>
          <a
            className="btn-secondary"
            href={buildWhatsAppUrl(
              siteMeta.phoneE164,
              `Hello, I want the current rates for ${collection.name}.`,
            )}
            target="_blank"
            rel="noreferrer"
          >
            Ask on WhatsApp
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
  const visualCollections = collections.filter((collection) =>
    getCollectionVisual(collection.slug),
  );

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
              className={`surface-card motion-panel surface-elevation-strong overflow-hidden lg:grid lg:grid-cols-[minmax(320px,0.96fr)_minmax(0,1.04fr)] ${
                reverseLayout
                  ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
                  : ""
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
                    <span className={`mono-label text-accent`}>
                      Source-backed board
                    </span>
                    <span className="chip">
                      {collection.productCount} products
                    </span>
                    <span className="chip">{collection.latestUpdateLabel}</span>
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
                    <p className={`mono-label text-muted`}>Board status</p>
                    <p className="mt-3 font-display text-[1.75rem] font-semibold tracking-[-0.04em] text-foreground">
                      {collection.hasProducts ? "Live" : "Waiting"}
                    </p>
                  </div>
                  <div className="bg-panel-strong px-4 py-4">
                    <p className={`mono-label text-muted`}>Source</p>
                    <p className="mt-3 text-sm font-semibold text-foreground">
                      {visual.sourceLabel}
                    </p>
                  </div>
                  <div className="bg-panel-strong px-4 py-4">
                    <p className={`mono-label text-muted`}>Lead rate</p>
                    <p className="mt-3 font-display text-[1.75rem] font-semibold tracking-[-0.04em] text-foreground">
                      {leadProduct
                        ? formatPriceLac(leadProduct.currentPrice)
                        : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <div className="border border-line bg-panel-strong px-4 py-4">
                    {leadProduct ? (
                      <>
                        <p className={`mono-label text-muted`}>
                          Featured product
                        </p>
                        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {leadProduct.name}
                            </p>
                            <p className="mt-2 text-sm leading-7 text-muted">
                              Open the collection board for the complete rate
                              table, market pulse, and archive rows.
                            </p>
                          </div>
                          <MovementBadge
                            direction={leadProduct.direction}
                            delta={leadProduct.delta}
                            compact
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p className={`mono-label text-muted`}>Board note</p>
                        <p className="mt-3">
                          The image and board shell are live, but published
                          price records have not been added yet.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 md:justify-end">
                    <Link
                      className="btn-primary"
                      href={`/collections/${collection.slug}`}
                    >
                      Open board
                      <ArrowUpRightIcon />
                    </Link>
                    <a
                      className="btn-secondary"
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
    <div className="surface-card motion-panel overflow-hidden">
      <div className="border-b border-line px-5 py-5 sm:px-6">
        <p className={`mono-label text-accent`}>{title}</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
          {description}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="overflow-x-auto px-4 py-4 sm:px-6">
          <div className="flex min-w-max gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="motion-lift min-w-56 border border-line bg-panel-strong px-4 py-4"
              >
                <p className={`mono-label text-muted`}>
                  {getTypeLabel(product.type)}
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {product.name}
                </p>
                <p className="mt-5 font-display text-[2.2rem] font-semibold leading-none tracking-[-0.05em] text-foreground">
                  {formatPriceLac(product.currentPrice)}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <MovementBadge
                    direction={product.direction}
                    delta={product.delta}
                    compact
                  />
                  <span className={`mono-label text-muted`}>
                    {product.latestTime
                      ? formatShortDate(product.latestTime)
                      : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-5 py-6 text-sm leading-7 text-muted sm:px-6">
          Published products will appear here as soon as Strapi has live price
          data for this board.
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
    <div className="surface-brand motion-panel overflow-hidden px-5 py-8 sm:px-8 lg:px-10">
      <SectionHeading
        eyebrow="Market Pulse"
        title="See where the market actually moved."
        description="The pulse ranks products by their latest change so visitors can spot movement fast instead of scanning every board equally. Products with only one recorded point stay visible elsewhere until a real comparison exists."
        inverse
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="overflow-hidden border border-white/20 bg-white">
          {products.length > 0 ? (
            <>
              <div
                className={`hidden gap-4 border-b border-line bg-panel-strong px-5 py-4 mono-label md:grid ${columns}`}
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
                    <p className="text-sm font-semibold text-foreground">
                      {product.name}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {product.latestTime
                        ? `Updated ${formatShortDate(product.latestTime)}`
                        : "Awaiting point"}
                    </p>
                  </div>

                  {showCollectionColumn ? (
                    <div className="space-y-1">
                      <p className="mono-label text-muted md:hidden">
                        Collection
                      </p>
                      <Link
                        className="text-sm text-muted transition hover:text-accent"
                        href={`/collections/${slugify(product.collectionName)}`}
                      >
                        {product.collectionName}
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="mono-label text-muted md:hidden">Type</p>
                      <p className={`mono-label text-muted`}>
                        {getTypeLabel(product.type)}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="mono-label text-muted md:hidden">Price</p>
                    <p className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                      {formatPriceLac(product.currentPrice)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="mono-label text-muted md:hidden">Movement</p>
                    <MovementBadge
                      direction={product.direction}
                      delta={product.delta}
                    />
                  </div>
                  <a
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-line bg-panel-strong px-4 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:bg-white hover:text-accent md:w-auto md:justify-start md:border-none md:bg-transparent md:px-0 md:py-0"
                    href={buildWhatsAppUrl(
                      siteMeta.phoneE164,
                      `Hello, I want context on ${product.name} in ${product.collectionName}.`,
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

        <div className="sheen border border-white/30 bg-brand-deep/90 p-5">
          <p className={`mono-label text-white/84`}>Need context?</p>
          <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
            Numbers still need a reader.
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/88">
            The board shows structure and momentum. The advisory desk fills the
            gaps when a collection is thin, a price looks unusual, or you need
            to compare multiple markets fast.
          </p>
          <a
            className="btn-light mt-5"
            href={buildWhatsAppUrl(
              siteMeta.phoneE164,
              "Hello, please explain the current market pulse.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            Ask for guidance
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

export function CollectionTodayRatesShowcase({
  collection,
  state,
}: {
  collection: MappedCollectionSection;
  state: MarketState;
}) {
  const products = collection.groups
    .flatMap((group) => group.products)
    .filter((product) => product.currentPrice !== null);
  const visual = getCollectionVisual(collection.slug);
  const showcaseTitle =
    getCollectionRateLabel(products as MappedProductCard[]) === "file rates"
      ? "Today's File Rates"
      : "Today's Collection Rates";
  const showcaseDescription = `${collection.name} live rates, ready to export and share.`;

  return (
    <div className="theme-inverse animate-rise brand-elevation relative overflow-hidden border border-white/18 bg-[linear-gradient(180deg,#07172f_0%,#0b1834_100%)] px-6 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_26%),radial-gradient(circle_at_bottom_right,rgba(7,85,233,0.28)_0%,rgba(7,85,233,0)_34%)]" />

      <div className="relative z-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
          <div>
            <div className="inline-flex items-center gap-2 glass-card">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#88e592]" />
              <span className={`mono-label text-white/92`}>Live rates</span>
            </div>

            <h2 className="mt-6 font-display text-[clamp(2.6rem,5vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
              {showcaseTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/88 sm:text-lg">
              Updated {collection.latestUpdateLabel} · Monitored by{" "}
              {siteMeta.agencyName}. These cards bring the most relevant live
              prices forward before the user moves into archive rows or board
              breakdown.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="motion-lift overflow-hidden rounded-[20px] border border-white/28 bg-white/18 px-5 py-5 backdrop-blur-sm"
                >
                  <p className={`mono-label text-white/84`}>
                    {getTypeLabel(product.type)} rate
                  </p>
                  <h3 className="mt-3 font-display text-[1.85rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
                    {product.name}
                  </h3>

                  <div className="mt-6 flex items-end gap-3">
                    <p className="font-display text-[3rem] font-semibold leading-none tracking-[-0.06em] text-white">
                      {formatPriceLac(product.currentPrice, {
                        showUnit: false,
                      })}
                    </p>
                    <p className="pb-1 text-sm font-semibold uppercase tracking-mono text-white/84">
                      Lac
                    </p>
                  </div>

                  <p className="mt-4 text-sm font-medium">
                    <ShowcaseDeltaLine
                      direction={product.direction}
                      delta={product.delta}
                    />
                  </p>

                  <a
                    className="pressable mt-6 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-[14px] border border-white/24 bg-white/12 px-4 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/18"
                    href={buildWhatsAppUrl(
                      siteMeta.phoneE164,
                      `Hello, I want buy and sell guidance for ${product.name} in ${collection.name}.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buy / Sell
                    <ArrowUpRightIcon />
                  </a>
                </article>
              ))}
            </div>
          </div>

          <RatesSharePanel
            collectionName={collection.name}
            headline={showcaseTitle}
            updatedLabel={collection.latestUpdateLabel}
            description={showcaseDescription}
            imageSrc={visual?.src}
            products={products.map((product) => ({
              name: product.name,
              price: product.currentPrice,
              delta: product.delta,
              direction: product.direction,
            }))}
          />
        </div>
        {products.length === 0 ? (
          <div className="mt-10 border border-dashed border-white/24 bg-white/10 px-5 py-6 text-sm leading-7 text-white/88">
            {state === "unavailable"
              ? "The live feed is temporarily unavailable, so today’s rate cards are paused until the connection recovers."
              : "Published products will appear here as soon as live prices are available for this collection."}
          </div>
        ) : null}
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
    return (
      <CollectionEmptyState collectionName={collection.name} state={state} />
    );
  }

  return (
    <div className="space-y-8">
      {collection.groups.map((group) => (
        <section
          key={group.type}
          className="surface-card motion-panel p-6 sm:p-8"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className={`mono-label text-accent`}>{group.label}</p>
              <p className="mt-3">
                Today&apos;s published {group.label.toLowerCase()} for{" "}
                {collection.name}, sorted the same way the public board reads
                them.
              </p>
            </div>
            <span className="chip">{group.products.length} items</span>
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
      <div className="border border-dashed border-line bg-panel-strong px-5 py-6">
        Historical rows will appear here once this collection has published
        price history.
      </div>
    );
  }

  return (
    <div className="surface-card motion-panel overflow-hidden">
      <div className="border-b border-line px-5 py-5 sm:px-6">
        <p className={`mono-label text-accent`}>30-day archive preview</p>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">
          A table-first history view for {collectionName}. Values are shown in
          Lac and generated directly from the published `price[]` entries in
          Strapi.
        </p>
      </div>

      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-panel-strong">
              <th className={`px-4 py-4 mono-label text-muted`}>Date</th>
              {products.map((product) => (
                <th key={product.id} className="min-w-36 px-4 py-4">
                  <span className="block text-sm font-semibold text-foreground">
                    {product.name}
                  </span>
                  <span className={`mono-label mt-1 block text-muted`}>
                    {getTypeLabel(product.type)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.date}
                className="motion-row border-b border-line last:border-none"
              >
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
                          <p className={`mono-label text-muted`}>
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
      <div className="surface-card motion-panel p-6 sm:p-8">
        <SectionHeading
          eyebrow="Trust Signals"
          title={trustTitle}
          description={trustDescription}
        />

        <div className="mt-8 space-y-4">
          {deals.map((deal) => (
            <article
              key={`${deal.month}-${deal.productType}-${deal.action}`}
              className="motion-lift border border-line bg-panel-strong p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className={`mono-label text-muted`}>{deal.month}</span>
                <span className="border border-foreground bg-foreground px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-loosest text-white">
                  {deal.action}
                </span>
                <span className="border border-accent bg-accent px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-loosest text-white">
                  {deal.outcomeTag}
                </span>
              </div>
              <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {deal.productType}
              </h3>
              <p className={`mono-label mt-2 text-muted`}>{deal.market}</p>
              <p className="mt-4 text-sm leading-7 text-muted">
                {deal.summary}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="surface-card-strong motion-panel p-6 sm:p-8">
        <SectionHeading
          eyebrow="Investor Guide"
          title={guidanceTitle}
          description={guidanceDescription}
        />

        <div className="mt-8 space-y-4">
          {guides.map((topic) => (
            <article
              key={topic.title}
              className="motion-lift border border-line bg-white px-5 py-5"
            >
              <h3 className="font-display text-[2rem] font-semibold tracking-[-0.04em] text-foreground">
                {topic.title}
              </h3>
              <p className="mt-3">{topic.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BrandStorySection({
  preferredVisualSlug,
}: {
  preferredVisualSlug?: string;
}) {
  const visual =
    (preferredVisualSlug ? getCollectionVisual(preferredVisualSlug) : null) ??
    getCollectionVisual("phase-10") ??
    getCollectionVisual("mangla-green-housing");

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)]">
      <div className="surface-card motion-panel overflow-hidden">
        {visual ? (
          <div className="relative min-h-[22rem] overflow-hidden">
            <Image
              src={visual.src}
              alt={visual.alt}
              fill
              sizes="(min-width: 1280px) 36vw, (min-width: 1024px) 42vw, 100vw"
              className="object-cover"
              style={
                visual.objectPosition
                  ? { objectPosition: visual.objectPosition }
                  : undefined
              }
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,28,75,0.16)_0%,rgba(3,28,75,0.86)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className={`mono-label text-white/86`}>
                {siteMeta.bioEyebrow}
              </p>
              <h3 className="mt-3 font-display text-[clamp(2rem,4vw,3.3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-white [text-shadow:0_8px_24px_rgba(2,8,22,0.28)]">
                One portal. Multiple live boards.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/92">
                A cleaner market interface that helps users move from browsing
                to an informed buy, sell, or hold decision.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-brand-gradient flex min-h-[22rem] items-center justify-center p-8">
            <BrandMark size={84} />
          </div>
        )}
      </div>

      <div className="surface-card-strong motion-panel p-6 sm:p-8">
        <SectionHeading
          eyebrow={siteMeta.bioEyebrow}
          title={siteMeta.bioTitle}
          description={siteMeta.bioDescription}
        />

        <div className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {siteMeta.bioHighlights.map((highlight) => (
            <div key={highlight} className="bg-white px-4 py-5">
              <p className={`mono-label text-accent`}>Focus</p>
              <p className="mt-3 text-sm font-semibold leading-7 text-foreground">
                {highlight}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div className="border border-line bg-white px-5 py-5">
            <p className={`mono-label text-muted`}>Short bio</p>
            <p className="mt-3">
              Property Portals is structured as a live market hub with dedicated
              collection pages, clearer section hierarchy, and direct contact
              paths for serious visitors. It is built to look trustworthy, feel
              lightweight, and keep decision-making close to the data.
            </p>
          </div>

          <div className="bg-brand-gradient border border-white/20 px-5 py-5 text-white">
            <p className={`mono-label text-white/86`}>{siteMeta.visionTitle}</p>
            <p className="mt-3 text-sm leading-7 text-white/92">
              {siteMeta.visionDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OfficeAndCoverageSection({
  collectionLinks,
}: {
  collectionLinks: CollectionLink[];
}) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    siteMeta.officeMapQuery,
  )}&z=15&output=embed`;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteMeta.officeMapQuery,
  )}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.14fr)_minmax(320px,0.86fr)]">
      <div className="surface-card motion-panel overflow-hidden">
        <div className="border-b border-line px-5 py-6 sm:px-8">
          <SectionHeading
            eyebrow="Office And Coverage"
            title="Put the office, map, and active collections in the same trust block."
            description="This section gives the page a real-world anchor. Users can verify the office location, open the map, and jump directly into the collection they care about."
          />
        </div>

        <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
          <div className="bg-white p-3 sm:p-4">
            <div className="overflow-hidden border border-line bg-panel-strong">
              <iframe
                title="Office location map"
                src={mapSrc}
                loading="lazy"
                className="min-h-[22rem] w-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="bg-panel-strong p-6 sm:p-8">
            <p className={`mono-label text-accent`}>Office</p>
            <h3 className="mt-3 font-display text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-foreground">
              {siteMeta.address}
            </h3>
            <p className="mt-4 text-sm leading-7 text-muted">
              Visible office information makes the portal feel more accountable.
              Keep the address live, keep the map close, and keep the route to
              advice simple.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="btn-primary"
                href={mapHref}
                target="_blank"
                rel="noreferrer"
              >
                Open map
                <ArrowUpRightIcon />
              </a>
              <a className="btn-secondary" href={`tel:${siteMeta.phoneE164}`}>
                Call advisory desk
              </a>
            </div>

            <div className="mt-8 border border-line bg-white px-4 py-5">
              <p className={`mono-label text-muted`}>Collections</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {collectionLinks.length > 0 ? (
                  collectionLinks.map((collection) => (
                    <Link
                      key={collection.slug}
                      className="chip"
                      href={`/collections/${collection.slug}`}
                    >
                      {collection.label}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted">
                    Collection links will appear here as soon as the CMS has
                    published boards.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card-strong motion-panel p-6 sm:p-8">
        <p className={`mono-label text-accent`}>Social Channels</p>
        <h3 className="mt-3 font-display text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-foreground">
          Keep the contact paths visible beyond the form.
        </h3>
        <p className="mt-4 text-sm leading-7 text-muted">
          Add direct access to the active social channels so the portal feels
          visible outside the landing page itself.
        </p>

        <SocialLinks labeled className="mt-6" />

        <div className="bg-brand-gradient mt-6 border border-white/20 px-5 py-5 text-white">
          <p className={`mono-label text-white/86`}>Practical note</p>
          <p className="mt-3 text-sm leading-7 text-white/92">
            The strongest property portals do not hide trust behind one form.
            They show office visibility, public social channels, and multiple
            ways to continue the conversation.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ConsultationSection({
  title,
  description,
  fileTypes,
  quickMessage,
}: {
  title: string;
  description: string;
  fileTypes: string[];
  quickMessage?: string;
}) {
  return (
    <div className="grid overflow-hidden border border-line bg-white lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div className="theme-inverse bg-brand-gradient relative overflow-hidden px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_70%)] blur-3xl" />
        <div className="relative space-y-6">
          <SectionHeading
            eyebrow="Free Consultation"
            title={title}
            description={description}
            inverse
          />

          <ul className="space-y-3 text-sm leading-7 text-white/92">
            {siteMeta.consultationBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center border border-white/24 bg-white/12 text-white">
                  <CheckIcon />
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="sheen border border-white/22 bg-white/14 p-5">
            <p className={`mono-label text-white/86`}>Advisory desk</p>
            <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
              {siteMeta.expertName}
            </p>
            <p className="mt-2 text-sm leading-7 text-white/92">
              {siteMeta.agencyName}
            </p>
            <p className="text-sm leading-7 text-white/92">
              {siteMeta.address}
            </p>
            <a
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-white/84"
              href={`tel:${siteMeta.phoneE164}`}
            >
              {siteMeta.phoneDisplay}
              <ArrowUpRightIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <p className={`mono-label text-muted`}>Get market guidance</p>
        <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-foreground">
          Get a human read on the market in under a minute.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          Choose your intent, optionally add the collection or product, and open
          WhatsApp with the right context already filled in.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            className="btn-primary w-full sm:w-auto"
            href={buildWhatsAppUrl(
              siteMeta.phoneE164,
              quickMessage ??
                "Hello, I want help with the current property market.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            Open WhatsApp now
            <ArrowUpRightIcon />
          </a>
          <p className="text-sm text-muted">
            Prefer to add more context first? Use the form below.
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {consultationExpectations.map((item) => (
            <div
              key={item.title}
              className="border border-line bg-panel-strong px-4 py-4"
            >
              <p className={`mono-label text-accent`}>{item.title}</p>
              <p className="mt-3">{item.description}</p>
            </div>
          ))}
        </div>

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
    <footer className="surface-navy border-x-0 border-b-0">
      <div className="shell grid gap-10 py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] lg:py-16">
        <div>
          <BrandLockup compact caption="Live collection boards" inverse />
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/86">
            A refined property portal for public-facing collection boards,
            market context, budgeting tools, and direct advisory contact when
            the data alone is not enough.
          </p>
          <SocialLinks footer />
        </div>

        <div>
          <p className={`mono-label text-white/84`}>Quick Links</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/84">
            {pageLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
          </div>
        </div>

        <div>
          <p className={`mono-label text-white/84`}>Contact</p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/84">
            <p>{siteMeta.agencyName}</p>
            <p>{siteMeta.address}</p>
            <a
              href={`tel:${siteMeta.phoneE164}`}
              className="block transition hover:text-white"
            >
              Advisory line: {siteMeta.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/12">
        <div className="shell flex flex-col gap-3 py-5 text-sm text-white/84 lg:flex-row lg:items-center lg:justify-between">
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
  } = {},
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
          <p className={`mono-label text-muted`}>{product.collectionName}</p>
          <h4 className="mt-2 font-display text-[2rem] font-semibold leading-none tracking-[-0.05em] text-foreground">
            {product.name}
          </h4>
        </div>
        <span className="chip">{getTypeLabel(product.type)}</span>
      </div>

      <p className="mt-4 text-sm leading-7 text-muted">{product.description}</p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-[3rem] font-semibold leading-none tracking-[-0.06em] text-foreground">
            {formatPriceLac(product.currentPrice)}
          </p>
          <p className={`mono-label mt-3 text-muted`}>
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
              `Hello, please guide me on ${product.name} in ${product.collectionName}.`,
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
          <p className={`mono-label text-muted`}>Recent trend</p>
          <p className={`mono-label text-muted`}>
            {product.pricePointCount} points
          </p>
        </div>

        {product.sparklinePoints.length >= 2 ? (
          <div className="mt-4">
            <MiniTrend
              points={product.sparklinePoints}
              direction={product.direction}
            />
          </div>
        ) : (
          <p className="mt-4 text-sm leading-7 text-muted">
            Publish at least two price points in Strapi to unlock a visible
            trend for this product.
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
        <p className={`mono-label text-muted`}>
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

      <div className="surface-brand motion-panel sheen p-5">
        <p className={`mono-label text-white/84`}>Interim action</p>
        <p className="mt-3 text-sm leading-7 text-white/90">
          If this is the board you care about, use WhatsApp now and ask whether
          the market is awaiting publication or simply waiting for the next
          manual update.
        </p>
        <a
          className="btn-light mt-5"
          href={buildWhatsAppUrl(
            siteMeta.phoneE164,
            `Hello, please share the current situation for ${collectionName}.`,
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
    ? "inline-flex items-center gap-2 rounded-[20px] px-2.5 py-1 text-mono-sm font-mono uppercase tracking-looser"
    : "inline-flex items-center gap-2 rounded-[20px] px-3 py-2 text-sm font-medium";

  if (direction === null || delta === null) {
    return (
      <span
        className={`${baseClass} ${
          inverse
            ? "border border-white/24 bg-white/14 text-white/90"
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
    <div className="bg-white/22 px-4 py-4">
      <p className={`mono-label text-white/84`}>{label}</p>
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
      const x =
        padding +
        (index / Math.max(points.length - 1, 1)) * (width - padding * 2);
      const y =
        height - padding - ((point - min) / range) * (height - padding * 2);

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
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {points.map((point, index) => {
        const x =
          padding +
          (index / Math.max(points.length - 1, 1)) * (width - padding * 2);
        const y =
          height - padding - ((point - min) / range) * (height - padding * 2);

        return (
          <circle
            key={`${point}-${index}`}
            cx={x}
            cy={y}
            r="2.8"
            fill={stroke}
          />
        );
      })}
    </svg>
  );
}

function SocialLinks({
  compact = false,
  footer = false,
  inverse = false,
  labeled = false,
  className = "",
}: {
  compact?: boolean;
  footer?: boolean;
  inverse?: boolean;
  labeled?: boolean;
  className?: string;
}) {
  if (labeled) {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        {siteMeta.socialLinks.map((social) => (
          <a
            key={social.label}
            className="pressable inline-flex min-h-11 items-center gap-3 border border-line bg-white px-4 py-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center border border-line bg-panel-strong text-muted">
              <SocialIcon label={social.label} className="h-4.5 w-4.5" />
            </span>
            {social.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${compact || footer ? "" : "mt-5"} ${className}`}
    >
      {siteMeta.socialLinks.map((social) => (
        <a
          key={social.label}
          className={`pressable inline-flex ${compact ? "h-8 w-8" : "h-10 w-10"} items-center justify-center rounded-[10px] border text-xs font-semibold uppercase tracking-mono ${
            footer
              ? "border-white/18 bg-white/10 text-white/88 hover:border-white/32 hover:text-white"
              : inverse
                ? "border-white/18 bg-white/10 text-white/88 hover:border-white/32 hover:text-white"
                : "border-line bg-white text-foreground hover:border-accent hover:text-accent"
          }`}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          aria-label={social.label}
        >
          <SocialIcon label={social.label} className="h-4.5 w-4.5" />
        </a>
      ))}
    </div>
  );
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
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="none"
      >
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.4" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (label === "TikTok") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={className}
        fill="currentColor"
      >
        <path d="M14.78 3c.34 1.87 1.36 3.23 3.22 3.72v2.56c-1.24-.03-2.28-.38-3.22-1.02v5.66c0 3.31-2.04 5.61-5.38 5.61-3.13 0-5.4-2.16-5.4-5.16 0-3.15 2.48-5.34 5.75-5.12v2.61c-1.57-.16-2.96.73-2.96 2.45 0 1.33.98 2.42 2.37 2.42 1.59 0 2.8-1.03 2.8-3.18V3h2.82Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M13.37 20v-7.29h2.45l.37-2.84h-2.82V8.05c0-.82.23-1.38 1.4-1.38H16V4.12c-.55-.08-1.35-.12-2.27-.12-2.24 0-3.77 1.37-3.77 3.89v1.98H7.43v2.84h2.53V20h3.41Z" />
    </svg>
  );
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

function TickerDelta({
  direction,
  delta,
}: {
  direction: MarketDirection;
  delta: number | null;
}) {
  if (delta === null || direction === null) {
    return <span className="font-medium text-muted">—</span>;
  }

  if (direction === "flat") {
    return <span className="font-medium text-muted">—</span>;
  }

  const isUp = direction === "up";

  return (
    <span className={`font-semibold ${isUp ? "text-accent" : "text-danger"}`}>
      {isUp ? "▲" : "▼"} {formatPriceLac(Math.abs(delta), { showUnit: false })}
    </span>
  );
}

function getCollectionTrustHeading(collectionName: string, rateLabel: string) {
  if (rateLabel === "market rates") {
    return `Dedicated ${collectionName} board with live updates`;
  }

  return `Dedicated ${collectionName} ${rateLabel} board with live updates`;
}

function ShowcaseDeltaLine({
  direction,
  delta,
}: {
  direction: MarketDirection;
  delta: number | null;
}) {
  if (direction === null || delta === null) {
    return <span className="text-white/84">No change available yet</span>;
  }

  if (direction === "flat") {
    return <span className="text-white/84">No change today</span>;
  }

  const isUp = direction === "up";

  return (
    <span className={isUp ? "text-[#88e592]" : "text-[#ff8b8b]"}>
      {isUp ? "▲" : "▼"} {formatPriceLac(Math.abs(delta), { showUnit: false })}{" "}
      today
    </span>
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
