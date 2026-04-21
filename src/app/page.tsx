import HeroSection from '@/components/sections/HeroSection';
import SocialProofSection from '@/components/sections/SocialProofSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import AnalyticsMapSection from '@/components/sections/AnalyticsMapSection';
import CTASection from '@/components/sections/CTASection';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
      <AnalyticsMapSection />
      <CTASection />
    </main>
  );
}
