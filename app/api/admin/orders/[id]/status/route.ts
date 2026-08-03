import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { updateOrderStatusSchema } from "@/lib/validations/checkout";
import { sendShippingNotificationEmail, sendDeliveryNotificationEmail } from "@/lib/email/orderEmails";

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

  const parsed = updateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid status." },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    order.orderStatus = parsed.data.status;
    order.statusHistory.push({
      status: parsed.data.status,
      note: parsed.data.note,
      changedAt: new Date(),
    });

    // Fire the relevant transactional email automatically as the status
    // reaches "shipped" or "delivered" — a courtesy notification, sent at
    // most once per order (tracked via emailsSent) even if the admin
    // toggles status back and forth.
    const emailData = {
      orderNumber: order.orderNumber,
      customerName: order.shippingAddress.fullName,
      customerEmail: order.shippingAddress.email,
      items: order.items.map((i) => ({ title: i.title, price: i.price, quantity: i.quantity })),
      subtotal: order.subtotal,
      shippingCharge: order.shippingCharge,
      tax: order.tax,
      totalAmount: order.totalAmount,
      courierName: order.courierName,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
    };

    if (parsed.data.status === "shipped" && !order.emailsSent.shippingNotification) {
      const result = await sendShippingNotificationEmail(emailData);
      if (result.sent) order.emailsSent.shippingNotification = true;
    }
    if (parsed.data.status === "delivered" && !order.emailsSent.deliveryNotification) {
      const result = await sendDeliveryNotificationEmail(emailData);
      if (result.sent) order.emailsSent.deliveryNotification = true;
    }

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error(`PATCH /api/admin/orders/${id}/status failed:`, err);
    return NextResponse.json({ success: false, error: "Failed to update order status." }, { status: 500 });
  }
}
