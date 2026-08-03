"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Loader2,
  User,
  MapPin,
  CreditCard,
  Package,
  Truck,
  Save,
  CheckCircle2,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import {
  ORDER_STATUS_FLOW,
  ORDER_TERMINAL_STATUSES,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type OrderStatus,
} from "@/lib/order-status";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";

interface AdminOrder {
  _id: string;
  orderNumber: string;
  items: { title: string; image: string; price: number; quantity: number }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  orderNotes?: string;
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: OrderStatus;
  statusHistory: { status: OrderStatus; note?: string; changedAt: string }[];
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
}

const inputClass =
  "w-full rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-sage-dark";

export default function OrderDetailView({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<OrderStatus | null>(null);
  const [tracking, setTracking] = useState({ courierName: "", trackingNumber: "", trackingUrl: "" });
  const [savingTracking, setSavingTracking] = useState(false);
  const [trackingSaved, setTrackingSaved] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const json = await res.json();
      if (json.success) {
        setOrder(json.order);
        setTracking({
          courierName: json.order.courierName ?? "",
          trackingNumber: json.order.trackingNumber ?? "",
          trackingUrl: json.order.trackingUrl ?? "",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function handleStatusChange(status: OrderStatus) {
    setUpdatingStatus(status);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) setOrder(json.order);
    } finally {
      setUpdatingStatus(null);
    }
  }

  async function handleSaveTracking() {
    setSavingTracking(true);
    setTrackingSaved(false);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tracking),
      });
      const json = await res.json();
      if (json.success) {
        setOrder(json.order);
        setTrackingSaved(true);
        setTimeout(() => setTrackingSaved(false), 2500);
      }
    } finally {
      setSavingTracking(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-sage-dark" aria-hidden="true" />
      </div>
    );
  }

  if (!order) {
    return <p className="py-24 text-center font-sans text-sm text-ink-light">Order not found.</p>;
  }

  const actionableStatuses: OrderStatus[] = [...ORDER_STATUS_FLOW.slice(1), ...ORDER_TERMINAL_STATUSES];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink">{order.orderNumber}</h1>
          <p className="mt-1 font-sans text-sm text-ink-light">
            Placed {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <span className="font-serif text-2xl text-ink">{formatPrice(order.totalAmount)}</span>
      </div>

      {/* Status action buttons */}
      <div className="mt-6 rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="flex items-center gap-2 font-serif text-lg tracking-tight text-ink">
          <Package className="h-4 w-4" aria-hidden="true" /> Order Status
        </h2>
        <p className="mt-1 font-sans text-xs text-ink-light">
          Current status: <span className="font-medium text-ink">{ORDER_STATUS_LABELS[order.orderStatus]}</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {actionableStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusChange(status)}
              disabled={updatingStatus !== null || order.orderStatus === status}
              className={cn(
                "btn-premium inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-xs font-medium disabled:opacity-50",
                order.orderStatus === status
                  ? "border-sage-dark bg-sage-dark text-cream"
                  : ORDER_TERMINAL_STATUSES.includes(status as (typeof ORDER_TERMINAL_STATUSES)[number])
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-line text-ink hover:border-sage-dark"
              )}
            >
              {updatingStatus === status && <Loader2 className="h-3 w-3 animate-spin" />}
              {ORDER_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Ordered products */}
          <div className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
            <h2 className="font-serif text-lg tracking-tight text-ink">Ordered Products</h2>
            <ul className="mt-4 divide-y divide-line">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center gap-4 py-3.5">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-cream-alt">
                    {item.image && <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-sm text-ink">{item.title}</p>
                    <p className="text-xs text-ink-light">
                      {formatPrice(item.price)} &times; {item.quantity}
                    </p>
                  </div>
                  <span className="font-sans text-sm font-medium text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1.5 border-t border-line pt-4 font-sans text-sm">
              <div className="flex justify-between text-ink-light"><span>Subtotal</span><span className="text-ink">{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between text-ink-light"><span>Shipping</span><span className="text-ink">{order.shippingCharge === 0 ? "Free" : formatPrice(order.shippingCharge)}</span></div>
              <div className="flex justify-between text-ink-light"><span>Tax</span><span className="text-ink">{order.tax === 0 ? "\u2014" : formatPrice(order.tax)}</span></div>
              <div className="flex justify-between border-t border-line pt-1.5 font-medium"><span className="text-ink">Total</span><span className="text-ink">{formatPrice(order.totalAmount)}</span></div>
            </div>
            {order.orderNotes && (
              <div className="mt-4 rounded-xl bg-cream-alt/60 px-4 py-3 font-sans text-sm text-ink-light">
                <span className="font-medium text-ink">Note: </span>{order.orderNotes}
              </div>
            )}
          </div>

          {/* Tracking */}
          <div className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
            <h2 className="flex items-center gap-2 font-serif text-lg tracking-tight text-ink">
              <Truck className="h-4 w-4" aria-hidden="true" /> Shipping &amp; Tracking
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-sans text-sm text-ink-light">Courier Name</label>
                <input
                  value={tracking.courierName}
                  onChange={(e) => setTracking((t) => ({ ...t, courierName: e.target.value }))}
                  className={inputClass}
                  placeholder="Delhivery, BlueDart, India Post..."
                />
              </div>
              <div>
                <label className="mb-1.5 block font-sans text-sm text-ink-light">Tracking Number</label>
                <input
                  value={tracking.trackingNumber}
                  onChange={(e) => setTracking((t) => ({ ...t, trackingNumber: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block font-sans text-sm text-ink-light">Tracking URL</label>
                <input
                  value={tracking.trackingUrl}
                  onChange={(e) => setTracking((t) => ({ ...t, trackingUrl: e.target.value }))}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveTracking}
              disabled={savingTracking}
              className="btn-premium mt-4 inline-flex items-center gap-2 rounded-full bg-sage-dark px-6 py-2.5 font-sans text-sm font-medium text-cream shadow-lift disabled:opacity-60"
            >
              {savingTracking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : trackingSaved ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {trackingSaved ? "Saved" : "Save Tracking Info"}
            </button>
          </div>

          {/* Timeline */}
          <div className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
            <h2 className="font-serif text-lg tracking-tight text-ink">Timeline</h2>
            <div className="mt-5">
              <OrderStatusTimeline currentStatus={order.orderStatus} statusHistory={order.statusHistory} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer */}
          <div className="rounded-[22px] bg-white p-6 shadow-soft">
            <h2 className="flex items-center gap-2 font-serif text-base tracking-tight text-ink">
              <User className="h-4 w-4" aria-hidden="true" /> Customer
            </h2>
            <dl className="mt-3 space-y-1.5 font-sans text-sm">
              <div className="flex justify-between"><dt className="text-ink-light">Name</dt><dd className="text-ink">{order.shippingAddress.fullName}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-light">Phone</dt><dd className="text-ink">{order.shippingAddress.phone}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-light">Email</dt><dd className="truncate text-ink">{order.shippingAddress.email}</dd></div>
            </dl>
          </div>

          {/* Shipping address */}
          <div className="rounded-[22px] bg-white p-6 shadow-soft">
            <h2 className="flex items-center gap-2 font-serif text-base tracking-tight text-ink">
              <MapPin className="h-4 w-4" aria-hidden="true" /> Shipping Address
            </h2>
            <p className="mt-3 font-sans text-sm text-ink-light">
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state}<br />
              {order.shippingAddress.pinCode}, {order.shippingAddress.country}
            </p>
          </div>

          {/* Payment */}
          <div className="rounded-[22px] bg-white p-6 shadow-soft">
            <h2 className="flex items-center gap-2 font-serif text-base tracking-tight text-ink">
              <CreditCard className="h-4 w-4" aria-hidden="true" /> Payment
            </h2>
            <dl className="mt-3 space-y-1.5 font-sans text-sm">
              <div className="flex justify-between"><dt className="text-ink-light">Method</dt><dd className="text-ink capitalize">{order.paymentMethod}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-light">Status</dt><dd className="text-ink">{PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS] ?? order.paymentStatus}</dd></div>
              {order.razorpayOrderId && (
                <div className="flex justify-between gap-2"><dt className="flex-shrink-0 text-ink-light">Razorpay Order</dt><dd className="truncate text-ink" title={order.razorpayOrderId}>{order.razorpayOrderId}</dd></div>
              )}
              {order.razorpayPaymentId && (
                <div className="flex justify-between gap-2"><dt className="flex-shrink-0 text-ink-light">Payment ID</dt><dd className="truncate text-ink" title={order.razorpayPaymentId}>{order.razorpayPaymentId}</dd></div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
