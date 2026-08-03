import { sendEmail } from "@/lib/email/transporter";
import { emailShell, formatINR } from "@/lib/email/emailShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://soulhues.example.com";

/** Minimal shape these templates need — decoupled from the full Mongoose document. */
export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { title: string; price: number; quantity: number }[];
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

function itemsTable(items: OrderEmailData["items"]): string {
  const rows = items
    .map(
      (i) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #E8E2D8;">${i.title} &times; ${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #E8E2D8;text-align:right;">${formatINR(i.price * i.quantity)}</td>
    </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" style="border-collapse:collapse;margin:16px 0;">${rows}</table>`;
}

export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  const body = `
    <p>Hi ${order.customerName},</p>
    <p>Thank you for your order! Here's a summary of what you ordered under
    <strong>${order.orderNumber}</strong>.</p>
    ${itemsTable(order.items)}
    <table role="presentation" width="100%" style="border-collapse:collapse;">
      <tr><td>Subtotal</td><td style="text-align:right;">${formatINR(order.subtotal)}</td></tr>
      <tr><td>Shipping</td><td style="text-align:right;">${order.shippingCharge === 0 ? "Free" : formatINR(order.shippingCharge)}</td></tr>
      <tr><td style="font-weight:bold;padding-top:8px;">Total</td><td style="text-align:right;font-weight:bold;padding-top:8px;">${formatINR(order.totalAmount)}</td></tr>
    </table>
    <p style="margin-top:20px;">We'll email you again once your payment is confirmed and your order ships.</p>
    <p><a href="${SITE_URL}/track-order" style="color:#4F6B52;">Track your order</a></p>
  `;
  return sendEmail({
    to: order.customerEmail,
    subject: `Order Received \u2014 ${order.orderNumber}`,
    html: emailShell("Thank you for your order", body),
  });
}

export async function sendPaymentConfirmationEmail(order: OrderEmailData) {
  const body = `
    <p>Hi ${order.customerName},</p>
    <p>We've received your payment of <strong>${formatINR(order.totalAmount)}</strong> for
    order <strong>${order.orderNumber}</strong>. Your order is now confirmed and Shivani
    is getting it ready.</p>
    ${itemsTable(order.items)}
    <p><a href="${SITE_URL}/track-order" style="color:#4F6B52;">Track your order</a></p>
  `;
  return sendEmail({
    to: order.customerEmail,
    subject: `Payment Confirmed \u2014 ${order.orderNumber}`,
    html: emailShell("Payment confirmed", body),
  });
}

export async function sendShippingNotificationEmail(order: OrderEmailData) {
  const trackingLine = order.trackingNumber
    ? `<p>Courier: <strong>${order.courierName ?? "\u2014"}</strong><br/>
       Tracking number: <strong>${order.trackingNumber}</strong>${
         order.trackingUrl
           ? `<br/><a href="${order.trackingUrl}" style="color:#4F6B52;">Track your shipment</a>`
           : ""
       }</p>`
    : "";
  const body = `
    <p>Hi ${order.customerName},</p>
    <p>Good news \u2014 your order <strong>${order.orderNumber}</strong> is on its way!</p>
    ${trackingLine}
    <p><a href="${SITE_URL}/track-order" style="color:#4F6B52;">Track your order</a></p>
  `;
  return sendEmail({
    to: order.customerEmail,
    subject: `Your Order Has Shipped \u2014 ${order.orderNumber}`,
    html: emailShell("Your order is on its way", body),
  });
}

export async function sendDeliveryNotificationEmail(order: OrderEmailData) {
  const body = `
    <p>Hi ${order.customerName},</p>
    <p>Your order <strong>${order.orderNumber}</strong> has been delivered. We hope you
    love it! If anything's not right, just reply to this email or message us on WhatsApp.</p>
  `;
  return sendEmail({
    to: order.customerEmail,
    subject: `Delivered \u2014 ${order.orderNumber}`,
    html: emailShell("Your order has arrived", body),
  });
}
