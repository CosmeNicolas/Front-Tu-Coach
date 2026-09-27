import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { StandardPlanDetailPageClient } from '@/components/landing/StandardPlanDetailView';
import { fetchPublicPlatformPricing } from '@/lib/api/platform-settings';
import { STANDARD_PLAN_TRIAL_SESSIONS, TRIAL_DAYS } from '@/lib/landing/constants';
import { resolveTrialDays, resolveStandardPlanTrialSessions } from '@/lib/landing/pricing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: `${slug} | Entrenamientos TuCoach`,
    description: 'Planificación estándar de TuCoach para entrenar por tu cuenta.',
  };
}

export default async function EntrenamientoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
        <StandardPlanDetailPageClient
          params={params}
          trialSessions={trialSessions}
        />
      </main>
      <LandingFooter />
    </div>
  );
}
