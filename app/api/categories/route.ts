import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ displayOrder: 1, name: 1 }).lean();
    return NextResponse.json({ success: true, categories });
  } catch (err) {
    console.error("GET /api/categories failed:", err);
    return NextResponse.json({ success: false, error: "Failed to load categories." }, { status: 500 });
  }
}
