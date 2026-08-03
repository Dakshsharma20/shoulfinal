import { Sparkles } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-cream-alt/60 pb-20 pt-32 md:pt-40 lg:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-sage/10 blur-3xl"
      />
      <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
        <RevealOnScroll>
          <div className="eyebrow mb-5 inline-flex items-center gap-2 text-sage-dark">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> We&rsquo;d Love to Hear From You
          </div>
          <h1 className="text-balance font-serif text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[1.1] tracking-tight text-ink">
            Let&rsquo;s Talk Jewellery
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance font-sans text-base leading-relaxed text-ink-light md:text-lg">
            Questions about a piece, sizing, or a custom order? Send a
            message below or reach us directly on WhatsApp or Instagram.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
