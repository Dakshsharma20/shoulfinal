import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { XCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { getOrCreateSettings } from "@/lib/data/getOrCreateSettings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Payment Failed",
  robots: { index: false, follow: false },
};

async function FailedContent({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const settings = await getOrCreateSettings();
  const message = order
    ? `Hi Soul Hues, my payment for order ${order} didn't go through. Could you help me complete it?`
    : "Hi Soul Hues, I had trouble completing payment for my order. Could you help me?";
  const whatsappHref = buildWhatsAppLink(settings.whatsappNumber, message);

  return (
    <div className="mx-auto max-w-lg px-6 py-24 pt-32 text-center md:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <XCircle className="h-8 w-8" aria-hidden="true" />
      </div>
      <h1 className="mt-6 font-serif text-3xl tracking-tight text-ink">Payment Didn&rsquo;t Go Through</h1>
      <p className="mt-3 font-sans text-sm leading-relaxed text-ink-light">
        Your payment couldn&rsquo;t be completed{order ? ` for order ${order}` : ""}. No amount has
        been charged. You can try again, or reach out and we&rsquo;ll help you complete the order
        directly.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/checkout"
          className="btn-premium inline-flex items-center gap-2 rounded-full bg-sage-dark px-6 py-3 font-sans text-sm font-medium text-cream shadow-lift"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Try Again
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 font-sans text-sm font-medium text-ink hover:bg-ink hover:text-cream"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Message Us on WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function OrderFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  return (
    <Suspense fallback={<div className="pt-32" />}>
      <FailedContent searchParams={searchParams} />
    </Suspense>
  );
}
