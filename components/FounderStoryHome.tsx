import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import CornerFrame from "@/components/CornerFrame";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function FounderStoryHome() {
  return (
    <section className="py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-2 md:gap-12 md:px-10">
      <RevealOnScroll
        effect="scale"
        className="order-1 mx-auto w-full max-w-sm"
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

      <RevealOnScroll effect="slide-left" className="order-2">
        <div className="eyebrow mb-5 flex items-center gap-2 text-sage-dark">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Our Story
        </div>
        <h2 className="text-balance font-serif text-[clamp(1.85rem,4.2vw,2.75rem)] font-medium leading-[1.15] tracking-tight text-ink">
          Every Piece Begins With Shivani
        </h2>
        <p className="mt-5 font-sans text-base leading-relaxed text-ink-light">
          Soul Hues started at a small table with a handful of beads and a
          habit Shivani couldn&rsquo;t shake &mdash; making things with her
          hands. Today, every piece is still shaped, checked, and packed
          the same personal way it was on day one.
        </p>
        <p className="mt-4 font-script text-2xl text-sage-dark">Shivani</p>
        <Link
          href="/about"
          className="link-underline mt-7 inline-flex items-center gap-2 font-sans text-sm font-medium text-ink"
        >
          Read the Full Story &rarr;
        </Link>
      </RevealOnScroll>
      </div>
    </section>
  );
}
