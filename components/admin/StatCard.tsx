import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "sage",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "sage" | "ink";
}) {
  return (
    <div className="rounded-[22px] bg-white p-6 shadow-soft">
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full",
          accent === "sage" ? "bg-sage/10 text-sage-dark" : "bg-ink/8 text-ink"
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="mt-4 font-serif text-3xl tracking-tight text-ink">{value}</p>
      <p className="mt-1 font-sans text-sm text-ink-light">{label}</p>
    </div>
  );
}
