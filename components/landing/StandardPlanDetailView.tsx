'use client';

import Link from 'next/link';
import { use } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Check } from 'lucide-react';
import { ApiError } from '@/lib/api/client';
import { usePublicStandardPlan } from '@/hooks/useStandardPlans';
import {
  STANDARD_PLAN_LEVEL_LABELS,
  StandardPlanLevel,
} from '@/types/standard-plan';
import { LANDING_CONTAINER, STANDARD_PLAN_TRIAL_SESSIONS } from '@/lib/landing/constants';
import { standardPlanTrialPhrase } from '@/lib/landing/pricing';
import { LandingButton } from '@/components/landing/LandingButton';
import { StandardPlanPreviewSection } from '@/components/landing/StandardPlanPreviewSection';
import { Button } from '@/components/ui/button';

function formatArs(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

export function StandardPlanDetailView({
  slug: slugProp,
  trialSessions = STANDARD_PLAN_TRIAL_SESSIONS,
}: {
  slug?: string;
  trialSessions?: number;
}) {
  // supports both direct prop and next page wrapper
  const slug = slugProp ?? '';
  const { data, error, isLoading } = usePublicStandardPlan(slug);

  if (isLoading) {
    return (
      <div className={LANDING_CONTAINER}>
        <p className="text-sm text-[#737373]">Cargando plan…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`${LANDING_CONTAINER} space-y-4`}>
        <Button asChild variant="ghost" className="text-[#A3A3A3]">
          <Link href="/entrenamientos">
            <FontAwesomeIcon icon={faCircleArrowLeft} className="size-4" />
            Volver
          </Link>
        </Button>
        <p className="text-sm text-[#A3A3A3]">
          {error instanceof ApiError && error.status === 404
            ? 'Plan no encontrado o catálogo desactivado.'
            : 'No se pudo cargar el plan.'}
        </p>
      </div>
    );
  }

  const trialPhrase = standardPlanTrialPhrase(trialSessions);
  const level =
    STANDARD_PLAN_LEVEL_LABELS[data.nivel as StandardPlanLevel] ?? data.nivel;

  return (
    <div className={LANDING_CONTAINER}>
      <Button asChild variant="ghost" className="-ml-2 mb-6 text-[#A3A3A3]">
        <Link href="/entrenamientos">
          <FontAwesomeIcon icon={faCircleArrowLeft} className="size-4" />
          Entrenamientos
        </Link>
      </Button>

      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
          {level}
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-wide text-white sm:text-5xl">
          {data.nombre}
        </h1>
        <p className="mt-4 text-lg text-[#A3A3A3]">
          {data.descripcion || data.objetivo}
        </p>

        <p className="mt-8 font-display text-4xl text-white">
          {formatArs(data.precioArs)}
          <span className="ml-2 font-sans text-base font-normal text-[#737373]">
            el bloque
          </span>
        </p>

        <ul className="mt-8 space-y-3">
          {[
            `Objetivo: ${data.objetivo}`,
            `${data.config.semanasDelPlan} semanas · ${data.config.frecuenciaSemanal} días por semana`,
            `${data.config.totalSesiones} sesiones en total`,
            'Sin kilos prescritos — ajustás la carga a tu nivel',
          ].map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[#A3A3A3]">
              <Check className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <LandingButton
            href={`/registro/entrenar?plan=${encodeURIComponent(data.slug)}`}
            variant="primary"
          >
            Probar {trialPhrase} gratis
          </LandingButton>
          <LandingButton href="/entrenamientos" variant="secondary">
            Ver otros
          </LandingButton>
        </div>
        <p className="mt-4 text-xs text-[#737373]">
          Creás tu cuenta, entrenás {trialPhrase} y después desbloqueás el resto del
          bloque con Mercado Pago.
        </p>

        <StandardPlanPreviewSection slug={data.slug} />
      </div>
    </div>
  );
}

export function StandardPlanDetailPageClient({
  params,
  trialSessions,
}: {
  params: Promise<{ slug: string }>;
  trialSessions?: number;
}) {
  const { slug } = use(params);
  return <StandardPlanDetailView slug={slug} trialSessions={trialSessions} />;
}
