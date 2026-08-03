/**
 * The order status lifecycle. Defined once here and reused by the Order
 * model (as the enum of valid values), the admin order detail page (as
 * the action buttons), and the customer-facing Track Order page (as the
 * timeline).
 *
 * "cancelled" and "refunded" are terminal statuses that can be reached
 * from most points in the flow, so they're handled separately from the
 * linear happy-path sequence.
 */
export const ORDER_STATUS_FLOW = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
] as const;

export const ORDER_TERMINAL_STATUSES = ["cancelled", "refunded"] as const;

export const ALL_ORDER_STATUSES = [
  ...ORDER_STATUS_FLOW,
  ...ORDER_TERMINAL_STATUSES,
] as const;

export type OrderStatus = (typeof ALL_ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

/** Returns how far along the happy-path flow a status is (-1 if terminal/unknown). */
export function orderStatusStepIndex(status: OrderStatus): number {
  return ORDER_STATUS_FLOW.indexOf(status as (typeof ORDER_STATUS_FLOW)[number]);
}

export function isTerminalStatus(status: OrderStatus): boolean {
  return (ORDER_TERMINAL_STATUSES as readonly string[]).includes(status);
}
