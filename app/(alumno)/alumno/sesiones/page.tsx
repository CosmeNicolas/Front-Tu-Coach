'use client';

import Link from 'next/link';
import {
  useMiPlanificacion,
  useStudentMaterialized,
} from '@/hooks/useStudentPortal';
import { SessionHistorialList } from '@/components/alumno/SessionHistorialList';
import { buildAlumnoMetrics } from '@/lib/alumno/metrics';

export default function SesionesAlumnoPage() {
  const { data: plan, isLoading: loadingPlan, error: planError } =
    useMiPlanificacion();
  const {
    data: materialized,
    isLoading: loadingMat,
    error: matError,
  } = useStudentMaterialized(plan?.id ?? '');

  if (loadingPlan) {
    return <p className="p-8 text-sm text-muted-foreground">Cargando sesiones…</p>;
  }

  if (planError || !plan) {
    return (
      <p className="p-8 text-sm text-destructive">
        No se pudo cargar tu planificación.
      </p>
    );
  }

  const metrics = buildAlumnoMetrics(plan, plan.progresoResumen);

  if (loadingMat) {
    return <p className="p-8 text-sm text-muted-foreground">Cargando sesiones…</p>;
  }

  if (matError || !materialized) {
    return (
      <p className="p-8 text-sm text-destructive">
        No se pudieron cargar las sesiones materializadas.
      </p>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header data-tour="alumno-sesiones-header">
        <Link
          href="/alumno/mi-planificacion"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Mi planificación
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Sesiones</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {plan.titulo} · {metrics.completadas}/{metrics.total} completadas
        </p>
      </header>

      <SessionHistorialList
        planificationId={plan.id}
        materialized={materialized}
      />
    </div>
  );
}
