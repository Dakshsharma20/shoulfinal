import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { categorySchema } from "@/lib/validations/schemas";

type RouteParams = { params: Promise<{ id: string }> };

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

  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid category data." },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const category = await Category.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, category });
  } catch (err) {
    console.error(`PATCH /api/admin/categories/${id} failed:`, err);
    return NextResponse.json({ success: false, error: "Failed to update category." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await connectDB();

    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Can't delete — ${productCount} product${productCount === 1 ? "" : "s"} still use this category. Reassign or delete them first.`,
        },
        { status: 409 }
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/admin/categories/${id} failed:`, err);
    return NextResponse.json({ success: false, error: "Failed to delete category." }, { status: 500 });
  }
}
