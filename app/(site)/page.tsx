import Hero from "@/components/Hero";
import AnnouncementBar from "@/components/AnnouncementBar";
import CategoryGrid from "@/components/CategoryGrid";
import BestSellers from "@/components/BestSellers";
import NewArrivals from "@/components/NewArrivals";
import Gallery from "@/components/Gallery";
import FeaturedReels from "@/components/FeaturedReels";
import FounderStoryHome from "@/components/FounderStoryHome";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import InstagramCTA from "@/components/InstagramCTA";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AnnouncementBar />
      <CategoryGrid />
      <BestSellers />
      <NewArrivals />
      <Gallery />
      <FeaturedReels />
      <FounderStoryHome />
      <WhyChooseUs />
      <Testimonials />
      <InstagramCTA />
      <CTASection />
    </>
  );
}
