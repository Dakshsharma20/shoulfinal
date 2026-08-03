import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const q = searchParams.get("q")?.trim();
    const orderStatus = searchParams.get("orderStatus");
    const paymentStatus = searchParams.get("paymentStatus");
    const sort = searchParams.get("sort") || "newest"; // newest | oldest | amount_high | amount_low
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));

    const filter: Record<string, unknown> = {};
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (q) {
      filter.$or = [
        { orderNumber: { $regex: q, $options: "i" } },
        { "shippingAddress.fullName": { $regex: q, $options: "i" } },
        { "shippingAddress.phone": { $regex: q, $options: "i" } },
        { "shippingAddress.email": { $regex: q, $options: "i" } },
      ];
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      amount_high: { totalAmount: -1 },
      amount_low: { totalAmount: 1 },
    };

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort(sortMap[sort] ?? sortMap.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      orders,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error("GET /api/admin/orders failed:", err);
    return NextResponse.json({ success: false, error: "Failed to load orders." }, { status: 500 });
  }
}
