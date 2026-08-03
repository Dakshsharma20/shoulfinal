import { cn } from "@/lib/utils";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <RevealOnScroll
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" ? "text-center" : "text-left mx-0",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "eyebrow mb-5 flex items-center gap-3 text-sage-dark",
            align === "center" && "justify-center"
          )}
        >
          <span aria-hidden="true" className="h-px w-8 bg-sage/60" />
          {eyebrow}
          <span aria-hidden="true" className="h-px w-8 bg-sage/60" />
        </div>
      )}
      <h2 className="text-balance font-serif text-[clamp(2rem,4.2vw,3rem)] font-medium leading-[1.15] tracking-tight text-ink">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 max-w-xl text-balance font-sans text-base leading-relaxed text-ink-light md:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </RevealOnScroll>
  );
}
