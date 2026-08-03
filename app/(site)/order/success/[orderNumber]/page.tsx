import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, PackageSearch } from "lucide-react";
import { getPublicOrderSummary } from "@/lib/data/orders";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getPublicOrderSummary(orderNumber);

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 pt-32 md:px-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage/10 text-sage-dark">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-balance font-serif text-3xl tracking-tight text-ink md:text-4xl">
          Thank you, {order.shippingAddress.fullName.split(" ")[0]}!
        </h1>
        <p className="mt-2 font-sans text-sm text-ink-light">
          Your order has been placed successfully.
        </p>
        <p className="mt-4 rounded-full bg-cream-alt px-5 py-2 font-sans text-sm text-ink">
          Order Number: <span className="font-medium">{order.orderNumber}</span>
        </p>
      </div>

      <div className="mt-12 rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg tracking-tight text-ink">Order Summary</h2>
        <ul className="mt-5 divide-y divide-line">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-4 py-3.5">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-cream-alt">
                {item.image && (
                  <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-sm text-ink">{item.title}</p>
                <p className="text-xs text-ink-light">Qty {item.quantity}</p>
              </div>
              <span className="font-sans text-sm text-ink">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-2 border-t border-line pt-5 font-sans text-sm">
          <div className="flex justify-between text-ink-light">
            <span>Subtotal</span>
            <span className="text-ink">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-light">
            <span>Shipping</span>
            <span className="text-ink">
              {order.shippingCharge === 0 ? "Free" : formatPrice(order.shippingCharge)}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-ink">Total</span>
            <span className="font-serif text-lg text-ink">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <div className="mt-5 border-t border-line pt-5 font-sans text-sm text-ink-light">
          <p className="font-medium text-ink">Shipping to</p>
          <p className="mt-1">
            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state} {order.shippingAddress.pinCode},{" "}
            {order.shippingAddress.country}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/track-order"
          className="btn-premium inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 font-sans text-sm font-medium text-ink hover:bg-ink hover:text-cream"
        >
          <PackageSearch className="h-4 w-4" aria-hidden="true" />
          Track Your Order
        </Link>
        <Link
          href="/products"
          className="btn-premium inline-flex items-center gap-2 rounded-full bg-sage-dark px-6 py-3 font-sans text-sm font-medium text-cream shadow-lift"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
