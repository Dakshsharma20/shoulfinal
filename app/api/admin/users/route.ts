import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth/requireAdmin";

type Customer = {
  key: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrderAt: Date;
};

export async function GET(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const q = searchParams.get("q")?.trim().toLowerCase() ?? "";
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "20") || 20));

    const rows = await Order.aggregate([
      {
        $project: {
          name: "$shippingAddress.fullName",
          email: "$shippingAddress.email",
          phone: "$shippingAddress.phone",
          totalAmount: 1,
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $ne: ["$email", ""] },
              { $toLower: "$email" },
              { $concat: ["phone:", "$phone"] },
            ],
          },
          name: { $last: "$name" },
          email: { $last: "$email" },
          phone: { $last: "$phone" },
          orders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          lastOrderAt: { $max: "$createdAt" },
        },
      },
      ...(q
        ? [{
            $match: {
              $or: [
                { name: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } },
                { phone: { $regex: q, $options: "i" } },
              ],
            },
          }]
        : []),
      { $sort: { lastOrderAt: -1 } },
    ]);

    const total = rows.length;
    const customers = rows.slice((page - 1) * limit, page * limit).map((customer) => ({
      key: customer._id,
      name: customer.name || "Unknown customer",
      email: customer.email || "—",
      phone: customer.phone || "—",
      orders: customer.orders,
      totalSpent: customer.totalSpent,
      lastOrderAt: customer.lastOrderAt,
    }));

    return NextResponse.json({
      success: true,
      customers,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error("GET /api/admin/users failed:", err);
    return NextResponse.json({ success: false, error: "Failed to load customers." }, { status: 500 });
  }
}
