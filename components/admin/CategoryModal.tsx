"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, AlertCircle } from "lucide-react";
import { categorySchema, type CategoryInput } from "@/lib/validations/schemas";
import { slugify } from "@/lib/utils";
import ImageUploader, { type UploadedImage } from "@/components/admin/ImageUploader";

export interface CategoryRecord {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; publicId: string };
  displayOrder: number;
}

export default function CategoryModal({
  category,
  onClose,
  onSaved,
}: {
  category: CategoryRecord | null; // null = create mode
  onClose: () => void;
  onSaved: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!!category);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          image: category.image,
          displayOrder: category.displayOrder,
        }
      : { name: "", slug: "", description: "", displayOrder: 0 },
  });

  const name = watch("name");
  useEffect(() => {
    if (!slugTouched && name) setValue("slug", slugify(name));
  }, [name, slugTouched, setValue]);

  const image = watch("image");
  const imagesArray: UploadedImage[] = image ? [{ ...image, order: 0 }] : [];

  async function onSubmit(data: CategoryInput) {
    setServerError(null);
    setSubmitting(true);
    try {
      const url = category ? `/api/admin/categories/${category._id}` : "/api/admin/categories";
      const method = category ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }
      onSaved();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-sage-dark";
  const labelClass = "mb-1.5 block font-sans text-sm text-ink-light";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[22px] bg-white p-6 shadow-lift md:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl tracking-tight text-ink">
            {category ? "Edit Category" : "New Category"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-light hover:bg-cream-alt hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          {serverError && (
            <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {serverError}
            </div>
          )}

          <div>
            <label htmlFor="cat-name" className={labelClass}>Name</label>
            <input id="cat-name" {...register("name")} className={inputClass} placeholder="Necklaces" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="cat-slug" className={labelClass}>Slug</label>
            <input
              id="cat-slug"
              {...register("slug", { onChange: () => setSlugTouched(true) })}
              className={inputClass}
              placeholder="necklaces"
            />
            {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
          </div>

          <div>
            <label htmlFor="cat-description" className={labelClass}>
              Description <span className="text-ink-light">(optional)</span>
            </label>
            <textarea
              id="cat-description"
              rows={2}
              {...register("description")}
              className={`${inputClass} resize-none`}
              placeholder="Pendants & layers"
            />
          </div>

          <div>
            <label className={labelClass}>Category Image</label>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ImageUploader
                  images={imagesArray}
                  onChange={(imgs) => field.onChange(imgs[imgs.length - 1] ?? undefined)}
                />
              )}
            />
          </div>

          <div>
            <label htmlFor="cat-order" className={labelClass}>Display Order</label>
            <input
              id="cat-order"
              type="number"
              step="1"
              {...register("displayOrder")}
              className={inputClass}
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-premium inline-flex items-center gap-2 rounded-full bg-sage-dark px-6 py-3 font-sans text-sm font-medium text-cream shadow-lift disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {submitting ? "Saving..." : category ? "Save Changes" : "Create Category"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-line px-6 py-3 font-sans text-sm font-medium text-ink hover:bg-cream-alt"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
