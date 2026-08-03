"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, PackageSearch, Truck, ExternalLink } from "lucide-react";
import { trackOrderSchema, type TrackOrderInput } from "@/lib/validations/checkout";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { formatPrice, cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/order-status";

interface TrackedOrder {
  orderNumber: string;
  items: { title: string; quantity: number }[];
  orderStatus: OrderStatus;
  statusHistory: { status: OrderStatus; note?: string; changedAt: string }[];
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  totalAmount: number;
  createdAt: string;
}

const inputBase =
  "w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm outline-none transition-colors duration-300 focus:border-sage-dark";

export default function TrackOrderContent() {
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackOrderInput>({ resolver: zodResolver(trackOrderSchema) });

  async function onSubmit(data: TrackOrderInput) {
    setServerError(null);
    setSubmitting(true);
    setOrder(null);
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Couldn't find that order.");
        return;
      }
      setOrder(json.order);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 pt-32 md:px-10">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/10 text-sage-dark">
          <PackageSearch className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-serif text-3xl tracking-tight text-ink md:text-4xl">Track Your Order</h1>
        <p className="mt-2 font-sans text-sm text-ink-light">
          Enter your order number and the phone number used at checkout.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-10 rounded-[22px] bg-white p-6 shadow-soft md:p-8"
      >
        {serverError && (
          <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {serverError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="orderNumber" className="mb-1.5 block font-sans text-sm text-ink-light">
              Order Number
            </label>
            <input
              id="orderNumber"
              {...register("orderNumber")}
              className={cn(inputBase, errors.orderNumber ? "border-red-300" : "border-line")}
              placeholder="SH-20260729-0001"
            />
            {errors.orderNumber && <p className="mt-1 text-xs text-red-500">{errors.orderNumber.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block font-sans text-sm text-ink-light">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className={cn(inputBase, errors.phone ? "border-red-300" : "border-line")}
              placeholder="98765 43210"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-premium mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-sage-dark px-6 py-3.5 font-sans text-sm font-medium text-cream shadow-lift disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {submitting ? "Searching..." : "Track Order"}
        </button>
      </form>

      {order && (
        <div className="mt-8 rounded-[22px] bg-white p-6 shadow-soft md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-serif text-lg text-ink">{order.orderNumber}</p>
              <p className="text-xs text-ink-light">
                Placed{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                })}
              </p>
            </div>
            <span className="font-serif text-xl text-ink">{formatPrice(order.totalAmount)}</span>
          </div>

          {order.trackingNumber && (
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-cream-alt px-4 py-3">
              <Truck className="h-4 w-4 flex-shrink-0 text-sage-dark" aria-hidden="true" />
              <div className="min-w-0 flex-1 font-sans text-sm text-ink">
                <p>
                  {order.courierName ?? "Courier"} &middot; {order.trackingNumber}
                </p>
              </div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-sans text-xs font-medium text-sage-dark hover:underline"
                >
                  Track <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
            </div>
          )}

          <div className="mt-6 border-t border-line pt-6">
            <OrderStatusTimeline currentStatus={order.orderStatus} statusHistory={order.statusHistory} />
          </div>

          <div className="mt-6 border-t border-line pt-6">
            <p className="font-sans text-sm font-medium text-ink">Items</p>
            <ul className="mt-2 space-y-1 font-sans text-sm text-ink-light">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.title} &times; {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
