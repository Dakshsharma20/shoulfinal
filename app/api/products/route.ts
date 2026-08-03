import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import "@/models/Category"; // ensure Category schema is registered before populate()

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const q = searchParams.get("q")?.trim();
    const categorySlug = searchParams.get("category")?.trim();
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");
    const newArrival = searchParams.get("newArrival");
    const sort = searchParams.get("sort"); // "newest" | undefined
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(48, Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10) || 12));

    const filter: Record<string, unknown> = { isVisible: true };

    if (q) {
      filter.$text = { $search: q };
    }
    if (featured === "true") filter.featured = true;
    if (bestseller === "true") filter.bestseller = true;
    if (newArrival === "true") filter.newArrival = true;

    if (categorySlug && categorySlug !== "All") {
      const category = await Category.findOne({ slug: categorySlug }).select("_id").lean();
      if (category) {
        filter.category = category._id;
      } else {
        // Unknown category slug — return an empty result rather than
        // erroring, since this is a normal outcome of a stale filter link.
        return NextResponse.json({
          success: true,
          products: [],
          total: 0,
          page,
          totalPages: 0,
        });
      }
    }

    const sortStage: Record<string, 1 | -1> = sort === "newest"
      ? { createdAt: -1 }
      : { displayOrder: 1, createdAt: -1 };

    const total = await Product.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortStage)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, products, total, page, totalPages });
  } catch (err) {
    console.error("GET /api/products failed:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load products." },
      { status: 500 }
    );
  }
}
