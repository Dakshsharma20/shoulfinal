"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations/schemas";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Login failed. Please try again.");
        setSubmitting(false);
        return;
      }
      const redirectTo = searchParams.get("from") || "/admin/dashboard";
      router.push(redirectTo);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-alt px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative h-16 w-16">
            <Image
              src="/images/logo-soulhues.png"
              alt="Soul Hues"
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>
          <h1 className="mt-4 font-serif text-2xl tracking-tight text-ink">
            Admin Login
          </h1>
          <p className="mt-1 font-sans text-sm text-ink-light">
            Sign in to manage Soul Hues
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-[22px] bg-white p-8 shadow-soft"
          noValidate
        >
          {serverError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {serverError}
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="email" className="mb-1.5 block font-sans text-sm text-ink-light">
              Email
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                autoComplete="username"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="w-full rounded-xl border border-line bg-cream/40 py-3 pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-sage-dark"
                placeholder="admin@soulhues.example"
              />
            </div>
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block font-sans text-sm text-ink-light">
              Password
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
                aria-hidden="true"
              />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className="w-full rounded-xl border border-line bg-cream/40 py-3 pl-10 pr-4 text-sm text-ink outline-none transition-colors focus:border-sage-dark"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-premium flex w-full items-center justify-center gap-2 rounded-full bg-sage-dark px-6 py-3.5 font-sans text-sm font-medium text-cream shadow-lift disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center font-sans text-xs text-ink-light">
          Soul Hues Admin &mdash; authorised access only
        </p>
      </div>
    </div>
  );
}
