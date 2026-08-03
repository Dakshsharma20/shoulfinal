"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

export default function AddToCartButton({
  item,
  quantity = 1,
  size = "sm",
  className,
  fullWidth = true,
}: {
  item: Omit<CartItem, "quantity">;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullWidth?: boolean;
}) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!item.inStock}
      className={cn(
        "btn-premium group inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide transition-colors",
        fullWidth && "w-full",
        sizes[size],
        item.inStock
          ? justAdded
            ? "bg-sage-dark text-cream"
            : "bg-ink text-cream hover:bg-sage-dark"
          : "cursor-not-allowed bg-line text-ink-light",
        className
      )}
    >
      {justAdded ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingBag
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
          {item.inStock ? "Add to Cart" : "Out of Stock"}
        </>
      )}
    </button>
  );
}
