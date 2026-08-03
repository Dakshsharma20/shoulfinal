import Razorpay from "razorpay";
import crypto from "node:crypto";

export function assertRazorpayConfigured() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local."
    );
  }
}

let cachedClient: Razorpay | null = null;

/**
 * Lazily constructed so importing this module doesn't throw at build
 * time before env vars are configured — only calling getRazorpay()
 * requires them to be set.
 */
export function getRazorpay(): Razorpay {
  assertRazorpayConfigured();
  if (!cachedClient) {
    cachedClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return cachedClient;
}

/**
 * Verifies the HMAC SHA256 signature Razorpay returns after a successful
 * checkout, per their documented verification scheme:
 * https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/#step-6-verify-payment-signature
 *
 * This MUST happen server-side — the client-reported "payment succeeded"
 * event is never trusted on its own, since it's trivial to fake from the
 * browser. Only a signature that verifies against your API secret proves
 * the payment is genuine.
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  assertRazorpayConfigured();
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  // Constant-time comparison to avoid leaking signature bytes via timing.
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    // Buffers of different lengths throw — that's still "not equal".
    return false;
  }
}
