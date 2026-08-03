import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-line bg-cream-alt/60 py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading
          eyebrow="You Might Also Like"
          title="Complete the Look"
          align="left"
          className="md:mx-0"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
