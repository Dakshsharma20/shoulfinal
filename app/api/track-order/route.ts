import { NextRequest, NextResponse } from "next/server";
import { trackOrderSchema } from "@/lib/validations/checkout";
import { findOrderForTracking } from "@/lib/data/orders";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = trackOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const order = await findOrderForTracking(parsed.data.orderNumber, parsed.data.phone);

  if (!order) {
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't find an order matching that order number and phone number.",
      },
      { status: 404 }
    );
  }

  // Public-safe subset only — no Razorpay IDs/signature.
  return NextResponse.json({
    success: true,
    order: {
      orderNumber: order.orderNumber,
      items: order.items,
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      courierName: order.courierName,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    },
  });
}
