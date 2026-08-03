"use client";

import Image from "next/image";
import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/lib/types";

export default function ProductGallery({
  images,
  productTitle,
}: {
  images: ProductImage[];
  productTitle: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const active = images[activeIndex];

  return (
    <div>
      <div
        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-[22px] bg-cream-alt shadow-soft"
        onClick={() => setZoomed((z) => !z)}
      >
        {active && (
          <Image
            src={active.url}
            alt={`${productTitle} — photo ${activeIndex + 1} of ${images.length}`}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            className={cn(
              "object-cover transition-transform duration-500",
              zoomed ? "scale-150" : "scale-100"
            )}
          />
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] text-ink">
          <ZoomIn className="h-3 w-3" aria-hidden="true" />
          {zoomed ? "Click to reset" : "Click to zoom"}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img.publicId}
              type="button"
              onClick={() => {
                setActiveIndex(i);
                setZoomed(false);
              }}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition-colors",
                i === activeIndex ? "border-sage-dark" : "border-transparent hover:border-sage/40"
              )}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
