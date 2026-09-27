import { RegisterAutogestionadoForm } from '@/components/auth/RegisterAutogestionadoForm';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { fetchPublicPlatformPricing } from '@/lib/api/platform-settings';
import { fetchPublicStandardPlan } from '@/lib/api/standard-plans';
import { STANDARD_PLAN_TRIAL_SESSIONS } from '@/lib/landing/constants';
import { resolveStandardPlanTrialSessions } from '@/lib/landing/pricing';

export default async function RegistroAutogestionadoPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planSlug } = await searchParams;
  let planNombre: string | undefined;
  let trialSessions = STANDARD_PLAN_TRIAL_SESSIONS;

  try {
    const pricing = await fetchPublicPlatformPricing();
    trialSessions = resolveStandardPlanTrialSessions(pricing);
  } catch {
    // fallback
  }

  if (planSlug?.trim()) {
    try {
      const plan = await fetchPublicStandardPlan(planSlug.trim());
      planNombre = plan.nombre;
    } catch {
      // slug inválido o catálogo off — el back validará al registrar
    }
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-black/30 p-1 backdrop-blur-md">
        <ThemeToggle
          variant="compact"
          className="text-white [&_svg]:text-white/90"
        />
      </div>
      <RegisterAutogestionadoForm
        standardPlanSlug={planSlug?.trim() || undefined}
        planNombre={planNombre}
        trialSessions={trialSessions}
      />
    </div>
  );
}
