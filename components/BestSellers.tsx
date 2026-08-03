import Link from "next/link";
import { Crown } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { getBestsellerProducts } from "@/lib/data/products";

export default async function BestSellers() {
  const products = await getBestsellerProducts(4);

  if (products.length === 0) return null;

  return (
    <section className="bg-cream-alt/60 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Loved Again & Again"
            title="Best Sellers"
            description="The pieces our community keeps coming back to reorder."
            align="left"
            className="md:mx-0"
          />
          <Link
            href="/products"
            className="link-underline inline-flex items-center gap-1.5 whitespace-nowrap font-sans text-sm font-medium text-ink"
          >
            <Crown className="h-4 w-4 text-sage-dark" aria-hidden="true" />
            View all products &rarr;
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
