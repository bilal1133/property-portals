import type { ReactNode } from "react";

export type CollectionSectionKey =
  | "overview"
  | "insights"
  | "rates"
  | "movers"
  | "archive"
  | "deals"
  | "knowledge"
  | "notice"
  | "contact"
  | "advisory";

type CollectionSectionTone = "paper" | "mist" | "cloud" | "signal";
type CollectionSectionSpacing = "hero" | "standard";
type CollectionPanelTone = "light" | "soft" | "dark";
type CollectionPillTone = "neutral" | "accent" | "danger" | "dark";

export const collectionPageSystemRules = {
  sectionOrder: [
    "overview",
    "insights",
    "rates",
    "movers",
    "archive",
    "deals",
    "knowledge",
    "notice",
    "contact",
    "advisory",
  ] as const satisfies readonly CollectionSectionKey[],
  sections: {
    overview: { tone: "paper", spacing: "hero" },
    insights: { tone: "mist", spacing: "standard" },
    rates: { tone: "paper", spacing: "standard" },
    movers: { tone: "signal", spacing: "standard" },
    archive: { tone: "cloud", spacing: "standard" },
    deals: { tone: "paper", spacing: "standard" },
    knowledge: { tone: "cloud", spacing: "standard" },
    notice: { tone: "paper", spacing: "standard" },
    contact: { tone: "cloud", spacing: "standard" },
    advisory: { tone: "paper", spacing: "standard" },
  } satisfies Record<
    CollectionSectionKey,
    { tone: CollectionSectionTone; spacing: CollectionSectionSpacing }
  >,
  spacing: {
    hero: "pb-12 pt-8 lg:pb-18 lg:pt-10",
    standard: "py-14 lg:py-18",
  },
  tones: {
    paper:
      "border-y border-white/6 bg-[linear-gradient(180deg,var(--brand-ink)_0%,var(--navy)_100%)]",
    mist: "border-y border-white/6 bg-[linear-gradient(180deg,var(--navy)_0%,var(--brand-ink)_100%)]",
    cloud:
      "border-y border-white/6 bg-[linear-gradient(180deg,var(--navy)_0%,var(--brand-deep)_100%)]",
    signal:
      "border-y border-white/8 bg-[linear-gradient(180deg,var(--brand-deep)_0%,var(--navy)_100%)]",
  },
  layouts: {
    heroSplit: "grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)]",
    heroCenter: "mx-auto max-w-[72rem]",
    ratesSplit: "grid gap-5 xl:grid-cols-[minmax(0,1.16fr)_24rem]",
    contactSplit:
      "overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,var(--brand-ink)_0%,var(--navy)_100%)] lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]",
    advisorySplit:
      "grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]",
  },
  cards: {
    grid: "mt-8 grid gap-5",
    panelPadding: "px-5 py-6 sm:px-6",
    rateCard: "surface-card motion-panel overflow-hidden px-5 py-6 sm:px-6",
    dealCard: "surface-card motion-panel flex h-full flex-col gap-4 px-5 py-6",
  },
  table: {
    wrapper: "overflow-x-auto",
    table: "min-w-full border-collapse text-left",
    headRow: "border-b border-white/10 bg-white/8",
    headCell: "px-4 py-4",
    bodyRow: "border-b border-white/8 last:border-none bg-white/4",
    bodyCell: "px-4 py-4",
    highlightedRow: "bg-[rgba(7,85,233,0.14)]",
  },
} as const;

export function CollectionPageSection({
  id,
  tone = "paper",
  spacing = "standard",
  className,
  shellClassName = "shell",
  children,
}: {
  id?: string;
  tone?: CollectionSectionTone;
  spacing?: CollectionSectionSpacing;
  className?: string;
  shellClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cx(
        collectionPageSystemRules.tones[tone],
        collectionPageSystemRules.spacing[spacing],
        className,
      )}
    >
      <div className={shellClassName}>{children}</div>
    </section>
  );
}

export function CollectionPageIntro({
  eyebrow,
  title,
  description,
  inverse = false,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cx("max-w-3xl", className)}>
      <p
        className={cx("mono-label", inverse ? "text-white/84" : "text-accent")}
      >
        {eyebrow}
      </p>
      <h2
        className={cx(
          "mt-4 font-display text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[0.95] tracking-[-0.055em]",
          inverse ? "text-white" : "text-white",
        )}
      >
        {title}
      </h2>
      <p
        className={cx(
          "mt-4 max-w-3xl text-base leading-8",
          inverse ? "text-white/88" : "text-white/68",
        )}
      >
        {description}
      </p>
    </div>
  );
}

export function CollectionPagePanel({
  tone = "light",
  className,
  children,
}: {
  tone?: CollectionPanelTone;
  className?: string;
  children: ReactNode;
}) {
  const panelToneClass =
    tone === "dark"
      ? "surface-brand motion-panel theme-inverse rounded-[30px] text-white shadow-[0_28px_72px_rgba(2,8,22,0.42)]"
      : tone === "soft"
        ? "motion-panel theme-inverse rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,var(--brand-deep)_0%,var(--brand-ink)_100%)] text-white shadow-[0_20px_56px_rgba(2,8,22,0.34)]"
        : "surface-navy motion-panel theme-inverse rounded-[26px] text-white shadow-[0_20px_56px_rgba(2,8,22,0.34)]";

  return <div className={cx(panelToneClass, className)}>{children}</div>;
}

export function CollectionPageGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cx("mt-8 grid gap-5", className)}>{children}</div>;
}

export function CollectionStatMatrix({
  inverse = false,
  columnsClassName = "sm:grid-cols-2 xl:grid-cols-4",
  className,
  children,
}: {
  inverse?: boolean;
  columnsClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "grid gap-px overflow-hidden rounded-[24px] border",
        columnsClassName,
        inverse ? "border-white/18 bg-white/8" : "border-white/10 bg-white/6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CollectionStatCell({
  label,
  value,
  detail,
  inverse = false,
  className,
}: {
  label: string;
  value: string;
  detail?: string;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cx(inverse ? "bg-white/8" : "bg-white/4", className)}>
      <div className="px-5 py-5">
        <p
          className={cx(
            "mono-label",
            inverse ? "text-white/82" : "text-accent",
          )}
        >
          {label}
        </p>
        <p
          className={cx(
            "mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.05em]",
            inverse ? "text-white" : "text-white",
          )}
        >
          {value}
        </p>
        {detail ? (
          <p
            className={cx(
              "mt-3 text-sm leading-7",
              inverse ? "text-white/86" : "text-white/68",
            )}
          >
            {detail}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function CollectionEditorialCard({
  label,
  title,
  excerpt,
  meta,
  href,
  actionLabel,
  featured = false,
  className,
}: {
  label: string;
  title: string;
  excerpt: string;
  meta: string;
  href: string;
  actionLabel: string;
  featured?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cx(
        "motion-panel overflow-hidden border px-5 py-6 sm:px-6",
        featured
          ? "border-accent/24 bg-[linear-gradient(180deg,var(--brand-deep)_0%,var(--brand-ink)_100%)] shadow-[0_24px_56px_rgba(7,85,233,0.16)]"
          : "border-white/10 bg-[linear-gradient(180deg,var(--brand-ink)_0%,var(--navy)_100%)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className={cx("mono-label", featured ? "text-accent" : "text-muted")}
        >
          {label}
        </span>
        <span className="mono-label-sm text-white/56">{meta}</span>
      </div>
      <h3 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.35rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-white/68">{excerpt}</p>
      <a
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-accent"
        href={href}
      >
        {actionLabel}
        <ArrowUpRightIcon />
      </a>
    </article>
  );
}

export function CollectionDataCard({
  eyebrow,
  title,
  value,
  unit,
  badge,
  meta,
  description,
  footer,
  className,
}: {
  eyebrow: string;
  title: string;
  value: string;
  unit?: string;
  badge?: ReactNode;
  meta?: ReactNode;
  description?: string;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <CollectionPagePanel
      tone="light"
      className={cx("overflow-hidden px-5 py-6 sm:px-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mono-label text-white/62">{eyebrow}</p>
          <h3 className="mt-3 font-display text-[2rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
            {title}
          </h3>
        </div>
        {badge}
      </div>

      <div className="mt-8">
        <p className="font-display text-[clamp(2.8rem,5vw,3.8rem)] font-semibold leading-none tracking-[-0.06em] text-white">
          {value}
        </p>
        {unit ? (
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/54">
            {unit}
          </p>
        ) : null}
      </div>

      {meta ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">{meta}</div>
      ) : null}
      {description ? (
        <p className="mt-5 text-sm leading-7 text-white/68">{description}</p>
      ) : null}
      {footer ? (
        <div className="mt-6 flex flex-wrap gap-3">{footer}</div>
      ) : null}
    </CollectionPagePanel>
  );
}

export function CollectionTableFrame({
  eyebrow,
  description,
  meta,
  className,
  children,
}: {
  eyebrow: string;
  description: string;
  meta?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <CollectionPagePanel
      tone="light"
      className={cx("overflow-hidden", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5 sm:px-6">
        <div>
          <p className="mono-label text-accent">{eyebrow}</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
            {description}
          </p>
        </div>
        {meta}
      </div>
      {children}
    </CollectionPagePanel>
  );
}

export function CollectionActionStrip({
  eyebrow,
  description,
  action,
  inverse = false,
  className,
}: {
  eyebrow: string;
  description: string;
  action: ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "mt-6 grid gap-4 border p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center",
        inverse
          ? "border-white/14 bg-white/8 text-white"
          : "border-white/10 bg-white/6 text-white",
        className,
      )}
    >
      <div>
        <p
          className={cx(
            "mono-label",
            inverse ? "text-white/84" : "text-accent",
          )}
        >
          {eyebrow}
        </p>
        <p
          className={cx(
            "mt-3 max-w-3xl text-sm leading-7",
            inverse ? "text-white/88" : "text-white/68",
          )}
        >
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function CollectionNoticeBand({
  eyebrow,
  title,
  description,
  action,
  className,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <CollectionPagePanel
      tone="dark"
      className={cx(
        "overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10",
        className,
      )}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="mono-label text-white/84">{eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,4vw,4rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/90">
            {description}
          </p>
          {children}
        </div>
        {action}
      </div>
    </CollectionPagePanel>
  );
}

export function CollectionPill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: CollectionPillTone;
  className?: string;
  children: ReactNode;
}) {
  const toneClass =
    tone === "accent"
      ? "bg-accent-soft text-accent"
      : tone === "danger"
        ? "bg-danger-soft text-danger"
        : tone === "dark"
          ? "bg-white/8 text-white border border-white/10"
          : "bg-white/6 text-white/72 border border-white/10";

  return (
    <span
      className={cx(
        "inline-flex min-h-8 items-center rounded-[999px] px-3 py-1 text-sm font-semibold",
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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
