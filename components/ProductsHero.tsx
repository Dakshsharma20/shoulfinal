import { Sparkles } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function ProductsHero() {
  return (
    <section className="relative overflow-hidden bg-cream-alt/60 pb-20 pt-32 md:pt-40 lg:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-sage/10 blur-3xl"
      />
      <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
        <RevealOnScroll>
          <div className="eyebrow mb-5 inline-flex items-center gap-2 text-sage-dark">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> The Full Collection
          </div>
          <h1 className="text-balance font-serif text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.1] tracking-tight text-ink">
            Shop Handcrafted Jewellery
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance font-sans text-base leading-relaxed text-ink-light md:text-lg">
            Browse every piece Shivani has made by hand. Filter by category,
            search by name, and tap any piece to view it up close before
            ordering on WhatsApp.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
