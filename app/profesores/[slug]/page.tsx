import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ProfessorDetailPageClient } from '@/components/landing/ProfessorDetailView';
import { fetchPublicPlatformPricing } from '@/lib/api/platform-settings';
import { TRIAL_DAYS } from '@/lib/landing/constants';
import { resolveTrialDays } from '@/lib/landing/pricing';

export const metadata = {
  title: 'Perfil de profesor | TuCoach',
  description: 'Perfil público de un entrenador en TuCoach.',
};

export default async function ProfesorDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let trialDays = TRIAL_DAYS;
  try {
    const pricing = await fetchPublicPlatformPricing();
    trialDays = resolveTrialDays(pricing);
  } catch {
    // fallback
  }

  return (
    <div className="landing-page min-h-screen bg-[#050505] text-white antialiased">
      <LandingNavbar trialDays={trialDays} />
      <main className="pb-20 pt-28">
        <ProfessorDetailPageClient params={params} />
      </main>
      <LandingFooter />
    </div>
  );
}
