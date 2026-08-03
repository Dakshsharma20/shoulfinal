import CategoriesManager from "@/components/admin/CategoriesManager";

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl tracking-tight text-ink">Categories</h1>
      <p className="mt-1 font-sans text-sm text-ink-light">
        Organise the collection — these power the filter chips and category cards.
      </p>
      <div className="mt-8">
        <CategoriesManager />
      </div>
    </div>
  );
}
