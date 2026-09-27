'use client';

import Link from 'next/link';
import { ApiError } from '@/lib/api/client';
import {
  useCoachHistory,
  useCoachHistoryMaterialized,
} from '@/hooks/useCoachRelationships';
import { countSessionExercises } from '@/lib/alumno/flatten-materialized';
import { SeccionPreviewBlock } from '@/components/planificaciones/asistente/preview/SeccionPreviewBlock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function estadoLabel(estado: string) {
  switch (estado) {
    case 'active':
      return 'Activa';
    case 'completed':
      return 'Completada';
    case 'paused':
      return 'Pausada';
    case 'draft':
      return 'Borrador';
    default:
      return estado;
  }
}

export function ProfesorCoachHistoryListView({
  relationshipId,
}: {
  relationshipId: string;
}) {
  const { data, isLoading, error } = useCoachHistory(relationshipId);

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-muted-foreground">Cargando historial…</p>
    );
  }

  if (error) {
    return (
      <div className="space-y-3 p-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/profesor/solicitudes">← Solicitudes</Link>
        </Button>
        <h1 className="text-xl font-semibold">Historial del alumno</h1>
        <p className="text-sm text-destructive">
          {error instanceof ApiError
            ? error.message
            : 'No se pudo cargar el historial.'}
        </p>
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <header className="space-y-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/profesor/solicitudes">← Solicitudes</Link>
        </Button>
        <h1 className="text-2xl font-bold">
          Historial de {data?.alumnoNombre ?? 'alumno'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Solo lectura. El alumno compartió este historial con vos.
        </p>
      </header>

      {!items.length ? (
        <p className="text-sm text-muted-foreground">
          Este alumno todavía no tiene planificaciones.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{item.titulo}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.progresoResumen.completadas}/
                    {item.progresoResumen.total} sesiones ·{' '}
                    {item.progresoResumen.porcentaje}% adherencia
                  </p>
                  <Badge className="mt-2" variant="secondary">
                    {estadoLabel(item.estado)}
                  </Badge>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`/profesor/solicitudes/${relationshipId}/historial/${item.id}`}
                  >
                    Ver detalle
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProfesorCoachHistoryDetailView({
  relationshipId,
  planificationId,
}: {
  relationshipId: string;
  planificationId: string;
}) {
  const { data, isLoading, error } = useCoachHistoryMaterialized(
    relationshipId,
    planificationId,
  );

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-muted-foreground">Cargando planificación…</p>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-3 p-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/profesor/solicitudes/${relationshipId}/historial`}>
            ← Historial
          </Link>
        </Button>
        <p className="text-sm text-destructive">
          {error instanceof ApiError
            ? error.message
            : 'No se pudo cargar el detalle.'}
        </p>
      </div>
    );
  }

  const completed = new Set(data.progreso.completadas ?? []);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <header className="space-y-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/profesor/solicitudes/${relationshipId}/historial`}>
            ← Historial
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{data.titulo}</h1>
        <p className="text-sm text-muted-foreground">
          {data.progresoResumen.completadas}/{data.progresoResumen.total}{' '}
          sesiones · {data.progresoResumen.porcentaje}% · solo lectura
        </p>
      </header>

      <ul className="space-y-4">
        {Array.from({ length: data.totalSesiones }, (_, i) => i + 1).map(
          (n) => {
            const done = completed.has(n);
            const rpe = data.progreso.rpePorSesion[String(n)];
            const comment = data.progreso.comentarios[n - 1];
            const fecha = data.progreso.fechas[n - 1];
            const sesion = data.sesiones.find((s) => s.numero === n);
            const secciones = sesion?.secciones ?? [];
            const ejercicios = sesion ? countSessionExercises(sesion) : 0;

            return (
              <li
                key={n}
                className="rounded-lg border border-border px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">Sesión {n}</p>
                  <Badge variant={done ? 'default' : 'secondary'}>
                    {done ? 'Completada' : 'Pendiente'}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {ejercicios} ejercicios
                  {typeof rpe === 'number' ? ` · RPE ${rpe}` : ''}
                  {fecha
                    ? ` · ${new Date(fecha).toLocaleDateString('es-AR')}`
                    : ''}
                </p>
                {comment ? (
                  <p className="mt-2 text-sm text-muted-foreground">{comment}</p>
                ) : null}

                {secciones.length ? (
                  <div className="mt-4 space-y-4 border-t border-border pt-4">
                    {secciones.map((grupo, idx) => (
                      <SeccionPreviewBlock
                        key={`${n}-${grupo.titulo}-${idx}`}
                        grupo={grupo}
                        sessionNum={n}
                        compact
                      />
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Sin ejercicios en esta sesión.
                  </p>
                )}
              </li>
            );
          },
        )}
      </ul>
    </div>
  );
}
