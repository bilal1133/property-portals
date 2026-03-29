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
  bioEyebrow: string;
  bioTitle: string;
  bioDescription: string;
  visionTitle: string;
  visionDescription: string;
  bioHighlights: string[];
  officeMapQuery: string;
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

export const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://property-portals.com";

export const officeAddressSchema = {
  streetAddress: "Street 10, Dera G Block, Sector G, DHA Phase 6",
  addressLocality: "Lahore",
  addressRegion: "Punjab",
  postalCode: "54000",
  addressCountry: "PK",
} as const;

export const defaultSocialImagePath = "/opengraph-image";

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

export type JourneyStep = {
  title: string;
  description: string;
};

export type ConsultationExpectation = {
  title: string;
  description: string;
};

export type KnowledgeTopic = {
  icon: string;
  title: string;
  description: string;
  summary: string;
  details?: string[];
  points: string[];
  noteTitle?: string;
  noteLines?: string[];
};

export const siteMeta: SiteMeta = {
  brandName: "Property Portals",
  siteTitle: "Live Property Rates And Collection Boards",
  agencyName: "Property Portals Advisory Desk",
  expertName: "Property Portals Advisory Desk",
  phoneDisplay: "+923099936786",
  phoneE164: "923099936786",
  whatsappChannelUrl: "https://www.whatsapp.com/channel/",
  address: "Street 10, Dera G Block, Sector G, DHA Phase 6, Lahore, 54000, Pakistan",
  heroEyebrow: "Live Property Market",
  heroHeadline: "Live Property Rates. Real Market Context.",
  heroDescription:
    "Track live boards, compare collection activity, review market movement, and get direct guidance when you need more than numbers.",
  bioEyebrow: "About The Desk",
  bioTitle: "A property portal built to move visitors from browsing to a real decision.",
  bioDescription:
    "Instead of burying markets inside one oversized feed, this platform turns each collection into a focused decision page with live rates, movement, archive history, and a direct route to human guidance.",
  visionTitle: "Vision",
  visionDescription:
    "Build a property portal where live board data, practical tools, office credibility, and human guidance work together in the same flow.",
  bioHighlights: [
    "Live collection boards pulled from the CMS",
    "Buy and sell intent paths from the homepage",
    "Construction cost estimation for faster budgeting",
  ],
  officeMapQuery: "Street 10, Dera G Block, Sector G, DHA Phase 6, Lahore, 54000, Pakistan",
  disclaimer:
    "Market values shown here reflect published CMS data and are intended as indicative guidance only. They are not a formal valuation, legal offer, or guarantee of execution.",
  trustBadges: [
    { value: "Live", label: "Collections pulled from Strapi" },
    { value: "Buy / Sell", label: "Intent-led actions from the homepage" },
    { value: "Estimator", label: "Construction budgeting built in" },
    { value: "Office", label: "Address, map, and contact visibility" },
  ],
  quickLinks: [
    { label: "Start Here", href: "#start" },
    { label: "Market Pulse", href: "#pulse" },
    { label: "Collections", href: "#collections" },
    { label: "Calculator", href: "#calculator" },
    { label: "Advisory", href: "#advisory" },
  ],
  socialLinks: [
    {
      label: "Instagram",
      shortLabel: "IG",
      href: "https://www.instagram.com/propertyportals1?utm_source=qr&igsh=bW80cmxsbmZ1b2pl",
    },
    {
      label: "Facebook",
      shortLabel: "FB",
      href: "https://www.facebook.com/share/18FcdiqAQD/",
    },
  ],
  consultationBenefits: [
    "Open WhatsApp instantly with the right market already in context",
    "No account, no email queue, and no backend form dependency",
    "Useful for buying, selling, or comparing multiple collections",
    "Ask for a human read when the board alone is not enough",
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

export const journeySteps: JourneyStep[] = [
  {
    title: "Choose the right collection",
    description:
      "Start from the hub and open the board that matches the market you care about instead of scanning one long mixed list.",
  },
  {
    title: "Read today’s rate and recent movement",
    description:
      "Each board shows the latest published price and whether the previous point moved up, down, or stayed flat.",
  },
  {
    title: "Ask before you commit",
    description:
      "If timing, comparison, or confidence is still unclear, open WhatsApp with the collection already prefilled.",
  },
];

export const consultationExpectations: ConsultationExpectation[] = [
  {
    title: "Takes under a minute",
    description:
      "Choose your intent, add optional context, and open a ready-to-send message.",
  },
  {
    title: "WhatsApp first",
    description:
      "The form never hits a backend. It only prepares the conversation inside WhatsApp.",
  },
  {
    title: "Built for real decisions",
    description:
      "Use it when you want help buying, selling, comparing, or sanity-checking a quoted price.",
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

export const phase10KnowledgeTopics: KnowledgeTopic[] = [
  {
    icon: "📤",
    title: "File Transfer Procedure",
    description:
      "Step-by-step guide to transferring ownership of a DHA Phase 10 file",
    summary:
      "A DHA Phase 10 transfer should move through verification, file-class checking, dues review, and office-side submission in a clear order. Most delays happen when buyers skip the paperwork check and jump straight to price negotiation.",
    details: [
      "Step 1: Verify the seller CNIC, file copy, latest payment position, and whether the file is affidavit or allocation based.",
      "Step 2: Check outstanding dues, transfer readiness, and whether any office-side issue needs to be cleared before token or advance payment.",
      "Step 3: Agree the commercial terms only after the paperwork matches the quoted file type and the market-side verification is complete.",
      "Step 4: Prepare transfer forms, photographs, affidavits, payment evidence, and any authority documents before the office visit or representative handoff.",
      "Step 5: Deposit the applicable transfer fee, submit the pack, and wait for DHA to process the ownership change officially.",
    ],
    points: [
      "Never treat an unverified file copy as enough; always match the latest payment and identity record before moving forward.",
      "Confirm whether the transfer will happen in person or through a representative before preparing the final document pack.",
      "Keep buyer-side and seller-side contact, signature, and payment records aligned from day one.",
    ],
  },
  {
    icon: "📅",
    title: "Transfer Fee Schedule",
    description:
      "Approximate DHA Phase 10 transfer charges by file type",
    summary:
      "These working ranges help investors estimate transfer cost before committing to a file. Treat them as guidance only and confirm the exact amount from DHA before you finalise the deal.",
    details: [
      "5 Marla Residential: ~45,000 - 60,000 PKR",
      "10 Marla Residential: ~70,000 - 90,000 PKR",
      "1 Kanal Residential: ~1.0 - 1.2 Lac PKR",
      "2 Kanal Residential: ~1.8 - 2.2 Lac PKR",
      "4 Marla Commercial: ~1.5 - 1.8 Lac PKR",
      "8 Marla Commercial: ~2.5 - 3.0 Lac PKR",
      "Agent Commission: ~1% of deal value on each side",
    ],
    points: [
      "Residential and commercial files usually sit in different fee bands.",
      "Affidavit and allocation files can create different documentation expectations alongside transfer cost.",
      "Always ask for the latest office-side fee confirmation before token, bayana, or final payment.",
    ],
    noteTitle: "Disclaimer note",
    noteLines: [
      "These are approximate figures based on current DHA fee schedules and are subject to revision.",
      "Always confirm the exact amount at the DHA office before finalising your deal.",
      "Your advisor should confirm the current fee for your exact file type before you commit.",
    ],
  },
  {
    icon: "📝",
    title: "Affidavit vs Allocation File",
    description:
      "The most important distinction every Phase 10 investor must understand",
    summary:
      "This distinction affects pricing, paperwork strength, buyer confidence, and the way market quotes should be read. Many first-time investors compare rates incorrectly because they do not separate affidavit and allocation files first.",
    details: [
      "Affidavit files usually represent an earlier documentation stage, so they can trade with a different risk and pricing profile.",
      "Allocation files usually sit in a stronger paperwork position, which often changes buyer comfort and quoted market value.",
      "A lower affidavit quote is not automatically a better deal if your comparison set is allocation-based stock.",
    ],
    points: [
      "Never compare two quoted rates without checking that both files belong to the same class.",
      "If an agent quotes one figure without stating affidavit or allocation, treat the quote as incomplete.",
      "The file class should be visible in the screenshots, office record, and negotiation summary before you commit.",
    ],
  },
  {
    icon: "📤",
    title: "Documents Required for Transfer",
    description:
      "Full checklist for buyers and sellers — including overseas investors",
    summary:
      "A clean file pack reduces repeat visits, prevents avoidable objections, and gives both buyer and seller a smoother transfer day. Missing one document often causes more delay than price negotiation itself.",
    details: [
      "Seller CNIC copies, buyer CNIC copies, passport copies if applicable, and recent passport-size photographs should be kept ready.",
      "File copy, payment record, transfer forms, affidavits, and any DHA-issued supporting letters should be assembled as one pack before submission.",
      "If a representative is involved, include the relevant authority letter or power-of-attorney paperwork before the office visit.",
    ],
    points: [
      "Buyers and sellers should both verify the final document checklist one day before submission.",
      "Overseas investors should keep identity records, signatures, and attestation copies consistent across the entire pack.",
      "Do not release final payment until both the paperwork stack and market-side verification trail make sense together.",
    ],
  },
  {
    icon: "📲",
    title: "Remote Transfer Guide — For Overseas Pakistanis",
    description:
      "Buy or sell a DHA Phase 10 file without coming to Pakistan",
    summary:
      "Overseas Pakistanis can usually buy or sell without travelling, but only when the paperwork, representative authority, and verification trail are prepared early. Remote execution fails when identity records and signing instructions are left for the end.",
    details: [
      "Use a trusted local representative and confirm exactly what authority paperwork DHA will require for your case.",
      "Prepare identity documents, signatures, attestations, and communication records before the market-side negotiation moves to final commitment.",
      "Ask for the office-side procedure and the market-side verification trail in writing so that nothing depends on verbal assumptions.",
    ],
    points: [
      "Keep one document pack for the advisor, one for the representative, and one for your own records.",
      "Before releasing funds, confirm both the transfer procedure and the exact file verification status.",
      "Remote deals are safest when the legal paperwork and the market paperwork are checked together, not separately.",
    ],
  },
];
