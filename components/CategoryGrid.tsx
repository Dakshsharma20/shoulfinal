"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCategories } from "@/lib/categories-context";
import SectionHeading from "@/components/SectionHeading";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function CategoryGrid() {
  const categories = useCategories();

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 lg:py-28">
      <SectionHeading
        eyebrow="Featured Collections"
        title="Every Piece, Made by Hand"
        description="From everyday studs to statement cuffs — explore the collection organised the way you shop."
      />

      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
        {categories.map((cat, i) => (
          <RevealOnScroll key={cat._id} delay={i * 0.06} effect="scale">
            <Link
              href={`/products?category=${encodeURIComponent(cat.slug)}`}
              className="group block"
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="shine-hover relative aspect-square overflow-hidden rounded-[22px] bg-sage/10 shadow-soft transition-shadow duration-500 group-hover:shadow-lift"
              >
                {cat.image?.url && (
                  <Image
                    src={cat.image.url}
                    alt={`${cat.name} — handmade jewellery category`}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent transition-opacity duration-500 group-hover:from-ink/85"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 border border-sage/0 rounded-[22px] transition-colors duration-500 group-hover:border-sage/50"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                  <p className="font-serif text-base tracking-tight text-cream md:text-lg">
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p className="hidden text-[11px] uppercase tracking-widest text-cream/70 sm:block">
                      {cat.description}
                    </p>
                  )}
                </div>
              </motion.div>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
