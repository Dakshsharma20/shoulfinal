import ProductsTable from "@/components/admin/ProductsTable";

export default function AdminProductsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-ink">Products</h1>
      <p className="mt-1 font-sans text-sm text-ink-light">
        Create, edit, and manage every piece in the catalog.
      </p>
      <div className="mt-8">
        <ProductsTable />
      </div>
    </div>
  );
}
