import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's signature visual motif: a thin sage corner-bracket frame,
 * directly lifted from the four ornamental brackets in the Soul Hues
 * logo mark. Wrap any image or card in this to tie it back to the brand.
 */
export default function CornerFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("corner-frame", className)}>{children}</div>;
}
