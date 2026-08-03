"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, MessageCircle, MapPin } from "lucide-react";
import Newsletter from "@/components/Newsletter";
import { buildGeneralInquiryLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";
import { useCategories } from "@/lib/categories-context";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const settings = useSettings();
  const categories = useCategories();
  const whatsappHref = buildGeneralInquiryLink(settings.whatsappNumber, settings.whatsappMessage);

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sage/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sage/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-24 md:px-10 lg:pt-28">
        <div className="grid grid-cols-1 gap-14 border-b border-cream/15 pb-16 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] md:gap-12">
          <div>
            <div className="inline-flex rounded-2xl bg-cream p-3 shadow-soft">
              <div className="relative h-14 w-14">
                <Image
                  src={settings.logo?.url || "/images/logo-soulhues.png"}
                  alt={settings.storeName}
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
            </div>
            <p className="mt-3 font-script text-2xl leading-none text-sage-accent">
              by Shivani
            </p>
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-cream/70">
              {settings.footerTagline}
            </p>
          </div>

          <nav aria-label="Footer quick links">
            <h3 className="eyebrow mb-5 text-sage-accent">Quick Links</h3>
            <ul className="space-y-3.5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline font-sans text-sm text-cream/80 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer shop categories">
            <h3 className="eyebrow mb-5 text-sage-accent">Shop</h3>
            <ul className="space-y-3.5">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/products?category=${encodeURIComponent(cat.slug)}`}
                    className="link-underline font-sans text-sm text-cream/80 transition-colors hover:text-cream"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="eyebrow mb-5 text-sage-accent">Stay in the loop</h3>
            <Newsletter variant="dark" />
            <div className="mt-7 flex items-center gap-3">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${settings.storeName} on Instagram`}
                className="btn-premium flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 hover:border-sage-accent hover:text-sage-accent"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat with ${settings.storeName} on WhatsApp`}
                className="btn-premium flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 hover:border-sage-accent hover:text-sage-accent"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <span className="flex items-center gap-1.5 pl-1 text-xs text-cream/60">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {settings.footerLocation}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-8 text-xs text-cream/55 md:flex-row">
          <p>&copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <p>Crafted with love, by Shivani.</p>
        </div>
      </div>
    </footer>
  );
}
