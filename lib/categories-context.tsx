"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface PublicCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; publicId: string };
  displayOrder: number;
}

const CategoriesContext = createContext<PublicCategory[]>([]);

export function CategoriesProvider({
  categories,
  children,
}: {
  categories: PublicCategory[];
  children: ReactNode;
}) {
  return <CategoriesContext.Provider value={categories}>{children}</CategoriesContext.Provider>;
}

export function useCategories(): PublicCategory[] {
  return useContext(CategoriesContext);
}
