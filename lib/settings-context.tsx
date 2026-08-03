"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface PublicSettings {
  storeName: string;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramUrl: string;
  instagramHandle: string;
  email: string;
  logo?: { url: string; publicId: string };
  heroBanner?: { url: string; publicId: string };
  footerTagline: string;
  footerLocation: string;
}

// Sensible fallbacks so the site still renders correctly even if the
// settings fetch fails (e.g. DB briefly unavailable) — these match what
// was previously hardcoded, so nothing regresses.
export const FALLBACK_SETTINGS: PublicSettings = {
  storeName: "Soul Hues",
  whatsappNumber: "919144801221",
  whatsappMessage:
    "Hi Soul Hues!\nI'm interested in this jewellery piece.\nPlease share more details.",
  instagramUrl: "https://www.instagram.com/soulhues.official/",
  instagramHandle: "@soulhues.official",
  email: "",
  footerTagline:
    "Handcrafted jewellery made piece by piece in small batches, designed to be worn close and passed down.",
  footerLocation: "India",
};

const SettingsContext = createContext<PublicSettings>(FALLBACK_SETTINGS);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: PublicSettings;
  children: ReactNode;
}) {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings(): PublicSettings {
  return useContext(SettingsContext);
}
