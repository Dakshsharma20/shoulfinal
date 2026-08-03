import { cache } from "react";
import { getOrCreateSettings } from "@/lib/data/getOrCreateSettings";
import { FALLBACK_SETTINGS, type PublicSettings } from "@/lib/settings-context";

/**
 * Used at both the root layout (for JSON-LD) and the (site) layout (to
 * hydrate SettingsProvider). Wrapped in React's cache() so those two
 * calls within the same request only hit MongoDB once. Falls back to
 * sensible defaults if MongoDB isn't reachable, so a DB hiccup never
 * takes down the whole site (WhatsApp/Instagram links still work, just
 * with the last-known-good values instead of live-edited ones).
 */
export const getPublicSettings = cache(async (): Promise<PublicSettings> => {
  try {
    const settings = await getOrCreateSettings();
    return {
      storeName: settings.storeName,
      whatsappNumber: settings.whatsappNumber,
      whatsappMessage: settings.whatsappMessage,
      instagramUrl: settings.instagramUrl,
      instagramHandle: settings.instagramHandle,
      email: settings.email,
      logo: settings.logo?.url ? settings.logo : undefined,
      heroBanner: settings.heroBanner?.url ? settings.heroBanner : undefined,
      footerTagline: settings.footerTagline,
      footerLocation: settings.footerLocation,
    };
  } catch (err) {
    console.error("Failed to load settings from MongoDB, using fallback values:", err);
    return FALLBACK_SETTINGS;
  }
});
