import { connectDB } from "@/lib/db/connect";
import Order, { type OrderDocument } from "@/models/Order";

function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc));
}

/** Fields safe to show on the public order-success page — no Razorpay signature/IDs. */
export interface PublicOrderSummary {
  orderNumber: string;
  items: { title: string; image: string; price: number; quantity: number }[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export async function getPublicOrderSummary(orderNumber: string): Promise<PublicOrderSummary | null> {
  try {
    await connectDB();
    const order = await Order.findOne({ orderNumber }).lean();
    if (!order) return null;
    return serialize({
      orderNumber: order.orderNumber,
      items: order.items,
      shippingAddress: {
        fullName: order.shippingAddress.fullName,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pinCode: order.shippingAddress.pinCode,
        country: order.shippingAddress.country,
      },
      subtotal: order.subtotal,
      shippingCharge: order.shippingCharge,
      tax: order.tax,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    });
  } catch (err) {
    console.error(`getPublicOrderSummary("${orderNumber}") failed:`, err);
    return null;
  }
}

/** Order + phone number lookup for the customer Track Order page. */
export async function findOrderForTracking(
  orderNumber: string,
  phone: string
): Promise<OrderDocument | null> {
  try {
    await connectDB();
    const order = await Order.findOne({
      orderNumber: orderNumber.trim(),
      "shippingAddress.phone": phone.trim(),
    }).lean();
    return order ? serialize(order) : null;
  } catch (err) {
    console.error("findOrderForTracking failed:", err);
    return null;
  }
}

export interface AdminDashboardOrderStats {
  todayOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  recentOrders: {
    _id: string;
    orderNumber: string;
    shippingAddress: { fullName: string; phone: string };
    totalAmount: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
  }[];
}

export async function getAdminDashboardOrderStats(): Promise<AdminDashboardOrderStats> {
  await connectDB();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [todayOrders, pendingOrders, revenueAgg, monthlyRevenueAgg, recentOrders] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: startOfToday } }),
    Order.countDocuments({ orderStatus: { $in: ["pending", "confirmed", "processing"] } }),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber shippingAddress.fullName shippingAddress.phone totalAmount paymentStatus orderStatus createdAt")
      .lean(),
  ]);

  return serialize({
    todayOrders,
    pendingOrders,
    totalRevenue: revenueAgg[0]?.total ?? 0,
    monthlyRevenue: monthlyRevenueAgg[0]?.total ?? 0,
    recentOrders,
  });
}
