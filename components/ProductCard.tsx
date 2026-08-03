"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Crown, Sparkles, MessageCircle } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { buildProductOrderLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";
import RevealOnScroll from "@/components/RevealOnScroll";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({
  product,
  delay = 0,
  onQuickView,
}: {
  product: Product;
  delay?: number;
  onQuickView?: (product: Product) => void;
}) {
  const settings = useSettings();
  const badge = product.bestseller
    ? { label: "Bestseller", icon: Crown }
    : product.newArrival
      ? { label: "New Arrival", icon: Sparkles }
      : null;
  const mainImage = product.images?.[0]?.url;
  const categoryName = product.category?.name ?? "";

  return (
    <RevealOnScroll delay={delay} effect="fade-up" className="h-full">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-transparent bg-white shadow-soft transition-[box-shadow,border-color] duration-500 hover:border-sage/30 hover:shadow-lift"
      >
        <Link
          href={`/products/${product.slug}`}
          className="shine-hover relative block aspect-square overflow-hidden"
        >
          {mainImage && (
            <Image
              src={mainImage}
              alt={`${product.title} — handmade ${categoryName.toLowerCase()} by Soul Hues`}
              fill
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          )}
          {badge && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-sage-dark/95 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-cream shadow-soft backdrop-blur">
              <badge.icon className="h-3 w-3" aria-hidden="true" />
              {badge.label}
            </div>
          )}
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-ink opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100">
            {categoryName}
          </div>
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="absolute inset-x-4 bottom-3 flex translate-y-4 items-center justify-center gap-2 rounded-full bg-ink/95 py-2.5 text-xs font-medium uppercase tracking-wider text-cream opacity-0 backdrop-blur transition-all duration-[400ms] group-hover:translate-y-0 group-hover:opacity-100"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Quick View
            </button>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-5">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-serif text-lg tracking-tight text-ink transition-colors hover:text-sage-dark">
              {product.title}
            </h3>
          </Link>
          <p className="mt-1.5 flex-1 font-sans text-sm leading-relaxed text-ink-light">
            {product.shortDescription}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-serif text-xl text-ink">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2">
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
              size="sm"
            />
            <a
              href={buildProductOrderLink(settings.whatsappNumber, settings.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Order ${product.title} on WhatsApp`}
              title="Order on WhatsApp"
              className="btn-premium flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-sage-dark text-sage-dark transition-colors hover:bg-sage-dark hover:text-cream"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.div>
    </RevealOnScroll>
  );
}
