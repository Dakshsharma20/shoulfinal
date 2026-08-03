"use client";

import Image from "next/image";
import CornerFrame from "@/components/CornerFrame";
import RevealOnScroll from "@/components/RevealOnScroll";
import { WhatsAppLinkButton } from "@/components/WhatsAppButton";
import { buildGeneralInquiryLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";

export default function WhyHandmadeMatters() {
  const settings = useSettings();
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-24 md:grid-cols-2 md:gap-12 md:px-10 lg:py-28">
      <RevealOnScroll effect="scale" className="mx-auto w-full max-w-md">
        <CornerFrame className="shine-hover overflow-hidden rounded-[2.5rem] shadow-lift">
          <div className="relative aspect-[5/4] w-full">
            <Image
              src="/images/about-why-handmade.svg"
              alt="Close-up detail of handmade Soul Hues jewellery craftsmanship"
              fill
              sizes="(min-width: 768px) 420px, 90vw"
              className="object-cover transition-transform duration-700 ease-out hover:scale-105"
            />
          </div>
        </CornerFrame>
      </RevealOnScroll>

      <RevealOnScroll effect="slide-left">
        <div className="eyebrow mb-5 text-sage-dark">Why It Matters</div>
        <h2 className="text-balance font-serif text-[clamp(1.85rem,4.2vw,2.75rem)] font-medium leading-[1.15] tracking-tight text-ink">
          Why Handmade Still Matters
        </h2>
        <p className="mt-5 font-sans text-base leading-relaxed text-ink-light">
          In a world of identical, factory-pressed pieces, handmade
          jewellery carries something a machine can&rsquo;t replicate:
          intention. Every slight variation is proof a real hand shaped it
          &mdash; not a flaw, but a signature.
        </p>
        <p className="mt-4 font-sans text-base leading-relaxed text-ink-light">
          Choosing handmade also means choosing a small business over a
          supply chain. Every order directly supports one studio, one
          craftsperson, and the community of customers who&rsquo;ve grown
          with Soul Hues since the first bracelet.
        </p>
        <div className="mt-9">
          <WhatsAppLinkButton
            href={buildGeneralInquiryLink(settings.whatsappNumber, settings.whatsappMessage)}
            size="md"
            className="shine-hover"
          >
            Talk to Us on WhatsApp
          </WhatsAppLinkButton>
        </div>
      </RevealOnScroll>
    </section>
  );
}
