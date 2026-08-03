"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";
import { productSchema, type ProductInput } from "@/lib/validations/schemas";
import { slugify } from "@/lib/utils";
import ImageUploader from "@/components/admin/ImageUploader";
import ToggleSwitch from "@/components/admin/ToggleSwitch";

interface CategoryOption {
  _id: string;
  name: string;
}

export interface ProductFormInitialData extends Omit<ProductInput, "category"> {
  _id?: string;
  category: string; // category ObjectId
}

export default function ProductForm({
  mode,
  productId,
  initialData,
}: {
  mode: "create" | "edit";
  productId?: string;
  initialData?: ProductFormInitialData;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ?? {
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      category: "",
      price: 0,
      images: [],
      featured: false,
      bestseller: false,
      newArrival: false,
      inStock: true,
      isVisible: true,
      material: "",
      color: "",
      careInstructions: "",
      displayOrder: 0,
    },
  });

  const title = watch("title");

  useEffect(() => {
    if (!slugTouched && title) {
      setValue("slug", slugify(title));
    }
  }, [title, slugTouched, setValue]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCategories(json.categories);
      })
      .catch(() => {
        setServerError("Couldn't load categories. Refresh and try again.");
      });
  }, []);

  async function onSubmit(data: ProductInput) {
    setServerError(null);
    setSubmitting(true);
    try {
      const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-sage-dark";
  const labelClass = "mb-1.5 block font-sans text-sm text-ink-light";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {serverError && (
        <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          {serverError}
        </div>
      )}

      {/* Images */}
      <section className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg tracking-tight text-ink">Product Images</h2>
        <p className="mt-1 font-sans text-xs text-ink-light">
          Drag to reorder. The first image is used as the main product photo.
        </p>
        <div className="mt-4">
          <Controller
            control={control}
            name="images"
            render={({ field }) => (
              <ImageUploader images={field.value ?? []} onChange={field.onChange} />
            )}
          />
        </div>
        {errors.images && <p className={errorClass}>{errors.images.message as string}</p>}
      </section>

      {/* Basic info */}
      <section className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg tracking-tight text-ink">Basic Information</h2>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelClass}>Title</label>
            <input id="title" {...register("title")} className={inputClass} placeholder="Gold Vine Hoops" />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="slug" className={labelClass}>Slug (URL)</label>
            <input
              id="slug"
              {...register("slug", {
                onChange: () => setSlugTouched(true),
              })}
              className={inputClass}
              placeholder="gold-vine-hoops"
            />
            {errors.slug && <p className={errorClass}>{errors.slug.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select id="category" {...register("category")} className={inputClass}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {errors.category && <p className={errorClass}>{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="price" className={labelClass}>Price (&#8377;)</label>
            <input
              id="price"
              type="number"
              step="1"
              min="0"
              {...register("price")}
              className={inputClass}
              placeholder="649"
            />
            {errors.price && <p className={errorClass}>{errors.price.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="shortDescription" className={labelClass}>Short Description</label>
            <input
              id="shortDescription"
              {...register("shortDescription")}
              className={inputClass}
              placeholder="One line shown on the product card"
            />
            {errors.shortDescription && <p className={errorClass}>{errors.shortDescription.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>Full Description</label>
            <textarea
              id="description"
              rows={4}
              {...register("description")}
              className={`${inputClass} resize-none`}
              placeholder="Detailed description shown on the product page"
            />
            {errors.description && <p className={errorClass}>{errors.description.message}</p>}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg tracking-tight text-ink">Details</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="material" className={labelClass}>Material</label>
            <input id="material" {...register("material")} className={inputClass} placeholder="Brass, gold polish" />
            {errors.material && <p className={errorClass}>{errors.material.message}</p>}
          </div>
          <div>
            <label htmlFor="color" className={labelClass}>Colour <span className="text-ink-light">(optional)</span></label>
            <input id="color" {...register("color")} className={inputClass} placeholder="Antique gold" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="careInstructions" className={labelClass}>Care Instructions</label>
            <textarea
              id="careInstructions"
              rows={2}
              {...register("careInstructions")}
              className={`${inputClass} resize-none`}
              placeholder="Keep away from water and perfume."
            />
            {errors.careInstructions && <p className={errorClass}>{errors.careInstructions.message}</p>}
          </div>
          <div>
            <label htmlFor="displayOrder" className={labelClass}>
              Display Order <span className="text-ink-light">(lower shows first)</span>
            </label>
            <input
              id="displayOrder"
              type="number"
              step="1"
              {...register("displayOrder")}
              className={inputClass}
              placeholder="0"
            />
          </div>
        </div>
      </section>

      {/* Flags */}
      <section className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg tracking-tight text-ink">Visibility &amp; Merchandising</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Controller
            control={control}
            name="isVisible"
            render={({ field }) => (
              <ToggleSwitch
                checked={field.value}
                onChange={field.onChange}
                label="Visible on site"
                description="Hide to keep this product in draft"
              />
            )}
          />
          <Controller
            control={control}
            name="inStock"
            render={({ field }) => (
              <ToggleSwitch checked={field.value} onChange={field.onChange} label="In stock" />
            )}
          />
          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <ToggleSwitch checked={field.value} onChange={field.onChange} label="Featured" />
            )}
          />
          <Controller
            control={control}
            name="bestseller"
            render={({ field }) => (
              <ToggleSwitch checked={field.value} onChange={field.onChange} label="Best Seller" />
            )}
          />
          <Controller
            control={control}
            name="newArrival"
            render={({ field }) => (
              <ToggleSwitch checked={field.value} onChange={field.onChange} label="New Arrival" />
            )}
          />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="btn-premium inline-flex items-center gap-2 rounded-full bg-sage-dark px-8 py-3.5 font-sans text-sm font-medium text-cream shadow-lift disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {submitting ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-line px-8 py-3.5 font-sans text-sm font-medium text-ink hover:bg-cream-alt"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
