import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins, Sacramento } from "next/font/google";
import "./globals.css";
import { getPublicSettings } from "@/lib/data/settings";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sacramento",
  display: "swap",
});

// TODO: replace with the real production domain before launch — this
// powers canonical URLs and resolves relative Open Graph/Twitter images.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://soulhues.example.com";
const SITE_TITLE = "Soul Hues | Handcrafted Jewellery by Shivani";
const SITE_DESCRIPTION =
  "Soul Hues is a handmade jewellery studio by Shivani \u2014 earrings, necklaces, bracelets, rings, anklets and hair accessories, crafted piece by piece. Order directly on WhatsApp.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4F6B52",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Soul Hues",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "handmade jewellery",
    "Soul Hues",
    "handcrafted earrings",
    "artisan jewellery India",
    "WhatsApp jewellery order",
    "handmade necklaces India",
    "custom jewellery Shivani",
  ],
  authors: [{ name: "Shivani", url: SITE_URL }],
  creator: "Soul Hues",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description:
      "Handmade jewellery, crafted piece by piece. Explore the collection and order directly on WhatsApp.",
    type: "website",
    url: SITE_URL,
    siteName: "Soul Hues",
    locale: "en_IN",
    images: [
      {
        url: "/images/logo-soulhues.png",
        width: 1254,
        height: 1254,
        alt: "Soul Hues \u2014 Crafted With Love, by Shivani",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/logo-soulhues.png"],
  },
  // Favicon / apple-touch-icon / browser tab icon are handled automatically
  // by Next.js's file-based icon convention (app/icon.png, app/apple-icon.png,
  // app/favicon.ico) generated from the real Soul Hues logo — no manual
  // `icons` field needed here.
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSettings();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.storeName,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: settings.logo?.url || `${SITE_URL}/images/logo-soulhues.png`,
    founder: {
      "@type": "Person",
      name: "Shivani",
    },
    sameAs: [settings.instagramUrl],
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: "Handmade Jewellery",
        category: "Jewellery",
      },
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${poppins.variable} ${sacramento.variable} bg-cream font-sans text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
