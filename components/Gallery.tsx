"use client";

import Image from "next/image";
import { Instagram, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useSettings } from "@/lib/settings-context";

const IMAGES = [
  { src: "/images/real/necklace-reversible-1.jpg", tall: true },
  { src: "/images/real/earrings-tiger-eye.jpg", tall: false },
  { src: "/images/real/necklace-reversible-2.jpg", tall: false },
  { src: "/images/real/earrings-jelly-star.jpg", tall: true },
  { src: "/images/real/earrings-blossom-boom.jpg", tall: false },
  { src: "/images/real/necklace-reversible-3.jpg", tall: false },
  { src: "/images/real/earrings-tiger-eye.jpg", tall: true },
  { src: "/images/real/necklace-reversible-2.jpg", tall: false },
];

export default function Gallery() {
  const settings = useSettings();
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 lg:py-28">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Instagram Gallery"
          title={`Straight From ${settings.instagramHandle}`}
          description="Real pieces, styled by real customers — tag us to be featured here."
          align="left"
          className="md:mx-0"
        />
        <a
          href={settings.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-sage/30 bg-white px-6 py-3 font-sans text-sm font-medium text-ink shadow-soft hover:border-sage-dark"
        >
          <Instagram className="h-4 w-4 text-sage-dark" aria-hidden="true" />
          {settings.instagramHandle}
        </a>
      </div>

      <div className="mt-14 columns-2 gap-4 sm:columns-3 md:columns-4">
        {IMAGES.map((img, i) => (
          <RevealOnScroll
            key={`${img.src}-${i}`}
            delay={(i % 4) * 0.08}
            effect="scale"
            className="mb-4 break-inside-avoid"
          >
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View Soul Hues on Instagram — post ${i + 1}`}
              className="group relative block overflow-hidden rounded-[22px]"
            >
              <div
                className={`relative w-full ${
                  img.tall ? "aspect-[3/4]" : "aspect-square"
                }`}
              >
                <Image
                  src={img.src}
                  alt={`Soul Hues Instagram post placeholder ${i + 1} — replace with a real post image`}
                  fill
                  sizes="(min-width: 768px) 22vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-500 group-hover:bg-ink/40">
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-6 w-6 text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
              </div>
            </a>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
