import type { Metadata } from "next";
import FounderSection from "@/components/FounderSection";
import MissionValues from "@/components/MissionValues";
import ProcessTimeline from "@/components/ProcessTimeline";
import WhyHandmadeMatters from "@/components/WhyHandmadeMatters";

export const metadata: Metadata = {
  title: "About Shivani",
  description:
    "Meet Shivani, the founder behind Soul Hues, and discover the handmade process behind every piece of jewellery \u2014 from first sketch to your doorstep.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Shivani | Soul Hues",
    description:
      "Meet Shivani, the founder behind Soul Hues, and discover the handmade process behind every piece.",
    url: "/about",
    images: [{ url: "/images/founder-shivani.svg", width: 900, height: 1100, alt: "Shivani, founder of Soul Hues" }],
  },
};

export default function AboutPage() {
  return (
    <div className="pt-24">
      <FounderSection />
      <MissionValues />
      <ProcessTimeline />
      <WhyHandmadeMatters />
    </div>
  );
}
