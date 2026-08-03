"use client";

import { cn } from "@/lib/utils";

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line px-4 py-3 transition-colors",
        checked && "border-sage/40 bg-sage/5",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <span>
        <span className="block font-sans text-sm font-medium text-ink">{label}</span>
        {description && (
          <span className="mt-0.5 block font-sans text-xs text-ink-light">{description}</span>
        )}
      </span>
      <span className="relative inline-flex flex-shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={cn(
            "block h-6 w-11 rounded-full transition-colors",
            checked ? "bg-sage-dark" : "bg-line"
          )}
        />
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform",
            checked && "translate-x-5"
          )}
        />
      </span>
    </label>
  );
}
