"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Newsletter({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  const dark = variant === "dark";

  if (submitted) {
    return (
      <p
        className={cn(
          "flex items-center gap-2 font-sans text-sm",
          dark ? "text-sage-accent" : "text-ink"
        )}
      >
        <Check className="h-4 w-4" /> You&rsquo;re on the list &mdash; thank you!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xs">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn(
          "w-full rounded-l-full border px-4 py-2.5 text-sm outline-none transition-colors",
          dark
            ? "border-cream/25 bg-transparent text-cream placeholder:text-cream/40 focus:border-sage-accent"
            : "border-line bg-white text-ink placeholder:text-ink-light focus:border-sage-dark"
        )}
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className={cn(
          "flex items-center justify-center rounded-r-full px-4 transition-colors",
          dark
            ? "bg-sage-accent text-ink hover:bg-cream"
            : "bg-sage-dark text-cream hover:bg-ink"
        )}
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
