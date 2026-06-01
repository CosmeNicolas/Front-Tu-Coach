'use client';

import Link from 'next/link';
import { AlumnoDashboardMetrics } from '@/lib/alumno/metrics';
import { StudentPlanification } from '@/lib/api/student-portal';
import { PROGRESSION_MODE_LABELS } from '@/types/planification';
import { Button } from '@/components/ui/button';

interface Props {
  plan: StudentPlanification;
  metrics: AlumnoDashboardMetrics;
}

export function AlumnoProgressHeader({ plan, metrics }: Props) {
  const proxima = plan.progresoResumen.proximaSesion;

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
        {proxima ? (
          <Button asChild size="lg" className="w-full shrink-0 sm:w-auto">
            <Link href={`/alumno/sesiones/${proxima}`}>
              Entrenar sesión {proxima}
            </Link>
          </Button>
        ) : (
          <span className="rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground">
            Plan completado
          </span>
        )}
      </div>

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
    </header>
  );
}
