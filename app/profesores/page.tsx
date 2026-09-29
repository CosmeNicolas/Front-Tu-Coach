import { publicMetadata } from '@/lib/seo/site';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ProfessorsCatalogView } from '@/components/landing/ProfessorsCatalogView';
import { fetchPublicPlatformPricing } from '@/lib/api/platform-settings';
import { TRIAL_DAYS } from '@/lib/landing/constants';
import { resolveTrialDays } from '@/lib/landing/pricing';

export const metadata = publicMetadata({
  title: 'Profesores',
  description:
    'Encontrá entrenadores para entrenar online o presencial. Mirá su perfil, especialidades y pedí seguimiento en TuCoach.',
  path: '/profesores',
});

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
