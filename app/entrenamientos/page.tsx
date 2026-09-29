import { publicMetadata } from '@/lib/seo/site';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { StandardPlansCatalogView } from '@/components/landing/StandardPlansCatalogView';
import { fetchPublicPlatformPricing } from '@/lib/api/platform-settings';
import { STANDARD_PLAN_TRIAL_SESSIONS, TRIAL_DAYS } from '@/lib/landing/constants';
import { resolveTrialDays, resolveStandardPlanTrialSessions } from '@/lib/landing/pricing';

export const metadata = publicMetadata({
  title: 'Entrenamientos',
  description:
    'Planes de entrenamiento listos para empezar por tu cuenta. Probá sesiones gratis y desbloqueá el plan completo.',
  path: '/entrenamientos',
});

export default async function EntrenamientosPage() {
  let trialDays = TRIAL_DAYS;
  let trialSessions = STANDARD_PLAN_TRIAL_SESSIONS;
  try {
    const pricing = await fetchPublicPlatformPricing();
    trialDays = resolveTrialDays(pricing);
    trialSessions = resolveStandardPlanTrialSessions(pricing);
  } catch {
    // fallback
  }

  return (
    <div className="landing-page min-h-screen bg-[#050505] text-white antialiased">
      <LandingNavbar trialDays={trialDays} />
      <main className="pb-20 pt-28">
        <StandardPlansCatalogView trialSessions={trialSessions} />
      </main>
      <LandingFooter />
    </div>
  );
}
