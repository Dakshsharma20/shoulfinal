"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn, Crown, Sparkles, ArrowUpRight, MessageCircle, Minus, Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { buildProductOrderLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";
import AddToCartButton from "@/components/AddToCartButton";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const settings = useSettings();
  const [zoomed, setZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setZoomed(false);
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (product) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      // Move focus into the dialog for keyboard and screen-reader users.
      closeButtonRef.current?.focus();
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  const badge = product?.bestseller
    ? { label: "Bestseller", icon: Crown }
    : product?.newArrival
      ? { label: "New Arrival", icon: Sparkles }
      : null;
  const mainImage = product?.images?.[0]?.url;
  const categoryName = product?.category?.name ?? "";

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-view-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-[2rem] bg-cream shadow-lift md:grid-cols-2"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="btn-premium absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className="relative aspect-square cursor-zoom-in overflow-hidden bg-cream-alt md:aspect-auto"
              onClick={() => setZoomed((z) => !z)}
            >
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={`${product.title} — handmade ${categoryName.toLowerCase()} by Soul Hues`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={`object-cover transition-transform duration-500 ${
                    zoomed ? "scale-150" : "scale-100"
                  }`}
                />
              )}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] text-ink">
                <ZoomIn className="h-3 w-3" aria-hidden="true" />
                {zoomed ? "Click to reset" : "Click to zoom"}
              </div>
              {badge && (
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-sage-dark/95 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-cream shadow-soft">
                  <badge.icon className="h-3 w-3" aria-hidden="true" />
                  {badge.label}
                </div>
              )}
            </div>

            <div className="flex flex-col p-7 md:p-8">
              <p className="eyebrow text-sage-dark">{categoryName}</p>
              <h3
                id="quick-view-title"
                className="mt-2 font-serif text-2xl tracking-tight text-ink md:text-3xl"
              >
                {product.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ink-light">
                {product.shortDescription}
              </p>

              <dl className="mt-5 space-y-2 border-y border-line py-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-light">Material</dt>
                  <dd className="text-right font-medium text-ink">
                    {product.material}
                  </dd>
                </div>
                {product.color && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-light">Colour</dt>
                    <dd className="text-right font-medium text-ink">
                      {product.color}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-light">Care</dt>
                  <dd className="max-w-[60%] text-right font-medium text-ink">
                    {product.careInstructions}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex items-center justify-between">
                <span className="font-serif text-2xl text-ink">
                  {formatPrice(product.price)}
                </span>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="link-underline inline-flex items-center gap-1 font-sans text-xs font-medium text-ink-light hover:text-ink"
                >
                  Full details <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center rounded-full border border-line">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center text-ink-light hover:text-ink"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center font-sans text-sm text-ink" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center text-ink-light hover:text-ink"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <AddToCartButton
                  item={{
                    productId: product._id,
                    slug: product.slug,
                    title: product.title,
                    image: mainImage ?? "",
                    price: product.price,
                    categoryName,
                    inStock: product.inStock,
                  }}
                  quantity={quantity}
                  size="md"
                />
                <a
                  href={buildProductOrderLink(settings.whatsappNumber, settings.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Order ${product.title} on WhatsApp`}
                  title="Order on WhatsApp"
                  className="btn-premium flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-sage-dark text-sage-dark transition-colors hover:bg-sage-dark hover:text-cream"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
