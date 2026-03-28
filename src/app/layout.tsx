import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";

import {
  defaultSocialImagePath,
  officeAddressSchema,
  siteMeta,
  siteOrigin,
} from "@/data/landing-content";

import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = siteOrigin;

export const metadata: Metadata = {
  title: {
    default: siteMeta.brandName,
    template: `%s | ${siteMeta.brandName}`,
  },
  description: siteMeta.heroDescription,
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
    locale: "en_PK",
    url: siteUrl,
    siteName: siteMeta.brandName,
    title: siteMeta.siteTitle,
    description: siteMeta.heroDescription,
    images: [defaultSocialImagePath],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.siteTitle,
    description: siteMeta.heroDescription,
    images: [defaultSocialImagePath],
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
              name: siteMeta.brandName,
              description:
                "Premium property portal with live collection boards, market movement, and direct WhatsApp guidance in Lahore, Pakistan.",
              telephone: siteMeta.phoneDisplay,
              url: siteUrl,
              address: {
                "@type": "PostalAddress",
                ...officeAddressSchema,
              },
              areaServed: "Lahore, Pakistan",
              sameAs: siteMeta.socialLinks.map((link) => link.href),
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  telephone: siteMeta.phoneDisplay,
                  availableLanguage: ["en", "ur"],
                },
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
