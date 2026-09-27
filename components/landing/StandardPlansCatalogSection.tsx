'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
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
import {
  ScrollReveal,
  StaggerGrid,
  StaggerItem,
} from '@/components/landing/ScrollReveal';
import { cn } from '@/lib/utils';

function formatArs(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

function levelLabel(nivel: string) {
  return (
    STANDARD_PLAN_LEVEL_LABELS[nivel as StandardPlanLevel] ?? nivel
  );
}

function CatalogCard({
  plan,
  trialSessions,
}: {
  plan: PublicStandardPlan;
  trialSessions: number;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#101010] p-6 transition-all duration-300 hover:border-white/18">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
        {levelLabel(plan.nivel)}
      </p>
      <h3 className="font-display text-2xl tracking-wide text-white">
        {plan.nombre}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-[#737373]">
        {plan.objetivo}
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
          'Sin kilos prescritos — ajustás la carga',
          `${standardPlanTrialPhrase(trialSessions)} de prueba al registrarte`,
        ].map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm text-[#A3A3A3]"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>
      <LandingButton
        href={`/entrenamientos/${plan.slug}`}
        variant="secondary"
        className="w-full"
      >
        Ver plan
      </LandingButton>
    </article>
  );
}

/**
 * Sección landing Etapa 3. Si el flag público está off o no hay planes,
 * no renderiza nada (cero impacto).
 */
export function StandardPlansCatalogSection({
  trialSessions = 2,
}: {
  trialSessions?: number;
}) {
  const { data, error, isLoading } = usePublicStandardPlans();

  if (isLoading) return null;
  if (error instanceof ApiError && error.status === 404) return null;
  if (error || !data?.items?.length) return null;

  return (
    <section
      id="entrenamientos"
      className="border-t border-white/10 bg-[#050505] py-20 sm:py-24"
    >
      <div className={LANDING_CONTAINER}>
        <ScrollReveal>
          <SectionHeader
            label="Entrená por tu cuenta"
            title="Planificaciones estándar"
            description="Planes listos de TuCoach. Probá, comprá el bloque completo y entrená sin profesor. Después podés contratar uno si querés."
          />
        </ScrollReveal>

        <StaggerGrid
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
            <StaggerItem key={plan.id}>
              <CatalogCard plan={plan} trialSessions={trialSessions} />
            </StaggerItem>
          ))}
        </StaggerGrid>

        <div className="mt-10 text-center">
          <Link
            href="/entrenamientos"
            className="text-sm font-medium text-[#A3A3A3] underline-offset-4 hover:text-white hover:underline"
          >
            Ver todos los entrenamientos
          </Link>
        </div>
      </div>
    </section>
  );
}
