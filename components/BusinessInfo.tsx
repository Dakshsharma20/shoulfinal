"use client";

import { Instagram, MapPin, Clock, User, Store } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import { WhatsAppLinkButton } from "@/components/WhatsAppButton";
import { buildGeneralInquiryLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";

export default function BusinessInfo() {
  const settings = useSettings();

  const rows = [
    { icon: User, label: "Founder", value: "Shivani" },
    { icon: Store, label: "Business", value: `${settings.storeName} Handmade Jewellery` },
    { icon: MapPin, label: "Studio", value: `${settings.footerLocation} (exact location shared on request)` },
    { icon: Clock, label: "Working Hours", value: "Mon\u2013Sat, 10:00 AM\u20137:00 PM IST" },
  ];

  return (
    <RevealOnScroll effect="slide-left" className="h-full">
      <div className="flex h-full flex-col justify-between rounded-[2rem] bg-ink p-8 text-cream shadow-soft md:p-10">
        <div>
          <h2 className="font-serif text-2xl tracking-tight md:text-3xl">
            {settings.storeName} Studio
          </h2>
          <p className="mt-2 font-sans text-sm text-cream/70">
            Here&rsquo;s everything you need to reach us directly.
          </p>

          <dl className="mt-9 space-y-6">
            {rows.map((row) => (
              <div key={row.label} className="group flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-cream/20 text-sage-accent transition-all duration-500 ease-out group-hover:border-sage-accent group-hover:bg-sage-accent/10">
                  <row.icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-cream/60">
                    {row.label}
                  </dt>
                  <dd className="mt-1 font-sans text-sm text-cream">
                    {row.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <WhatsAppLinkButton
            href={buildGeneralInquiryLink(settings.whatsappNumber, settings.whatsappMessage)}
            variant="ghost"
            className="!bg-sage-accent !text-ink hover:!bg-cream"
          >
            WhatsApp Us
          </WhatsAppLinkButton>
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 font-sans text-sm font-medium text-cream hover:border-sage-accent hover:text-sage-accent"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            Follow Us
          </a>
        </div>
      </div>
    </RevealOnScroll>
  );
}
