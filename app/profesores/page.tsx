import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ProfessorsCatalogView } from '@/components/landing/ProfessorsCatalogView';
import { fetchPublicPlatformPricing } from '@/lib/api/platform-settings';
import { TRIAL_DAYS } from '@/lib/landing/constants';
import { resolveTrialDays } from '@/lib/landing/pricing';

export const metadata = {
  title: 'Profesores | TuCoach',
  description:
    'Encontrá entrenadores en TuCoach. Perfiles públicos de coaches Premium.',
};

export default async function ProfesoresPage() {
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
        <ProfessorsCatalogView />
      </main>
      <LandingFooter />
    </div>
  );
}
