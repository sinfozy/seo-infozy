import { FaqSection } from "@/components/home/faq";
import { FeaturesSection } from "@/components/home/features";
import { HeroSection } from "@/components/home/hero";
import { MainHeroSection } from "@/components/home/main-hero";
import { TestimonialsSection } from "@/components/home/testimonials";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <MainHeroSection />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FaqSection />
    </main>
  );
}
