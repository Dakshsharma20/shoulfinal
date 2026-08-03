"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { WhatsAppLinkButton } from "@/components/WhatsAppButton";
import { buildProductOrderLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/lib/types";

export default function ProductOrderButton({ product }: { product: Product }) {
  const settings = useSettings();
  const [quantity, setQuantity] = useState(1);
  const mainImage = product.images?.[0]?.url ?? "";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-line">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="flex h-11 w-11 items-center justify-center text-ink-light hover:text-ink"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-sans text-sm text-ink" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            aria-label="Increase quantity"
            className="flex h-11 w-11 items-center justify-center text-ink-light hover:text-ink"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <AddToCartButton
          item={{
            productId: product._id,
            slug: product.slug,
            title: product.title,
            image: mainImage,
            price: product.price,
            categoryName: product.category?.name ?? "",
            inStock: product.inStock,
          }}
          quantity={quantity}
          size="lg"
          fullWidth={false}
          className="flex-1"
        />
      </div>

      <WhatsAppLinkButton
        href={buildProductOrderLink(settings.whatsappNumber, settings.whatsappMessage)}
        variant="outline"
        size="lg"
        className="w-full sm:w-auto"
      >
        Or Order Directly on WhatsApp
      </WhatsAppLinkButton>
    </div>
  );
}
