export type SiteMeta = {
  brandName: string;
  siteTitle: string;
  agencyName: string;
  expertName: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappChannelUrl: string;
  address: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroDescription: string;
  disclaimer: string;
  trustBadges: Array<{
    value: string;
    label: string;
  }>;
  quickLinks: Array<{
    label: string;
    href: string;
  }>;
  socialLinks: Array<{
    label: string;
    shortLabel: string;
    href: string;
  }>;
  consultationBenefits: string[];
};

export type DealProof = {
  month: string;
  action: "Buy" | "Sell";
  productType: string;
  market: string;
  summary: string;
  outcomeTag: string;
};

export type GuideTopic = {
  title: string;
  description: string;
};

export const siteMeta: SiteMeta = {
  brandName: "Property Portals",
  siteTitle: "Live Collection Boards Across Curated Markets",
  agencyName: "Bin Suleman Real Estate",
  expertName: "Muhammad Kamran Sharif",
  phoneDisplay: "0300-9484188",
  phoneE164: "923009484188",
  whatsappChannelUrl: "https://www.whatsapp.com/channel/",
  address: "138-B Broadway Commercial, Phase 8 DHA, Lahore",
  heroEyebrow: "OmniBack Collections · Dedicated Market Boards",
  heroHeadline: "Open each collection as its own market page, not just a row in a grid.",
  heroDescription:
    "The homepage now works as a collection hub. Each collection gets its own focused board with today’s rates, movers, archive rows, and a direct WhatsApp path when numbers need interpretation.",
  disclaimer:
    "Market values shown here reflect published CMS data and are intended as indicative guidance only. They are not a formal valuation, legal offer, or guarantee of execution.",
  trustBadges: [
    { value: "Live", label: "Collections pulled from Strapi" },
    { value: "Board", label: "Dedicated page for every collection" },
    { value: "5 min", label: "Revalidation window" },
    { value: "Human", label: "Direct WhatsApp consultation" },
  ],
  quickLinks: [
    { label: "Collections", href: "#collections" },
    { label: "Pulse", href: "#pulse" },
    { label: "Guidance", href: "#guidance" },
    { label: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { label: "Facebook", shortLabel: "FB", href: "https://www.facebook.com/" },
    { label: "Instagram", shortLabel: "IG", href: "https://www.instagram.com/" },
    { label: "TikTok", shortLabel: "TT", href: "https://www.tiktok.com/" },
    { label: "YouTube", shortLabel: "YT", href: "https://www.youtube.com/" },
  ],
  consultationBenefits: [
    "Free WhatsApp consultation with no obligation",
    "Context behind market shifts, not just a quoted price",
    "Dedicated collection pages for focused rate browsing",
    "Fast human follow-up when CMS data is incomplete",
  ],
};

export const dealProofs: DealProof[] = [
  {
    month: "Mar 2026",
    action: "Buy",
    productType: "Commercial Plot",
    market: "DHA-side collection",
    summary:
      "Buyer entered after a short watchlist period once the momentum and documentation lined up. The value came from timing and verification, not urgency.",
    outcomeTag: "Entry after confirmation",
  },
  {
    month: "Feb 2026",
    action: "Sell",
    productType: "Residential File",
    market: "Remote client case",
    summary:
      "An overseas owner exited through a fully remote coordination flow after paperwork review and title matching.",
    outcomeTag: "Remote exit completed",
  },
  {
    month: "Jan 2026",
    action: "Buy",
    productType: "Home Unit",
    market: "End-user demand",
    summary:
      "A first-time buyer moved ahead after shortlisting the right market, comparing price movement, and checking readiness against budget.",
    outcomeTag: "Clarity before commitment",
  },
];

export const guideTopics: GuideTopic[] = [
  {
    title: "How to Read a Product Timeline",
    description:
      "The latest price matters, but the previous one tells you whether movement is conviction, noise, or just a flat day.",
  },
  {
    title: "Plots vs Files vs Homes",
    description:
      "The product type affects the buyer mindset, the way demand moves, and how quickly a change in price should be interpreted.",
  },
  {
    title: "What To Do When A Collection Is Empty",
    description:
      "A collection with no published products is still useful: it shows market coverage is planned, but pricing has not been published yet.",
  },
  {
    title: "When To Ask For Human Context",
    description:
      "If the data is thin, the delta is missing, or you are comparing multiple collections, a direct WhatsApp conversation is the faster route.",
  },
];

export const consultationIntents = [
  "Buy something in a live collection",
  "Sell an existing asset",
  "Compare multiple collections",
  "Need investor guidance",
  "Just checking current market signals",
];

export const consultationFallbackOptions = [
  "Plot",
  "File",
  "Home",
  "Not sure yet",
];
