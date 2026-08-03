"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartPageContent() {
  const {
    items,
    itemCount,
    subtotal,
    shippingCharge,
    tax,
    total,
    isHydrated,
    updateQuantity,
    removeItem,
  } = useCart();

  // Avoid a flash of "empty cart" before localStorage has been read.
  if (!isHydrated) {
    return <div className="mx-auto max-w-6xl px-6 py-24 md:px-10" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center md:px-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage/10 text-sage-dark">
          <ShoppingBag className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-serif text-3xl tracking-tight text-ink">Your bag is empty</h1>
        <p className="mt-2 font-sans text-sm text-ink-light">
          Explore the collection and add a piece you love.
        </p>
        <Link
          href="/products"
          className="btn-premium mt-8 inline-flex items-center gap-2 rounded-full bg-sage-dark px-8 py-3.5 font-sans text-sm font-medium text-cream shadow-lift"
        >
          Explore Collection <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      <div className="flex items-baseline justify-between">
        <h1 className="font-serif text-3xl tracking-tight text-ink md:text-4xl">Your Bag</h1>
        <span className="font-sans text-sm text-ink-light">
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-6">
          {items.map((item, i) => (
            <motion.li
              key={item.productId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex gap-4 rounded-[22px] bg-white p-4 shadow-soft sm:gap-6 sm:p-5"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-cream-alt sm:h-28 sm:w-28"
              >
                {item.image && (
                  <Image src={item.image} alt="" fill sizes="112px" className="object-cover" />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-light">
                    {item.categoryName}
                  </p>
                  <Link
                    href={`/products/${item.slug}`}
                    className="mt-1 block font-serif text-lg text-ink hover:text-sage-dark"
                  >
                    {item.title}
                  </Link>
                  {!item.inStock && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      Currently out of stock
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.title}`}
                      className="flex h-9 w-9 items-center justify-center text-ink-light hover:text-ink"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center font-sans text-sm text-ink" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.title}`}
                      className="flex h-9 w-9 items-center justify-center text-ink-light hover:text-ink"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-serif text-lg text-ink">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.title} from cart`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-light hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        <aside className="h-fit rounded-[22px] bg-white p-6 shadow-soft md:p-8">
          <h2 className="font-serif text-xl tracking-tight text-ink">Order Summary</h2>
          <div className="mt-5 space-y-3 border-b border-line pb-5 font-sans text-sm">
            <div className="flex justify-between text-ink-light">
              <span>Subtotal</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-light">
              <span>Shipping</span>
              <span className="text-ink">
                {shippingCharge === 0 ? "Free" : formatPrice(shippingCharge)}
              </span>
            </div>
            <div className="flex justify-between text-ink-light">
              <span>Tax</span>
              <span className="text-ink">{tax === 0 ? "\u2014" : formatPrice(tax)}</span>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="font-sans text-sm font-medium text-ink">Total</span>
            <span className="font-serif text-2xl text-ink">{formatPrice(total)}</span>
          </div>

          {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
            <p className="mt-4 rounded-xl bg-sage/10 px-4 py-3 text-xs text-sage-dark">
              Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
            </p>
          )}

          <Link
            href="/checkout"
            className="btn-premium mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-sage-dark px-6 py-3.5 font-sans text-sm font-medium text-cream shadow-lift"
          >
            Proceed to Checkout <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/products"
            className="mt-3 flex w-full items-center justify-center gap-1.5 font-sans text-sm text-ink-light hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
