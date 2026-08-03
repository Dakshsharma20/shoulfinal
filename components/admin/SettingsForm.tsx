"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { settingsSchema, type SettingsInput } from "@/lib/validations/schemas";
import ImageUploader, { type UploadedImage } from "@/components/admin/ImageUploader";

export default function SettingsForm() {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) reset(json.settings);
      })
      .catch(() => setServerError("Couldn't load settings."))
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data: SettingsInput) {
    setServerError(null);
    setSaved(false);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Something went wrong.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-sage-dark";
  const labelClass = "mb-1.5 block font-sans text-sm text-ink-light";
  const errorClass = "mt-1 text-xs text-red-500";

  const logo = watch("logo");
  const heroBanner = watch("heroBanner");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-sage-dark" aria-hidden="true" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {serverError && (
        <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          {serverError}
        </div>
      )}
      {saved && (
        <div role="status" className="flex items-center gap-2 rounded-xl bg-sage/10 px-4 py-3 text-sm text-sage-dark">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Settings saved.
        </div>
      )}

      <section className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg tracking-tight text-ink">Store</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="storeName" className={labelClass}>Store Name</label>
            <input id="storeName" {...register("storeName")} className={inputClass} />
            {errors.storeName && <p className={errorClass}>{errors.storeName.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Contact Email</label>
            <input id="email" type="email" {...register("email")} className={inputClass} />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg tracking-tight text-ink">WhatsApp Ordering</h2>
        <div className="mt-4 grid grid-cols-1 gap-5">
          <div>
            <label htmlFor="whatsappNumber" className={labelClass}>
              WhatsApp Number <span className="text-ink-light">(digits only, with country code)</span>
            </label>
            <input id="whatsappNumber" {...register("whatsappNumber")} className={inputClass} placeholder="919144801221" />
            {errors.whatsappNumber && <p className={errorClass}>{errors.whatsappNumber.message}</p>}
          </div>
          <div>
            <label htmlFor="whatsappMessage" className={labelClass}>Prefilled Message</label>
            <textarea
              id="whatsappMessage"
              rows={3}
              {...register("whatsappMessage")}
              className={`${inputClass} resize-none`}
            />
            {errors.whatsappMessage && <p className={errorClass}>{errors.whatsappMessage.message}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg tracking-tight text-ink">Instagram</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="instagramUrl" className={labelClass}>Profile URL</label>
            <input id="instagramUrl" {...register("instagramUrl")} className={inputClass} />
            {errors.instagramUrl && <p className={errorClass}>{errors.instagramUrl.message}</p>}
          </div>
          <div>
            <label htmlFor="instagramHandle" className={labelClass}>Handle (displayed)</label>
            <input id="instagramHandle" {...register("instagramHandle")} className={inputClass} placeholder="@soulhues.official" />
            {errors.instagramHandle && <p className={errorClass}>{errors.instagramHandle.message}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg tracking-tight text-ink">Logo</h2>
        <p className="mt-1 font-sans text-xs text-ink-light">
          Replaces the logo shown in the navbar, footer, and loading screen.
        </p>
        <div className="mt-4">
          <Controller
            control={control}
            name="logo"
            render={({ field }) => (
              <ImageUploader
                images={logo ? [{ ...logo, order: 0 }] : []}
                onChange={(imgs: UploadedImage[]) => field.onChange(imgs[imgs.length - 1] ?? undefined)}
              />
            )}
          />
        </div>
      </section>

      <section className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg tracking-tight text-ink">Hero Banner</h2>
        <p className="mt-1 font-sans text-xs text-ink-light">
          Overrides the homepage hero image.
        </p>
        <div className="mt-4">
          <Controller
            control={control}
            name="heroBanner"
            render={({ field }) => (
              <ImageUploader
                images={heroBanner ? [{ ...heroBanner, order: 0 }] : []}
                onChange={(imgs: UploadedImage[]) => field.onChange(imgs[imgs.length - 1] ?? undefined)}
              />
            )}
          />
        </div>
      </section>

      <section className="rounded-[22px] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg tracking-tight text-ink">Footer</h2>
        <div className="mt-4 grid grid-cols-1 gap-5">
          <div>
            <label htmlFor="footerTagline" className={labelClass}>Tagline</label>
            <textarea
              id="footerTagline"
              rows={2}
              {...register("footerTagline")}
              className={`${inputClass} resize-none`}
            />
            {errors.footerTagline && <p className={errorClass}>{errors.footerTagline.message}</p>}
          </div>
          <div>
            <label htmlFor="footerLocation" className={labelClass}>Location</label>
            <input id="footerLocation" {...register("footerLocation")} className={inputClass} placeholder="India" />
            {errors.footerLocation && <p className={errorClass}>{errors.footerLocation.message}</p>}
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={submitting}
        className="btn-premium inline-flex items-center gap-2 rounded-full bg-sage-dark px-8 py-3.5 font-sans text-sm font-medium text-cream shadow-lift disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {submitting ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
