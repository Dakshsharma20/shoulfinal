"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { WhatsAppLinkButton } from "@/components/WhatsAppButton";
import { buildGeneralInquiryLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";
import CornerFrame from "@/components/CornerFrame";

const STATS = [
  { value: "100%", label: "Handmade" },
  { value: "500+", label: "Happy Customers" },
  { value: "6", label: "Collections" },
];

export default function Hero() {
  const settings = useSettings();
  const heroImage = settings.heroBanner?.url || "/images/real/necklace-reversible-hero.jpg";
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-cream pb-24 pt-32 md:pb-32 md:pt-44"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-sage/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-sage/5 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-12 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="eyebrow mb-7 inline-flex items-center gap-2 text-sage-dark">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Instagram&rsquo;s handcrafted jewellery studio
          </div>
          <h1 className="text-balance font-serif text-[clamp(2.75rem,6vw,4.75rem)] font-medium leading-[1.06] tracking-tight text-ink">
            Handcrafted Jewellery
            <br />
            That Reflects{" "}
            <span className="italic text-sage-dark">Your Soul</span>
          </h1>
          <p className="mt-7 max-w-md text-balance font-sans text-base leading-relaxed text-ink-light md:text-lg">
            Timeless handmade jewellery crafted with love and elegance.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/products"
                className="shine-hover btn-premium group inline-flex items-center gap-2 rounded-full bg-sage-dark px-8 py-4 font-sans text-sm font-medium tracking-wide text-cream shadow-lift"
              >
                Explore Collection
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </motion.div>
            <WhatsAppLinkButton
              href={buildGeneralInquiryLink(settings.whatsappNumber, settings.whatsappMessage)}
              variant="outline"
              size="lg"
            >
              Order on WhatsApp
            </WhatsAppLinkButton>
          </div>

          <div className="mt-14 flex items-center gap-8 border-t border-line pt-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={i > 0 ? "border-l border-line pl-8" : ""}
              >
                <p className="font-serif text-3xl text-ink">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-ink-light">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ y, opacity }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <CornerFrame className="shine-hover overflow-hidden rounded-[2.5rem] shadow-lift">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={heroImage}
                alt="Handcrafted Soul Hues reversible beaded necklace, laid flat on a soft backdrop"
                fill
                priority
                sizes="(min-width: 768px) 420px, 90vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>
          </CornerFrame>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute -bottom-6 -left-6 hidden animate-float rounded-[22px] bg-white/90 px-5 py-4 shadow-soft backdrop-blur sm:block"
          >
            <p className="font-script text-2xl text-ink">Crafted with love</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
