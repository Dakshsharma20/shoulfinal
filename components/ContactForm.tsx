"use client";

import { FormEvent, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import { cn } from "@/lib/utils";
import { buildContactFormLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

const EMPTY: FormState = { name: "", phone: "", email: "", message: "" };

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Please share your name.";
  if (!values.phone.trim()) {
    errors.phone = "Please share a phone number.";
  } else if (!/^[+]?[\d\s-]{8,15}$/.test(values.phone.trim())) {
    errors.phone = "That doesn't look like a valid phone number.";
  }
  if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "That doesn't look like a valid email.";
  }
  if (!values.message.trim()) errors.message = "Tell us a little about what you need.";
  return errors;
}

const inputBase =
  "w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm outline-none transition-colors duration-300 focus:border-sage-dark";

export default function ContactForm() {
  const settings = useSettings();
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const link = buildContactFormLink(settings.whatsappNumber, values.name, values.phone, values.message);
    window.open(link, "_blank", "noopener,noreferrer");
    setSent(true);
    setValues(EMPTY);
  }

  return (
    <RevealOnScroll effect="slide-right" className="h-full">
      <div className="h-full rounded-[2rem] bg-white p-8 shadow-soft md:p-10">
        <h2 className="font-serif text-2xl tracking-tight text-ink md:text-3xl">
          Send a Message
        </h2>
        <p className="mt-2 font-sans text-sm text-ink-light">
          We&rsquo;ll open WhatsApp with your details pre-filled so you can
          send it straight to us.
        </p>

        {sent && (
          <div
            role="status"
            aria-live="polite"
            className="mt-5 flex items-center gap-2 rounded-xl bg-sage/10 px-4 py-3 text-sm text-ink"
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            Opened WhatsApp with your message ready to send.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="mb-1.5 block font-sans text-sm text-ink-light">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={cn(inputBase, errors.name ? "border-red-300" : "border-line")}
              placeholder="Your full name"
            />
            {errors.name && (
              <p id="name-error" role="alert" className="mt-1 text-xs text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="mb-1.5 block font-sans text-sm text-ink-light">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={cn(inputBase, errors.phone ? "border-red-300" : "border-line")}
                placeholder="+91 00000 00000"
              />
              {errors.phone && (
                <p id="phone-error" role="alert" className="mt-1 text-xs text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block font-sans text-sm text-ink-light">
                Email <span className="text-ink-light">(optional)</span>
              </label>
              <input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn(inputBase, errors.email ? "border-red-300" : "border-line")}
                placeholder="you@email.com"
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block font-sans text-sm text-ink-light">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={cn(inputBase, "resize-none", errors.message ? "border-red-300" : "border-line")}
              placeholder="Tell us what you're looking for..."
            />
            {errors.message && (
              <p id="message-error" role="alert" className="mt-1 text-xs text-red-500">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn-premium group inline-flex w-full items-center justify-center gap-2 rounded-full bg-sage-dark px-6 py-3.5 font-sans text-sm font-medium text-cream shadow-lift"
          >
            Send via WhatsApp
            <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </form>
      </div>
    </RevealOnScroll>
  );
}
