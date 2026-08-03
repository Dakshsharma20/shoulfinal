import { FALLBACK_SETTINGS } from "@/lib/settings-context";

/**
 * All functions here take the WhatsApp number/message as explicit
 * arguments rather than reading module-level constants, since these now
 * come from MongoDB (editable in /admin/settings) instead of being
 * hardcoded. Components read the live values via useSettings() and pass
 * them through. Fallback values keep every function safe to call even
 * before settings have loaded.
 */

export function buildWhatsAppLink(
  number: string = FALLBACK_SETTINGS.whatsappNumber,
  message: string = FALLBACK_SETTINGS.whatsappMessage
): string {
  const text = encodeURIComponent(message?.trim() || FALLBACK_SETTINGS.whatsappMessage);
  return `https://wa.me/${number}?text=${text}`;
}

/**
 * Used by every "Order Now" / "Order on WhatsApp" button site-wide
 * (product cards, quick view, hero, CTA sections). Intentionally uses the
 * single standard message rather than a per-product message, per brand
 * requirement that every order button opens the same prefilled chat.
 */
export function buildProductOrderLink(number: string, message: string): string {
  return buildWhatsAppLink(number, message);
}

/**
 * Used by the floating WhatsApp button and general "chat with us" CTAs.
 */
export function buildGeneralInquiryLink(number: string, message: string): string {
  return buildWhatsAppLink(number, message);
}

/**
 * Used only by the Contact page form, where the visitor's own name,
 * phone, and message are relevant context for Shivani to see on WhatsApp.
 */
export function buildContactFormLink(
  number: string,
  name: string,
  phone: string,
  message: string
): string {
  const text = `Hi Soul Hues, my name is ${name} (${phone}).\n${message}`;
  return buildWhatsAppLink(number, text);
}
