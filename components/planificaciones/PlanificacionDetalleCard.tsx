'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Planification,
  PlanificationStatus,
  PROGRESSION_MODE_LABELS,
} from '@/types/planification';
import { ProgresoAlumnoPanel } from '@/components/planificaciones/ProgresoAlumnoPanel';
import { RenovarDesdeAnteriorButton } from '@/components/planificaciones/RenovarDesdeAnteriorButton';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUnarchivePlanification } from '@/hooks/usePlanifications';
import { ApiError } from '@/lib/api/client';

export function PlanificacionDetalleCard({
  planification,
}: {
  planification: Planification;
}) {
  const { config } = planification;
  const totalItems = planification.secciones.reduce(
    (acc, s) => acc + s.items.length,
    0,
  );
  const canRenew =
    Boolean(planification.alumnoId) &&
    !planification.esPlantilla &&
    planification.secciones.length > 0 &&
    (planification.estado === PlanificationStatus.ACTIVE ||
      planification.solicitudRevisionPendiente);
  const canUnarchive =
    !planification.esPlantilla &&
    planification.estado === PlanificationStatus.ARCHIVED;
  const unarchive = useUnarchivePlanification();
  const [confirmUnarchive, setConfirmUnarchive] = useState(false);

  async function handleUnarchive() {
    try {
      await unarchive.mutateAsync(planification.id);
      toast.success('Planificación desarchivada', {
        description: 'Ahora es la Actual del alumno.',
      });
      setConfirmUnarchive(false);
    } catch (err) {
      toast.error('No se pudo desarchivar', {
        description:
          err instanceof ApiError ? err.message : 'Intentá de nuevo.',
      });
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {planification.titulo}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Versión {planification.version} · {planification.estado}
            {planification.solicitudRevisionPendiente
              ? ' · solicitud de renovación pendiente'
              : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link
              href={`/profesor/planificaciones/${planification.id}/asistente`}
            >
              {planification.secciones.length === 0
                ? 'Abrir Asistente'
                : 'Editar en Asistente'}
            </Link>
          </Button>
          {canRenew && planification.alumnoId ? (
            <RenovarDesdeAnteriorButton
              alumnoId={planification.alumnoId}
              fromPlanId={planification.id}
              label={
                planification.solicitudRevisionPendiente
                  ? 'Armar nueva desde este plan'
                  : 'Nueva desde este plan'
              }
            />
          ) : null}
          {canUnarchive ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmUnarchive(true)}
            >
              Desarchivar
            </Button>
          ) : null}
        </div>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Item label="Modo" value={PROGRESSION_MODE_LABELS[config.modoProgresion]} />
        <Item label="Semanas" value={String(config.semanasDelPlan)} />
        <Item label="Frecuencia semanal" value={String(config.frecuenciaSemanal)} />
        <Item label="Total sesiones" value={String(config.totalSesiones)} />
      </dl>

      <ProgresoAlumnoPanel planification={planification} />

      <p className="mt-4 text-sm text-muted-foreground">
        {planification.secciones.length === 0
          ? 'Sin secciones todavía. Abrí el Asistente para cargar entrada en calor, ejercicios principales y vuelta a la calma.'
          : `${planification.secciones.length} secciones · ${totalItems} ítems cargados`}
      </p>

      <AlertDialog
        open={confirmUnarchive}
        onOpenChange={(open) => !open && setConfirmUnarchive(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desarchivar planificación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta planificación vuelve a ser la Actual del alumno. Si ya tiene
              una Actual, esa se archiva. El alumno verá este plan (con su
              progreso anterior) la próxima vez que entre.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={unarchive.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={unarchive.isPending}
              onClick={(e) => {
                e.preventDefault();
                void handleUnarchive();
              }}
            >
              {unarchive.isPending ? 'Desarchivando…' : 'Desarchivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
