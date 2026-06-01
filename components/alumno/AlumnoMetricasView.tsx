'use client';

import { useMemo } from 'react';
import {
  useMiPlanificacion,
  useStudentMaterialized,
} from '@/hooks/useStudentPortal';
import { buildAlumnoMetrics } from '@/lib/alumno/metrics';
import { buildProgressStats } from '@/lib/planification/progress-stats';
import {
  buildExercisesPerSession,
  buildRpePerSession,
  buildWeeklyCompletions,
  countAssignedExercises,
} from '@/lib/alumno/chart-data';
import { AlumnoMetricasCharts } from './AlumnoMetricasCharts';
import { formatProgressDate } from '@/lib/planification/progress-stats';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export function AlumnoMetricasView() {
  const { data: plan, isLoading, error } = useMiPlanificacion();
  const { data: materialized, isLoading: loadingMat } = useStudentMaterialized(
    plan?.id ?? '',
  );

  const charts = useMemo(() => {
    if (!plan || !materialized) return null;
    const progress = materialized.progreso;
    return {
      weekly: buildWeeklyCompletions(
        progress.fechas,
        progress.completadas,
      ),
      rpe: buildRpePerSession(progress, materialized.totalSesiones),
      exercises: buildExercisesPerSession(materialized),
    };
  }, [plan, materialized]);

  if (isLoading) {
    return (
      <p className="p-4 text-sm text-muted-foreground">Cargando métricas…</p>
    );
  }

  if (error || !plan) {
    return (
      <p className="p-4 text-sm text-destructive">
        No se pudieron cargar tus métricas.
      </p>
    );
  }

  const metrics = buildAlumnoMetrics(plan, plan.progresoResumen);
  const stats = buildProgressStats(
    plan.progresoAlumno,
    plan.config.totalSesiones,
  );
  const asignados = materialized ? countAssignedExercises(materialized) : 0;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Métricas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {plan.titulo} · tu progreso personal
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <StatCard label="Completadas" value={String(metrics.completadas)} />
        <StatCard label="Pendientes" value={String(metrics.pendientes)} />
        <StatCard
          label="Avance"
          value={`${metrics.adherenciaPct}%`}
        />
        <StatCard
          label="RPE promedio"
          value={
            metrics.rpePromedio !== null ? String(metrics.rpePromedio) : '—'
          }
        />
        <StatCard
          label="Última sesión"
          value={
            metrics.ultimaSesion !== null
              ? `S${metrics.ultimaSesion}`
              : '—'
          }
        />
        <StatCard
          label="Adherencia"
          value={`${stats.adherenciaPct}%`}
        />
      </section>

      {metrics.ultimaFecha ? (
        <p className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground">
          Última sesión completada:{' '}
          <strong>{formatProgressDate(metrics.ultimaFecha)}</strong>
        </p>
      ) : null}

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Ejercicios</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Realizados:{' '}
          <strong className="text-foreground">
            {stats.ejerciciosCompletados}
          </strong>{' '}
          · Asignados en plan:{' '}
          <strong className="text-foreground">{asignados || '—'}</strong>
          {asignados > 0 ? (
            <>
              {' '}
              ·{' '}
              <strong className="text-primary">
                {Math.round(
                  (stats.ejerciciosCompletados / asignados) * 100,
                )}
                %
              </strong>{' '}
              de adherencia en ejercicios
            </>
          ) : null}
        </p>
      </section>

      {loadingMat || !charts ? (
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
      ) : (
        <AlumnoMetricasCharts
          weekly={charts.weekly}
          rpe={charts.rpe}
          exercises={charts.exercises}
        />
      )}
    </div>
  );
}
