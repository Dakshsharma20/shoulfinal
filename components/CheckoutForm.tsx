"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useSettings } from "@/lib/settings-context";
import { shippingAddressSchema, type ShippingAddressInput } from "@/lib/validations/checkout";
import { formatPrice, cn } from "@/lib/utils";
import { loadRazorpayScript } from "@/lib/loadRazorpayScript";

const inputBase =
  "w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm outline-none transition-colors duration-300 focus:border-sage-dark";

export default function CheckoutForm() {
  const router = useRouter();
  const settings = useSettings();
  const { items, subtotal, shippingCharge, tax, total, isHydrated, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: { country: "India" },
  });

  // Guests shouldn't land on checkout with nothing to buy.
  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.replace("/cart");
    }
  }, [isHydrated, items.length, router]);

  async function onSubmit(data: ShippingAddressInput) {
    setServerError(null);
    setSubmitting(true);

    try {
      const createRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: data,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const createJson = await createRes.json();
      if (!createRes.ok || !createJson.success) {
        setServerError(createJson.error ?? "Couldn't start checkout. Please try again.");
        setSubmitting(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setServerError("Couldn't load the payment gateway. Check your connection and try again.");
        setSubmitting(false);
        return;
      }

      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        setServerError("Payment gateway isn't configured yet. Please contact us to complete your order.");
        setSubmitting(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: razorpayKeyId,
        amount: createJson.amount,
        currency: createJson.currency,
        name: settings.storeName,
        description: `Order ${createJson.orderNumber}`,
        order_id: createJson.razorpayOrderId,
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.phone,
        },
        theme: { color: "#4F6B52" },
        handler: async (response: unknown) => {
          const paymentResponse = response as {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          };
          const verifyRes = await fetch("/api/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...paymentResponse,
              orderNumber: createJson.orderNumber,
            }),
          });
          const verifyJson = await verifyRes.json();
          if (verifyRes.ok && verifyJson.success) {
            clearCart();
            router.push(`/order/success/${createJson.orderNumber}`);
          } else {
            router.push(`/order/failed?order=${createJson.orderNumber}`);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      });

      razorpay.on("payment.failed", () => {
        router.push(`/order/failed?order=${createJson.orderNumber}`);
      });

      razorpay.open();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (!isHydrated || items.length === 0) {
    return <div className="mx-auto max-w-6xl px-6 py-24 md:px-10" />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 font-sans text-sm text-ink-light hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Bag
      </Link>
      <h1 className="mt-4 font-serif text-3xl tracking-tight text-ink md:text-4xl">Checkout</h1>
      <p className="mt-1 font-sans text-sm text-ink-light">
        No account needed — just your delivery details.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {serverError && (
            <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {serverError}
            </div>
          )}

          <section className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
            <h2 className="font-serif text-lg tracking-tight text-ink">Contact &amp; Delivery</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="mb-1.5 block font-sans text-sm text-ink-light">
                  Full Name
                </label>
                <input
                  id="fullName"
                  {...register("fullName")}
                  aria-invalid={!!errors.fullName}
                  className={cn(inputBase, errors.fullName ? "border-red-300" : "border-line")}
                  placeholder="Your full name"
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block font-sans text-sm text-ink-light">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                  className={cn(inputBase, errors.phone ? "border-red-300" : "border-line")}
                  placeholder="98765 43210"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block font-sans text-sm text-ink-light">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  className={cn(inputBase, errors.email ? "border-red-300" : "border-line")}
                  placeholder="you@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1.5 block font-sans text-sm text-ink-light">
                  Address
                </label>
                <input
                  id="address"
                  {...register("address")}
                  aria-invalid={!!errors.address}
                  className={cn(inputBase, errors.address ? "border-red-300" : "border-line")}
                  placeholder="House/flat no., street, area"
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
              </div>

              <div>
                <label htmlFor="city" className="mb-1.5 block font-sans text-sm text-ink-light">
                  City
                </label>
                <input
                  id="city"
                  {...register("city")}
                  aria-invalid={!!errors.city}
                  className={cn(inputBase, errors.city ? "border-red-300" : "border-line")}
                />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
              </div>

              <div>
                <label htmlFor="state" className="mb-1.5 block font-sans text-sm text-ink-light">
                  State
                </label>
                <input
                  id="state"
                  {...register("state")}
                  aria-invalid={!!errors.state}
                  className={cn(inputBase, errors.state ? "border-red-300" : "border-line")}
                />
                {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>}
              </div>

              <div>
                <label htmlFor="pinCode" className="mb-1.5 block font-sans text-sm text-ink-light">
                  PIN Code
                </label>
                <input
                  id="pinCode"
                  {...register("pinCode")}
                  aria-invalid={!!errors.pinCode}
                  className={cn(inputBase, errors.pinCode ? "border-red-300" : "border-line")}
                  placeholder="452001"
                />
                {errors.pinCode && <p className="mt-1 text-xs text-red-500">{errors.pinCode.message}</p>}
              </div>

              <div>
                <label htmlFor="country" className="mb-1.5 block font-sans text-sm text-ink-light">
                  Country
                </label>
                <input
                  id="country"
                  {...register("country")}
                  aria-invalid={!!errors.country}
                  className={cn(inputBase, errors.country ? "border-red-300" : "border-line")}
                />
                {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="orderNotes" className="mb-1.5 block font-sans text-sm text-ink-light">
                  Order Notes <span className="text-ink-light">(optional)</span>
                </label>
                <textarea
                  id="orderNotes"
                  rows={3}
                  {...register("orderNotes")}
                  className={cn(inputBase, "resize-none border-line")}
                  placeholder="Delivery instructions, gift note, etc."
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={submitting}
            className="btn-premium flex w-full items-center justify-center gap-2 rounded-full bg-sage-dark px-8 py-4 font-sans text-sm font-medium text-cream shadow-lift disabled:opacity-60 sm:w-auto"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {submitting ? "Processing..." : `Pay ${formatPrice(total)}`}
          </button>
          <p className="flex items-center gap-1.5 font-sans text-xs text-ink-light">
            <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            Payments are securely processed by Razorpay. We never see your card details.
          </p>
        </form>

        <aside className="h-fit rounded-[22px] bg-white p-6 shadow-soft md:p-8">
          <h2 className="font-serif text-xl tracking-tight text-ink">Order Summary</h2>
          <ul className="mt-5 space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-cream-alt">
                  {item.image && (
                    <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                  )}
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-cream">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-sm text-ink">{item.title}</p>
                </div>
                <span className="font-sans text-sm text-ink">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2 border-t border-line pt-5 font-sans text-sm">
            <div className="flex justify-between text-ink-light">
              <span>Subtotal</span>
              <span className="text-ink">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-light">
              <span>Shipping</span>
              <span className="text-ink">{shippingCharge === 0 ? "Free" : formatPrice(shippingCharge)}</span>
            </div>
            <div className="flex justify-between text-ink-light">
              <span>Tax</span>
              <span className="text-ink">{tax === 0 ? "\u2014" : formatPrice(tax)}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="font-sans text-sm font-medium text-ink">Total</span>
            <span className="font-serif text-2xl text-ink">{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
