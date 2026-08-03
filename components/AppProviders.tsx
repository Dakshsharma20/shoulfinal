"use client";

import { type ReactNode } from "react";
import { SettingsProvider, type PublicSettings } from "@/lib/settings-context";
import { CategoriesProvider, type PublicCategory } from "@/lib/categories-context";
import { CartProvider } from "@/lib/cart-context";

export default function AppProviders({
  settings,
  categories,
  children,
}: {
  settings: PublicSettings;
  categories: PublicCategory[];
  children: ReactNode;
}) {
  return (
    <SettingsProvider settings={settings}>
      <CategoriesProvider categories={categories}>
        <CartProvider>{children}</CartProvider>
      </CategoriesProvider>
    </SettingsProvider>
  );
}
