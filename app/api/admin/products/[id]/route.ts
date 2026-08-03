import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Product from "@/models/Product";
import "@/models/Category";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { productUpdateSchema } from "@/lib/validations/schemas";
import cloudinary, { assertCloudinaryConfigured } from "@/lib/cloudinary";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await connectDB();
    const product = await Product.findById(id).populate("category", "name slug").lean();
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error(`GET /api/admin/products/${id} failed:`, err);
    return NextResponse.json({ success: false, error: "Failed to load product." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid product data." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    if (parsed.data.slug) {
      const clash = await Product.findOne({ slug: parsed.data.slug, _id: { $ne: id } })
        .select("_id")
        .lean();
      if (clash) {
        return NextResponse.json(
          { success: false, error: "A product with this slug already exists." },
          { status: 409 }
        );
      }
    }

    const product = await Product.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error(`PATCH /api/admin/products/${id} failed:`, err);
    return NextResponse.json({ success: false, error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(id).lean();
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    }

    // Best-effort cleanup of the product's Cloudinary images. Failure here
    // shouldn't block the product deletion from succeeding.
    try {
      assertCloudinaryConfigured();
      const images = (product as { images?: { publicId: string }[] }).images ?? [];
      await Promise.all(images.map((img) => cloudinary.uploader.destroy(img.publicId)));
    } catch (cleanupErr) {
      console.warn(`Cloudinary cleanup skipped for product ${id}:`, cleanupErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/admin/products/${id} failed:`, err);
    return NextResponse.json({ success: false, error: "Failed to delete product." }, { status: 500 });
  }
}
