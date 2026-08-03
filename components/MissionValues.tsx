import { Target, Eye, Gem, HeartHandshake } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import RevealOnScroll from "@/components/RevealOnScroll";

const PILLARS = [
  {
    icon: Target,
    title: "Mission",
    text: "To make thoughtfully handcrafted jewellery accessible, one small studio at a time — without cutting the corners that machines cut for us.",
  },
  {
    icon: Eye,
    title: "Vision",
    text: "A world where the pieces closest to your skin were touched by a real person who cared how they turned out.",
  },
  {
    icon: Gem,
    title: "Craftsmanship",
    text: "Every curve, clasp, and finish is shaped and checked by hand — never rushed through a production line.",
  },
  {
    icon: HeartHandshake,
    title: "Values",
    text: "Honesty in materials, fairness in pricing, and warmth in every WhatsApp conversation we have with you.",
  },
];

export default function MissionValues() {
  return (
    <section className="bg-cream-alt/60 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="What We Stand For"
          title="Mission, Vision & Values"
        />
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 0.07}>
              <div className="group h-full rounded-[22px] bg-white p-8 text-center shadow-soft transition-all duration-500 ease-out hover:-translate-y-1.5">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage/10 text-ink transition-all duration-500 ease-out group-hover:-rotate-6 group-hover:bg-sage-dark group-hover:text-cream">
                  <p.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-serif text-xl tracking-tight text-ink">
                  {p.title}
                </h3>
                <p className="mt-2.5 font-sans text-sm leading-relaxed text-ink-light">
                  {p.text}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
