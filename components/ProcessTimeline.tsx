import { Lightbulb, PenTool, Hammer, Sparkles, Package, Truck } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import RevealOnScroll from "@/components/RevealOnScroll";

const STEPS = [
  { icon: Lightbulb, title: "Idea", text: "Every piece starts as a sketch inspired by nature, memory, or a customer's request." },
  { icon: PenTool, title: "Design", text: "The sketch is refined into a working design, with materials and proportions chosen with care." },
  { icon: Hammer, title: "Handcraft", text: "Shivani shapes, sets, and assembles each piece entirely by hand at the studio bench." },
  { icon: Sparkles, title: "Finishing", text: "Every surface is polished and checked by eye before it's approved to leave the studio." },
  { icon: Package, title: "Packaging", text: "Wrapped by hand in Soul Hues packaging, ready to feel like a gift from the first touch." },
  { icon: Truck, title: "Delivery", text: "Shipped with care and tracked over WhatsApp, right up to your doorstep." },
];

export default function ProcessTimeline() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
      <SectionHeading
        eyebrow="Our Process"
        title="From Idea to Your Hands"
        description="A real, six-step process — the same one every Soul Hues piece follows before it reaches you."
      />

      <div className="relative mt-16">
        <div
          aria-hidden="true"
          className="absolute left-6 top-0 hidden h-full w-px bg-sage/25 md:left-1/2 md:block"
        />
        <ol className="space-y-10 md:space-y-0">
          {STEPS.map((step, i) => (
            <RevealOnScroll
              key={step.title}
              as="li"
              delay={i * 0.05}
              effect={i % 2 === 0 ? "slide-right" : "slide-left"}
              className={`group relative flex items-start gap-5 md:w-1/2 md:py-6 ${
                i % 2 === 0
                  ? "md:pr-12 md:text-right"
                  : "md:ml-auto md:pl-12"
              }`}
            >
              <div
                aria-hidden="true"
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-sage/40 bg-cream text-ink shadow-soft transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-sage group-hover:bg-sage-dark group-hover:text-cream md:absolute md:top-6 ${
                  i % 2 === 0 ? "md:-right-6" : "md:-left-6"
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <div className={i % 2 === 0 ? "md:pr-2" : "md:pl-2"}>
                <p className="eyebrow text-sage-dark">Step {i + 1}</p>
                <h3 className="mt-1 font-serif text-2xl tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-sm font-sans text-sm leading-relaxed text-ink-light md:ml-auto">
                  {step.text}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </ol>
      </div>
    </section>
  );
}
