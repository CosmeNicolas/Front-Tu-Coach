'use client';

import { use } from 'react';
import Link from 'next/link';
import { Asistente } from '@/components/planificaciones/asistente/Asistente';
import { usePlanification } from '@/hooks/usePlanifications';
import { ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';

export default function AsistentePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error, refetch, isFetching } = usePlanification(id);

  if (isLoading) {
    return <p className="p-4 sm:p-8 text-sm text-muted-foreground">Cargando planificación…</p>;
  }
  if (error || !data) {
    const api404 = error instanceof ApiError && error.status === 404;
    return (
      <div className="space-y-3 p-4 sm:p-8">
        <p className="text-sm text-rose-600">
          {api404
            ? 'No encontramos esa planificación. Verificá que el backend esté corriendo y que la creación haya terminado bien.'
            : 'No se pudo cargar la planificación.'}
        </p>
        {error instanceof ApiError ? (
          <p className="text-xs text-muted-foreground">{error.message}</p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            {isFetching ? 'Reintentando…' : 'Reintentar'}
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/profesor/planificaciones">Volver al listado</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full bg-muted/30 p-4 sm:p-6 lg:p-8">
      <Asistente planification={data} />
    </div>
  );
}
