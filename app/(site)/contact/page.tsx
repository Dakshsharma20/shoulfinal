import type { Metadata } from "next";
import ContactHero from "@/components/ContactHero";
import ContactForm from "@/components/ContactForm";
import BusinessInfo from "@/components/BusinessInfo";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Soul Hues for orders, customisation, and questions. Message us on WhatsApp or Instagram, or use the contact form.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Soul Hues",
    description:
      "Get in touch for orders, customisation, and questions \u2014 on WhatsApp, Instagram, or the contact form.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div>
      <ContactHero />
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ContactForm />
          <BusinessInfo />
        </div>
      </section>
      <FAQAccordion />
    </div>
  );
}
