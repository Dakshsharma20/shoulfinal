"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import QuickViewModal from "@/components/QuickViewModal";
import { useCategories } from "@/lib/categories-context";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export default function ProductExplorer() {
  const params = useSearchParams();
  const categories = useCategories();
  const initialCategory = params.get("category") || "All";

  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (params.get("category")) {
      setCategory(params.get("category") as string);
    }
  }, [params]);

  // Debounce search input so we're not hitting the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  // Any filter change resets pagination back to page 1.
  useEffect(() => {
    setPage(1);
  }, [category, debouncedQuery]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const searchParams = new URLSearchParams();
    if (category !== "All") searchParams.set("category", category);
    if (debouncedQuery.trim()) searchParams.set("q", debouncedQuery.trim());
    searchParams.set("page", String(page));
    searchParams.set("limit", String(PAGE_SIZE));

    fetch(`/api/products?${searchParams.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) return;
        setProducts(json.products);
        setTotal(json.total);
        setTotalPages(json.totalPages);
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [category, debouncedQuery, page]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => setCategory("All")}
            aria-pressed={category === "All"}
            className={cn(
              "btn-premium rounded-full border px-4 py-2 font-sans text-xs font-medium uppercase tracking-wide md:text-sm",
              category === "All"
                ? "border-sage-dark bg-sage-dark text-cream shadow-sage"
                : "border-line text-ink-light hover:border-sage/60 hover:text-ink"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => setCategory(cat.slug)}
              aria-pressed={category === cat.slug}
              className={cn(
                "btn-premium rounded-full border px-4 py-2 font-sans text-xs font-medium uppercase tracking-wide md:text-sm",
                category === cat.slug
                  ? "border-sage-dark bg-sage-dark text-cream shadow-sage"
                  : "border-line text-ink-light hover:border-sage/60 hover:text-ink"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-xs">
          <label htmlFor="product-search" className="sr-only">
            Search pieces
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
          />
          <input
            id="product-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces..."
            className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-9 font-sans text-sm text-ink outline-none transition-colors focus:border-sage-dark"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-6 font-sans text-xs uppercase tracking-widest text-ink-light"
      >
        {loading ? "Loading pieces..." : `${total} piece${total === 1 ? "" : "s"} found`}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                delay={(i % 4) * 0.06}
                onQuickView={setActiveProduct}
              />
            ))}
      </div>

      {!loading && products.length === 0 && (
        <div role="status" className="mt-16 text-center">
          <p className="font-serif text-2xl tracking-tight text-ink">
            No pieces match just yet
          </p>
          <p className="mt-2 font-sans text-sm text-ink-light">
            Try a different search term or category &mdash; or message us on
            WhatsApp, we may have it in the studio.
          </p>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <nav
          aria-label="Product pagination"
          className="mt-14 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-light transition-colors hover:border-sage-dark hover:text-ink disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full font-sans text-sm transition-colors",
                p === page ? "bg-sage-dark text-cream" : "text-ink-light hover:bg-cream-alt hover:text-ink"
              )}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-light transition-colors hover:border-sage-dark hover:text-ink disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}

      <QuickViewModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </section>
  );
}
