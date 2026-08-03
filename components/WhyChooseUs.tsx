import { Heart, Gem, Sparkles, UserRound, Palette, Zap } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import RevealOnScroll from "@/components/RevealOnScroll";

const FEATURES = [
  {
    icon: Heart,
    title: "Handmade with Love",
    text: "Every piece passes through Shivani's hands before it reaches yours.",
  },
  {
    icon: Gem,
    title: "Premium Materials",
    text: "Considered materials chosen to look beautiful and last, wear after wear.",
  },
  {
    icon: Sparkles,
    title: "Unique Designs",
    text: "Small-batch pieces designed to feel special, never mass-produced.",
  },
  {
    icon: UserRound,
    title: "Made by Founder Shivani",
    text: "A one-woman studio, so every order gets a personal touch.",
  },
  {
    icon: Palette,
    title: "Customisation Available",
    text: "Adjust length, colour or finish to make a piece truly yours.",
  },
  {
    icon: Zap,
    title: "Fast Response",
    text: "Message us on WhatsApp and hear back the same day, most days.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 lg:py-28">
      <SectionHeading
        eyebrow="Why Soul Hues"
        title="Why Choose Soul Hues"
        description="A boutique studio built on care, not volume."
      />

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <RevealOnScroll key={f.title} delay={i * 0.06}>
            <div className="group h-full rounded-[22px] border border-sage/15 bg-white/60 p-8 shadow-none transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-sage/40 hover:bg-white hover:shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/10 text-ink transition-all duration-500 ease-out group-hover:-rotate-6 group-hover:bg-sage-dark group-hover:text-cream">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-serif text-xl tracking-tight text-ink">
                {f.title}
              </h3>
              <p className="mt-2.5 font-sans text-sm leading-relaxed text-ink-light">
                {f.text}
              </p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
