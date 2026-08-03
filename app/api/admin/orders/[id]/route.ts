import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth/requireAdmin";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await connectDB();
    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error(`GET /api/admin/orders/${id} failed:`, err);
    return NextResponse.json({ success: false, error: "Failed to load order." }, { status: 500 });
  }
}
