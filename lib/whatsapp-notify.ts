import { buildWhatsAppLink } from "@/lib/whatsapp";

export interface OrderWhatsAppData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  items: { title: string; quantity: number }[];
}

function buildOrderMessage(order: OrderWhatsAppData): string {
  const itemLines = order.items.map((i) => `\u2022 ${i.title} x${i.quantity}`).join("\n");
  return [
    `New order on Soul Hues! \ud83c\udf80`,
    `Order: ${order.orderNumber}`,
    `Customer: ${order.customerName}`,
    `Total: \u20b9${order.totalAmount.toLocaleString("en-IN")}`,
    ``,
    `Items:`,
    itemLines,
  ].join("\n");
}

export function isWhatsAppCloudApiConfigured(): boolean {
  return !!(process.env.WHATSAPP_CLOUD_API_TOKEN && process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID);
}

/**
 * Notifies the STORE (Soul Hues' own WhatsApp number, from Settings)
 * that a new order came in, containing the order number, customer name,
 * total, and items — exactly per spec.
 *
 * True background sending requires Meta's WhatsApp Business Cloud API,
 * which needs a verified WhatsApp Business Account and a paid/approved
 * phone number — not something that can be provisioned without real
 * business credentials. If WHATSAPP_CLOUD_API_TOKEN /
 * WHATSAPP_CLOUD_API_PHONE_NUMBER_ID are set, this sends automatically
 * via that API. If not, it returns a wa.me deep link instead — the
 * order confirmation page opens it so the message is one tap away
 * rather than fully automatic. Swap in Twilio/Gupshup/another provider
 * here later if you'd prefer a different vendor.
 */
export async function notifyStoreOfNewOrder(
  order: OrderWhatsAppData,
  storeWhatsAppNumber: string
): Promise<{ sent: boolean; method: "api" | "link"; link?: string }> {
  const message = buildOrderMessage(order);

  if (isWhatsAppCloudApiConfigured()) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: storeWhatsAppNumber,
            type: "text",
            text: { body: message },
          }),
        }
      );
      if (res.ok) {
        return { sent: true, method: "api" };
      }
      console.error("WhatsApp Cloud API send failed:", await res.text().catch(() => ""));
    } catch (err) {
      console.error("WhatsApp Cloud API request failed:", err);
    }
  }

  // Fallback: a ready-to-tap deep link, no API credentials required.
  return { sent: false, method: "link", link: buildWhatsAppLink(storeWhatsAppNumber, message) };
}
