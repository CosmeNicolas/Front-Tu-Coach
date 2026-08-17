'use client';

import Link from 'next/link';
import { usePlanifications } from '@/hooks/usePlanifications';
import { ProgresoAlumnoPanel } from '@/components/planificaciones/ProgresoAlumnoPanel';
import { RenovarDesdeAnteriorButton } from '@/components/planificaciones/RenovarDesdeAnteriorButton';
import { PlanificationStatus } from '@/types/planification';
import { Button } from '@/components/ui/button';

export function AlumnoPlanificacionesPanel({ alumnoId }: { alumnoId: string }) {
  const { data, isLoading } = usePlanifications(alumnoId);

  if (isLoading) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">
        Cargando planificaciones…
      </p>
    );
  }

  const activas =
    data?.items.filter((p) => p.estado === PlanificationStatus.ACTIVE) ?? [];

  if (activas.length === 0) {
    return (
      <section className="mt-6 rounded-lg border border-dashed border-border p-5">
        <h2 className="text-sm font-semibold text-foreground">Planificaciones</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sin planificación activa.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={`/profesor/planificaciones/nueva?alumnoId=${alumnoId}`}>
              Crear vacía
            </Link>
          </Button>
          <RenovarDesdeAnteriorButton
            alumnoId={alumnoId}
            size="sm"
            label="Desde plan anterior"
          />
        </div>
      </section>
    );
  }

  const principal = activas[0]!;
  const pending = Boolean(principal.solicitudRevisionPendiente);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          Planificación activa
          {pending ? (
            <span className="ml-2 text-xs font-medium text-amber-600">
              · a renovar
            </span>
          ) : null}
        </h2>
        <div className="flex flex-wrap gap-2">
          <RenovarDesdeAnteriorButton
            alumnoId={alumnoId}
            fromPlanId={principal.id}
            size="sm"
            label={pending ? 'Armar nueva planificación' : 'Nueva desde anterior'}
          />
          <Button asChild size="sm" variant="outline">
            <Link href={`/profesor/planificaciones/${principal.id}`}>
              Ver detalle →
            </Link>
          </Button>
        </div>
      </div>
      <p className="text-lg font-medium text-foreground">{principal.titulo}</p>
      {pending && principal.solicitudRevisionMensaje ? (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-foreground">
          “{principal.solicitudRevisionMensaje}”
        </p>
      ) : null}
      <ProgresoAlumnoPanel planification={principal} />
    </div>
  );
}
