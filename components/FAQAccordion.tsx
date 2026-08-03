"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import faqsData from "@/data/faqs.json";
import { Faq } from "@/lib/types";
import SectionHeading from "@/components/SectionHeading";
import RevealOnScroll from "@/components/RevealOnScroll";
import { cn } from "@/lib/utils";

export default function FAQAccordion() {
  const faqs = faqsData as Faq[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 md:px-10">
      <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" />

      <div className="mt-14 space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          const buttonId = `faq-question-${i}`;
          const panelId = `faq-answer-${i}`;
          return (
            <RevealOnScroll key={faq.question} delay={i * 0.05}>
              <div
                className={cn(
                  "overflow-hidden rounded-[22px] border transition-colors duration-300",
                  isOpen ? "border-sage/40 bg-white shadow-soft" : "border-line bg-white/60 hover:border-sage/30"
                )}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-serif text-lg tracking-tight text-ink">
                      {faq.question}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "h-5 w-5 flex-shrink-0 text-sage-dark transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!isOpen}
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 font-sans text-sm leading-relaxed text-ink-light">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
