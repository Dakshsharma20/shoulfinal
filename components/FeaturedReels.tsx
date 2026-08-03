"use client";

import Image from "next/image";
import { Play, Instagram } from "lucide-react";
import reelsData from "@/data/reels.json";
import { Reel } from "@/lib/types";
import SectionHeading from "@/components/SectionHeading";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useSettings } from "@/lib/settings-context";

export default function FeaturedReels() {
  const settings = useSettings();
  const reels = reelsData as Reel[];

  return (
    <section className="bg-cream-alt/60 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Featured Reels"
          title="Our Creations in Motion"
          description="Watch the making, styling, and unboxing on Instagram."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {reels.map((reel, i) => (
            <RevealOnScroll key={reel.id} delay={i * 0.08} effect="fade-up">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch "${reel.title}" on Instagram`}
                className="group relative block overflow-hidden rounded-[22px] shadow-soft transition-shadow duration-500 hover:shadow-lift"
              >
                <div className="relative aspect-[9/16] w-full">
                  <Image
                    src={reel.thumbnail}
                    alt={`${reel.title} — Reel placeholder, replace with a real Instagram Reel cover`}
                    fill
                    sizes="(min-width: 1024px) 23vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
                  />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/90 shadow-lift backdrop-blur transition-transform duration-500 ease-out group-hover:scale-110">
                      <Play
                        className="ml-0.5 h-5 w-5 fill-ink text-ink"
                        aria-hidden="true"
                      />
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-serif text-base leading-tight text-cream">
                      {reel.title}
                    </p>
                    <p className="mt-1 line-clamp-1 font-sans text-xs text-cream/70">
                      {reel.caption}
                    </p>
                  </div>
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream/85">
                    <Instagram className="h-3.5 w-3.5 text-ink" aria-hidden="true" />
                  </div>
                </div>
              </a>
            </RevealOnScroll>
          ))}
        </div>

        <p className="mt-8 text-center font-sans text-sm text-ink-light">
          More reels on{" "}
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-medium text-ink"
          >
            {settings.instagramHandle}
          </a>
        </p>
      </div>
    </section>
  );
}
