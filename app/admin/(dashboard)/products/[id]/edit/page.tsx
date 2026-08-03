import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import Product from "@/models/Product";
import "@/models/Category";
import ProductForm, { type ProductFormInitialData } from "@/components/admin/ProductForm";

async function getProduct(id: string) {
  await connectDB();
  const product = await Product.findById(id).lean().catch(() => null);
  return product;
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const p = product as unknown as Record<string, unknown> & {
    _id: { toString(): string };
    category: { toString(): string };
  };

  const initialData: ProductFormInitialData = {
    _id: p._id.toString(),
    title: p.title as string,
    slug: p.slug as string,
    description: p.description as string,
    shortDescription: p.shortDescription as string,
    category: p.category.toString(),
    price: p.price as number,
    images: p.images as ProductFormInitialData["images"],
    featured: p.featured as boolean,
    bestseller: p.bestseller as boolean,
    newArrival: p.newArrival as boolean,
    inStock: p.inStock as boolean,
    isVisible: p.isVisible as boolean,
    material: p.material as string,
    color: (p.color as string) ?? "",
    careInstructions: p.careInstructions as string,
    displayOrder: p.displayOrder as number,
  };

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 font-sans text-sm text-ink-light hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Products
      </Link>
      <h1 className="mt-4 font-serif text-3xl tracking-tight text-ink">Edit Product</h1>
      <p className="mt-1 font-sans text-sm text-ink-light">{initialData.title}</p>

      <div className="mt-8">
        <ProductForm mode="edit" productId={initialData._id} initialData={initialData} />
      </div>
    </div>
  );
}
