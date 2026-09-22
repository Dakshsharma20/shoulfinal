"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppLinkButton } from "@/components/WhatsAppButton";
import { buildGeneralInquiryLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";
import { useCart } from "@/lib/cart-context";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const settings = useSettings();
  const whatsappHref = buildGeneralInquiryLink(settings.whatsappNumber, settings.whatsappMessage);
  const { itemCount, openMiniCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out",
        scrolled || open ? "glass shadow-soft py-3" : "bg-transparent py-5 md:py-6"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-10"
      >
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label={`${settings.storeName}, by Shivani — home`}
        >
          <span
            className={cn(
              "relative block flex-shrink-0 transition-all duration-500 ease-out",
              scrolled ? "h-11 w-32 md:h-12 md:w-36" : "h-14 w-36 md:h-16 md:w-44"
            )}
          >
            <Image
              src={settings.logo?.url || "/images/logo-soulhues.png"}
              alt={settings.storeName}
              fill
              priority
              sizes="176px"
              className="object-contain object-left transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          </span>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "link-underline relative font-sans text-sm tracking-wide text-ink-light transition-colors duration-300 hover:text-ink",
                    isActive && "font-medium text-ink"
                  )}
                >
                  {link.label}
                </Link>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-sage"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <WhatsAppLinkButton href={whatsappHref} size="sm">
              Order on WhatsApp
            </WhatsAppLinkButton>
          </div>

          <button
            type="button"
            onClick={openMiniCart}
            aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}`}
            className="btn-premium relative flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-cream-alt"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sage-dark px-1 text-[10px] font-medium text-cream">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="btn-premium flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-3 py-3 font-serif text-lg text-ink transition-colors",
                        isActive && "text-ink"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
              <li className="mt-2">
                <WhatsAppLinkButton
                  href={whatsappHref}
                  className="w-full"
                >
                  Order on WhatsApp
                </WhatsAppLinkButton>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
