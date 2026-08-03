"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function MiniCart() {
  const {
    items,
    itemCount,
    subtotal,
    isMiniCartOpen,
    closeMiniCart,
    updateQuantity,
    removeItem,
  } = useCart();

  return (
    <AnimatePresence>
      {isMiniCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMiniCart}
            className="fixed inset-0 z-[70] bg-ink/50"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-sm flex-col bg-cream shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="flex items-center gap-2 font-serif text-lg tracking-tight text-ink">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Your Bag {itemCount > 0 && `(${itemCount})`}
              </h2>
              <button
                type="button"
                onClick={closeMiniCart}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-light hover:bg-cream-alt hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag className="h-8 w-8 text-ink-light" aria-hidden="true" />
                <p className="font-sans text-sm text-ink-light">Your bag is empty.</p>
                <Link
                  href="/products"
                  onClick={closeMiniCart}
                  className="link-underline font-sans text-sm font-medium text-sage-dark"
                >
                  Explore the collection
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="space-y-5">
                    {items.map((item) => (
                      <li key={item.productId} className="flex gap-3">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeMiniCart}
                          className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-cream-alt"
                        >
                          {item.image && (
                            <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                          )}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeMiniCart}
                            className="truncate font-sans text-sm font-medium text-ink hover:text-sage-dark"
                          >
                            {item.title}
                          </Link>
                          <p className="mt-0.5 text-xs text-ink-light">{formatPrice(item.price)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center rounded-full border border-line">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                aria-label={`Decrease quantity of ${item.title}`}
                                className="flex h-7 w-7 items-center justify-center text-ink-light hover:text-ink"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center text-xs text-ink">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                aria-label={`Increase quantity of ${item.title}`}
                                className="flex h-7 w-7 items-center justify-center text-ink-light hover:text-ink"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              aria-label={`Remove ${item.title} from cart`}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-light hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <span className="font-sans text-sm font-medium text-ink">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-line px-6 py-5">
                  <div className="flex items-center justify-between font-sans text-sm text-ink-light">
                    <span>Subtotal</span>
                    <span className="font-serif text-lg text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-light">
                    Shipping and tax calculated at checkout.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Link
                      href="/cart"
                      onClick={closeMiniCart}
                      className="btn-premium rounded-full border border-ink px-5 py-3 text-center font-sans text-sm font-medium text-ink hover:bg-ink hover:text-cream"
                    >
                      View Bag
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeMiniCart}
                      className="btn-premium rounded-full bg-sage-dark px-5 py-3 text-center font-sans text-sm font-medium text-cream shadow-lift"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
