'use client';

import Link from 'next/link';
import { use } from 'react';
import {
  useMiPlanificacion,
  useStudentMaterialized,
} from '@/hooks/useStudentPortal';
import { AlumnoSesionExecutionView } from '@/components/alumno/session/AlumnoSesionExecutionView';

export default function SesionAlumnoPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = use(params);
  const sesionNum = Number.parseInt(n, 10);
  const { data: plan, isLoading: loadingPlan } = useMiPlanificacion();
  const { data, isLoading, error } = useStudentMaterialized(plan?.id ?? '');

  if (loadingPlan || isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-4">
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="h-24 rounded-xl bg-muted" />
        <div className="h-64 rounded-xl bg-muted" />
      </div>
    );
  }

  if (error || !data || !plan) {
    return (
      <p className="p-8 text-sm text-destructive">
        No se pudo cargar la sesión.
      </p>
    );
  }

  if (!data.sesiones.some((s) => s.numero === sesionNum)) {
    return (
      <div className="p-8">
        <p className="text-sm text-destructive">
          Sesión {sesionNum} no encontrada.
        </p>
        <Link href="/alumno/sesiones" className="mt-3 inline-block text-sm text-primary">
          Volver al historial
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 pb-8 sm:p-6">
      <AlumnoSesionExecutionView
        plan={plan}
        materialized={data}
        sessionNum={sesionNum}
      />
    </div>
  );
}
