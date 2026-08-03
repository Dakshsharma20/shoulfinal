import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email address"),
  address: z.string().trim().min(5, "Enter your full address").max(300),
  city: z.string().trim().min(2, "Enter your city").max(80),
  state: z.string().trim().min(2, "Enter your state").max(80),
  pinCode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  country: z.string().trim().min(2).default("India"),
  orderNotes: z.string().trim().max(500).optional().or(z.literal("")),
});
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});
export type CartItemInput = z.infer<typeof cartItemSchema>;

/**
 * What the client sends to /api/checkout/create-order: the shipping
 * details plus the cart contents. Prices are deliberately NOT trusted
 * from the client — the route re-fetches current prices from MongoDB
 * before creating the Razorpay order, so a tampered request can't pay
 * less than the real total.
 */
export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  items: z.array(cartItemSchema).min(1, "Your cart is empty"),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  orderNumber: z.string().min(1),
});
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;

export const trackOrderSchema = z.object({
  orderNumber: z.string().trim().min(1, "Enter your order number"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter the 10-digit mobile number used at checkout"),
});
export type TrackOrderInput = z.infer<typeof trackOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  note: z.string().trim().max(300).optional(),
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export const updateTrackingSchema = z.object({
  courierName: z.string().trim().max(100).optional().or(z.literal("")),
  trackingNumber: z.string().trim().max(100).optional().or(z.literal("")),
  trackingUrl: z.string().trim().url().optional().or(z.literal("")),
});
export type UpdateTrackingInput = z.infer<typeof updateTrackingSchema>;
