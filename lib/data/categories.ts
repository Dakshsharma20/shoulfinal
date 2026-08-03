import { cache } from "react";
import { connectDB } from "@/lib/db/connect";
import Category from "@/models/Category";
import type { PublicCategory } from "@/lib/categories-context";

export const getPublicCategories = cache(async (): Promise<PublicCategory[]> => {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ displayOrder: 1, name: 1 }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (err) {
    console.error("Failed to load categories from MongoDB:", err);
    return [];
  }
});
