"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  categoryName: string;
  /** Snapshot of stock status at the time it was added; re-validated at checkout. */
  inStock: boolean;
}

const STORAGE_KEY = "soulhues_cart_v1";

// Placeholder shipping/tax rules — easy to tune here without touching
// any component. Tax is intentionally 0 (a real rate can be wired in
// once the business registers for GST/sales tax collection).
export const FREE_SHIPPING_THRESHOLD = 999;
export const FLAT_SHIPPING_RATE = 79;
export const TAX_RATE = 0;

function calculateShipping(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingCharge: number;
  tax: number;
  total: number;
  isHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isMiniCartOpen: boolean;
  openMiniCart: () => void;
  closeMiniCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  // Load from localStorage once, on mount (client-only — localStorage
  // isn't available during server rendering).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Corrupted or inaccessible storage — start with an empty cart
      // rather than crashing the page.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist on every change, once hydrated (avoids overwriting saved
  // data with an empty array during the initial mount).
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full/unavailable (e.g. private browsing) — cart still
      // works for the current session, just won't persist.
    }
  }, [items, isHydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsMiniCartOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { itemCount, subtotal, shippingCharge, tax, total } = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const sub = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = calculateShipping(sub);
    const taxAmount = Math.round(sub * TAX_RATE);
    return {
      itemCount: count,
      subtotal: sub,
      shippingCharge: shipping,
      tax: taxAmount,
      total: sub + shipping + taxAmount,
    };
  }, [items]);

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    shippingCharge,
    tax,
    total,
    isHydrated,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isMiniCartOpen,
    openMiniCart: () => setIsMiniCartOpen(true),
    closeMiniCart: () => setIsMiniCartOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart() must be used within a <CartProvider>.");
  }
  return ctx;
}
