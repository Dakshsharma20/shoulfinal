import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Product from "@/models/Product";
import "@/models/Category";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { productSchema } from "@/lib/validations/schemas";

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const q = searchParams.get("q")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));

    const filter: Record<string, unknown> = {};
    if (q) filter.$text = { $search: q };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      products,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error("GET /api/admin/products failed:", err);
    return NextResponse.json({ success: false, error: "Failed to load products." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid product data." },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const existingSlug = await Product.findOne({ slug: parsed.data.slug }).select("_id").lean();
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "A product with this slug already exists." },
        { status: 409 }
      );
    }
    const product = await Product.create(parsed.data);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products failed:", err);
    return NextResponse.json({ success: false, error: "Failed to create product." }, { status: 500 });
  }
}
