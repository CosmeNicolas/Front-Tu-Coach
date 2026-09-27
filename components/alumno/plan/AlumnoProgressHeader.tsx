'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlumnoDashboardMetrics } from '@/lib/alumno/metrics';
import { StudentPlanification } from '@/lib/api/student-portal';
import { PROGRESSION_MODE_LABELS } from '@/types/planification';
import { SolicitarNuevaPlanDialog } from '@/components/alumno/plan/SolicitarNuevaPlanDialog';
import { StandardPlanUnlockButton } from '@/components/alumno/StandardPlanUnlockButton';
import { TrainingStreakBadge } from '@/components/alumno/TrainingStreakBadge';
import { Button } from '@/components/ui/button';

interface Props {
  plan: StudentPlanification;
  metrics: AlumnoDashboardMetrics;
  /** La próxima sesión del plan estándar está bloqueada. */
  proximaBloqueada?: boolean;
  /** False mientras no llegó el plan materializado. */
  sesionesListas?: boolean;
  /** Sin profesor distinto de sí mismo. */
  trainsAlone?: boolean;
}

export function AlumnoProgressHeader({
  plan,
  metrics,
  proximaBloqueada = false,
  sesionesListas = true,
  trainsAlone = false,
}: Props) {
  const proxima = plan.progresoResumen.proximaSesion;
  const pending = Boolean(plan.solicitudRevisionPendiente);
  const [dialogOpen, setDialogOpen] = useState(false);
  const mostrarEntrenar =
    Boolean(proxima) && sesionesListas && !proximaBloqueada;

  return (
    <header
      data-tour="alumno-plan-header"
      className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Mi entrenamiento
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">
            {plan.titulo}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {PROGRESSION_MODE_LABELS[plan.config.modoProgresion]} ·{' '}
            {metrics.total} sesiones
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
          {mostrarEntrenar ? (
            <Button asChild size="lg" className="w-full shrink-0 sm:w-auto" data-tour="alumno-plan-entrenar">
              <Link href={`/alumno/sesiones/${proxima}`}>
                Entrenar sesión {proxima}
              </Link>
            </Button>
          ) : proxima && !sesionesListas ? null : proximaBloqueada ? (
            <StandardPlanUnlockButton
              planificationId={plan.id}
              label="Desbloquear"
              size="lg"
              className="w-full shrink-0 sm:w-auto"
            />
          ) : (
            <span className="rounded-lg bg-muted px-3 py-2 text-center text-sm font-medium text-foreground">
              Plan completado
            </span>
          )}
          {trainsAlone ? null : (
            <Button
              type="button"
              variant={mostrarEntrenar ? 'outline' : 'default'}
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setDialogOpen(true)}
            >
              {pending
                ? 'Enviar recordatorio al profe'
                : 'Solicitar nueva planificación'}
            </Button>
          )}
        </div>
      </div>

      {pending && !trainsAlone ? (
        <p className="mt-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          Ya avisaste a tu profesor
          {plan.solicitudRevisionAt
            ? ` el ${new Date(plan.solicitudRevisionAt).toLocaleString('es-AR')}`
            : ''}
          . Cuando revise o arme una nueva planificación, se actualiza acá.
        </p>
      ) : null}

      <TrainingStreakBadge
        actividad={plan.actividad ?? metrics.actividad}
        className="mt-4"
      />

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-foreground">Progreso del plan</span>
          <span className="font-semibold text-primary">
            {metrics.completadas}/{metrics.total} ({metrics.adherenciaPct}%)
          </span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={metrics.adherenciaPct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${metrics.adherenciaPct}%` }}
          />
        </div>
      </div>

      {trainsAlone ? null : (
        <SolicitarNuevaPlanDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          planificationId={plan.id}
          alreadyPending={pending}
        />
      )}
    </header>
  );
}
