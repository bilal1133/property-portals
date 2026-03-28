import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = "https://property-portals.com";

export const metadata: Metadata = {
  title: {
    default: "Property Portals | Live Collection Boards",
    template: "%s | Property Portals",
  },
  description:
    "Compare live property rates, shortlist collections, and get WhatsApp guidance before you move.",
  keywords: [
    "property portal",
    "property rates",
    "real estate",
    "Pakistan property",
    "DHA",
    "collection boards",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Property Portals",
    title: "Property Portals | Live Collection Boards",
    description:
      "Compare live property rates, shortlist collections, and get WhatsApp guidance before you move.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Portals | Live Collection Boards",
    description:
      "Compare live property rates, shortlist collections, and get WhatsApp guidance.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Property Portals",
              description:
                "Premium property portal with live collection boards for property rates and market data in Pakistan.",
              telephone: "+923009484188",
              url: siteUrl,
              address: {
                "@type": "PostalAddress",
                streetAddress: "30 N Gould St Ste R",
                addressLocality: "Sheridan",
                addressRegion: "WY",
                postalCode: "82801",
                addressCountry: "US",
              },
              sameAs: [
                "https://www.instagram.com/tkturners_official/",
                "https://www.tiktok.com/@tkturners",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
