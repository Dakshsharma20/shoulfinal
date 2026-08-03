import type { Metadata } from "next";
import CartPageContent from "@/components/CartPageContent";

export const metadata: Metadata = {
  title: "Your Bag",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <div className="pt-24">
      <CartPageContent />
    </div>
  );
}
