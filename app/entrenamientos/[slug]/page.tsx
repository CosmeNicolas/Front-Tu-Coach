import type { Metadata } from 'next';
import { fetchPublicStandardPlan } from '@/lib/api/standard-plans';
import { publicMetadata } from '@/lib/seo/site';
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
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const plan = await fetchPublicStandardPlan(slug);
    const description =
      plan.descripcion?.trim().slice(0, 160) ||
      `Plan ${plan.nombre} de TuCoach para entrenar por tu cuenta. ${plan.config.semanasDelPlan} semanas, ${plan.config.frecuenciaSemanal} días por semana.`;
    return publicMetadata({
      title: plan.nombre,
      description,
      path: `/entrenamientos/${plan.slug}`,
      image: plan.imagenUrl,
    });
  } catch {
    return publicMetadata({
      title: 'Plan de entrenamiento',
      description: 'Planificación estándar de TuCoach para entrenar por tu cuenta.',
      path: `/entrenamientos/${slug}`,
      index: false,
    });
  }
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
