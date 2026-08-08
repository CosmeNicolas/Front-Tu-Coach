'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlumnoDashboardMetrics } from '@/lib/alumno/metrics';
import { StudentPlanification } from '@/lib/api/student-portal';
import { PROGRESSION_MODE_LABELS } from '@/types/planification';
import { SolicitarNuevaPlanDialog } from '@/components/alumno/plan/SolicitarNuevaPlanDialog';
import { Button } from '@/components/ui/button';

interface Props {
  plan: StudentPlanification;
  metrics: AlumnoDashboardMetrics;
}

export function AlumnoProgressHeader({ plan, metrics }: Props) {
  const proxima = plan.progresoResumen.proximaSesion;
  const pending = Boolean(plan.solicitudRevisionPendiente);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <header className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
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
          {proxima ? (
            <Button asChild size="lg" className="w-full shrink-0 sm:w-auto">
              <Link href={`/alumno/sesiones/${proxima}`}>
                Entrenar sesión {proxima}
              </Link>
            </Button>
          ) : (
            <span className="rounded-lg bg-muted px-3 py-2 text-center text-sm font-medium text-foreground">
              Plan completado
            </span>
          )}
          <Button
            type="button"
            variant={proxima ? 'outline' : 'default'}
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => setDialogOpen(true)}
          >
            {pending
              ? 'Enviar recordatorio al profe'
              : 'Solicitar nueva planificación'}
          </Button>
        </div>
      </div>

      {pending ? (
        <p className="mt-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          Ya avisaste a tu profesor
          {plan.solicitudRevisionAt
            ? ` el ${new Date(plan.solicitudRevisionAt).toLocaleString('es-AR')}`
            : ''}
          . Cuando revise o arme una nueva planificación, se actualiza acá.
        </p>
      ) : null}

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

      <SolicitarNuevaPlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        planificationId={plan.id}
        alreadyPending={pending}
      />
    </header>
  );
}
