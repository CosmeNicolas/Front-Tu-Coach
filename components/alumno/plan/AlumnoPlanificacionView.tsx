'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useMiPlanificacion, useStudentMaterialized } from '@/hooks/useStudentPortal';
import { buildAlumnoMetrics } from '@/lib/alumno/metrics';
import { AlumnoProgressHeader } from './AlumnoProgressHeader';
import { AlumnoSessionMetrics } from './AlumnoSessionMetrics';
import { AlumnoPlanificacionVertical } from '@/components/alumno/AlumnoPlanificacionVertical';

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
  const { data: materialized, isLoading: loadingMat } = useStudentMaterialized(
    plan?.id ?? '',
  );

  const metrics = useMemo(() => {
    if (!plan) return null;
    const source = materialized
      ? {
          config: { totalSesiones: materialized.totalSesiones },
          progresoAlumno: materialized.progreso,
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

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <AlumnoProgressHeader plan={plan} metrics={metrics} />
      <AlumnoSessionMetrics metrics={metrics} />

      <section className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Historial de sesiones</h2>
        <Link
          href="/alumno/sesiones"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver listado completo →
        </Link>
      </section>

      {loadingMat || !materialized ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : (
        <AlumnoPlanificacionVertical
          planificationId={plan.id}
          materialized={materialized}
          highlightSession={plan.progresoResumen.proximaSesion ?? undefined}
        />
      )}
    </div>
  );
}
