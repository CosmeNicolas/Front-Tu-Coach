'use client';

import { ApiError } from '@/lib/api/client';
import { usePublicStandardPlans } from '@/hooks/useStandardPlans';
import {
  STANDARD_PLAN_LEVEL_LABELS,
  StandardPlanLevel,
} from '@/types/standard-plan';
import type { PublicStandardPlan } from '@/lib/api/standard-plans';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { standardPlanTrialPhrase } from '@/lib/landing/pricing';
import { SectionHeader } from '@/components/landing/SectionHeader';
import { LandingButton } from '@/components/landing/LandingButton';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatArs(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

function CatalogCard({ plan }: { plan: PublicStandardPlan }) {
  const level =
    STANDARD_PLAN_LEVEL_LABELS[plan.nivel as StandardPlanLevel] ?? plan.nivel;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#101010] p-6 transition-all hover:border-white/18">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
        {level}
      </p>
      <h2 className="font-display text-2xl tracking-wide text-white">
        {plan.nombre}
      </h2>
      <p className="mt-1 line-clamp-3 text-sm text-[#737373]">
        {plan.descripcion || plan.objetivo}
      </p>
      <p className="mt-4 font-display text-3xl text-white">
        {formatArs(plan.precioArs)}
        <span className="ml-1 font-sans text-sm font-normal text-[#737373]">
          el bloque
        </span>
      </p>
      <ul className="mb-8 mt-6 flex-1 space-y-3">
        {[
          `${plan.config.semanasDelPlan} semanas · ${plan.config.frecuenciaSemanal} días/sem`,
          `${plan.config.totalSesiones} sesiones`,
          'Sin kilos prescritos',
        ].map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-[#A3A3A3]">
            <Check className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <LandingButton
        href={`/entrenamientos/${plan.slug}`}
        variant="secondary"
        className="w-full"
      >
        Ver detalle
      </LandingButton>
    </article>
  );
}

export function StandardPlansCatalogView({
  trialSessions = 2,
}: {
  trialSessions?: number;
}) {
  const { data, error, isLoading } = usePublicStandardPlans();

  if (isLoading) {
    return (
      <div className={LANDING_CONTAINER}>
        <p className="text-sm text-[#737373]">Cargando entrenamientos…</p>
      </div>
    );
  }

  if (error instanceof ApiError && error.status === 404) {
    return (
      <div className={LANDING_CONTAINER}>
        <SectionHeader
          title="Entrenamientos"
          description="El catálogo público todavía no está activado. Pronto vas a poder elegir un plan y entrenar por tu cuenta."
        />
      </div>
    );
  }

  if (error || !data?.items?.length) {
    return (
      <div className={LANDING_CONTAINER}>
        <SectionHeader
          title="Entrenamientos"
          description="Todavía no hay planificaciones publicadas. Volvé pronto."
        />
      </div>
    );
  }

  return (
    <div className={LANDING_CONTAINER}>
      <SectionHeader
        label="Entrená por tu cuenta"
        title="Planificaciones estándar"
        description={`Elegí un plan de TuCoach. Creás tu cuenta, entrenás ${standardPlanTrialPhrase(trialSessions)} y después desbloqueás el resto del bloque.`}
      />
      <div
        className={cn(
          'mt-12 grid gap-5',
          data.items.length === 1
            ? 'mx-auto max-w-md'
            : data.items.length === 2
              ? 'sm:grid-cols-2'
              : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {data.items.map((plan) => (
          <CatalogCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
