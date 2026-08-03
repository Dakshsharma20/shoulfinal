"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildGeneralInquiryLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";

export function WhatsAppLinkButton({
  href,
  children,
  variant = "solid",
  className,
  size = "md",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };
  const variants = {
    solid:
      "bg-sage-dark text-cream hover:bg-ink shadow-lift hover:shadow-sage",
    outline:
      "border border-sage-dark text-ink hover:bg-sage-dark hover:text-cream",
    ghost: "bg-white/70 text-ink hover:bg-white",
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "btn-premium group inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide",
        sizes[size],
        variants[variant],
        className
      )}
    >
      <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
      {children}
    </a>
  );
}

export default function FloatingWhatsApp() {
  const settings = useSettings();
  const href = buildGeneralInquiryLink(settings.whatsappNumber, settings.whatsappMessage);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Soul Hues on WhatsApp"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sage-dark text-cream shadow-lift md:bottom-8 md:right-8"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-sage-dark/40 group-hover:opacity-0" />
      <MessageCircle className="relative h-6 w-6" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-ink px-4 py-2 font-sans text-xs font-medium text-cream opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100">
        Chat with us
      </span>
    </motion.a>
  );
}
