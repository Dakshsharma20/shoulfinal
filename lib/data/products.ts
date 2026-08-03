import { connectDB } from "@/lib/db/connect";
import Product from "@/models/Product";
import "@/models/Category";
import type { Product as ProductType } from "@/lib/types";

/**
 * Mongoose .lean() documents contain ObjectId/Date instances that aren't
 * directly serializable across the Server->Client Component boundary.
 * This round-trip through JSON is the standard way to get plain,
 * serializable objects (Next.js does this internally for props anyway).
 */
function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function getBestsellerProducts(limit = 4): Promise<ProductType[]> {
  await connectDB();
  const products = await Product.find({ isVisible: true, bestseller: true })
    .populate("category", "name slug")
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(limit)
    .lean();
  return serialize(products);
}

export async function getNewArrivalProducts(limit = 4): Promise<ProductType[]> {
  await connectDB();
  const products = await Product.find({ isVisible: true, newArrival: true })
    .populate("category", "name slug")
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(limit)
    .lean();
  return serialize(products);
}

export async function getFeaturedProducts(limit = 4): Promise<ProductType[]> {
  await connectDB();
  const products = await Product.find({ isVisible: true, featured: true })
    .populate("category", "name slug")
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(limit)
    .lean();
  return serialize(products);
}

export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  await connectDB();
  const product = await Product.findOne({ slug, isVisible: true })
    .populate("category", "name slug")
    .lean();
  return product ? serialize(product) : null;
}

export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit = 4
): Promise<ProductType[]> {
  await connectDB();
  const products = await Product.find({
    isVisible: true,
    category: categoryId,
    _id: { $ne: excludeProductId },
  })
    .populate("category", "name slug")
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(limit)
    .lean();
  return serialize(products);
}

export async function getAllProductSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  await connectDB();
  const products = await Product.find({ isVisible: true }).select("slug updatedAt").lean();
  return serialize(products);
}
