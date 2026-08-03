import Image from "next/image";
import { Sparkles } from "lucide-react";
import CornerFrame from "@/components/CornerFrame";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function FounderSection() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 md:grid-cols-2 md:gap-14 md:px-10 lg:py-28">
      <RevealOnScroll effect="slide-right" className="order-2 md:order-1">
        <div className="eyebrow mb-5 flex items-center gap-2 text-sage-dark">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Our Story
        </div>
        <h1 className="text-balance font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.1] tracking-tight text-ink">
          Meet Shivani
        </h1>
        <div className="mt-7 space-y-5 font-sans text-base leading-relaxed text-ink-light">
          <p>
            Soul Hues began at a small table with a handful of beads, some
            thread, and a habit Shivani couldn&rsquo;t shake &mdash; making
            things with her hands. What started as gifts for friends slowly
            turned into orders from strangers on Instagram, and eventually,
            into a studio of her own.
          </p>
          <p>
            Every Soul Hues piece is still made the way the very first one
            was: one at a time, checked by eye, finished by hand. No
            factories, no mass runs &mdash; just a founder who believes
            jewellery should feel personal, not produced.
          </p>
          <p>
            Today, Soul Hues is worn by hundreds of customers across the
            country, but the process hasn&rsquo;t changed. Shivani still
            packs many of the orders herself, and still reads every message
            that comes in on WhatsApp.
          </p>
        </div>
        <p className="mt-9 font-script text-3xl text-sage-dark">Shivani</p>
      </RevealOnScroll>

      <RevealOnScroll
        effect="scale"
        className="order-1 mx-auto w-full max-w-sm md:order-2"
      >
        <CornerFrame className="shine-hover overflow-hidden rounded-[2.5rem] shadow-lift">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/images/founder-shivani.svg"
              alt="Shivani, founder of Soul Hues, in her handmade jewellery studio"
              fill
              sizes="(min-width: 768px) 380px, 90vw"
              className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            />
          </div>
        </CornerFrame>
      </RevealOnScroll>
    </section>
  );
}
