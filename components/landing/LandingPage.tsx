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
import { PlatformBenefitsSection } from '@/components/landing/PlatformBenefitsSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { resolveTrialDays } from '@/lib/landing/pricing';
import type { PublicPlatformPricing } from '@/types/platform-pricing';

export function LandingPage({ pricing }: { pricing?: PublicPlatformPricing }) {
  const trialDays = resolveTrialDays(pricing);

  return (
    <div className="landing-page min-h-screen bg-[#050505] text-white antialiased">
      <LandingNavbar trialDays={trialDays} />
      <main>
        <HeroSection trialDays={trialDays} />
        <TrustedBySection />
        <FeaturesSection />
        <CoachesSection />
        <ContentSection />
        <PlanningAssistantSection />
        <CommunicationSection />
        <HowItWorksSection trialDays={trialDays} />
        <TestimonialsSection />
        <GymsSection />
        <PricingSection pricing={pricing} />
        <PlatformBenefitsSection />
        <FinalCTA trialDays={trialDays} />
      </main>
      <LandingFooter />
    </div>
  );
}
