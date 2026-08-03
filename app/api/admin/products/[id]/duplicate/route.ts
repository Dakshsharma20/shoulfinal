import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth/requireAdmin";

type RouteParams = { params: Promise<{ id: string }> };

async function uniqueSlug(baseSlug: string): Promise<string> {
  let candidate = `${baseSlug}-copy`;
  let n = 2;
  while (await Product.findOne({ slug: candidate }).select("_id").lean()) {
    candidate = `${baseSlug}-copy-${n}`;
    n += 1;
  }
  return candidate;
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await connectDB();
    const original = await Product.findById(id).lean();
    if (!original) {
      return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    }

    const {
      _id: _omitId,
      createdAt: _omitCreatedAt,
      updatedAt: _omitUpdatedAt,
      slug: originalSlug,
      title: originalTitle,
      ...rest
    } = original as Record<string, unknown> & { slug: string; title: string };

    const newSlug = await uniqueSlug(originalSlug);

    const duplicate = await Product.create({
      ...rest,
      title: `${originalTitle} (Copy)`,
      slug: newSlug,
      // Default the copy to hidden so it doesn't appear live until reviewed.
      isVisible: false,
    });

    return NextResponse.json({ success: true, product: duplicate }, { status: 201 });
  } catch (err) {
    console.error(`POST /api/admin/products/${id}/duplicate failed:`, err);
    return NextResponse.json({ success: false, error: "Failed to duplicate product." }, { status: 500 });
  }
}
