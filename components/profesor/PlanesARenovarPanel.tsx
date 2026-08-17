'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useResolveRevisionRequest } from '@/hooks/usePlanifications';
import { ApiError } from '@/lib/api/client';
import { Planification, PlanificationStatus } from '@/types/planification';
import { getUltimaSesionFeedback } from '@/lib/planification/exercise-progress-context';
import {
  AlumnoFeedbackResumen,
  hasAlumnoFeedbackContent,
} from '@/components/planificaciones/shared/AlumnoFeedbackResumen';
import { Button } from '@/components/ui/button';

interface Props {
  plans: Planification[];
  alumnoNameById: Map<string, string>;
}

function formatWhen(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PlanesARenovarPanel({ plans, alumnoNameById }: Props) {
  const resolve = useResolveRevisionRequest();

  const pendientes = plans.filter(
    (p) =>
      !p.esPlantilla &&
      p.estado === PlanificationStatus.ACTIVE &&
      p.solicitudRevisionPendiente,
  );

  async function handleResolve(id: string) {
    try {
      await resolve.mutateAsync(id);
      toast.success('Solicitud marcada como resuelta');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo actualizar la solicitud.';
      toast.error('Error', { description: message });
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Alumnos / planes a renovar
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Planes completados o con pedido explícito del alumno.
          </p>
        </div>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {pendientes.length}
        </span>
      </div>

      {pendientes.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No hay solicitudes pendientes por ahora.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {pendientes.map((plan) => {
            const alumno =
              (plan.alumnoId && alumnoNameById.get(plan.alumnoId)) ||
              'Alumno';
            const ultimaSesionFeedback = getUltimaSesionFeedback(
              plan.progresoAlumno,
            );
            return (
              <li
                key={plan.id}
                className="rounded-xl border border-border bg-background/60 px-3 py-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{alumno}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {plan.titulo}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Solicitado: {formatWhen(plan.solicitudRevisionAt)}
                    </p>
                    {plan.solicitudRevisionMensaje ? (
                      <p className="mt-2 text-sm text-foreground">
                        “{plan.solicitudRevisionMensaje}”
                      </p>
                    ) : null}
                    {hasAlumnoFeedbackContent(ultimaSesionFeedback) ? (
                      <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-2 dark:border-sky-900/50 dark:bg-sky-950/30">
                        <AlumnoFeedbackResumen
                          feedback={ultimaSesionFeedback}
                          title={`Última sesión · #${ultimaSesionFeedback.sessionNum}${ultimaSesionFeedback.rpe !== null ? ` · RPE ${ultimaSesionFeedback.rpe}` : ''}`}
                          compact
                          showExerciseNotesHint
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {plan.alumnoId ? (
                      <Button asChild size="sm">
                        <Link
                          href={`/profesor/planificaciones/nueva?alumnoId=${plan.alumnoId}&fromPlanId=${plan.id}&origen=anterior`}
                        >
                          Nueva desde este plan
                        </Link>
                      </Button>
                    ) : null}
                    {plan.alumnoId ? (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/profesor/alumnos/${plan.alumnoId}`}>
                          Ver alumno
                        </Link>
                      </Button>
                    ) : null}
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/profesor/planificaciones/${plan.id}`}>
                        Ver plan
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={resolve.isPending}
                      onClick={() => void handleResolve(plan.id)}
                    >
                      Marcar resuelto
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
