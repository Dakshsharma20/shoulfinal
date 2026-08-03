import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 font-sans text-sm text-ink-light hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Products
      </Link>
      <h1 className="mt-4 font-serif text-3xl tracking-tight text-ink">New Product</h1>
      <p className="mt-1 font-sans text-sm text-ink-light">Add a new piece to the catalog.</p>

      <div className="mt-8">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
