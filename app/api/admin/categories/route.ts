import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { categorySchema } from "@/lib/validations/schemas";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await connectDB();
    const categories = await Category.find({}).sort({ displayOrder: 1, name: 1 }).lean();
    return NextResponse.json({ success: true, categories });
  } catch (err) {
    console.error("GET /api/admin/categories failed:", err);
    return NextResponse.json({ success: false, error: "Failed to load categories." }, { status: 500 });
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

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid category data." },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const clash = await Category.findOne({
      $or: [{ slug: parsed.data.slug }, { name: parsed.data.name }],
    })
      .select("_id")
      .lean();
    if (clash) {
      return NextResponse.json(
        { success: false, error: "A category with this name or slug already exists." },
        { status: 409 }
      );
    }
    const category = await Category.create(parsed.data);
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/categories failed:", err);
    return NextResponse.json({ success: false, error: "Failed to create category." }, { status: 500 });
  }
}
