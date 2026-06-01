'use client';

import { use } from 'react';
import { Asistente } from '@/components/planificaciones/asistente/Asistente';
import { usePlanification } from '@/hooks/usePlanifications';

export default function AsistentePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = usePlanification(id);

  if (isLoading) {
    return <p className="p-4 sm:p-8 text-sm text-zinc-500">Cargando planificación…</p>;
  }
  if (error || !data) {
    return (
      <p className="p-4 sm:p-8 text-sm text-rose-600">
        No se pudo cargar la planificación.
      </p>
    );
  }

  return (
    <div className="w-full max-w-full bg-zinc-50 p-4 sm:p-6 lg:p-8">
      <Asistente planification={data} />
    </div>
  );
}
