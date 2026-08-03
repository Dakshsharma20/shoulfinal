import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { createOrderSchema } from "@/lib/validations/checkout";
import { generateOrderNumber } from "@/lib/generateOrderNumber";
import { getRazorpay, assertRazorpayConfigured } from "@/lib/razorpay";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING_RATE, TAX_RATE } from "@/lib/cart-context";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid checkout data." },
      { status: 400 }
    );
  }

  try {
    assertRazorpayConfigured();
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }

  const { shippingAddress, items } = parsed.data;

  try {
    await connectDB();

    // Re-fetch every product from MongoDB and rebuild the order server-side.
    // Prices, titles, images, and stock status are NEVER trusted from the
    // client — this is what stops someone from tampering with the cart in
    // devtools to pay less than the real price.
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds }, isVisible: true }).lean();
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const orderItems: {
      product: string;
      title: string;
      image: string;
      price: number;
      quantity: number;
    }[] = [];
    const unavailable: string[] = [];

    for (const cartItem of items) {
      const product = productMap.get(cartItem.productId);
      if (!product) {
        unavailable.push(cartItem.productId);
        continue;
      }
      if (!product.inStock) {
        unavailable.push(product.title);
        continue;
      }
      orderItems.push({
        product: String(product._id),
        title: product.title,
        image: product.images?.[0]?.url ?? "",
        price: product.price,
        quantity: cartItem.quantity,
      });
    }

    if (unavailable.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Some items are no longer available: ${unavailable.join(", ")}. Please update your cart.`,
        },
        { status: 409 }
      );
    }

    if (orderItems.length === 0) {
      return NextResponse.json({ success: false, error: "Your cart is empty." }, { status: 400 });
    }

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
    const tax = Math.round(subtotal * TAX_RATE);
    const totalAmount = subtotal + shippingCharge + tax;

    const orderNumber = await generateOrderNumber();

    const { orderNotes, ...addressFields } = shippingAddress;

    // Razorpay amounts are in the smallest currency unit (paise for INR).
    const razorpay = getRazorpay();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: orderNumber,
      notes: { orderNumber },
    });

    const order = await Order.create({
      orderNumber,
      items: orderItems,
      shippingAddress: addressFields,
      orderNotes: orderNotes || undefined,
      subtotal,
      shippingCharge,
      tax,
      totalAmount,
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      razorpayOrderId: razorpayOrder.id,
      orderStatus: "pending",
      statusHistory: [{ status: "pending", changedAt: new Date() }],
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    console.error("POST /api/checkout/create-order failed:", err);
    return NextResponse.json(
      { success: false, error: "Couldn't start checkout. Please try again." },
      { status: 500 }
    );
  }
}
