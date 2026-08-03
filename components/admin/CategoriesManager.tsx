"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, FolderTree } from "lucide-react";
import CategoryModal, { type CategoryRecord } from "@/components/admin/CategoryModal";

export default function CategoriesManager() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      if (json.success) setCategories(json.categories);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setError(null);
    setModalOpen(true);
  }
  function openEdit(cat: CategoryRecord) {
    setEditing(cat);
    setError(null);
    setModalOpen(true);
  }
  function handleSaved() {
    setModalOpen(false);
    load();
  }

  async function handleDelete(cat: CategoryRecord) {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${cat._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Couldn't delete this category.");
        return;
      }
      load();
    } catch {
      setError("Couldn't delete this category.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-sans text-sm text-ink-light">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"}
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="btn-premium inline-flex items-center gap-2 rounded-full bg-sage-dark px-5 py-2.5 font-sans text-sm font-medium text-cream shadow-lift"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Category
        </button>
      </div>

      {error && (
        <div role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-[22px] bg-white shadow-soft">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-sage-dark" aria-hidden="true" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <FolderTree className="h-6 w-6 text-ink-light" aria-hidden="true" />
            <p className="font-sans text-sm text-ink-light">No categories yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {categories.map((cat) => (
              <li key={cat._id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-cream-alt">
                  {cat.image?.url && (
                    <Image src={cat.image.url} alt="" fill sizes="44px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-sm font-medium text-ink">{cat.name}</p>
                  <p className="truncate text-xs text-ink-light">/{cat.slug}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(cat)}
                    title="Edit"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-light hover:bg-cream-alt hover:text-ink"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    title="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-light hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalOpen && (
        <CategoryModal category={editing} onClose={() => setModalOpen(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}
