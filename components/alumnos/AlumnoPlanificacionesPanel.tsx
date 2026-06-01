'use client';

import Link from 'next/link';
import { usePlanifications } from '@/hooks/usePlanifications';
import { ProgresoAlumnoPanel } from '@/components/planificaciones/ProgresoAlumnoPanel';
import { PlanificationStatus } from '@/types/planification';

export function AlumnoPlanificacionesPanel({ alumnoId }: { alumnoId: string }) {
  const { data, isLoading } = usePlanifications(alumnoId);

  if (isLoading) {
    return (
      <p className="mt-6 text-sm text-zinc-500">Cargando planificaciones…</p>
    );
  }

  const activas =
    data?.items.filter((p) => p.estado === PlanificationStatus.ACTIVE) ?? [];

  if (activas.length === 0) {
    return (
      <section className="mt-6 rounded-lg border border-dashed border-zinc-200 p-5">
        <h2 className="text-sm font-semibold text-zinc-700">Planificaciones</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Sin planificación activa.{' '}
          <Link
            href={`/profesor/planificaciones/nueva?alumnoId=${alumnoId}`}
            className="font-medium text-primary hover:underline"
          >
            Crear una
          </Link>
        </p>
      </section>
    );
  }

  const principal = activas[0];

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-700">
          Planificación activa
        </h2>
        <Link
          href={`/profesor/planificaciones/${principal.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver detalle →
        </Link>
      </div>
      <p className="text-lg font-medium text-zinc-900">{principal.titulo}</p>
      <ProgresoAlumnoPanel planification={principal} />
    </div>
  );
}
