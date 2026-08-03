"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Crown,
  Sparkles,
  Star,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface AdminProduct {
  _id: string;
  title: string;
  price: number;
  images: { url: string }[];
  category?: { name: string };
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  isVisible: boolean;
}

export default function ProductsTable() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("limit", "100");
      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const json = await res.json();
      if (json.success) setProducts(json.products);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(query), 300);
    return () => clearTimeout(t);
  }, [query, load]);

  async function toggleFlag(id: string, flag: "featured" | "bestseller" | "newArrival" | "isVisible", value: boolean) {
    setBusyId(id);
    setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, [flag]: value } : p)));
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [flag]: value }),
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDuplicate(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}/duplicate`, { method: "POST" });
      const json = await res.json();
      if (json.success) load(query);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) setProducts((prev) => prev.filter((p) => p._id !== id));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none focus:border-sage-dark"
          />
        </div>
        <Link
          href="/admin/products/new"
          className="btn-premium inline-flex items-center justify-center gap-2 rounded-full bg-sage-dark px-5 py-2.5 font-sans text-sm font-medium text-cream shadow-lift"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-[22px] bg-white shadow-soft">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-sage-dark" aria-hidden="true" />
          </div>
        ) : products.length === 0 ? (
          <p className="px-6 py-16 text-center font-sans text-sm text-ink-light">
            No products found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-light">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Flags</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((p) => (
                  <tr key={p._id} className={cn(busyId === p._id && "opacity-50")}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-cream-alt">
                          {p.images?.[0] && (
                            <Image src={p.images[0].url} alt="" fill sizes="44px" className="object-cover" />
                          )}
                        </div>
                        <span className="max-w-[180px] truncate font-sans text-sm text-ink">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-sans text-sm text-ink-light">
                      {p.category?.name ?? "\u2014"}
                    </td>
                    <td className="px-5 py-3 font-sans text-sm text-ink">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          title="Featured"
                          onClick={() => toggleFlag(p._id, "featured", !p.featured)}
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                            p.featured ? "bg-sage-dark text-cream" : "bg-cream-alt text-ink-light hover:text-ink"
                          )}
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Best Seller"
                          onClick={() => toggleFlag(p._id, "bestseller", !p.bestseller)}
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                            p.bestseller ? "bg-sage-dark text-cream" : "bg-cream-alt text-ink-light hover:text-ink"
                          )}
                        >
                          <Crown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          title="New Arrival"
                          onClick={() => toggleFlag(p._id, "newArrival", !p.newArrival)}
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                            p.newArrival ? "bg-sage-dark text-cream" : "bg-cream-alt text-ink-light hover:text-ink"
                          )}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => toggleFlag(p._id, "isVisible", !p.isVisible)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                          p.isVisible ? "bg-sage/10 text-sage-dark" : "bg-ink/8 text-ink-light"
                        )}
                      >
                        {p.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {p.isVisible ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${p._id}/edit`}
                          title="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-light hover:bg-cream-alt hover:text-ink"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          title="Duplicate"
                          onClick={() => handleDuplicate(p._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-light hover:bg-cream-alt hover:text-ink"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => handleDelete(p._id, p.title)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-light hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
