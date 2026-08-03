import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrustedBySection } from '@/components/landing/TrustedBySection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CoachesSection } from '@/components/landing/CoachesSection';
import { ContentSection } from '@/components/landing/ContentSection';
import { PlanningAssistantSection } from '@/components/landing/PlanningAssistantSection';
import { CommunicationSection } from '@/components/landing/CommunicationSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { GymsSection } from '@/components/landing/GymsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { LandingFooter } from '@/components/landing/LandingFooter';

export function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-[#050505] text-white antialiased">
      <LandingNavbar />
      <main>
        <HeroSection />
        <TrustedBySection />
        <FeaturesSection />
        <CoachesSection />
        <ContentSection />
        <PlanningAssistantSection />
        <CommunicationSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <GymsSection />
        <PricingSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
