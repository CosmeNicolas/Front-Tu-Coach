'use client';

import { useEffect, useMemo, useState } from 'react';
import { Archive, CheckCircle2, History } from 'lucide-react';
import {
  useMisPlanificaciones,
  useStudentMaterialized,
} from '@/hooks/useStudentPortal';
import { buildAlumnoMetrics } from '@/lib/alumno/metrics';
import { buildProgressStats, formatProgressDate } from '@/lib/planification/progress-stats';
import {
  buildAggregateMonthlyCompletions,
  buildExercisesPerSession,
  buildMonthlyCompletions,
  buildMonthlyTrainingMinutes,
  buildMonthlyVolumeKg,
  buildDailyTrainingMinutes,
  buildTrainingTimePerSession,
  buildRpePerSession,
  buildWeeklyCompletions,
  buildWeeklyTrainingMinutes,
  buildWeeklyVolumeKg,
  countAssignedExercises,
} from '@/lib/alumno/chart-data';
import { formatTrainingMinutes } from '@/lib/alumno/format-time';
import { StudentPlanificationListItem } from '@/lib/api/student-portal';
import { PlanificationStatus } from '@/types/planification';
import { AlumnoMetricasCharts } from './AlumnoMetricasCharts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const HISTORIAL_ID = '__historial__';

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

function estadoLabel(item: StudentPlanificationListItem): string {
  if (item.completada) return 'Completada';
  if (item.estado === PlanificationStatus.ARCHIVED) return 'Archivada';
  if (item.estado === PlanificationStatus.CLOSED) return 'Cerrada';
  return 'En curso';
}

function estadoBadgeVariant(
  item: StudentPlanificationListItem,
): 'default' | 'secondary' | 'outline' {
  if (item.estado === PlanificationStatus.ACTIVE && !item.completada) return 'default';
  if (item.completada) return 'secondary';
  return 'outline';
}

export function AlumnoMetricasView() {
  const { data: historial, isLoading, error } = useMisPlanificaciones();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activePlan = historial?.find((p) => p.estado === PlanificationStatus.ACTIVE);
  const selectedPlan =
    selectedId && selectedId !== HISTORIAL_ID
      ? historial?.find((p) => p.id === selectedId)
      : null;
  const viewingHistorial = selectedId === HISTORIAL_ID;

  useEffect(() => {
    if (!historial?.length || selectedId) return;
    setSelectedId(activePlan?.id ?? historial[0]!.id);
  }, [historial, activePlan?.id, selectedId]);

  const materializedPlanId =
    viewingHistorial || !selectedPlan ? '' : selectedPlan.id;

  const { data: materialized, isLoading: loadingMat } = useStudentMaterialized(
    materializedPlanId,
  );

  const charts = useMemo(() => {
    if (viewingHistorial && historial?.length) {
      return {
        monthly: buildAggregateMonthlyCompletions(historial),
        weekly: [],
        rpe: [],
        exercises: [],
        trainingWeekly: [],
        trainingMonthly: [],
        trainingPerSession: [],
        trainingDaily: [],
        volumeWeekly: [],
        volumeMonthly: [],
      };
    }
    if (!materialized) return null;
    const progress = materialized.progreso;
    return {
      monthly: buildMonthlyCompletions(progress.fechas, progress.completadas),
      weekly: buildWeeklyCompletions(progress.fechas, progress.completadas),
      rpe: buildRpePerSession(progress, materialized.totalSesiones),
      exercises: buildExercisesPerSession(materialized),
      trainingPerSession: buildTrainingTimePerSession(progress),
      trainingDaily: buildDailyTrainingMinutes(progress),
      trainingWeekly: buildWeeklyTrainingMinutes(progress),
      trainingMonthly: buildMonthlyTrainingMinutes(progress),
      volumeWeekly: buildWeeklyVolumeKg(progress),
      volumeMonthly: buildMonthlyVolumeKg(progress),
    };
  }, [viewingHistorial, historial, materialized]);

  const aggregateStats = useMemo(() => {
    if (!historial?.length) return null;
    const totalSesiones = historial.reduce(
      (acc, p) => acc + p.progresoResumen.completadas,
      0,
    );
    const planesCompletados = historial.filter((p) => p.completada).length;
    const allDates = historial.flatMap((p) => p.fechasCompletadas);
    const ultimaFecha =
      allDates.length > 0
        ? [...allDates].sort((a, b) => a.localeCompare(b)).at(-1)!
        : null;
    return { totalSesiones, planesCompletados, ultimaFecha };
  }, [historial]);

  if (isLoading) {
    return (
      <p className="p-4 text-sm text-muted-foreground">Cargando métricas…</p>
    );
  }

  if (error || !historial?.length) {
    return (
      <div className="space-y-3 p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-foreground">Métricas</h1>
        <p className="text-sm text-muted-foreground">
          Todavía no tenés planificaciones con sesiones registradas. Cuando completes
          entrenamientos, vas a ver acá tu historial, avances y gráficos.
        </p>
      </div>
    );
  }

  const planForMetrics = selectedPlan ?? activePlan ?? historial[0]!;
  const metrics = materialized
    ? buildAlumnoMetrics(
        {
          config: { totalSesiones: materialized.totalSesiones },
          progresoAlumno: materialized.progreso,
        },
        planForMetrics.progresoResumen,
      )
    : null;
  const stats = materialized
    ? buildProgressStats(materialized.progreso, materialized.totalSesiones)
    : null;
  const asignados = materialized ? countAssignedExercises(materialized) : 0;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Métricas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu historial de entrenamiento, avances y actividad
        </p>
      </header>

      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <History className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Planificaciones
          </h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedId(HISTORIAL_ID)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              viewingHistorial
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:bg-muted',
            )}
          >
            Todo el historial
          </button>
          {historial.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                selectedId === item.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:bg-muted',
              )}
            >
              {item.titulo}
            </button>
          ))}
        </div>
      </section>

      {viewingHistorial ? (
        <>
          {aggregateStats ? (
            <section className="grid grid-cols-2 gap-3">
              <StatCard
                label="Sesiones totales"
                value={String(aggregateStats.totalSesiones)}
              />
              <StatCard
                label="Planes completados"
                value={String(aggregateStats.planesCompletados)}
              />
              <StatCard
                label="Planes en historial"
                value={String(historial.length)}
              />
              <StatCard
                label="Última actividad"
                value={
                  aggregateStats.ultimaFecha
                    ? formatProgressDate(aggregateStats.ultimaFecha)
                    : '—'
                }
              />
            </section>
          ) : null}

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground">
              Planes anteriores
            </h2>
            <div className="space-y-2">
              {historial.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{item.titulo}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.progresoResumen.completadas}/
                        {item.progresoResumen.total} sesiones ·{' '}
                        {item.progresoResumen.porcentaje}% adherencia
                      </p>
                    </div>
                    <Badge variant={estadoBadgeVariant(item)}>
                      {estadoLabel(item)}
                    </Badge>
                  </div>
                  {item.finalizadaEn ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Finalizada: {formatProgressDate(item.finalizadaEn)}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className="mt-2 text-xs font-medium text-primary hover:underline"
                  >
                    Ver métricas de este plan
                  </button>
                </article>
              ))}
            </div>
          </section>

          {charts ? (
            <AlumnoMetricasCharts
              monthly={charts.monthly}
              weekly={charts.weekly}
              rpe={charts.rpe}
              exercises={charts.exercises}
              trainingPerSession={charts.trainingPerSession}
              trainingDaily={charts.trainingDaily}
              trainingWeekly={charts.trainingWeekly}
              trainingMonthly={charts.trainingMonthly}
              volumeWeekly={charts.volumeWeekly}
              volumeMonthly={charts.volumeMonthly}
            />
          ) : null}
        </>
      ) : (
        <>
          {selectedPlan ? (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
              <p className="text-sm font-medium text-foreground">
                {selectedPlan.titulo}
              </p>
              <Badge variant={estadoBadgeVariant(selectedPlan)}>
                {estadoLabel(selectedPlan)}
              </Badge>
              {selectedPlan.completada ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-3.5" />
                  {selectedPlan.finalizadaEn
                    ? `Finalizada ${formatProgressDate(selectedPlan.finalizadaEn)}`
                    : 'Plan completado'}
                </span>
              ) : null}
              {selectedPlan.estado === PlanificationStatus.ARCHIVED ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Archive className="size-3.5" />
                  Archivada por tu profesor
                </span>
              ) : null}
            </div>
          ) : null}

          {metrics && stats ? (
            <>
              <section className="grid grid-cols-2 gap-3">
                <StatCard label="Completadas" value={String(metrics.completadas)} />
                <StatCard label="Pendientes" value={String(metrics.pendientes)} />
                <StatCard label="Avance" value={`${metrics.adherenciaPct}%`} />
                <StatCard
                  label="RPE promedio"
                  value={
                    metrics.rpePromedio !== null ? String(metrics.rpePromedio) : '—'
                  }
                />
                <StatCard
                  label="Última sesión"
                  value={
                    metrics.ultimaSesion !== null ? `S${metrics.ultimaSesion}` : '—'
                  }
                />
                <StatCard label="Adherencia" value={`${stats.adherenciaPct}%`} />
                <StatCard
                  label="Tiempo entrenado"
                  value={formatTrainingMinutes(metrics.totalTrainingSeconds)}
                />
                <StatCard
                  label="Carga total"
                  value={
                    metrics.totalVolumeKg > 0
                      ? `${metrics.totalVolumeKg} kg`
                      : '—'
                  }
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
            </>
          ) : null}

          {loadingMat || !charts ? (
            <div className="h-48 animate-pulse rounded-xl bg-muted" />
          ) : (
            <AlumnoMetricasCharts
              monthly={charts.monthly}
              weekly={charts.weekly}
              rpe={charts.rpe}
              exercises={charts.exercises}
              trainingPerSession={charts.trainingPerSession}
              trainingDaily={charts.trainingDaily}
              trainingWeekly={charts.trainingWeekly}
              trainingMonthly={charts.trainingMonthly}
              volumeWeekly={charts.volumeWeekly}
              volumeMonthly={charts.volumeMonthly}
            />
          )}
        </>
      )}
    </div>
  );
}
