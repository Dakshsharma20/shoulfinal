import { Star, Quote } from "lucide-react";
import testimonialsData from "@/data/testimonials.json";
import { Testimonial } from "@/lib/types";
import SectionHeading from "@/components/SectionHeading";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function Testimonials() {
  const testimonials = testimonialsData as Testimonial[];
  return (
    <section className="bg-ink py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="Kind Words"
          title="Loved, One Piece at a Time"
          className="[&_h2]:text-cream [&_p]:text-cream/70"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <RevealOnScroll key={t.name} delay={i * 0.08}>
              <div className="glass-dark relative h-full rounded-[22px] border border-transparent p-8 transition-all duration-500 hover:-translate-y-1 hover:border-sage-accent/30">
                <Quote className="h-7 w-7 text-sage-accent/60" aria-hidden="true" />
                <p className="mt-4 font-serif text-lg italic leading-relaxed text-cream/90">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="font-sans text-sm font-medium text-cream">
                      {t.name}
                    </p>
                    <p className="font-sans text-xs text-cream/60">
                      {t.location}
                    </p>
                  </div>
                  <div
                    role="img"
                    aria-label={`Rated ${t.rating} out of 5 stars`}
                    className="flex gap-0.5"
                  >
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        aria-hidden="true"
                        className="h-3.5 w-3.5 fill-sage-accent text-sage-accent"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
