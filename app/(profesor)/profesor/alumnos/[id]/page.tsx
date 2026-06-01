'use client';

import { use } from 'react';
import { AlumnoDetalleCard } from '@/components/alumnos/AlumnoDetalleCard';
import { AlumnoPlanificacionesPanel } from '@/components/alumnos/AlumnoPlanificacionesPanel';
import { useClient } from '@/hooks/useClients';

export default function AlumnoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useClient(id);

  if (isLoading) return <div className="p-4 sm:p-8 text-sm text-zinc-500">Cargando…</div>;
  if (!data) return <div className="p-4 sm:p-8 text-sm text-zinc-500">Alumno no encontrado</div>;

  return (
    <div className="space-y-2 p-4 sm:p-8">
      <AlumnoDetalleCard client={data} />
      <AlumnoPlanificacionesPanel alumnoId={data.id} />
    </div>
  );
}
