'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useMiPlanificacion, useStudentMaterialized } from '@/hooks/useStudentPortal';
import { buildAlumnoMetrics } from '@/lib/alumno/metrics';
import { AlumnoProgressHeader } from './AlumnoProgressHeader';
import { AlumnoSessionMetrics } from './AlumnoSessionMetrics';
import { AlumnoPlanificacionVertical } from '@/components/alumno/AlumnoPlanificacionVertical';
import { StandardPlanUnlockButton } from '@/components/alumno/StandardPlanUnlockButton';
import { useTrainsAlone } from '@/hooks/useTrainsAlone';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 sm:p-8">
      <div className="h-32 rounded-2xl bg-muted" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="h-48 rounded-xl bg-muted" />
    </div>
  );
}

export function AlumnoPlanificacionView() {
  const { data: plan, isLoading, error } = useMiPlanificacion();
  const { trainsAlone } = useTrainsAlone();
  const embedded = plan?.materialized;
  const { data: fetchedMaterialized, isLoading: loadingFetched } =
    useStudentMaterialized(embedded ? '' : (plan?.id ?? ''));
  const materialized = embedded ?? fetchedMaterialized;

  const metrics = useMemo(() => {
    if (!plan) return null;
    const source = materialized
      ? {
          config: {
            totalSesiones: materialized.totalSesiones,
            frecuenciaSemanal: plan.config.frecuenciaSemanal,
          },
          progresoAlumno: materialized.progreso,
          createdAt: plan.createdAt,
        }
      : plan;
    return buildAlumnoMetrics(source, plan.progresoResumen);
  }, [plan, materialized]);

  if (isLoading) return <LoadingSkeleton />;

  if (error || !plan) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold text-foreground">Mi planificación</h1>
        <p className="mt-3 text-sm text-destructive">
          No tenés una planificación activa. Contactá a tu profesor.
        </p>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const proxima = plan.progresoResumen.proximaSesion;
  const proximaSesion = proxima
    ? materialized?.sesiones.find((sesion) => sesion.numero === proxima)
    : undefined;
  const proximaBloqueada = Boolean(proximaSesion?.locked);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <AlumnoProgressHeader
        plan={plan}
        metrics={metrics}
        proximaBloqueada={proximaBloqueada}
        sesionesListas={Boolean(materialized)}
        trainsAlone={trainsAlone}
      />
      <AlumnoSessionMetrics metrics={metrics} />

      {materialized?.enrollment ? (
        <div
          className={
            materialized.enrollment.accessStatus === 'locked'
              ? 'rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100'
              : 'rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground'
          }
        >
          {materialized.enrollment.accessStatus === 'purchased' ? (
            <p>Plan completo desbloqueado.</p>
          ) : materialized.enrollment.accessStatus === 'locked' ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Terminaste tu prueba (
                {materialized.enrollment.trialSessionsAllowed} sesiones). Comprá
                el bloque para seguir entrenando.
              </p>
              <StandardPlanUnlockButton
                planificationId={plan.id}
                label="Desbloquear"
                size="sm"
                className="shrink-0"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Prueba: te quedan{' '}
                <strong>{materialized.enrollment.trialSessionsRemaining}</strong>{' '}
                de {materialized.enrollment.trialSessionsAllowed} sesiones
                gratis.
              </p>
              <StandardPlanUnlockButton
                planificationId={plan.id}
                label="Comprar ahora"
                variant="outline"
                size="sm"
                className="shrink-0"
              />
            </div>
          )}
        </div>
      ) : null}

      <section className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Historial de sesiones</h2>
        <Link
          href="/alumno/sesiones"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver listado completo →
        </Link>
      </section>

      {(!embedded && loadingFetched) || !materialized ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : (
        <AlumnoPlanificacionVertical
          planificationId={plan.id}
          materialized={materialized}
          highlightSession={
            proximaBloqueada ? undefined : (proxima ?? undefined)
          }
        />
      )}
    </div>
  );
}
