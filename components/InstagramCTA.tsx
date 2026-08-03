"use client";

import Image from "next/image";
import { Instagram } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useSettings } from "@/lib/settings-context";

const PREVIEW_IMAGES = [
  "/images/real/necklace-reversible-1.jpg",
  "/images/real/earrings-tiger-eye.jpg",
  "/images/real/necklace-reversible-2.jpg",
  "/images/real/earrings-jelly-star.jpg",
  "/images/real/earrings-blossom-boom.jpg",
  "/images/real/necklace-reversible-3.jpg",
];

export default function InstagramCTA() {
  const settings = useSettings();
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:px-10 lg:py-28">
      <RevealOnScroll effect="scale">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-sage/20 bg-white px-8 py-14 text-center shadow-soft md:px-14 md:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sage/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-sage-accent/20 blur-3xl"
          />

          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-dark text-cream shadow-sage">
            <Instagram className="h-6 w-6" aria-hidden="true" />
          </div>

          <h2 className="relative mt-6 text-balance font-serif text-[clamp(1.85rem,4.2vw,2.75rem)] font-medium leading-[1.15] tracking-tight text-ink">
            Follow Us on Instagram
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-balance font-sans text-base leading-relaxed text-ink-light">
            New pieces, studio moments, and styling ideas — posted first on{" "}
            <span className="font-medium text-ink">{settings.instagramHandle}</span>.
          </p>

          <div className="relative mx-auto mt-9 grid max-w-md grid-cols-6 gap-2 sm:gap-3">
            {PREVIEW_IMAGES.map((src, i) => (
              <a
                key={src}
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Soul Hues on Instagram, preview ${i + 1}`}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </a>
            ))}
          </div>

          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium relative mt-9 inline-flex items-center gap-2 rounded-full bg-sage-dark px-8 py-4 font-sans text-sm font-medium tracking-wide text-cream shadow-lift"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            Follow on Instagram
          </a>
        </div>
      </RevealOnScroll>
    </section>
  );
}
