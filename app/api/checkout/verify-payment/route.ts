import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Order from "@/models/Order";
import { verifyPaymentSchema } from "@/lib/validations/checkout";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { sendOrderConfirmationEmail, sendPaymentConfirmationEmail } from "@/lib/email/orderEmails";
import { notifyStoreOfNewOrder } from "@/lib/whatsapp-notify";
import { getOrCreateSettings } from "@/lib/data/getOrCreateSettings";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = verifyPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid payment data." },
      { status: 400 }
    );
  }

  const {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
    orderNumber,
  } = parsed.data;

  try {
    await connectDB();

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }
    if (order.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json(
        { success: false, error: "Order/payment mismatch." },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      order.paymentStatus = "failed";
      await order.save();
      return NextResponse.json(
        { success: false, error: "Payment verification failed. Please try again." },
        { status: 402 }
      );
    }

    // Signature is valid — this payment is genuinely from Razorpay for
    // this exact order, not something a client could have faked.
    order.paymentStatus = "paid";
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.orderStatus = "confirmed";
    order.statusHistory.push({ status: "confirmed", changedAt: new Date() });
    await order.save();

    // Best-effort side effects — a slow email/WhatsApp provider should
    // never block the customer from seeing their payment succeeded.
    const emailData = {
      orderNumber: order.orderNumber,
      customerName: order.shippingAddress.fullName,
      customerEmail: order.shippingAddress.email,
      items: order.items.map((i) => ({ title: i.title, price: i.price, quantity: i.quantity })),
      subtotal: order.subtotal,
      shippingCharge: order.shippingCharge,
      tax: order.tax,
      totalAmount: order.totalAmount,
    };

    Promise.allSettled([
      sendOrderConfirmationEmail(emailData).then((r) => {
        if (r.sent) {
          order.emailsSent.orderConfirmation = true;
        }
      }),
      sendPaymentConfirmationEmail(emailData).then((r) => {
        if (r.sent) {
          order.emailsSent.paymentConfirmation = true;
        }
      }),
      getOrCreateSettings().then((settings) =>
        notifyStoreOfNewOrder(
          {
            orderNumber: order.orderNumber,
            customerName: order.shippingAddress.fullName,
            customerPhone: order.shippingAddress.phone,
            totalAmount: order.totalAmount,
            items: order.items.map((i) => ({ title: i.title, quantity: i.quantity })),
          },
          settings.whatsappNumber
        ).then((r) => {
          if (r.sent) order.whatsappNotified = true;
        })
      ),
    ]).then(() => order.save().catch((err) => console.error("Failed to save notification flags:", err)));

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (err) {
    console.error("POST /api/checkout/verify-payment failed:", err);
    return NextResponse.json(
      { success: false, error: "Couldn't verify payment. Please contact us with your order number." },
      { status: 500 }
    );
  }
}
