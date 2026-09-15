import { AirportSearchBar } from "@/component_items/AirportSearchBar";
import { BlogCarousel } from "@/component_items/blog/BlogCarousel";
import { FaqSection } from "@/component_items/FaqSection";
import Hero_top_home from "@/component_items/hero_section/hero_top_home";
import { NightsHero } from "@/component_items/NightsHero";
import { SignInBanner } from "@/component_items/SignInBanner";
import { TestimonialsSection } from "@/component_items/TestimonialsSection";
import TravelHero from "@/component_items/TravelHero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full ">
      <Hero_top_home />
      <TravelHero />
      <BlogCarousel />
      <SignInBanner />
      <NightsHero />
      <FaqSection />
      <TestimonialsSection />
    </div>
  );
}
