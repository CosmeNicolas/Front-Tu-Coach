'use client';

import { Suspense, use } from 'react';
import Link from 'next/link';
import { AlumnoEditTabs } from '@/components/alumnos/AlumnoEditTabs';
import { useClient } from '@/hooks/useClients';

function EditarAlumnoContent({ id }: { id: string }) {
  const { data, isLoading } = useClient(id);

  if (isLoading) {
    return <div className="p-4 sm:p-8 text-sm text-zinc-500">Cargando…</div>;
  }
  if (!data) {
    return <div className="p-4 sm:p-8 text-sm text-zinc-500">Alumno no encontrado</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl tracking-wide text-zinc-900">
          Editar alumno
        </h1>
        <Link
          href={`/profesor/alumnos/${id}`}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Volver al detalle
        </Link>
      </div>
      <AlumnoEditTabs client={data} />
    </div>
  );
}

export default function EditarAlumnoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={<div className="p-4 sm:p-8 text-sm text-zinc-500">Cargando…</div>}>
      <EditarAlumnoContent id={id} />
    </Suspense>
  );
}
