import type { Metadata } from "next";
import TrackOrderContent from "@/components/TrackOrderContent";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track your Soul Hues order using your order number and phone number.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return <TrackOrderContent />;
}
