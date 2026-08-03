import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsHero from "@/components/ProductsHero";
import ProductExplorer from "@/components/ProductExplorer";

export const metadata: Metadata = {
  title: "Shop Handcrafted Jewellery",
  description:
    "Browse the full Soul Hues collection of handmade earrings, necklaces, bracelets, rings, anklets and hair accessories. Order directly on WhatsApp.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Shop Handcrafted Jewellery | Soul Hues",
    description:
      "Browse the full collection of handmade earrings, necklaces, bracelets, rings, anklets and hair accessories.",
    url: "/products",
    images: [{ url: "/images/flatlay-collection.svg", width: 1200, height: 1400, alt: "Soul Hues jewellery collection flatlay" }],
  },
};

export default function ProductsPage() {
  return (
    <div>
      <ProductsHero />
      <Suspense fallback={null}>
        <ProductExplorer />
      </Suspense>
    </div>
  );
}
