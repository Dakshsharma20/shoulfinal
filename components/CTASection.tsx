"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import { WhatsAppLinkButton } from "@/components/WhatsAppButton";
import { buildGeneralInquiryLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";

export default function CTASection() {
  const settings = useSettings();
  return (
    <section className="relative overflow-hidden py-24 lg:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
        <RevealOnScroll effect="scale">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-sage/25 bg-gradient-to-br from-cream-alt to-cream-deep px-8 py-16 shadow-soft md:px-16 md:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sage/10 blur-3xl"
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto flex h-12 w-12 items-center justify-center"
            >
              <Sparkles className="h-6 w-6 text-sage-dark" aria-hidden="true" />
            </motion.div>
            <h2 className="text-balance font-serif text-[clamp(1.85rem,4.5vw,3rem)] font-medium leading-[1.15] tracking-tight text-ink">
              Ready to Own a<br className="hidden sm:block" /> Handcrafted
              Masterpiece?
            </h2>
            <p className="mx-auto mt-5 max-w-md text-balance font-sans text-base leading-relaxed text-ink-light">
              Order directly on WhatsApp and Shivani will personally guide
              you through sizing, customisation, and delivery.
            </p>
            <div className="mt-10">
              <WhatsAppLinkButton
                href={buildGeneralInquiryLink(settings.whatsappNumber, settings.whatsappMessage)}
                size="lg"
                className="shine-hover"
              >
                Order on WhatsApp
              </WhatsAppLinkButton>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
