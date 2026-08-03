import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import LoadingScreen from "@/components/LoadingScreen";
import AppProviders from "@/components/AppProviders";
import MiniCart from "@/components/MiniCart";
import { getPublicSettings } from "@/lib/data/settings";
import { getPublicCategories } from "@/lib/data/categories";

/**
 * Chrome for every public-facing page (home, about, products, contact).
 * Deliberately separate from the root layout so /admin/* renders with
 * its own sidebar shell instead of inheriting the storefront's navbar,
 * footer, and floating WhatsApp button.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getPublicSettings(),
    getPublicCategories(),
  ]);

  return (
    <AppProviders settings={settings} categories={categories}>
      <LoadingScreen />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
      <MiniCart />
    </AppProviders>
  );
}
