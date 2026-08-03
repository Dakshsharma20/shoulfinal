import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Crown, Sparkles } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import ProductOrderButton from "@/components/ProductOrderButton";
import RelatedProducts from "@/components/RelatedProducts";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const image = product.images?.[0]?.url;

  return {
    title: product.title,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.title} | Soul Hues`,
      description: product.shortDescription,
      url: `/products/${product.slug}`,
      images: image ? [{ url: image, width: 1200, height: 1200, alt: product.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.shortDescription,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product.category._id, product._id, 4);

  const badge = product.bestseller
    ? { label: "Bestseller", icon: Crown }
    : product.newArrival
      ? { label: "New Arrival", icon: Sparkles }
      : null;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    image: product.images?.map((img) => img.url),
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-6 pt-8 md:px-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 font-sans text-sm text-ink-light hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Products
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-10 md:grid-cols-2 md:gap-16 md:px-10 md:py-14">
        <ProductGallery images={product.images} productTitle={product.title} />

        <div>
          <p className="eyebrow text-sage-dark">{product.category?.name}</p>
          {badge && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sage-dark/95 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-cream">
              <badge.icon className="h-3 w-3" aria-hidden="true" />
              {badge.label}
            </div>
          )}
          <h1 className="mt-3 text-balance font-serif text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.1] tracking-tight text-ink">
            {product.title}
          </h1>
          <p className="mt-4 font-serif text-2xl text-ink">{formatPrice(product.price)}</p>

          <p className="mt-6 font-sans text-base leading-relaxed text-ink-light">
            {product.description}
          </p>

          <dl className="mt-8 space-y-3 border-y border-line py-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-light">Material</dt>
              <dd className="text-right font-medium text-ink">{product.material}</dd>
            </div>
            {product.color && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-light">Colour</dt>
                <dd className="text-right font-medium text-ink">{product.color}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-light">Care Instructions</dt>
              <dd className="max-w-[60%] text-right font-medium text-ink">
                {product.careInstructions}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-light">Availability</dt>
              <dd className="text-right font-medium text-ink">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <ProductOrderButton product={product} />
          </div>
        </div>
      </section>

      <RelatedProducts products={related} />
    </div>
  );
}
