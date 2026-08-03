import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/data/products";
import { getPublicCategories } from "@/lib/data/categories";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://soulhues.example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const [slugs, categories] = await Promise.all([
      getAllProductSlugs(),
      getPublicCategories(),
    ]);

    productRoutes = slugs.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    categoryRoutes = categories.map((c) => ({
      url: `${SITE_URL}/products?category=${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (err) {
    // If MongoDB isn't reachable at build time, still ship a valid
    // sitemap with the static routes rather than failing the build.
    console.error("sitemap: failed to load dynamic routes:", err);
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
